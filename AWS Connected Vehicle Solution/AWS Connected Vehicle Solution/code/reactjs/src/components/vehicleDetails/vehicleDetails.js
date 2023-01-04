import React from "react";
// import { useState, useEffect } from "react";
// import axios from "axios";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
import { Card, Grid } from "@mui/material";
import '../vehicleDetails/vehicleDetails.css';
// import { Link } from "react-router-dom";
// import TripDetails from "../TripDetails/TripDetail";
import photo from '../../assets/banner1.png'

function Vehicle(props) {
const {head} = props

  return (
    <React.Fragment>
      <div>
        <img src={photo} alt="new" className="img-fluid"/>
      </div>
      <div>
        <Grid container >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Card className='Vcard_style card_bg card_grid'>
              <TableContainer>
                <Table className="vehicletable" sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>  VIN</TableCell>
                      <TableCell>Owner ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {head.map(({ vin, owner_id }, index) => (
                      <TableRow key={index}>
                        <TableCell>
                        {/* <Link
                      to="/trip"
                      state={{ id: {vin} }}>{vin}</Link> */}
                          {vin}
                          </TableCell>
                        <TableCell>{owner_id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
        
      </div>
    </React.Fragment>
  );
}
export default Vehicle;




