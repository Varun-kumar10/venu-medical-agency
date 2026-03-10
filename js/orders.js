fetch("http://localhost:3000/orders-db")
.then(res => res.json())
.then(data => {
    const div = document.getElementById("myOrders");

    if (data.length === 0) {
        div.innerHTML = "<p>No orders found</p>";
        return;
    }

    data.forEach(o => {
        div.innerHTML += `
            <div class="order-card">
                <h4>Order ID: ${o.order_id}</h4>
                <p>Status: ${o.status || "Pending"}</p>
                <p>Total: ₹${o.total_amount}</p>
                <a href="http://localhost:3000/invoice/${o.order_id}" target="_blank">
                    📄 Download Invoice
                </a>
            </div>
        `;
    });
});
