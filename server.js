"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const express = require('express');
const cookieParser = require("cookie-parser");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();
// Setting Express
const app = express();
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.get('/cadastrar', (req, res) => res.sendFile(path.join(__dirname, "frontend/dist", "index.html")));
app.get('/entrar', (req, res) => res.sendFile(path.join(__dirname, "frontend/dist", "index.html")));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, "frontend/dist", "index.html")));
// Connect Mongoose
mongoose.connect(process.env.API_KEY, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("Connected to DB"));
const userSchema = new mongoose.Schema({
    id: String,
    email: String,
    username: String,
    password: String,
    emailCode: String,
});
const UserModel = mongoose.model("BlogUser", userSchema);
// Function to check length of strings and if they are undefined
function checkLength(text, minLenght, maxLenght) {
    if (text) {
        return text.length >= minLenght && text.length <= maxLenght ? true : false;
    }
    return false;
}
app.post('/api/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const sessionID = req.sessionID;
    const emailCode = Math.floor(1000 + Math.random() * 9000).toString();
    if (checkLength(username, 3, 32) && checkLength(password, 3, 32) && sessionID && /\S+@\S+\.\S+/.test(email)) {
        // checar se o usu??rio j?? existe
        UserModel.find({ username: username }).then((e) => {
            if (Object.keys(e).length == 0) {
                const user = new UserModel({
                    id: sessionID,
                    email: email,
                    username: username,
                    password: password,
                    emailCode: emailCode
                });
                user.save();
                res.send({
                    status: true,
                    msg: "Usu??rio criado"
                });
                console.log("Usu??rio criado");
                sendMail(email, emailCode);
            }
            else {
                res.send({
                    status: false,
                    msg: "Usu??rio j?? existente"
                });
                console.log("Usu??rio j?? existente");
            }
        });
    }
    // Se dados inv??lidos
    else {
        res.send({
            msg: "Dados inv??lidos",
            status: false,
        });
        console.log("Dados inv??lidos");
    }
});
// Send Email With Code
function sendMail(mailReceiver, code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAILPASS,
                },
            });
            // send mail with defined transport object
            transporter.sendMail({
                from: process.env.EMAIL,
                to: mailReceiver,
                text: "Seu c??digo ??: " + code, // plain text body
            });
            console.log("C??digo enviado: " + code);
        }
        catch (err) {
            console.log(err);
        }
    });
}
app.listen(process.env.PORT || 8000, () => {
    console.log(`Listening on port 8000`);
});
