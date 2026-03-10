const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

console.log("🔥 admin-orders.js LOADED");

// ===============================
// GET ORDERS WITH SEARCH + FILTER + PAGINATION
// ===============================
router.get("/", auth, (req, res) => {

    const { search, status, page = 1 } = req.query;

    const limit = 5;
    const offset = (page - 1) * limit;

    let baseQuery = "FROM orders WHERE 1=1";
    let params = [];

    // 🔍 Search by Order ID
    if (search) {
        baseQuery += " AND id = ?";
        params.push(search);
    }

    // 🏷 Filter by Status
    if (status) {
        baseQuery += " AND status = ?";
        params.push(status);
    }

    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const dataQuery = `
        SELECT * ${baseQuery}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    `;

    db.query(countQuery, params, (err, countResult) => {
        if (err) return res.status(500).json({ message: "Count error" });

        const totalOrders = countResult[0].total;
        const totalPages = Math.ceil(totalOrders / limit);

        db.query(dataQuery, [...params, limit, offset], (err2, results) => {
            if (err2) return res.status(500).json({ message: "DB error" });

            res.json({
                orders: results,
                totalOrders,
                totalPages,
                currentPage: Number(page)
            });
        });
    });
});

// ===============================
// UPDATE ORDER STATUS
// ===============================
router.put("/update-status/:id", auth, (req, res) => {

    const { status } = req.body;
    const orderId = req.params.id;

    db.query(
        "UPDATE orders SET status=? WHERE id=?",
        [status, orderId],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Update failed" });
            }
            res.json({ message: "Status updated" });
        }
    );
});

module.exports = router;