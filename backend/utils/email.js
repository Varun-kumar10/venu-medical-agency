const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "varunnkumar940@gmail.com",
        pass: "vkmlkkpszxqvaksi"
    }
});

function sendOrderEmail(to, subject, text) {
    return transporter.sendMail({
        from: "Venu Medical Agency <varunnkumar940@gmail.com>",
        to,
        subject,
        text
    });
}

module.exports = sendOrderEmail;
