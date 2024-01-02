import React, { useState, useEffect } from 'react';

const CheckLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/check_login', {
          method: 'GET',
          credentials: 'include', // Include credentials for cross-origin requests
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <p>User is logged in</p>
      ) : (
        <p>User is not logged in</p>
      )}
    </div>
  );
};

export default CheckLogin;
