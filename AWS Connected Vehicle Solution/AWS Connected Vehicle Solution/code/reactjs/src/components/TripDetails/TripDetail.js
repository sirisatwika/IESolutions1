import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
// import {useLocation,Link} from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function TripDetails(props) {
    const {head} = props
    const [data, setData] = useState([]);
  

//   useEffect(() => {
    
   
//  handleChange();
    
//   }, []);

  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedOption, setSelectedOption] = useState();

  // handle onChange event of the dropdown
  const handleChange = e => {
    setSelectedOption(e.target.value);
   return axios
    .get(`http://18.211.145.178/apis/vehicles/${e.target.value}/trips`)
      .then((response) => {
        console.log(response.data.Items);
        setData(response.data.Items);
      })
      .catch(console.error);
// console.log(e.target.value)
  }
  console.log('Data', data);
  // console.log(",,,,", selectedOption)
  const columns = [
    {
      field: 'fuel_consumed_since_restart',
      headerName: 'fuel_consumed_since_restart',
      width: 150,
      editable: true,
    },
    {
      field: 'ignition_status',
      headerName: 'ignition_status',
      width: 150,
      editable: true,
    },
    {
      field: 'torque_at_transmission_mean',
      headerName: 'torque_at_transmission_mean',
      width: 110,
      editable: true,
    },
    {
      field: 'start_longitude',
      headerName: 'start_longititude',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
    },
    {
      field: 'engine_speed_mean',
      headerName: 'engine_speed_mean',
      width: 110,
      editable: true,
    },
    {
      field: 'vehicle_speed_mean',
      headerName: 'vehicle_speed_mean',
      width: 110,
      editable: true,
    },
    {
      field: 'start_time',
      headerName: 'start_time',
      width: 110,
      editable: true,
    },
    {
      field: 'end_time',
      headerName: 'end_time',
      width: 110,
      editable: true,
    },
    {
      field: 'trip_id',
      headerName: 'tripId',
      width: 110,
      editable: true,
      renderCell:(params) => <div>
        <p onClick={handleShow}>{params.value}</p>
                        <Modal
                              show={show}
                              onHide={handleClose}
                              backdrop="static"
                              keyboard={false}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Vehicle Detail</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Details of the Vehicle:
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="primary" onClick={handleClose}>
                                  Close
                                </Button>

                              </Modal.Footer>
                            </Modal>
        </div>
    },
    {
      field: 'owner_id',
      headerName: 'ownerId',
      width: 110,
      editable: true,
    },
    {
      field: 'driver_safety_score',
      headerName: 'driver_safety_score',
      width: 110,
      editable: true,
    },
    {
      field: 'start_latitude',
      headerName: 'start_latitude',
      width: 110,
      editable: true,
    },
    {
      field: 'oil_temp_mean',
      headerName: 'oil_temp_mean',
      width: 110,
      editable: true,
    },
    {
      field: 'stop_longitude',
      headerName: 'stop_longititude',
      width: 110,
      editable: true,
    },
    {
      field: 'accelerator_pedal_position_mean',
      headerName: 'accelerator_pedal_position_mean',
      width: 110,
      editable: true,
    },
    {
      field: 'brake_mean',
      headerName: 'brake_mean',
      width: 110,
      editable: true,
    },
    {
      field: 'fuel_level',
      headerName: 'fuel_level',
      width: 110,
      editable: true,
    },
    {
      field: 'vin',
      headerName: 'vin',
      width: 110,
      editable: true,
    },
    {
      field: 'stop_latitude',
      headerName: 'stop_latitude',
      width: 110,
      editable: true,
    },
    {
      field: 'odometer',
      headerName: 'odometer',
      width: 110,
      editable: true,
    },
  ];
  return (
    <div>

      <select onChange={handleChange} >
        <option>Select Vehicle ID</option>
     {head.map((option, index) =>
       <option key={index} value={option.vin} >
        {option.vin}
       </option>
      )}
    </select>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.vin}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
     
    </div>
  );
}
export default TripDetails;