const cartItemsDiv = document.getElementById("cartItems");
const totalAmountDiv = document.getElementById("totalAmount");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
    cartItemsDiv.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p style='text-align:center;'>Cart is empty</p>";
        totalAmountDiv.innerText = "";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <span>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</span>
            <button onclick="removeItem(${index})">Remove</button>
        `;

        cartItemsDiv.appendChild(div);
    });

    totalAmountDiv.innerText = `Total Amount: ₹${total}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

renderCart();
