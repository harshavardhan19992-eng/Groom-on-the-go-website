// ===============================
// GROOM ON THE GO
// script.js
// ===============================

// Save Customer Registration

function registerCustomer() {

  const name = document.getElementById("regName").value;
  const phone = document.getElementById("regPhone").value;
  const email = document.getElementById("regEmail").value;

  if (!name || !phone || !email) {
    alert("Please fill all fields");
    return;
  }

  const customer = {
    name,
    phone,
    email
  };

  localStorage.setItem(
    "customer",
    JSON.stringify(customer)
  );

  alert("Registration Successful");

}

// Customer Login

function customerLogin() {

  const customer = JSON.parse(
    localStorage.getItem("customer")
  );

  if (!customer) {
    alert("Please Register First");
    return;
  }

  document.getElementById(
    "customerDashboard"
  ).style.display = "block";

  document.getElementById(
    "customerName"
  ).innerText = customer.name;

  loadBookings();

}

// Admin Login

function adminLogin() {

  const username =
    document.getElementById("adminUser").value;

  const password =
    document.getElementById("adminPass").value;

  if (
    username === "admin" &&
    password === "admin123"
  ) {

    document.getElementById(
      "adminDashboard"
    ).style.display = "block";

    displayAdminBookings();

    alert("Admin Login Successful");

  } else {

    alert("Invalid Login");

  }

}

// Create Booking

function submitBooking(event) {

  event.preventDefault();

  const petName =
    document.getElementById("petName").value;

  const petType =
    document.getElementById("petType").value;

  const service =
    document.getElementById("service").value;

  const date =
    document.getElementById("appointmentDate").value;

  const address =
    document.getElementById("address").value;

  const booking = {
    id: Date.now(),
    petName,
    petType,
    service,
    date,
    address,
    status: "Pending"
  };

  const bookings =
    JSON.parse(
      localStorage.getItem("bookings")
    ) || [];

  bookings.push(booking);

  localStorage.setItem(
    "bookings",
    JSON.stringify(bookings)
  );

  alert("Booking Submitted");

  document
    .getElementById("bookingForm")
    .reset();

  loadBookings();

}

// Customer Dashboard Bookings

function loadBookings() {

  const bookingList =
    document.getElementById("appointmentList");

  if (!bookingList) return;

  const bookings =
    JSON.parse(
      localStorage.getItem("bookings")
    ) || [];

  bookingList.innerHTML = "";

  if (bookings.length === 0) {

    bookingList.innerHTML =
      "<li>No Bookings Yet</li>";

    return;

  }

  bookings.forEach(booking => {

    const li =
      document.createElement("li");

    li.innerHTML = `
      <strong>${booking.petName}</strong>
      | ${booking.service}
      | ${booking.date}
      | Status:
      <b>${booking.status}</b>
    `;

    bookingList.appendChild(li);

  });

}

// Admin Dashboard

function displayAdminBookings() {

  const tableBody =
    document.getElementById("bookingTable");

  if (!tableBody) return;

  const bookings =
    JSON.parse(
      localStorage.getItem("bookings")
    ) || [];

  tableBody.innerHTML = "";

  bookings.forEach(booking => {

    tableBody.innerHTML += `
      <tr>
        <td>${booking.petName}</td>
        <td>${booking.petType}</td>
        <td>${booking.service}</td>
        <td>${booking.date}</td>
        <td>${booking.status}</td>
        <td>
          <button onclick="approveBooking(${booking.id})">
            Approve
          </button>
        </td>
      </tr>
    `;

  });

}

// Approve Booking

function approveBooking(id) {

  let bookings =
    JSON.parse(
      localStorage.getItem("bookings")
    ) || [];

  bookings = bookings.map(booking => {

    if (booking.id === id) {
      booking.status = "Confirmed";
    }

    return booking;

  });

  localStorage.setItem(
    "bookings",
    JSON.stringify(bookings)
  );

  displayAdminBookings();

}

// Page Load

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadBookings();

    const form =
      document.getElementById(
        "bookingForm"
      );

    if (form) {

      form.addEventListener(
        "submit",
        submitBooking
      );

    }

  }
);
