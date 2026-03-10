const express = require("express");
const router = express.Router();
const db = require("../db");

const authUser = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

router.get("/", authUser, adminOnly, (req, res) => {

    const range = req.query.range || "all";

    let dateCondition = "";

    if (range === "7days") {
        dateCondition = "WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    }
    else if (range === "30days") {
        dateCondition = "WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    }

    // 💰 TOTAL REVENUE
    const revenueQuery = `
        SELECT SUM(o.total) AS totalRevenue
        FROM orders o
        ${dateCondition}
    `;

    // 💎 COST + PROFIT
    const profitQuery = `
        SELECT 
            SUM(oi.quantity * m.cost_price) AS totalCost,
            SUM((oi.price - m.cost_price) * oi.quantity) AS totalProfit
        FROM order_items oi
        JOIN medicines m ON oi.medicine_name = m.name
        JOIN orders o ON oi.order_id = o.id
        ${dateCondition}
    `;

    // 📈 MONTHLY REVENUE + PROFIT
    const monthlyQuery = `
        SELECT 
            DATE_FORMAT(o.created_at, '%Y-%m') AS month,
            SUM(o.total) AS revenue,
            SUM((oi.price - m.cost_price) * oi.quantity) AS profit
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN medicines m ON oi.medicine_name = m.name
        ${dateCondition}
        GROUP BY month
        ORDER BY month ASC
    `;

    // 📅 DAILY REVENUE
    const dailyQuery = `
        SELECT 
            DATE(o.created_at) AS day,
            SUM(o.total) AS revenue
        FROM orders o
        ${dateCondition}
        GROUP BY day
        ORDER BY day ASC
    `;

    // 🏆 TOP SELLING MEDICINES
    const topSellingQuery = `
        SELECT 
            oi.medicine_name,
            SUM(oi.quantity) AS totalSold
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        ${dateCondition}
        GROUP BY oi.medicine_name
        ORDER BY totalSold DESC
        LIMIT 5
    `;

    db.query(revenueQuery, (err, revenueResult) => {
        if (err) return res.status(500).json({ message: "Revenue error" });

        db.query(profitQuery, (err2, profitResult) => {
            if (err2) return res.status(500).json({ message: "Profit error" });

            db.query(monthlyQuery, (err3, monthlyResult) => {
                if (err3) return res.status(500).json({ message: "Monthly error" });

                db.query(dailyQuery, (err4, dailyResult) => {
                    if (err4) return res.status(500).json({ message: "Daily error" });

                    db.query(topSellingQuery, (err5, topSellingResult) => {
                        if (err5) return res.status(500).json({ message: "Top selling error" });

                        const totalRevenue = revenueResult[0].totalRevenue || 0;
                        const totalCost = profitResult[0].totalCost || 0;
                        const totalProfit = profitResult[0].totalProfit || 0;

                        res.json({
                            totalRevenue,
                            totalCost,
                            totalProfit,
                            monthly: monthlyResult,
                            daily: dailyResult,
                            topSelling: topSellingResult
                        });

                    });
                });
            });
        });
    });

});

module.exports = router;