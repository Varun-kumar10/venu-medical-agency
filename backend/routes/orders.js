const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// TEMP orders (later from DB in Step 3)
let orders = [
    {
        id: "ORD123",
        customer: "Ramesh",
        total: 450,
        status: "Pending"
    }
];

// 🔐 Protected route
router.get("/", auth, (req, res) => {
    res.json(orders);
});

module.exports = router;
