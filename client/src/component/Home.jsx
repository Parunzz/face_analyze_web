import '../css/Home.css';
import { useState, useRef } from 'react';
import WebcamCapture from './WebcamCapture';
import Nav from './Nav';

function Home() {

  const webRef = useRef(null);
  const showImage = () => {
    console.log(webRef.current.getScreenshot());
  }

  return (
    <div>
      <Nav/>
      <h1>HOME</h1>
    </div>
  );
}

export default Home;
