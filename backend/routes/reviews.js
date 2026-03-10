const express = require("express");
const router = express.Router();
const db = require("../db");

// ADD REVIEW
router.post("/", (req, res) => {
    const { medicine_id, user_name, rating, comment } = req.body;

    db.query(
        "INSERT INTO reviews (medicine_id, user_name, rating, comment) VALUES (?, ?, ?, ?)",
        [medicine_id, user_name, rating, comment],
        err => {
            if (err) return res.status(500).json({ message: "DB error" });
            res.json({ message: "Review added" });
        }
    );
});

// GET REVIEWS FOR MEDICINE
router.get("/:medicineId", (req, res) => {
    db.query(
        "SELECT * FROM reviews WHERE medicine_id = ?",
        [req.params.medicineId],
        (err, results) => {
            if (err) return res.status(500).json({ message: "DB error" });
            res.json(results);
        }
    );
});

module.exports = router;
