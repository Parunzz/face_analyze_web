import React, { useState, useEffect } from 'react';
import '../css/Nav.css';
import UseAuth from './UseAuth';
import Cookies from 'js-cookie';

function Nav() {
  const { authenticated } = UseAuth();

  //------------logout------------------
  const handleLogout = () => {
    Cookies.remove('token');
    // Redirect or perform other actions upon logout
  };
  //------------logout------------------

  return (
    <nav>
      <a href='/'>Home</a>
      {authenticated && <a href='/History'>History</a>}
      {authenticated && <a href='/Camera'>Camera</a>}
      {authenticated && <a href='/Member'>Member</a>}
      {authenticated && <a href='/Map'>Map</a>}
      {authenticated && <a href='/DashBoard'>DashBoard</a>}
      {authenticated ? (<a href='/' onClick={handleLogout}>Logout</a>) : (<a href='SignIn'>Login</a>)}
    </nav>
  );
}

export default Nav;
