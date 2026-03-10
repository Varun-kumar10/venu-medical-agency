const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "krarun@85", // 👈 put SAME password you use in Workbench
    database: "venu_medical"
});

db.connect(err => {
    if (err) {
        console.error("DB Connection Failed ❌", err.message);
    } else {
        console.log("MySQL Connected ✅");
    }
});

module.exports = db;
