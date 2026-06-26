// ===============================
// GROOM ON THE GO
// script.js
// ===============================
const API_URL = "https://backend-files-2-cjix.onrender.com";
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

async function submitBooking(event) {
  event.preventDefault();

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

  const response = await fetch(
    `${API_URL}/api/bookings`
  );

  const bookings = await response.json();

  const tableBody =
    document.getElementById("bookingTable");

  tableBody.innerHTML = "";

  bookings.forEach(booking => {

  tableBody.innerHTML += `
    <tr>
      <td>${booking.ownerName || ""}</td>
      <td>${booking.petName || ""}</td>
      <td>${booking.service || ""}</td>
      <td>${booking.date || ""}</td>
      <td>${booking.timeSlot || ""}</td>
      <td>${booking.status || "Pending"}</td>

      <td>
        <button onclick="updateStatus('${booking._id}','Confirmed')">
          Confirm
        </button>

        <button onclick="updateStatus('${booking._id}','In Progress')">
          Start
        </button>

        <button onclick="updateStatus('${booking._id}','Completed')">
          Complete
        </button>

        <button onclick="updateStatus('${booking._id}','Cancelled')">
          Cancel
        </button>
      </td>
    </tr>
  `;

});
}


    displayAdminBookings();

  } catch (error) {

    console.error(error);
    alert("Status update failed");

  }

}

async function updateStatus(id, status) {
  try {

    await fetch(
      `${API_URL}/api/bookings/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      }
    );

    displayAdminBookings();

  } catch (error) {

    console.error(error);
    alert("Status update failed");

  }

}

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
