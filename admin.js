const API_URL = "https://YOUR-RENDER-BACKEND.onrender.com";

async function loadBookings(){

const res = await fetch(`${API_URL}/api/bookings`);
const bookings = await res.json();

const table = document.getElementById("bookingTable");

table.innerHTML = "";

let pending = 0;
let completed = 0;

bookings.forEach(booking=>{

if(booking.status==="Pending") pending++;
if(booking.status==="Completed") completed++;

table.innerHTML += `
<tr>

<td>${booking.ownerName}</td>
<td>${booking.phone}</td>
<td>${booking.petName}</td>
<td>${booking.service}</td>
<td>${booking.date}</td>

<td>

<select onchange="updateStatus('${booking._id}',this.value)">

<option ${booking.status==="Pending"?"selected":""}>
Pending
</option>

<option ${booking.status==="Confirmed"?"selected":""}>
Confirmed
</option>

<option ${booking.status==="Completed"?"selected":""}>
Completed
</option>

</select>

</td>

<td>
<button onclick="deleteBooking('${booking._id}')">
Delete
</button>
</td>

</tr>
`;
});

document.getElementById("totalBookings").textContent = bookings.length;
document.getElementById("pendingBookings").textContent = pending;
document.getElementById("completedBookings").textContent = completed;

}

async function updateStatus(id,status){

await fetch(`${API_URL}/api/bookings/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({status})
});

loadBookings();

}

async function deleteBooking(id){

if(!confirm("Delete booking?")) return;

await fetch(`${API_URL}/api/bookings/${id}`,{
method:"DELETE"
});

loadBookings();

}

loadBookings();
