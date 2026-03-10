function loginAdmin() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {

        if (data.token) {

            localStorage.setItem("adminToken", data.token);

            alert("Login successful");

            window.location.href = "admin.html";

        } else {
            alert(data.message);
        }

    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });

}