const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json');

const port = 3000;
//connect to db
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASS}@${config.MONGO_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=> console.log('db connected')).catch(err =>{
  console.log(`bd connection error ${err.message}`)
});
//test the connectivity
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
  console.log('we are connected to mongodb');
});




app.get('/', (req, res) => res.send('Welcome to mongodb stuff'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
