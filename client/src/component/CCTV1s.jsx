import vdoBg from '../assets/video/Kiosk.mp4'
import UseAuth from './UseAuth';
import Cookies from 'js-cookie';
// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
//--------------------Import the libraries---------------------
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
//--------------------Import the libraries---------------------
import Typography from '@mui/material/Typography';
import Webcam from "react-webcam";
import { drawRect } from "./utilities";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';


function CCTV1s() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const handleLogout = () => {
  Cookies.remove('token');
  }
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0'); 
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const month = now.toLocaleString('default', { month: 'long' }); // Get full month name
      const date = now.getDate();
      const year = now.getFullYear();
      
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      setCurrentDate(`${date} ${month} ${year}`);
    };

    // Update time and date initially and then every second
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
    <div className='container'>
      <div className='left-menu'>
          <div className='logo'></div>
          <div className='menu'>
            <a href='./' className='home'>
              <li className='Home' >
                <div className='menu-item' a href='./'>
                    <img src='/img/home.gif' className='menu-icon'></img>
                    หน้าหลัก
                </div>
              </li>
            </a>
            <a href='./Camera' className='cctv'>
              <li className='CCTV'>
                <div className='menu-item'>
                    <img src='/img/camera.gif' className='menu-icon'></img>
                    กล้องวงจรปิด
                </div>
              </li> 
            </a>
            <a href='./History' className='history'>
                    <li className='History'>
                    <div className='menu-item'>
                    <img src='/img/history.gif' className='menu-icon'></img>ประวัติ
                </div>
            </li>
            </a>
            <a href='./Members' className='member'>
            <li className='Member'>
                <div className='menu-item'>
                    <img src='/img/profile.gif' className='menu-icon'></img>
                    สมาชิก
                </div>
            </li>
            </a>
              <a href='./Dashboard' className='dashboard'>
                <li className='Dashboard'>
                  <div className='menu-item'>
                    <img src='/img/presentation.gif' className='menu-icon'></img>
                  สถิติ
                  </div>
              </li>
            </a>
          </div>
          <div className='setting'>
            <div className='admin_name'>สวัสดี [User] </div>
            <a href='/Signin' onClick={handleLogout}>ออกจากระบบ</a>
          </div>
      </div>
      <div className='right-responsive'>
        <div className='top-menu'>
          <div className='data'>
            <div className='date text-white'>{currentDate}</div>
            <div className='time text-white'>{currentTime}</div>
          </div>
        </div>
        <div className='info'>   
          <h3 className='text-3xl font-bold'>กล้องวงจรปิด</h3>
          <div className='camera-section'>

          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default CCTV1s;
