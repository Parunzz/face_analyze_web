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
      <div >
        <img class="absolute object-cover	" src="\img\image-10@2x.png"/>
        <div class="absolute top-5200">ANALYZE</div>
    </div>
    </div>
  );
}

export default Home;
