import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import '../selector/selector.css';

function CitySelector() {

    const [city, setCity] = React.useState('');

    const handleChange = (event) => {
        setCity(event.target.value);
    };

    return (
        <React.Fragment>
            <div className="cityselector">
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small">Select Area</InputLabel>
                    <Select labelId="demo-select-small" id="demo-select-small" value={city} label="City" onChange={handleChange}>
                        <MenuItem selected value={10}>Hyderabad</MenuItem>
                        <MenuItem value={20}>Bangalore</MenuItem>
                        <MenuItem value={30}>Pune</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </React.Fragment>
    )
}
export default CitySelector;