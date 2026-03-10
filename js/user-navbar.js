if (name) {
    document.getElementById("userGreeting").innerText = `👋 Hi, ${name}`;
}

const welcome = document.getElementById("userWelcome");

if (userName && welcome) {
    welcome.innerText = `👋 Hi, ${userName}`;
}
