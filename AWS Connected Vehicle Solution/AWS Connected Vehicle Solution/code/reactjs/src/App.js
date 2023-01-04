import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNav from './components/sidenav/sidenav';
import TopNav from './components/topnav/topnav';
// import Vehicle from './components/vehicleDetails/vehicleDetails';
// import HealthStatus from './components/Health/HealthStatus';
// import Dtc from './components/DTC/Dtc';
// import Anomaly from './components/anomaly/Anomaly';
import './App.css';
import TripDetails from './components/TripDetails/TripDetail';
import ApiData from './components/ApiData';

function App() {
  // const vin = "VIN-1234-567"
  return (
    <React.Fragment>
      
      <Router>
        <div className='wrapper'>
          <SideNav />
          <main className='mainBlock'>
            <TopNav />
            <div className='main_content'>
            
              <ApiData/>
              {/* <Routes>
              <Route path="/" element={<ApiData />}></Route>
               <Route path="/trip" element={<TripDetails />}></Route>

              </Routes> */}

            </div>
          </main>
        </div>
      </Router>
    </React.Fragment>
  );
}
export default App;
