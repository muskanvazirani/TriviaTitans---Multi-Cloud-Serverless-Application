import React, { useState } from 'react';
import Header  from './Header/Header';
import SideNavbar from './SideNavBar/SideNavBar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const showSidebarPaths = ['/'];
    const hideSidebarPathRegexes = [
        /^\/create-category.*/,
        /^\/create-question.*/,
        /^\/create-game.*/,
        /^\/view-questions\/.+\/.*/,
        /^\/update-game\/.*/,
        /^\/view-all-categories.*/,
        /^\/view-all-games.*/,
        /^\/view-all-questions.*/,
        /^\/update-category\/.*/,
        /^\/update-question\/.+\/id\/.*/,
        /^\/admin-dashboard.*/,
        /^\/games\/.*/,
        /^\/in-game-experience.*/
    ];
    const hideSidebar = hideSidebarPathRegexes.some(regex => regex.test(location.pathname));
    const [sideNavVisible, setSideNavVisible] = useState(false);
    const toggleSideNav = () => {
        setSideNavVisible(!sideNavVisible);
    };
    return (
        <div>
            <Header toggleSideNav={toggleSideNav} />
            {sideNavVisible && <SideNavbar />}
            {showSidebarPaths.includes(location.pathname) || hideSidebar ? null : sideNavVisible && <SideNavbar />}
            <main>{children}</main>
        </div>
    );
};

export default Layout;

