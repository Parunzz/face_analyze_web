import { useState, useRef } from 'react';
import Nav from './Nav';

function Camera() {

  const webRef = useRef(null);
  const showImage = () => {
    console.log(webRef.current.getScreenshot());
  }

  return (
    <div>
      <Nav/>
      <h1>Choose Camera</h1>
      <a href="Kiosk">Kiosk</a><br />
      <a href="CCTV1">CCTV</a>
    </div>
  );
}

export default Camera;
