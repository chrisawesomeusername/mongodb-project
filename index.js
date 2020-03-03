const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json');
const products = require('./Products.json');

const port = 3000;
//connect to db
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASS}@${config.MONGO_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=> console.log('db connected')).catch(err =>{
  console.log(`bd connection error ${err.message}`);
});
//test the connectivity
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
  console.log('we are connected to mongodb');
});

app.use((req, res, next)=>{
  console.log(`${req.method} request for ${req.url}`);
  next();//indclude this to go to the next middleware
});

app.get('/', (req, res) => res.send('Welcome to mongodb stuff'));

app.get('/allProducts', (req,res)=>{
  res.json(products);
});
app.get('/products/p=:id', (req, res)=>{
  const idParam = req.params.id;
  for (let i = 0; i < products.length; i++){
    if (idParam.toString() === products[i].id.toString()) {
      res.json(products[i]);
    }
  }
});







//always keep this at the end
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
