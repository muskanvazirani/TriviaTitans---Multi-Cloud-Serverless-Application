import React from 'react';
import { Link } from 'react-router-dom';
import './SideNavBar.scss'

const SideNavbar = () => {
    return (
        <nav className="sidebar">
          <div className="sidebar__content">
            {/* Content to be placed below the header */}
          </div>
          <ul className="sidebar__list">
            <li className="sidebar__item">
              <Link to="/" className="sidebar__link">Login</Link>
            </li>
            <li className="sidebar__item">
              <Link to="/manage-team" className="sidebar__link">Team</Link>
            </li>
            <li className="sidebar__item">
              <Link to="/user-profile" className="sidebar__link">User Profile</Link>
            </li>
          </ul>
        </nav>
      );
};

export default SideNavbar;
