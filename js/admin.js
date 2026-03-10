const token = localStorage.getItem("adminToken");

if (!token) {
    alert("Please login again");
    window.location.href = "admin-login.html";
}

const authHeader = "Bearer " + token;

let currentPage = 1;

// ===============================
// LOAD ORDERS
// ===============================
function loadOrders(page = 1) {

    const search = document.getElementById("searchInput").value;
    const status = document.getElementById("statusFilter").value;

    fetch(`http://127.0.0.1:3000/admin-orders?search=${search}&status=${status}&page=${page}`, {
        headers: {
            "Authorization": authHeader
        }
    })
    .then(res => res.json())
    .then(data => {

        const orders = data.orders;
        const ordersList = document.getElementById("ordersList");

        ordersList.innerHTML = "";

        let pending = 0, packed = 0, delivered = 0;

        orders.forEach(order => {

            if (order.status === "Pending") pending++;
            if (order.status === "Packed") packed++;
            if (order.status === "Delivered") delivered++;

            const div = document.createElement("div");
            div.className = "order-card";

            div.innerHTML = `
                <h4>Order ID: ${order.id}</h4>
                <p><b>Name:</b> ${order.customer_name}</p>
                <p><b>Phone:</b> ${order.phone}</p>
                <p><b>Total:</b> ₹${order.total ?? 0}</p>
                <p><b>Status:</b> ${order.status}</p>

                <select onchange="updateStatus(${order.id}, this.value)">
                    <option value="Pending" ${order.status==="Pending"?"selected":""}>Pending</option>
                    <option value="Packed" ${order.status==="Packed"?"selected":""}>Packed</option>
                    <option value="Delivered" ${order.status==="Delivered"?"selected":""}>Delivered</option>
                </select>
            `;

            ordersList.appendChild(div);
        });

        // Update stats
        document.getElementById("total").innerText = data.totalOrders;
        document.getElementById("pending").innerText = pending;
        document.getElementById("packed").innerText = packed;
        document.getElementById("delivered").innerText = delivered;

        renderPagination(data.totalPages, data.currentPage);
    })
    .catch(err => {
        console.error(err);
        alert("Session expired. Please login again.");
        localStorage.removeItem("adminToken");
        window.location.href = "admin-login.html";
    });
}

// ===============================
// UPDATE STATUS
// ===============================
function updateStatus(orderId, status) {

    fetch(`http://127.0.0.1:3000/admin-orders/update-status/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
        },
        body: JSON.stringify({ status })
    })
    .then(() => loadOrders(currentPage))
    .catch(() => alert("❌ Failed to update status"));
}

// ===============================
// PAGINATION
// ===============================
function renderPagination(totalPages, current) {

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        const btn = document.createElement("button");
        btn.innerText = i;

        if (i === current)
            btn.style.fontWeight = "bold";

        btn.onclick = () => {
            currentPage = i;
            loadOrders(i);
        };

        pagination.appendChild(btn);
    }
}

// ===============================
// APPLY FILTERS
// ===============================
function applyFilters() {
    currentPage = 1;
    loadOrders(1);
}

document.addEventListener("DOMContentLoaded", () => loadOrders());