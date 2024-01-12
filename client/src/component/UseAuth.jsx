// UseAuth.js (Custom Hook for Authentication)
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UseAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      // You can perform additional checks on the token if needed
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  return { authenticated };
};

export default UseAuth;
