import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '66px' }}>
        {/* Adjust paddingTop to match your Navbar height */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
