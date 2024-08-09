const express = require('express');
const cors=require('cors');
const https = require("https");
const fs = require("fs");
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer');
const mime = require('mime-types');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'thisisascret';
const bucket = 'teja-hotelbooking-app';
app.use(cors({
    origin : 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
//console.log(process.env.MONGO_URL);
async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFilename,
    ContentType: mimetype,
    ACL: 'public-read'
    
  }));
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}


app.get('/',  function (req, res) {
  res.send('Hello World')
})
app.post('/register',async(req,res)=>{
    var {name,email,password}=req.body;
    await mongoose.connect(process.env.MONGO_URL);
   // res.json({name,email,password});
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

app.post('/upload-by-link', async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: '/tmp/' +newName,
    timeout: 30000,
  });
  const url = await uploadToS3('/tmp/' +newName, newName, mime.lookup('/tmp/' +newName));
  res.json(url);
});

const photosMiddleware = multer({dest:'/tmp'});
app.post('/upload', photosMiddleware.array('photos', 100), async (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname,mimetype} = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

app.post('/places', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
});

/*app.get('/user-places', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {_id} = userData;
    res.json( await Place.find({owner:id}) );
  });
});*/
app.get('/user-places', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const { token } = req.cookies;
   // console.log('Token:', token); // Add this line
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, jwtSecret, async (err, userData) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Invalid token' });
      }

      //console.log('User Data:', userData); // Add this line

      if (!userData || !userData.id) {
        return res.status(401).json({ error: 'Invalid user data' });
      }

      const { id } = userData;
      const places = await Place.find({ owner: id });
      res.json(places);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB or fetching data', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/places/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await Place.find() );
});

app.post('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.get('/bookings', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});
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