import React from "react";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useProSidebar } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SyncIcon from '@mui/icons-material/Sync';
import '../sidenav/sidenav.css';
import CommuteIcon from '@mui/icons-material/Commute';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import NearbyErrorIcon from '@mui/icons-material/NearbyError';
import SsidChartIcon from '@mui/icons-material/SsidChart';

function SideNav() {
    const { collapseSidebar } = useProSidebar();
    return (
        <React.Fragment>
            <div className="navmenus">
                <Sidebar breakPoint="md" backgroundColor="#004f8a">
                    <div className="sidebar-logo">
                    <img src={require("../../assets/ltts_logo.png")} alt="Logo" className='img-fluid' />
                        <span onClick={() => collapseSidebar()}>
                            <MenuOpenIcon />
                        </span>
                    </div>
                    <Menu className="sidemenu">
                        <NavLink to="/">
                            <MenuItem icon={<CommuteIcon />}>Vehicles</MenuItem>
                        </NavLink>
                        <NavLink to="/trip">
                            <MenuItem icon={<SyncIcon />}>Trip Details</MenuItem>
                        </NavLink>
                        <NavLink to="/health">
                            <MenuItem icon={<HealthAndSafetyIcon />}>Health Status</MenuItem>
                        </NavLink>
                        <NavLink to="/dtc">
                            <MenuItem icon={<NearbyErrorIcon />}>DTC</MenuItem>
                        </NavLink>
                        <NavLink to="/anomaly">
                            <MenuItem icon={<SsidChartIcon />}>Anomaly</MenuItem>
                        </NavLink>
                    </Menu>
                </Sidebar>
            </div>
        </React.Fragment>
    );
}
export default SideNav;