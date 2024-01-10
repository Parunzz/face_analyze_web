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
      {authenticated && <a href='PersonInfo'>PersonInfo</a>}
      {authenticated && <a href='/'>DashBoard</a>}
      {authenticated ? (<a href='/' onClick={handleLogout}>Logout</a>) : (<a href='SignIn'>Login</a>)}
    </nav>
  );
}

export default Nav;
