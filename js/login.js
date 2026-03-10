function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if (!email || !password) {
        msg.innerText = "❌ All fields required";
        return;
    }

    fetch("http://localhost:3000/user-auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("userName", data.user.name);
            localStorage.setItem("userEmail", data.user.email);

            msg.style.color = "green";
            msg.innerText = "✅ Login successful";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            msg.style.color = "red";
            msg.innerText = data.message;
        }
    })
    .catch(() => {
        msg.innerText = "❌ Server error";
    });
}
