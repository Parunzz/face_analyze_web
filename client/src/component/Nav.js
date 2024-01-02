import React, { useState, useEffect } from 'react';
import '../css/Nav.css';

function Nav() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch the login status from your Flask API
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/check_login/', {
          method: 'GET',
          credentials: 'include', // Include credentials (cookies) in the request
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'GET',
        credentials: 'include', // Include credentials (cookies) in the request
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Logout successful
        setLoggedIn(false);
      } else {
        // Handle logout failure
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav>
      <a href='/'>Home</a>
      {isLoggedIn && <a href='Display'>Display</a>}
      {isLoggedIn && <a href='/'>DashBoard</a>}
      {isLoggedIn ? (<a href='/' onClick={handleLogout}>Logout</a>) : (<a href='SignIn'>Login</a>)}
    </nav>
  );
}

export default Nav;
