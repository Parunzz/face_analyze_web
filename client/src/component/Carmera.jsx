import { useState, useRef } from 'react';
import WebcamCapture from './WebcamCapture';
import Nav from './Nav';

function Camera() {

  const webRef = useRef(null);
  const showImage = () => {
    console.log(webRef.current.getScreenshot());
  }

  return (
    <div>
      <Nav/>
      <WebcamCapture/>
    </div>
  );
}

export default Camera;
