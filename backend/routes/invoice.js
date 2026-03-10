const express = require("express");
const PDFDocument = require("pdfkit");
const db = require("../db");

const router = express.Router();

// 🔹 Generate invoice using ORDER CODE (ORD...)
router.get("/:orderCode", (req, res) => {
    const orderCode = req.params.orderCode;

    // 1️⃣ Get order using order_id (ORD...)
    db.query(
        "SELECT * FROM orders WHERE order_id = ?",
        [orderCode],
        (err, orders) => {
            if (err || orders.length === 0) {
                return res.status(404).send("Order not found");
            }

            const order = orders[0];

            // 2️⃣ Get order items using numeric order.id
            db.query(
                "SELECT * FROM order_items WHERE order_id = ?",
                [order.id],
                (err2, items) => {
                    if (err2) return res.status(500).send("Error fetching items");

                    const doc = new PDFDocument();

                    res.setHeader("Content-Type", "application/pdf");
                    res.setHeader(
                        "Content-Disposition",
                        `attachment; filename=invoice_${order.order_id}.pdf`
                    );

                    doc.pipe(res);

                    // 🧾 Invoice content
                    doc.fontSize(20).text("Venu Medical Agency", { align: "center" });
                    doc.moveDown();

                    doc.fontSize(12).text(`Order ID: ${order.order_id}`);
                    doc.text(`Customer: ${order.customer_name}`);
                    doc.text(`Phone: ${order.phone}`);
                    doc.text(`Address: ${order.address}`);
                    doc.text(`Date: ${order.created_at}`);
                    doc.moveDown();

                    doc.text("Medicines:");
                    doc.moveDown(0.5);

                    items.forEach(item => {
                        doc.text(
                            `${item.medicine_name}  x${item.quantity}  ₹${item.price}`
                        );
                    });

                    doc.moveDown();
                    doc.fontSize(14).text(
                        `Total Amount: ₹${order.total_amount}`,
                        { align: "right" }
                    );

                    doc.end();
                }
            );
        }
    );
});

module.exports = router;
