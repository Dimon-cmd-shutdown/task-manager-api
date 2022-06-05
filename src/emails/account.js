require('dotenv').config()
const express = require('express')
const app = express()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});




const sendWelcomeEmail = (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


const sendCancelationEmail = (email, name) => {
    const mailOptions = {
        from: 'mynotesapp.0@gmail.com',
        to: email,
        subject: 'Goodbye MyTask',
        text: `Goodbye, ${name}. Please, can you explain why you delete your account? Hoping for your response.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}


