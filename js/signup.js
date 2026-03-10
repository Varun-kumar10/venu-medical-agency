function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if (!name || !email || !password) {
        msg.innerText = "❌ All fields required";
        return;
    }

    fetch("http://localhost:3000/user-auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message === "Signup successful") {
            msg.style.color = "green";
            msg.innerText = "✅ Signup successful. Please login.";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            msg.style.color = "red";
            msg.innerText = data.message;
        }
    })
    .catch(() => {
        msg.innerText = "❌ Server error";
    });
}
