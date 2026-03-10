// ===============================
// GET URL PARAMETERS
// ===============================
const params = new URLSearchParams(window.location.search);

const orderId = params.get("orderId");
const amount = params.get("amount");
const delivery = params.get("delivery");

document.getElementById("orderId").innerText = orderId || "N/A";
document.getElementById("finalAmount").innerText = amount || "0";
document.getElementById("deliveryDate").innerText = delivery || "Soon";

// ===============================
// LOYALTY POINTS DISPLAY
// ===============================

// Points earned in this order
const earnedPoints = localStorage.getItem("lastEarnedPoints") || 0;

// Total accumulated points
const totalPoints = localStorage.getItem("loyaltyPoints") || 0;

document.getElementById("earnedPoints").innerText = earnedPoints;
document.getElementById("totalPoints").innerText = totalPoints;