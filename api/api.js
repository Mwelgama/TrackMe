const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Device = require('./models/device');
const User = require('./models/user');
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
app.use(express.static(`${__dirname}/public`));

// gets generataed documentation
app.get('/docs', (req,res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});
// test to see if api works
app.get('/app/test', (req,res) => {
    res.send('The API is working');
});

app.get('/api/users/:user/devices', (req,res) => {
    const {user} = req.params;
    Device.find({"user": user}, (err, devices) => {
        return err
        ? res.send(err)
        : res.send(devices)
    });
});

// checks to see if acount and password match. 
app.post('/api/authenticate', (req, res) => {
    const {user, passwordInput} = req.body;
    User.findOne({name: user}, function(err, found) {
        if (err){
            return res.send(err);
        }
        else if (!found)
            return res.send("User doesnt exist")
        if (found.password !== passwordInput)
            return res.send("Incorrect Password")
        else {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: found.isAdmin
               });
        }
    }
    )})
// registers a new account to database (json file with user and password and isAdmin)
app.post('/api/register', (req,res) => {
    const {user, passwordInput, isAdmin} = req.body;
    User.findOne({name: user}, function(err,found) {
        if (err)
            return res.send(err)
        else if (found)
            return res.send('User is already taken')
        else if(!found){
            const newUser = new User({
                name: user,
                password: passwordInput,
                isAdmin
            });
            newUser.save(err => {
                return err
                ? res.send(err)
                : res.json({
                    success: true, 
                    message: 'Created New User'
                });
            });
        };
    })
});
//Gets the sensor data from a specific device id (obtained from the GET all devices)
app.get('/api/devices/:deviceId/device-history', (req,res) => {
    const {deviceId} = req.params;
    Device.findOne({"_id": deviceId }, (err, devices) =>{
        const {sensorData } = devices;
        return err
        ? res.send(err)
        : res.send(sensorData);
    });
});

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
2.4_document_backend_api.md 7/7/2018
2 / 3
* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* }
* ]
* }
* ]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/

// gets all devices in db
app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
    if (err == true) {
    return res.send(err);
    } else {
    return res.send(devices);
    }
    });
});


// add new device to database
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

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

