// USER DATA
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");

nameEl.innerText = localStorage.getItem("userName");
emailEl.innerText = localStorage.getItem("userEmail");

// PROFILE PROGRESS
function updateProgress() {
    let filled = 0;
    if (nameEl.innerText) filled++;
    if (localStorage.getItem("userPhone")) filled++;
    if (localStorage.getItem("userAddress")) filled++;
    document.getElementById("progressFill").style.width = (filled / 3 * 100) + "%";
}
updateProgress();

// TOAST
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// UPDATE PROFILE
function updateProfile() {
    localStorage.setItem("userName", document.getElementById("name").value);
    localStorage.setItem("userPhone", document.getElementById("phone").value);
    localStorage.setItem("userAddress", document.getElementById("address").value);

    nameEl.innerText = document.getElementById("name").value;
    updateProgress();
    showToast("Profile updated 🎉");
}

// ADDRESS BOOK
function loadAddresses() {
    const list = JSON.parse(localStorage.getItem("addresses")) || [];
    const container = document.getElementById("addressList");
    container.innerHTML = "";
    list.forEach((addr, i) => {
        container.innerHTML += `
            <div class="address-card">
                ${addr}
                <button onclick="removeAddress(${i})">❌</button>
            </div>`;
    });
}
loadAddresses();

function addAddress() {
    const addr = prompt("Enter new address");
    if (!addr) return;
    const list = JSON.parse(localStorage.getItem("addresses")) || [];
    list.push(addr);
    localStorage.setItem("addresses", JSON.stringify(list));
    loadAddresses();
}
function removeAddress(i) {
    const list = JSON.parse(localStorage.getItem("addresses"));
    list.splice(i, 1);
    localStorage.setItem("addresses", JSON.stringify(list));
    loadAddresses();
}

// ORDER HISTORY + TIMELINE
fetch("http://localhost:3000/user-orders", {
    headers: { Authorization: "Bearer " + localStorage.getItem("userToken") }
})
.then(r => r.json())
.then(data => {
    const container = document.getElementById("orderHistory");
    container.innerHTML = "";
    data.forEach(o => {
        container.innerHTML += `
        <div class="order-card">
            <b>Order #${o.id}</b>
            <div class="timeline">
                <span class="${o.status !== 'Pending' ? 'done':''}">Pending</span>
                <span class="${o.status === 'Packed' || o.status === 'Delivered' ? 'done':''}">Packed</span>
                <span class="${o.status === 'Delivered' ? 'done':''}">Delivered</span>
            </div>
        </div>`;
    });
});

// LOGOUT
function logoutUser() {
    localStorage.clear();
    window.location.href = "login.html";
}
let map, marker, pickedAddress = "";

function openMap() {
    document.getElementById("mapModal").style.display = "flex";

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 17.385, lng: 78.4867 }, // Hyderabad
        zoom: 14
    });

    marker = new google.maps.Marker({ map });

    map.addListener("click", (e) => {
        marker.setPosition(e.latLng);

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: e.latLng }, (results) => {
            if (results[0]) {
                pickedAddress = results[0].formatted_address;
            }
        });
    });
}

function savePickedAddress() {
    if (!pickedAddress) {
        alert("Please select a location");
        return;
    }

    const list = JSON.parse(localStorage.getItem("addresses")) || [];
    list.push(pickedAddress);
    localStorage.setItem("addresses", JSON.stringify(list));

    loadAddresses(); // existing function
    closeMap();
}

function closeMap() {
    document.getElementById("mapModal").style.display = "none";
}
