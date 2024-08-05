const express = require('express');
const cors=require('cors');
const https = require("https");
const fs = require("fs");
const User = require('./models/User.js');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'thisisascret';
app.use(cors({
    origin : 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
//console.log(process.env.MONGO_URL);


app.get('/',  function (req, res) {
  res.send('Hello World')
})
app.post('/register',async(req,res)=>{
    var {name,email,password}=req.body;
    await mongoose.connect(process.env.MONGO_URL);
    res.json({name,email,password});
    try {
        const userDoc = await User.create({
          name,
          email,
          password:bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
      } catch (e) {
        res.status(422).json(e);
      }
})
app.post('/login', async (req,res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({
          email:userDoc.email,
          id:userDoc._id
        }, jwtSecret, {}, (err,token) => {
          if (err) throw err;
          res.cookie('token', token,{ sameSite: 'None', secure: true }).json(userDoc);
        });
      //  res.json('pass ok');
       // console.log('good');
      } else {
        res.status(422).json('pass not ok');
      }
    } else {
      res.status(422).json('not found');
    }
  });
  app.get('/profile', (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {name,email,_id} = await User.findById(userData.id);
        res.json({name,email,_id});
      });
    } else {
      res.json(null);
    }
  });
  app.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
  });
  
//61vCiFJ4UW6nM6t1
const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};

// Creating https server by passing
// options and app object
https.createServer(options, app)
    .listen(4000, function (req, res) {
        console.log("Server started at port 4000");
    });