require("dotenv").config(); // ✅ added for industry level

const express = require("express");
const cors = require("cors");

require("./db");

const adminRoutes = require("./routes/admin");
const medicinesRoutes = require("./routes/medicines");
const ordersDbRoutes = require("./routes/orders-db");
const adminOrdersRoutes = require("./routes/admin-orders");
const invoiceRoutes = require("./routes/invoice");
const userAuthRoutes = require("./routes/user-auth");
const reviewRoutes = require("./routes/reviews");
const userOrdersRoutes = require("./routes/user-orders");
const adminRevenueRoutes = require("./routes/admin-revenue");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 ROUTES
app.use("/admin", adminRoutes);
app.use("/medicines", medicinesRoutes);
app.use("/orders-db", ordersDbRoutes);
app.use("/admin-orders", adminOrdersRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/user-auth", userAuthRoutes);
app.use("/reviews", reviewRoutes);
app.use("/user-orders", userOrdersRoutes);
app.use("/admin-revenue", adminRevenueRoutes);

app.get("/", (req, res) => {
    res.send("Venu Medical Backend Running 🚀");
});

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});