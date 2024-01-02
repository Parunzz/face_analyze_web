import '../css/Home.css';
import Webcam from 'react-webcam'
import { useState, useRef } from 'react';
import WebcamCapture from './WebcamCapture';
import ResponsiveAppBarNotLogin from './ResponsiveAppBarNotLogin';
import Nav from './Nav';
import SignIn from './SignIn';

function Home() {
  //--------------------------------------------------session
  const [isLoggedIn, setLoggedIn] = useState(false);
  const handleLogin = () => {
    // Update login state
    setLoggedIn(true);
  };
  
  const handleLogout = () => {
    // Clear login state
    setLoggedIn(false);
  };
  //--------------------------------------------------session

  const webRef = useRef(null);
  const showImage = () => {
    console.log(webRef.current.getScreenshot());
  }

  return (
    <div>
      {/* <ResponsiveAppBarNotLogin/> */}
      <Nav/>
      <WebcamCapture/>
    </div>
  );
}

export default Home;
