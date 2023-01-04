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
    id: 'dtc_id',
    numeric: true,
    disablePadding: false,
    label: 'DTC Id ',
  },
  {
    id: 'updated_at',
    numeric: false,
    disablePadding: true,
    label: 'Updated At',
  },
  {
    id: 'dtc',
    numeric: false,
    disablePadding: true,
    label: 'DTC',
  },
  {
    id:"created_at",
    numeric: true,
    disablePadding: false,
    label: 'Created At',
  },
 
  // {
  //   id: "acknowledged" ,
  //   boolean: true,
  //   disablePadding: false,
  //   label: 'Acknowledged',
  // },
  {
    id:"vin"  ,
    numeric: true,
    disablePadding: false,
    label: 'VIN ',
  },
  // {
  //   id: "steps" ,
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Steps',
  // },
  {
    id: "generated_at" ,
    numeric: true,
    disablePadding: false,
    label: 'Generated At',
  },
  {
    id: "description" ,
    numeric: true,
    disablePadding: false,
    label: 'Description',
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

function Dtc(props) {
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
    .get(`http://18.211.145.178/apis/vehicles/${e.target.value}/dtc`)
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
                            <TableCell component="th" id={labelId} scope="row" padding="none" size='small' >
                              {row.dtc_id}
                            </TableCell>
                            <TableCell>{row.updated_at}</TableCell>
                            {/* <TableCell>{row.ownerId}</TableCell> */}
                            <TableCell>
                            {row.dtc}
                              {/* <Chip label={row.ownerId} variant="outlined" ></Chip> */}
                            </TableCell>
                            <TableCell>{row.created_at}</TableCell>
                            {/* <TableCell>{row.acknowledged}</TableCell> */}
                            <TableCell>{row.vin}</TableCell>
                            {/* <TableCell>{row.steps}</TableCell> */}
                            <TableCell>{row.generated_at}</TableCell>
                            <TableCell>{row.description}</TableCell>
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
export default Dtc;