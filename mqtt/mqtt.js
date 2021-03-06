const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const randomCoordinates = require('random-coordinates');
const rand = require('random-int');
const Device = require('./models/device');
const bodyParser = require('body-parser');
const app = express();
const { URL, USER, PASSWORD } = process.env;
const port = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URL);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: true
}));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith,Content-Type, Accept");
//     next();
//    });

const client = mqtt.connect(URL, {
 username: USER,
 password: PASSWORD
});

client.on('connect', () => {
    client.subscribe('/sensorData');
 console.log('mqtt connected');
});
/**
* @api {put} /sensor-data add extra sensor data to a user
* @mqttGroup Data
* @apiSuccessExample {json} Success-Response:
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


app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
    client.publish(topic, message, () => {
    res.send('published new message');
    });
   });


client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
    const data = JSON.parse(message);
   
    Device.findOne({"name": data.deviceId }, (err, device) => {
    if (err) {
    console.log(err)
    }
    
    const { sensorData } = device;
    const { ts, loc, temp } = data;
    sensorData.push({ ts, loc, temp });
    device.sensorData = sensorData;
    device.save(err => {
    if (err) {
    console.log(err)
    }
    });
    });
}
});


// client.on('message', (topic, message) => {
//     if (topic == '/sensorData') {
//     console.log(`Received message: ${message}`);
//     }
//    });
app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/command/${deviceId}`;
    client.publish(topic, command, () => {
    res.send('published new message');
    });
   });
   
app.listen(port, () => {
 console.log(`listening on port ${port}`);
});