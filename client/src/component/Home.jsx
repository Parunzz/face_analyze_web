import '../css/Home.css';
import { useState, useRef } from 'react';
import Nav from './Nav';

function Home() {

  const webRef = useRef(null);
  const showImage = () => {
    console.log(webRef.current.getScreenshot());
  }

  return (
    <div>
      <Nav/>
      <div className="container">
        <img src="\img\image-10@2x.png" alt="" width="100%" height="100%"/>
      <div className="centered-text">ANALYZE</div>
    </div>
    </div>
  );
}

export default Home;
