import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Card, Grid } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import {Link} from "react-router-dom"
import '../TripDetails/TripDetail.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import '../selector/selector.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'trip_id',
    numeric: false,
    disablePadding: true,
    label: 'Trip ID',
  },
  {
    id: 'idle_duration',
    numeric: false,
    disablePadding: true,
    label: 'Idle Duration(secs)',
  },
  {
    id:"fuel_consumed_since_restart",
    numeric: true,
    disablePadding: false,
    label: 'Fuel Consumed(l)',
  },
  {
    id: 'ignition_status',
    numeric: true,
    disablePadding: false,
    label: 'Ignition Status(on/off)',
  },
  {
    id: "torque_at_transmission_mean" ,
    numeric: true,
    disablePadding: false,
    label: 'Torque At Transmission Mean(Nm)',
  },
  {
    id:"start_longitude"  ,
    numeric: true,
    disablePadding: false,
    label: 'Start Longititude(degrees)',
  },
  {
    id: "engine_speed_mean" ,
    numeric: true,
    disablePadding: false,
    label: 'Engine Speed (rpm)',
  },
  {
    id: "vehicle_speed_mean" ,
    numeric: true,
    disablePadding: false,
    label: 'Vehicle Speed(km/hr)',
  },
  {
    id: "start_time" ,
    numeric: true,
    disablePadding: false,
    label: 'Start Time',
  },
  {
    id: "end_time" ,
    numeric: true,
    disablePadding: false,
    label: 'End Time',
  },
  {
    id: "driver_safety_score" ,
    numeric: true,
    disablePadding: false,
    label: 'Driver Safety Score',
  },
  {
    id: "start_latitude",
    numeric: true,
    disablePadding: false,
    label: 'Start Latitude(degrees)',
  },
  {
    id: "oil_temp_mean",
    numeric: true,
    disablePadding: false,
    label: 'Oil Temperature(C)',
  },
  {
    id:"stop_longitude"  ,
    numeric: true,
    disablePadding: false,
    label: 'Stop Longititude(degrees)',
  },
  {
    id: "accelerator_pedal_position_mean" ,
    numeric: true,
    disablePadding: false,
    label: 'Accelerator Pedal Position',
  },
  {
    id: 'brake_mean',
    numeric: true,
    disablePadding: false,
    label: 'Brake Mean',
  },
  {
    id: 'high_braking_event',
    numeric: true,
    disablePadding: false,
    label: 'High Braking Event',
  },
  {
    id: "fuel_level" ,
    numeric: true,
    disablePadding: false,
    label: 'Fuel Level(l)',
  },
  
  {
    id: 'vin',
    numeric: true,
    disablePadding: false,
    label: 'VIN',
  },
  {
    id: "stop_latitude" ,
    numeric: true,
    disablePadding: false,
    label: 'Stop Latitude(degrees)',
  },
  {
    id: "high_speed_duration" ,
    numeric: true,
    disablePadding: false,
    label: 'High Speed Duration',
  },
  {
    id: 'odometer',
    numeric: true,
    disablePadding: false,
    label: 'Odometer(m)',
  },
  {
    id: "high_acceleration_event" ,
    numeric: true,
    disablePadding: false,
    label: 'High Acceleration Event(m/s2) ',
  },
  
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  
  return (
   
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }} />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}           
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  return (
    <Toolbar className='e_toolbar'
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography className='e-rowselect'
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className='e_title'
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Vehicle Details
        </Typography>
      )} 
    </Toolbar>

  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function EnhancedTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('serialNo');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {head} = props
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState();

  // handle onChange event of the dropdown
  const handleChangeData = e => {
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.things);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, things) => {

    // event.stopPropagation();

    const selectedIndex = selected.indexOf(things);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, things);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleRowClick = (event, id) => {
    console.log("row link");
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (things) => selected.indexOf(things) !== -1;


  const handleOption = (event) => {
      event.preventDefault()
  };

  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  

  return (

    <React.Fragment>
      <div style={{ paddingTop: '20px' }}>
      <div className="cityselector">
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">

<InputLabel id="demo-select-small">Select VIN</InputLabel>

<Select labelId="demo-select-small" id="demo-select-small"  label="City" onChange={handleChangeData}>

{head.map((option, index) =>

  <MenuItem key={index} value={option.vin}> {option.vin}</MenuItem>

  )}

</Select>

</FormControl>
            </div>
            {selectedOption ?
        <Grid container spacing={1} >
          <Grid item lg={12} md={12} sm={12} xs={12}>

            <Card className='card_style card_bg p-0 card_grid'>
              <EnhancedTableToolbar numSelected={selected.length} />

              <TableContainer id ="mycode">
                <Table className='edge_table' aria-labelledby="tableTitle" >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={data.length} />
                  <TableBody>
                    {stableSort(data, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.things);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleRowClick(event, row.things)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.things}
                            selected={isItemSelected}>

                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                onClick={(event) => handleClick(event, row.things)}
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </TableCell>
                            <TableCell component="th" id={labelId} scope="row" padding="none" size='small' onClick={handleShow}>
                                 <Link 
                              >
                            
                              {row.trip_id}
                              </Link>
                            
                            </TableCell>
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
                            {/* <TableCell>{row.ownerId}</TableCell> */}
                            <TableCell>
                            {row.idle_duration}
                              {/* <Chip label={row.ownerId} variant="outlined" ></Chip> */}
                            </TableCell>
                            <TableCell>{row.fuel_consumed_since_restart}</TableCell>
                            <TableCell>{row.ignition_status}</TableCell>
                            <TableCell>{row.torque_at_transmission_mean}</TableCell>
                            <TableCell>{row.start_longitude}</TableCell>
                            <TableCell>{row.engine_speed_mean}</TableCell>
                            <TableCell>{row.vehicle_speed_mean}</TableCell>
                            <TableCell>{row.start_time}</TableCell>
                            <TableCell>{row.end_time}</TableCell>
                            <TableCell>{row.driver_safety_score}</TableCell>
                            <TableCell>{row.start_latitude}</TableCell>
                            <TableCell>{row.oil_temp_mean}</TableCell>
                            <TableCell>{row.stop_longitude}</TableCell>
                            <TableCell>{row.accelerator_pedal_position_mean}</TableCell>
                            <TableCell>{row.brake_mean}</TableCell>
                            <TableCell>{row.high_braking_event}</TableCell>
                            <TableCell>{row.fuel_level}</TableCell>
                            <TableCell>{row.vin}</TableCell>
                            <TableCell>{row.stop_latitude}</TableCell>
                            <TableCell>{row.high_speed_duration}</TableCell>
                            <TableCell>{row.odometer}</TableCell>
                            {/* <TableCell>{row.fuel_consumed}</TableCell> */}
                            <TableCell>{row.high_acceleration_event}</TableCell>


                            {/* <TableCell>
                              <Chip label={row.labels} variant="outlined" icon={<HighlightOffIcon />} >
                              </Chip>
                            </TableCell> */}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={data.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />

            </Card>
          </Grid>
        </Grid>
        :
        ""
                    }
      </div>
    </React.Fragment>

  );
}
export default EnhancedTable;