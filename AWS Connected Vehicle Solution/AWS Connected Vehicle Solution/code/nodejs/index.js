//const apigClientFactory = require('./apigClient');
const express = require('express');
const http = require('http');
// const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const axios = require('axios');


// var apigClient = apigClientFactory.newClient();

app.use(express.json());
app.use(cors());

 
//READ Request Handlers
app.get('/', (req, res) => {
console.log('request:'+req.body);
res.send('Welcome to AWS API Gateway!!!');
});

app.get('/vehicles/:vin/trips', async (req, res) => {
   let trip = await axtrips(req.params.vin);
   console.log(trip.data.body);
   res.send(trip.data.body);
});
   
   
let axtrips = async (vin) =>{ 
     let response = await axios('http://18.211.145.178/vehicles/'+vin+'/trips');
     return response;
}

app.get('/vehicles/:vin/trips/:trip_id', async (req, res) => {
   let trip = await axtrip(req.params.vin,req.params.trip_id);
   console.log(trip.data.body);
   res.send(trip.data.body);
});
   
let axtrip = async (vin,trip_id) =>{ 
     let response = await axios('http://18.211.145.178/vehicles/'+vin+'/trips/'+trip_id);
     return response;
}

app.get('/vehicles/:vin/anomalies', async (req, res) => {
   let anomalies = await axanomalies(req.params.vin);
   console.log(anomalies.data.body);
   res.send(anomalies.data.body);
});
   
let axanomalies = async (vin) =>{ 
     let response = await axios('http://18.211.145.178/vehicles/'+vin+'/anomalies');
     return response;
}

app.get('/vehicles/:vin/anomalies/:anomaly_id',  async (req, res) => {
   let anomaly = await axanomaly(req.params.vin,req.params.anomaly_id);
   console.log(anomaly.data.body);
   res.send(anomaly.data.body);
});
   
let axanomaly = async (vin,anomaly_id) =>{ 
     let response = await axios('http://18.211.145.178/vehicles/'+vin+'/anomalies/'+anomaly_id);
     return response;
}

app.get('/vehicles/:vin/dtc',  async (req, res) => {
   let dtcs = await axdtcs(req.params.vin);
   console.log(dtcs.data.body);
   res.send(dtcs.data.body);
});
   
let axdtcs = async (vin) =>{ 
     let response = await axios('http://18.211.145.178/vehicles/'+vin+'/dtc');
     return response;
}

app.get('/vehicles/:vin/dtc/:dtc_id', async (req, res) => {
   let dtc = await axdtc(req.params.vin,req.params.dtc_id);
   console.log(dtc.data.body);
   res.send(dtc.data.body);
});
   
let axdtc = async (vin,dtc_id) =>{ 
     let response = await axios('http://18.211.145.178/vehicles/'+vin+'/dtc/'+dtc_id);
     return response;
}

app.get('/vehicles/:vin/healthreports',  async (req, res) => {
   let hrs = await axhrs(req.params.vin);
   console.log(hrs.data.body);
   res.send(hrs.data.body);
});
   
let axhrs = async (vin) =>{ 
     let response = await axios('http://18.211.145.178/vehicles/'+vin+'/healthreports');
     return response;
}

//Gets the Healthreport details of the given vehiclenumber and report id
app.get('/vehicles/:vin/healthreports/:report_id', async (req, res) => {
   let hr = await axhr(req.params.vin,req.params.report_id);
   console.log(hr.data.body);
   res.send(hr.data.body);
});
   
let axhr = async (vin,report_id) =>{ 
     let response = await axios('http://18.211.145.178/vehicles/'+vin+'/healthreports/'+report_id);
     return response;
}

//Gets all the vehicles
app.get('/vehicles', async (req, res) => {
   let vehicles = await axvehicles();
   console.log(vehicles.data.body);
   res.send(vehicles.data.body);
});
   
let axvehicles = async () =>{ 
     let response = await axios('http://18.211.145.178/vehicles');
     return response;
}
 
//PORT ENVIRONMENT VARIABLE
const port = 9000;
app.listen(port, () => console.log(`Listening on port ${port}..`));