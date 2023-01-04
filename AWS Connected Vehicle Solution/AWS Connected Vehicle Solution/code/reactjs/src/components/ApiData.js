import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Vehicle from "./vehicleDetails/vehicleDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TripDetails from "./TripDetails/TripDetail";
import Dtc from "./DTC/Dtc";
import EnhancedTable from "./TripDetails/Monitoring";
import HealthStatus from "./Health/HealthStatus";
// import HealthStatus from "./Health/HealthStatus";
// import Dtc from "./DTC/Dtc";
// import Anomaly from "./anomaly/Anomaly";


function ApiData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://18.211.145.178/apis/vehicles/`)
      .then((response) => {
        // console.log(response.data.Items);
        setData(response.data.Items);
      })
      .catch(console.error);
  }, []);

  return (
    <React.Fragment>
      <div>
      <Routes>
              <Route path="/" element={<Vehicle head={data} />}></Route>
               <Route path="/trip" element={<EnhancedTable head={data}/>}></Route>
               <Route path="/dtc" element={<Dtc head={data}/>}></Route>
               <Route path="/health" element={<HealthStatus head={data}/>}></Route>
               
              </Routes>
        
      
        
        

        {/* <Route path="/" element={<Vehicle  head={data}/>} />

                <Route path="/health" element={<HealthStatus />} />
                <Route path="/dtc" element={<Dtc />} />
                <Route path="/anomaly" element={<Anomaly />} /> */}
             
      </div>
    </React.Fragment>
  );
}
export default ApiData;




