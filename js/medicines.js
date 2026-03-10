// ==============================
// OPEN CATEGORY PAGE
// ==============================

function openCategory(category){

window.location.href =
`category.html?category=${encodeURIComponent(category)}`;

}



// ==============================
// SHOW USER NAME
// ==============================

const userName = localStorage.getItem("userName");
const userWelcome = document.getElementById("userWelcome");

if (userName && userWelcome) {
    userWelcome.innerText = `👋 Hi, ${userName}`;
}



const container = document.getElementById("medicineContainer");
const categoryContainer = document.getElementById("categoryContainer");

let allMedicines = [];


// LOADING
if(container){
container.innerHTML = "<p>Loading medicines...</p>";
}



// ==============================
// FETCH MEDICINES
// ==============================

fetch("http://localhost:3000/medicines/public")

.then(res => {

if (!res.ok) throw new Error("API Error");

return res.json();

})

.then(data => {

allMedicines = data;

renderCategories(data);

renderMedicines(data);

})

.catch(err => {

console.error("❌ Medicines load error:", err);

if(container){
container.innerHTML = "<p>Error loading medicines</p>";
}

});



// ==============================
// CATEGORY CARDS
// ==============================

function renderCategories(medicines){

if(!categoryContainer) return;

const categories = [...new Set(medicines.map(m => m.category))];

categoryContainer.innerHTML = "";

categories.forEach(cat => {

const card = document.createElement("div");

card.className = "category-card";

card.innerText = cat;

card.onclick = () => openCategory(cat);

categoryContainer.appendChild(card);

});

}



// ==============================
// RENDER MEDICINES
// ==============================

function renderMedicines(medicines){

if(!container) return;

container.innerHTML = "";

if(!medicines.length){

container.innerHTML = "<p>No medicines found</p>";

return;

}

medicines.forEach(med => {

const expiryDate = new Date(med.expiry);

const today = new Date();

const diffDays = (expiryDate - today) / (1000*60*60*24);

let expiryWarning = "";

if(diffDays <= 30){

expiryWarning = "<p class='expiry-warning'>⚠ Expiring Soon</p>";

}

let stockInfo = `<p>Stock: ${med.stock}</p>`;

let btnDisabled = "";

if(med.stock <= 0){

stockInfo = "<p class='out-stock'>Out of Stock</p>";

btnDisabled = "disabled";

}

const card = document.createElement("div");

card.className = "medicine-card";

card.innerHTML = `

<h3>${med.name}</h3>

<p>Category: ${med.category}</p>

<p>Price: ₹${med.price}</p>

${stockInfo}

${expiryWarning}

<div style="margin:10px 0;">

<select onchange="submitReview(${med.id}, this.value)">

<option value="">⭐ Rate</option>

<option value="5">⭐⭐⭐⭐⭐</option>

<option value="4">⭐⭐⭐⭐</option>

<option value="3">⭐⭐⭐</option>

<option value="2">⭐⭐</option>

<option value="1">⭐</option>

</select>

</div>

<button ${btnDisabled}

onclick="addToCart(${med.id}, '${med.name}', ${med.price})">

Add to Cart

</button>

`;

container.appendChild(card);

});

}



// ==============================
// ADD TO CART
// ==============================

function addToCart(id,name,price){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const existing = cart.find(item => item.id === id);

if(existing){

existing.qty += 1;

}else{

cart.push({id,name,price,qty:1});

}

localStorage.setItem("cart",JSON.stringify(cart));

alert("Added to cart ✅");

}



// ==============================
// SUBMIT REVIEW
// ==============================

function submitReview(medicineId,rating){

const userName = localStorage.getItem("userName");

if(!userName){

alert("Please login to rate medicines");

return;

}

fetch("http://localhost:3000/reviews",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

medicine_id:medicineId,

user_name:userName,

rating,

comment:""

})

})

.then(res=>res.json())

.then(()=>alert("⭐ Thanks for your rating!"))

.catch(()=>alert("❌ Rating failed"));

}