import React from 'react';
import {Link, Outlet} from "react-router-dom";

const NavLinkLogout = ({link, onClick, children}) => {
    return (
        <li className='sidebar__navbar-item' onClick={onClick}>
            <div className={"sidebar__navbar-link " + (window.location.pathname
                .replaceAll('/', '') ===  link.replaceAll('/', '') ? 'active' : '')}>
                {children}
            </div>
        </li>
    );
};

export default NavLinkLogout;