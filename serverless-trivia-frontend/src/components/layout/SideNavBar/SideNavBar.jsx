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
              <Link to="/profile" className="sidebar__link">User Profile</Link>
            </li>
            <li className="sidebar__item">
              <Link to="/gamelist" className="sidebar__link">Trivia Game Lobby</Link>
            </li>
            <li className="sidebar__item">
              <Link to="/leaderboard" className="sidebar__link">Leader Board</Link>
            </li>
          </ul>
        </nav>
      );
};

export default SideNavbar;
