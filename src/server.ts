const nodemailer = require("nodemailer");
import { Request, Response, NextFunction } from 'express'
const express = require('express')
const cookieParser = require("cookie-parser")
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config()

// Setting Express
const app = express()
app.use(express.static(path.join(__dirname, 'frontend/dist')))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET, // just a long random string
  resave: false,
  saveUninitialized: true
}));

app.get('/cadastrar', (req: Request, res: Response) => res.sendFile(path.join(__dirname, "frontend/dist", "index.html")))
app.get('/entrar', (req: Request, res: Response) => res.sendFile(path.join(__dirname, "frontend/dist", "index.html")))
app.get('/', (req: Request, res: Response) => res.sendFile(path.join(__dirname, "frontend/dist", "index.html")))

// Connect Mongoose
mongoose.connect(process.env.API_KEY, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error: string) => console.log(error))
db.once('open', () => console.log("Connected to DB"))

const userSchema = new mongoose.Schema({
    id: String,
    email: String,
    username: String,
    password: String,
    emailCode: String,
})
const UserModel = mongoose.model("BlogUser", userSchema)

// Function to check length of strings and if they are undefined
function checkLength(text: string, minLenght: number, maxLenght: number){
  if (text){
    return text.length >= minLenght && text.length <= maxLenght ? true : false
  }
  return false
}

app.post('/api/register', (req: Request | any, res: Response) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email
  const sessionID = req.sessionID
  const emailCode = Math.floor(1000 + Math.random() * 9000).toString()

  if (checkLength(username, 3, 32) && checkLength(password, 3, 32) && sessionID && /\S+@\S+\.\S+/.test(email)){
    // checar se o usuário já existe
    UserModel.find({username: username}).then((e : any) => {
      if (Object.keys(e).length == 0){
        const user = new UserModel({
          id: sessionID,
          email: email,
          username: username,
          password: password,
          emailCode: emailCode
        })
        user.save()
        res.send({
          status: true,
          msg: "Usuário criado"
        })
        console.log("Usuário criado")
        sendMail(email, emailCode)
      }
      else{
        res.send({
          status: false,
          msg: "Usuário já existente"
        })
        console.log("Usuário já existente")
      }
    })
  }
  // Se dados inválidos
  else{
    res.send({
      msg: "Dados inválidos",
      status: false,
    })
    console.log("Dados inválidos")
  }
})

// Send Email With Code
async function sendMail(mailReceiver:string, code:string) {
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
        from: process.env.EMAIL, // sender address
        to: mailReceiver, // list of receivers
        text: "Seu código é: " + code, // plain text body
    });
    console.log("Código enviado: "+ code);
  }
  catch(err) {
    console.log(err)
  }
}

app.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on port 8000`)
})