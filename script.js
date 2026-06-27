// ===============================
// GROOM ON THE GO
// script.js
// ===============================
const API_URL = "https://backend-files-2-cjix.onrender.com";
console.log("script.js loaded successfully");
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

  loadCustomerBookings(customer.phone);

}

// Load Customer Bookings

async function loadCustomerBookings(phone) {

  try {

    const response = await fetch(
      `${API_URL}/api/bookings/customer/${phone}`
    );

    const bookings = await response.json();

    const bookingList =
      document.getElementById("appointmentList");

    if (!bookingList) return;

    bookingList.innerHTML = "";

    bookings.forEach(booking => {

      bookingList.innerHTML += `
        <li>
          ${booking.petName}
          | ${booking.service}
          | ${booking.date}
          | <strong>${booking.status}</strong>
        </li>
      `;

    });

  } catch (error) {

    console.error(error);
    alert("Failed to load bookings");

  }

}
// Admin Login
async function adminLogin() {

  const username =
    document.getElementById("adminUser").value;

  const password =
    document.getElementById("adminPass").value;

  if (
    username === "admin" &&
    password === "admin123"
  ) {

    alert("Login Successful");

    const dashboard =
      document.getElementById("adminDashboard");

    if (!dashboard) {
      alert("adminDashboard not found");
      return;
    }

    dashboard.style.display = "block";

    await displayAdminBookings();

    alert("Bookings loaded");

  } else {

    alert("Invalid Login");

  }
}

// Create Booking

async function submitBooking(event) {
  event.preventDefault();
  const service = document.getElementById("service").value;

let price = 0;

if (service === "Basic Bath") price = 799;
else if (service === "Premium Bath") price = 1499;
else if (service === "Full Grooming") price = 2499;
else if (service === "Haircut") price = 999;

  const booking = {
  ownerName: document.getElementById("ownerName").value,
  phone: document.getElementById("phone").value,
  email: document.getElementById("email").value,
  petName: document.getElementById("petName").value,
  breed: document.getElementById("breed").value,
  petAge: document.getElementById("petAge").value,
  petWeight: document.getElementById("petWeight").value,
  petType: document.getElementById("petType").value,
  service: document.getElementById("service").value,
  price: document.getElementById("price").value
  date: document.getElementById("appointmentDate").value,
  timeSlot: document.getElementById("timeSlot").value,
  notes: document.getElementById("notes").value,
  address: document.getElementById("address").value
};

  try {
    const response = await fetch(
      `${API_URL}/api/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
      }
    );

    const data = await response.json();

    alert("Booking Submitted Successfully");

    document
      .getElementById("bookingForm")
      .reset();

  } catch (error) {
    alert("Booking Failed");
    console.error(error);
  }
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
async function displayAdminBookings() {
  try {


    const response = await fetch(
      `${API_URL}/api/bookings`
    );


    const bookings = await response.json();
    document.getElementById("totalBookings").innerText =
  bookings.length;

document.getElementById("pendingBookings").innerText =
  bookings.filter(
    booking => booking.status === "Pending"
  ).length;

document.getElementById("completedBookings").innerText =
  bookings.filter(
    booking => booking.status === "Completed"
  ).length;

const revenue =
  bookings
    .filter(
      booking => booking.status === "Completed"
    )
    .reduce(
      (sum, booking) =>
        sum + (booking.price || 0),
      0
    );

document.getElementById("totalRevenue").innerText =
  `₹${revenue}`;

    const tableBody =
      document.getElementById("bookingTable");

    if (!tableBody) {
      alert("bookingTable not found");
      return;
    }


    tableBody.innerHTML = "";

    bookings.forEach((booking) => {

      tableBody.innerHTML += `
<tr>
  <td>${booking.ownerName || ""}</td>
  <td>${booking.petName || ""}</td>
  <td>${booking.service || ""}</td>
  <td>${booking.date || ""}</td>
  <td>${booking.timeSlot || ""}</td>
  <td>${booking.status || "Pending"}</td>
  <td>₹${booking.price || 0}</td>

  <td>
    <button onclick="updateStatus('${booking._id}','Confirmed')">Confirm</button>
    <button onclick="updateStatus('${booking._id}','Completed')">Complete</button>

    <button onclick="payViaUPI(${booking.price || 0})">
      Pay ₹${booking.price || 0}
    </button>
  </td>
</tr>
`;
    });


  } catch (error) {

    console.error(error);

    alert("ERROR: " + error.message);

  }
}
// Page Load
async function updateStatus(id, status) {
  try {

    const response = await fetch(
      `${API_URL}/api/bookings/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      }
    );

    const result = await response.json();

    console.log(result);

    alert(`Status changed to ${status}`);

    displayAdminBookings();

  } catch (error) {

    console.error(error);
    alert("Status update failed");

  }
}
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

  // Page Load
async function updateStatus(id, status) {
  try {

    const response = await fetch(
      `${API_URL}/api/bookings/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      }
    );

    const result = await response.json();

    console.log(result);

    alert(`Status changed to ${status}`);

    displayAdminBookings();

  } catch (error) {

    console.error(error);
    alert("Status update failed");

  }
}
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

function payViaUPI(amount) {

  if (!amount || amount <= 0) {
    alert("Invalid payment amount");
    return;
  }

  const upiID = "yourbusiness@upi"; // replace with real UPI ID

  const name = "Groom on the Go";

  const upiLink =
    `upi://pay?pa=${upiID}&pn=${name}&am=${amount}&cu=INR`;

  window.location.href = upiLink;
}
