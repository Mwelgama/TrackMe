const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const Device = require('./models/device')
const app = express();
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/app/test', (req,res) => {
    res.send('The API is working');
});

app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
    if (err == true) {
    return res.send(err);
    } else {
    return res.send(devices);
    }
    });
});


 app.post('/api/devices', (req, res) => {
     const { name, user, sensorData } = req.body;
     const newDevice = new Device({
     name,
     user,
     sensorData
   });
   newDevice.save(err => {
       return err
       ? res.send(err)
       : res.send('Succesfully added device and data');
   })
 });

 app.post('/api/send-command', (req,res) => {
    //  const command = 
     console.log(req.body);
 })

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

