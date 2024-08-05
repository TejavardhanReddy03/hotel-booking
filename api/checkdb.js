const mongoose = require('mongoose');

const uri = 'mongodb+srv://teja:61vCiFJ4UW6nM6t1@cluster0.g8ukxop.mongodb.net/';
             



mongoose.connect(uri, {
  ssl: true // Ensures SSL is enabled
})
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));
