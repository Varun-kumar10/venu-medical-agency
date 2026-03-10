const container = document.getElementById("medicineContainer");
const title = document.getElementById("categoryTitle");

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

title.innerText = category + " Medicines";

fetch(`http://localhost:3000/medicines/public?category=${category}`)

.then(res => res.json())

.then(data => {

container.innerHTML = "";

if(!data.length){
container.innerHTML = "<p>No medicines found</p>";
return;
}

data.forEach(med => {

const card = document.createElement("div");

card.className = "medicine-card";

card.innerHTML = `
<h3>${med.name}</h3>

<p>Price: ₹${med.price}</p>

<p>Stock: ${med.stock}</p>

<button onclick="addToCart(${med.id}, '${med.name}', ${med.price})">
Add to Cart
</button>
`;

container.appendChild(card);

});

});



function addToCart(id,name,price){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const existing = cart.find(item => item.id === id);

if(existing){
existing.qty += 1;
}else{
cart.push({id,name,price,qty:1});
}

localStorage.setItem("cart",JSON.stringify(cart));

alert("Added to cart");

}