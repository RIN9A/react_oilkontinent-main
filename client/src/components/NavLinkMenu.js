import React from 'react';
import {Link, Outlet} from "react-router-dom";

const NavLinkMenu = ({link, children}) => {
    return (
        <li className='sidebar__navbar-item'>
            <Link to={link} className={"sidebar__navbar-link " + (window.location.pathname
                .replaceAll('/', '') ===  link.replaceAll('/', '') ? 'active' : '')}>
                {children}
            </Link>
        </li>
    );
};

export default NavLinkMenu;