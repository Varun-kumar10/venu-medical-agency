const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "Venu@Admin2026") {

        const token = jwt.sign(
            { id: 1, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login successful",
            token
        });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;