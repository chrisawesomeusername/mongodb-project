const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');//to parse all data coming from the user and database.
const cors = require('cors');// to include cross origin request
const bcryptjs = require('bcryptjs');// to hash and compare password
const config = require('./config.json');// to store credentials
const products = require('./Products.json');// external api json data
const dbProduct = require('./models/products.js');
const User = require('./models/users.js');
const Product = require('./models/products.js');
const port = 3000;
//connect to db
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASS}@${config.MONGO_CLUSTER}.mongodb.net/shop?retryWrites=true&w=majority`
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

//including bodyParser, cors, bcryptjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

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

//-=-=-=-=-=-=-=-=-=-=USER SECTION=-=-=-=-=-=-=-=-=-=-=-//
//register users (C)RUD
app.post('/registerUser', (req, res)=>{
  //checking if user is found in DB already
  User.findOne({username : req.body.username},(err, userResult)=>{
    if (userResult) {
      res.send('username already taken!')
    }  else {
      const hash = bcryptjs.hashSync(req.body.password);//hash the password
      const user = new User({
             _id : new mongoose.Types.ObjectId,
        username : req.body.username,
           email : req.body.email,
        password : hash
      });
      //save to datebase and notify the user acordingly
      user.save().then(result =>{
        res.send(result);
      }).catch(err => res.send(err));
    }
  });
});

//get all user C(R)UD
app.get('/allUsers', (req, res)=>{
  User.find().then(result => {
    res.send(result);
  });
});

//update user CR(U)D
app.patch('/updateUser/:id', (req,res)=>{
  const idParam = req.params.id;
  User.findById(idParam,(err,user)=>{
      const updatedUser = {
      username : req.body.username,
         email : req.body.email,
      password : req.body.password
    };
    User.updateOne({_id:idParam}, updatedUser).then(result=>{
      res.send(result);
    }).catch(err=>res.send(err));
  }).catch(err=>res.send('not found'));
});


//delete user CRU(D)
app.delete('/deleteUser/:id', (req, res)=>{
  const idParam = req.params.id;
  User.findOne({_id:idParam}, (err,user)=>{
    if (user){
      User.deleteOne({_id:idParam},err=>{
        res.send('deleted');
      });
    } else{
      res.send('not found')
    }
  }).catch(err => res.send(err));
});


//login user
app.post('/loginUser', (req, res)=>{
  User.findOne({username : req.body.username},(err, userResult)=>{
  if (userResult){
    if (bcryptjs.compareSync(req.body.password, userResult.password)) {
      res.send(userResult);
    } else {
      res.send('not authorized')
    }
  } else {
    res.send('User not found. Please register.')
  }
  });
});

//-=-=-=-=-=-=-=-=-=-=USER SECTION=-=-=-=-=-=-=-=-=-=-=-//

//-=-=-=-=-=-=-=-=-PRODUCT SECTION-=-=-=-=-=-=-=-=-=-=-//

app.post('/registerProduct', (req, res)=>{
  Product.findOne({name : req.body.name},(err, productResult)=>{
    if (productResult) {
      res.send ('Product already in store')
    } else {
      const product = new Product({
        _id  : new mongoose.Types.ObjectId,
        name : req.body.name,
       price : req.body.price,
    imageUrl : req.body.imageUrl
      });
      product.save().then(result =>{
        res.send(result);
      }).catch(err => res.send(err));
    }
  });
});

app.get('/allProduct', (req, res)=>{
  Product.find().then(result => {
    res.send(result);
  });
});

app.delete('/deleteProduct/:id', (req, res)=>{
  const idParam = req.params.id;
  Product.findOne({_id:idParam}, (err,product)=>{
    if (product){
      Product.deleteOne({_id:idParam},err=>{
        res.send('deleted');
      });
    } else{
      res.send('not found')
    }
  }).catch(err => res.send(err));
});


app.patch('/updateProduct/:id', (req,res)=>{
  const idParam = req.params.id;
  Product.findById(idParam,(err,product)=>{
      const updatedProduct = {
          name : req.body.name,
         price : req.body.price,
      imageUrl : req.body.imageUrl
    };
    Product.updateOne({_id:idParam}, updatedProduct).then(result=>{
      res.send(result);
    }).catch(err=>res.send(err));
  }).catch(err=>res.send('not found'));
});

//-=-=-=-=-=-=-=-=-PRODUCT SECTION-=-=-=-=-=-=-=-=-=-=-//


//always keep this at the end
app.listen(port, ()=> console.log(`mongodb app ${port}!`));
