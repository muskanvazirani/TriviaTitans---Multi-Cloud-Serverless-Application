import React from 'react';
import Header  from './Header/Header';
import SideNavbar from './SideNavBar/SideNavBar';

const Layout = ({ children }) => {
  return (
    <div>
      <Header></Header>
      <SideNavbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
