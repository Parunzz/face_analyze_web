<<<<<<< HEAD
<<<<<<< HEAD
import { useState, useRef } from 'react';
=======
=======
>>>>>>> 0ce33e9ae7923a245c860d5c49fb0be11d0394bb
import { useEffect, useRef } from 'react';
import Nav from './Nav';
import Menu from './Menu';
import '../css/Camera.css'
import { useNavigate } from "react-router-dom"
<<<<<<< HEAD
>>>>>>> 815aab9 (Co-authored-by: Patanin Thongsongsom <ReellnwzaXDD@users.noreply.github.com>)
=======
>>>>>>> 0ce33e9ae7923a245c860d5c49fb0be11d0394bb
function Camera() {
  let Navi = useNavigate();
  const webRef = useRef(null);
  const showImage = () => {
    console.log(webRef.current.getScreenshot());
  }
  useEffect(()=>{
    setTimeout(()=>{
      Navi('/Kiosk');
    },1);
  });
  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <div>
      <h1>Choose Camera</h1>
=======
    <div className='Camera'> 
      <h1 id='Camera_Text'>Choose Camera</h1>
      <div id='rect-1'>
>>>>>>> 815aab9 (Co-authored-by: Patanin Thongsongsom <ReellnwzaXDD@users.noreply.github.com>)
=======
    <div className='Camera'> 
      <h1 id='Camera_Text'>Choose Camera</h1>
      <div id='rect-1'>
>>>>>>> 0ce33e9ae7923a245c860d5c49fb0be11d0394bb
      <a href="Kiosk">Kiosk</a><br />
      {/* <a href="CCTV1">CCTV</a> */}
      </div>
    </div>
    
  );
}

export default Camera;
