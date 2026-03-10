let currentChartType = "bar";

let monthlyChartInstance = null;
let dailyChartInstance = null;
let topSellingChartInstance = null;

const revenueToken = localStorage.getItem("adminToken");

function loadAnalytics(range = "all") {

    if (!revenueToken) return;
fetch(`http://127.0.0.1:3000/admin-revenue?range=${range}`, {

        headers: {
            "Authorization": "Bearer " + revenueToken
        }
    })
    .then(res => res.json())
    .then(data => {

        console.log("Analytics Data:", data);

        const totalRevenue = Number(data.totalRevenue || 0);
        const totalCost = Number(data.totalCost || 0);
        const totalProfit = Number(data.totalProfit || 0);

        // 💰 Cards
        document.getElementById("totalRevenueCard").innerText =
            "₹ " + totalRevenue.toFixed(2);

        document.getElementById("totalCost").innerText =
            "₹ " + totalCost.toFixed(2);

        document.getElementById("totalProfit").innerText =
            "₹ " + totalProfit.toFixed(2);

        const margin = totalRevenue > 0
            ? ((totalProfit / totalRevenue) * 100).toFixed(2)
            : 0;

        document.getElementById("profitMargin").innerText =
            margin + "%";

        // ===============================
        // 📈 MONTHLY REVENUE + PROFIT
        // ===============================
        if (data.monthly && data.monthly.length) {

            const labels = data.monthly.map(d => {
                const date = new Date(d.month + "-01");
                return date.toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric"
                });
            });

            const revenueValues =
                data.monthly.map(d => Number(d.revenue || 0));

            const profitValues =
                data.monthly.map(d => Number(d.profit || 0));

            if (monthlyChartInstance)
                monthlyChartInstance.destroy();

            monthlyChartInstance = new Chart(
                document.getElementById("revenueChart").getContext("2d"),
                {
                    type: currentChartType,
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "Revenue (₹)",
                                data: revenueValues,
                                backgroundColor: "rgba(54,162,235,0.6)",
                                borderColor: "rgba(54,162,235,1)",
                                fill: currentChartType === "line" ? false : true,
                                tension: 0.3
                            },
                            {
                                label: "Profit (₹)",
                                data: profitValues,
                                backgroundColor: "rgba(75,192,192,0.6)",
                                borderColor: "rgba(75,192,192,1)",
                                fill: currentChartType === "line" ? false : true,
                                tension: 0.3
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                }
            );
        }

        // ===============================
        // 📅 DAILY REVENUE TREND
        // ===============================
        if (data.daily && data.daily.length) {

            const days = data.daily.map(d => {
                const date = new Date(d.day);
                return date.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short"
                });
            });

            const revenues =
                data.daily.map(d => Number(d.revenue || 0));

            if (dailyChartInstance)
                dailyChartInstance.destroy();

            dailyChartInstance = new Chart(
                document.getElementById("dailyRevenueChart").getContext("2d"),
                {
                    type: "line",
                    data: {
                        labels: days,
                        datasets: [
                            {
                                label: "Daily Revenue (₹)",
                                data: revenues,
                                borderColor: "rgba(255,99,132,1)",
                                backgroundColor: "rgba(255,99,132,0.2)",
                                fill: true,
                                tension: 0.3
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                }
            );
        }

        // ===============================
        // 🏆 TOP SELLING MEDICINES
        // ===============================
        if (data.topSelling && data.topSelling.length) {

            const names =
                data.topSelling.map(d => d.medicine_name);

            const quantities =
                data.topSelling.map(d => Number(d.totalSold));

            if (topSellingChartInstance)
                topSellingChartInstance.destroy();

            topSellingChartInstance = new Chart(
                document.getElementById("topSellingChart").getContext("2d"),
                {
                    type: "bar",
                    data: {
                        labels: names,
                        datasets: [
                            {
                                label: "Units Sold",
                                data: quantities,
                                backgroundColor: "rgba(153,102,255,0.6)"
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                }
            );
        }

    })
    .catch(err => console.error("Analytics Error:", err));
}

// ===============================
// 🚀 INIT
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    loadAnalytics("all");

    const btnAll = document.getElementById("btnAll");
    const btn7 = document.getElementById("btn7");
    const btn30 = document.getElementById("btn30");
    const toggleBtn = document.getElementById("toggleChartBtn");

    if (btnAll)
        btnAll.addEventListener("click", () => loadAnalytics("all"));

    if (btn7)
        btn7.addEventListener("click", () => loadAnalytics("7days"));

    if (btn30)
        btn30.addEventListener("click", () => loadAnalytics("30days"));

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            currentChartType =
                currentChartType === "bar" ? "line" : "bar";
            loadAnalytics("all");
        });
    }

});