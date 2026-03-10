const token = localStorage.getItem("adminToken");

if (!token) {
    alert("Session expired");
    location.href = "admin-login.html";
}

fetch("http://localhost:3000/admin-analytics", {
    headers: {
        "Authorization": "Bearer " + token
    }
})
.then(res => res.json())
.then(data => {

    console.log("Analytics Data:", data);

    document.getElementById("totalRevenue").innerText = "₹ " + Number(data.totalRevenue || 0).toFixed(2);
    document.getElementById("totalCost").innerText = "₹ " + Number(data.totalCost || 0).toFixed(2);
    document.getElementById("totalProfit").innerText = "₹ " + Number(data.totalProfit || 0).toFixed(2);

    const margin = data.totalRevenue > 0
        ? ((data.totalProfit / data.totalRevenue) * 100).toFixed(2)
        : 0;

    document.getElementById("profitMargin").innerText = margin + "%";

    const ctx = document.getElementById("profitChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Revenue", "Cost", "Profit"],
            datasets: [{
                label: "Amount (₹)",
                data: [
                    Number(data.totalRevenue || 0),
                    Number(data.totalCost || 0),
                    Number(data.totalProfit || 0)
                ],
                backgroundColor: [
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(75, 192, 192, 0.6)"
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

})
.catch(err => {
    console.error("Analytics Error:", err);
});