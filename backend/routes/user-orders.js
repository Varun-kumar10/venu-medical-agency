const express = require("express");
const router = express.Router();
const db = require("../db");

// 🧑 USER ORDER HISTORY (by email)
router.get("/:email", (req, res) => {
    const email = req.params.email;

    const sql = `
        SELECT order_code, total, status, created_at
        FROM orders
        WHERE email = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "DB error" });
        }
        res.json(results);
    });
});

module.exports = router;
