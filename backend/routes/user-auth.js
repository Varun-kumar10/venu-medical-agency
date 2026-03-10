const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const authUser = require("../middleware/auth");

/* =========================
   USER SIGNUP
========================= */
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, results) => {
                if (err) return res.status(500).json({ message: "DB error" });

                if (results.length > 0) {
                    return res.status(409).json({ message: "User already exists" });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                    [name, email, hashedPassword, "user"],
                    (err) => {
                        if (err) return res.status(500).json({ message: "Insert failed" });

                        res.json({ message: "Signup successful" });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/* =========================
   USER LOGIN
========================= */
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) return res.status(500).json({ message: "DB error" });

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const user = results[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // ✅ Industry Level JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
});

/* =========================
   UPDATE PROFILE (PROTECTED)
========================= */
router.put("/update-profile", authUser, (req, res) => {
    const { name, phone, address } = req.body;
    const userId = req.user.id;

    const sql = `
        UPDATE users 
        SET name = ?, phone = ?, address = ?
        WHERE id = ?
    `;

    db.query(sql, [name, phone, address, userId], err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "DB error" });
        }
        res.json({ message: "Profile updated" });
    });
});

module.exports = router;