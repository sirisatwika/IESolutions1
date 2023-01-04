import React from "react";
import { useProSidebar } from 'react-pro-sidebar';
import '../topnav/topnav.css';
import { Dropdown } from 'react-bootstrap';
import { Menu } from '@mui/material';
import { MenuItem } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';


function TopNav() {

    const { toggleSidebar, broken } = useProSidebar();

    return (
        <React.Fragment>
            <div className="topnavigation">
                {broken ? (<MenuOpenIcon className="mobile-menu" onClick={() => toggleSidebar()} />) : null}
                <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 d-flex flex-row">
                         <div className="page_title">
                            <h1> Connected Vehicle</h1>
                           
                         </div>
                    {/* <div className="navbar-menu-wrapper d-flex align-items-stretch">
                        <ul className="navbar-nav navbar-nav-right">
                            <li className="nav-item">
                                <Dropdown>
                                    <Dropdown.Toggle className="nav-link count-indicator">
                                        <MailOutlineIcon />
                                    </Dropdown.Toggle>
                                </Dropdown>
                            </li>
                            <li className="nav-item">
                                <Dropdown>
                                    <Dropdown.Toggle className="nav-link count-indicator">
                                        <NotificationsNoneIcon />
                                    </Dropdown.Toggle>
                                </Dropdown>
                            </li>
                            <li className="nav-item nav-profile">
                                <Dropdown>
                                    <Dropdown.Toggle className="nav-link">
                                        <div className="nav-profile-text d-none d-md-block">
                                            <p>Thirumalai</p>
                                        </div>
                                        <div className="nav-profile-img">
                                            <img src={require("../../assets/face.jpg")} alt="user" className='img-fluid' />
                                        </div>
                                        <Menu>
                                            <MenuItem>Logout</MenuItem>
                                        </Menu>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="navbar-dropdown">
                                        <Dropdown.Item href="#">
                                            Signout <LogoutOutlinedIcon />
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </ul>
                    </div> */}
                </nav>
            </div>
        </React.Fragment>
    );
}
export default TopNav;