const form = document.getElementById("trackForm");
const resultBox = document.getElementById("result");
const timelineContainer = document.getElementById("timelineContainer");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const orderId = document.getElementById("orderId").value.trim();

    if (!orderId) {
        alert("Please enter Order ID");
        return;
    }

    fetch(`http://localhost:3000/orders-db/track/${orderId}`)
        .then(res => {
            if (!res.ok) throw new Error("Not found");
            return res.json();
        })
        .then(order => {
            resultBox.innerHTML = `
                <h3>Order #${order.id}</h3>
                <p><b>Status:</b> ${order.status}</p>
                <p><b>Total:</b> ₹${order.total}</p>
                <p><b>Date:</b> ${new Date(order.created_at).toLocaleDateString()}</p>
            `;

            renderTimeline(order.status);
        })
        .catch(() => {
            resultBox.innerHTML = "<p style='color:red'>❌ Order not found</p>";
            timelineContainer.innerHTML = "";
        });
});
function renderTimeline(status) {
    timelineContainer.innerHTML = `
        <div class="timeline">
            <div class="step ${["Pending","Packed","Delivered"].includes(status) ? "active" : ""}">
                Pending
            </div>
            <div class="step ${["Packed","Delivered"].includes(status) ? "active" : ""}">
                Packed
            </div>
            <div class="step ${status === "Delivered" ? "active" : ""}">
                Delivered
            </div>
        </div>
    `;
}

