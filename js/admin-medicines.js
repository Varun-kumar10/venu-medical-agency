const token = localStorage.getItem("adminToken");

if (!token) {
    alert("Admin not logged in");
    location.href = "admin-login.html";
}

const authHeader = "Bearer " + token;

let medicines = [];

// LOAD MEDICINES
function loadMedicines() {

fetch("http://localhost:3000/medicines/admin", {
    method: "GET",
    headers: {
        "Authorization": authHeader
    }
})
.then(res => {
    if (!res.ok) {
        throw new Error("Unauthorized or Token Error");
    }
    return res.json();
})
.then(data => {

    medicines = data;

    renderMedicines(data);

    showLowStock(data);

    showExpiryAlert(data);

})
.catch(err => {
    console.error("MEDICINE LOAD ERROR:", err.message);
    alert("Session expired. Please login again.");
    localStorage.removeItem("adminToken");
    location.href = "admin-login.html";
});

}


// RENDER MEDICINES
function renderMedicines(list) {

const tbody = document.getElementById("medicineTable");

tbody.innerHTML = "";

list.forEach(m => {

    tbody.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.category}</td>
            <td>₹${m.price}</td>
            <td>${m.stock}</td>
            <td>${m.expiry ? m.expiry.split("T")[0] : "-"}</td>
            <td>
                <button onclick="deleteMed(${m.id})">Delete</button>
            </td>
        </tr>
    `;
});

}


// DELETE MEDICINE
function deleteMed(id) {

if (!confirm("Delete this medicine?")) return;

fetch(`http://localhost:3000/medicines/${id}`, {
    method: "DELETE",
    headers: {
        "Authorization": authHeader
    }
})
.then(res => {
    if (!res.ok) throw new Error("Delete failed");

    loadMedicines();
})
.catch(() => alert("❌ Failed to delete medicine"));

}


// LOW STOCK ALERT
function showLowStock(list) {

const box = document.getElementById("lowStockAlert");

if (!box) return;

const lowStock = list.filter(m => m.stock <= 10);

if (lowStock.length === 0) {
    box.innerHTML = "";
    return;
}

let html = "<b>⚠ Low Stock Medicines:</b><br>";

lowStock.forEach(m => {
    html += `${m.name} (Stock: ${m.stock})<br>`;
});

box.innerHTML = html;

}


// EXPIRY ALERT
function showExpiryAlert(list) {

const box = document.getElementById("expiryAlert");

if (!box) return;

const today = new Date();

const expiring = list.filter(m => {

    if (!m.expiry) return false;

    const expiry = new Date(m.expiry);

    const diff = (expiry - today) / (1000*60*60*24);

    return diff <= 30;
});

if (expiring.length === 0) {
    box.innerHTML = "";
    return;
}

let html = "<b>⏳ Expiring Soon:</b><br>";

expiring.forEach(m => {

    html += `${m.name} (Expiry: ${m.expiry.split("T")[0]})<br>`;

});

box.innerHTML = html;

}


// OPEN ADD MODAL
function openAddMedicine() {

document.getElementById("addMedicineModal").style.display = "block";

}


// CLOSE ADD MODAL
function closeAddMedicine() {

document.getElementById("addMedicineModal").style.display = "none";

}


// SAVE MEDICINE
function saveMedicine() {

const name = document.getElementById("medName").value;
const category = document.getElementById("medCategory").value;
const price = document.getElementById("medPrice").value;
const cost = document.getElementById("medCost").value;
const stock = document.getElementById("medStock").value;
const expiry = document.getElementById("medExpiry").value;

fetch("http://localhost:3000/medicines", {
method: "POST",
headers: {
    "Content-Type": "application/json",
    "Authorization": authHeader
},
body: JSON.stringify({
    name,
    category,
    price,
    cost_price: cost,
    stock,
    expiry
})
})
.then(res => res.json())
.then(() => {

    alert("Medicine added");

    closeAddMedicine();

    loadMedicines();

})
.catch(() => alert("Failed to add medicine"));

}


// LOGOUT
function logout(){

localStorage.removeItem("adminToken");

location.href = "admin-login.html";

}


// INITIAL LOAD
loadMedicines();