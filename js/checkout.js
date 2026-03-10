let discountPercent = 0;
let appliedCoupon = "";
let isFirstTimeDiscountApplied = false;

// ===============================
// CALCULATE TOTAL
// ===============================
function calculateFinalTotal() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
    });

    // AUTO COUPON SUGGESTION
    const suggestion = document.getElementById("couponSuggestion");

    if (total >= 1000) {
        suggestion.innerText = "🎉 Use MED20 to get 20% OFF!";
    }
    else if (total >= 500) {
        suggestion.innerText = "🎉 Use SAVE10 to get 10% OFF!";
    }
    else {
        suggestion.innerText = "Add items worth ₹500 to unlock discounts";
    }

    // FIRST-TIME USER DISCOUNT
    let firstOrder = localStorage.getItem("firstOrder");
    const discountInfo = document.getElementById("discountInfo");

    if (!firstOrder && appliedCoupon === "") {
        discountPercent = 10;
        isFirstTimeDiscountApplied = true;
        discountInfo.innerText = "🎁 First Order Offer: 10% OFF Applied!";
    }

    const discountAmount = (total * discountPercent) / 100;
    const finalTotal = total - discountAmount;

    document.getElementById("totalAmount").innerText = total.toFixed(2);
    document.getElementById("discountPercent").innerText = discountPercent;
    document.getElementById("discountAmount").innerText = discountAmount.toFixed(2);
    document.getElementById("finalTotal").innerText = finalTotal.toFixed(2);
}

// ===============================
// APPLY COUPON
// ===============================
function applyCoupon() {

    const code = document.getElementById("couponInput").value.trim().toUpperCase();
    const discountInfo = document.getElementById("discountInfo");
    const total = parseFloat(document.getElementById("totalAmount").innerText);

    discountPercent = 0;
    appliedCoupon = "";
    isFirstTimeDiscountApplied = false;

    if (code === "SAVE10") {
        if (total >= 500) {
            discountPercent = 10;
            appliedCoupon = code;
            discountInfo.innerText = "🎉 10% Discount Applied!";
        } else {
            discountInfo.innerText = "Minimum ₹500 required for SAVE10";
        }
    }
    else if (code === "MED20") {
        if (total >= 1000) {
            discountPercent = 20;
            appliedCoupon = code;
            discountInfo.innerText = "🔥 20% Discount Applied!";
        } else {
            discountInfo.innerText = "Minimum ₹1000 required for MED20";
        }
    }
    else {
        discountInfo.innerText = "❌ Invalid Coupon";
    }

    calculateFinalTotal();
}

// ===============================
// PLACE ORDER
// ===============================
function placeOrder() {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !phone || !address) {
        alert("Please fill all required fields");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const subtotal = parseFloat(document.getElementById("totalAmount").innerText);
    const discountAmount = parseFloat(document.getElementById("discountAmount").innerText);
    const finalAmount = parseFloat(document.getElementById("finalTotal").innerText);

    const orderData = {
        customer: { name, phone, email, address },
        items: cart,
        subtotal: subtotal,
        coupon: appliedCoupon || "FIRST10",
        discountPercent: discountPercent,
        discountAmount: discountAmount,
        total: finalAmount,
        date: new Date().toLocaleString()
    };

    fetch("http://localhost:3000/orders-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })
    .then(res => res.json())
    .then(data => {

        if (!data.orderId) {
            alert("Order placed but ID not received ❌");
            return;
        }

        const delivery = getEstimatedDelivery();

        // Mark first order completed
        localStorage.setItem("firstOrder", "done");

        // ===============================
        // LOYALTY POINTS
        // ===============================
        let earnedPoints = Math.floor(finalAmount / 100);
        let existingPoints = parseInt(localStorage.getItem("loyaltyPoints")) || 0;
        let totalPoints = existingPoints + earnedPoints;

        localStorage.setItem("loyaltyPoints", totalPoints);
        localStorage.setItem("lastEarnedPoints", earnedPoints);

        localStorage.removeItem("cart");

        window.location.href =
            "order-success.html?orderId=" +
            data.orderId +
            "&amount=" +
            finalAmount +
            "&delivery=" +
            encodeURIComponent(delivery);
    })
    .catch(err => {
        console.error(err);
        alert("Order failed ❌");
    });
}

// ===============================
function getEstimatedDelivery() {
    const today = new Date();

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 5);

    const options = { day: "numeric", month: "short" };

    return `${minDate.toLocaleDateString("en-IN", options)} – ${maxDate.toLocaleDateString("en-IN", options)}`;
}

document.addEventListener("DOMContentLoaded", calculateFinalTotal);