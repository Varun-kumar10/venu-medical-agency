console.log("🔥🔥 orders-db.js LOADED 🔥🔥");

const express = require("express");
const router = express.Router();
const db = require("../db");


// ===============================
// PLACE ORDER
// ===============================
router.post("/", (req, res) => {

    console.log("🔥 ORDER ROUTE HIT");

    const { customer, items, total } = req.body;

    if (!customer || !items || !total) {
        return res.status(400).json({ message: "Invalid order data" });
    }

    const orderSql = `
        INSERT INTO orders (customer_name, phone, email, address, total)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        orderSql,
        [
            customer.name,
            customer.phone,
            customer.email,
            customer.address,
            total
        ],
        (err, result) => {

            if (err) {
                console.error("❌ ORDER INSERT ERROR:", err);
                return res.status(500).json({ message: "DB error" });
            }

            const orderId = result.insertId;

            console.log("✅ ORDER INSERTED, ID:", orderId);

            // 🔥 Reduce stock for each item
            items.forEach(item => {
                db.query(
                    "UPDATE medicines SET stock = stock - ? WHERE id = ? AND stock >= ?",
                    [item.qty, item.id, item.qty],
                    (stockErr) => {
                        if (stockErr) {
                            console.error("❌ STOCK UPDATE ERROR:", stockErr);
                        } else {
                            console.log(`📉 Stock updated for medicine ID ${item.id}`);
                        }
                    }
                );
            });

            // ✅ SEND ORDER ID BACK
            res.json({
                message: "Order placed successfully",
                orderId: orderId
            });
        }
    );
});


// ===============================
// TRACK ORDER
// ===============================
router.get("/track/:id", (req, res) => {

    const orderId = req.params.id;

    const sql = `
        SELECT id, customer_name, phone, status, total, created_at
        FROM orders
        WHERE id = ?
    `;

    db.query(sql, [orderId], (err, results) => {

        if (err) {
            console.error("❌ TRACK ORDER DB ERROR:", err);
            return res.status(500).json({ message: "DB error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(results[0]);
    });
});

module.exports = router;