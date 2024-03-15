import React, { useState, useEffect } from 'react';
import vdoBg from '../assets/video/Kiosk.mp4';
import UseAuth from './UseAuth';
import Cookies from 'js-cookie';
import '../css/History.css';
import Transaction from './Transaction';

function History() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const handleLogout = () => {
    Cookies.remove('token');
  };

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
    <div className='container'>
      <div className='top-menu'>
        <div className='data'>
          <div className='date text-white'>{currentDate}</div>
          <div className='time text-white'>{currentTime}</div>
        </div>
        <div className='setting'>
          <div className='admin_name'>สวัสดี [User]</div>
          <a href='/Signin' onClick={handleLogout}>ออกจากระบบ</a>
        </div>
      </div>
      <div className='left-menu'>
        <div className='logo'>
          <a href="./">
            <img src='/img/logo_analyze.png' className='icon' alt='logo' />
          </a>
        </div>
        <div className='menu'>
          <a href='./' className='home'>
            <li className='Home'>
              <div className='menu-item'>
                <img src='/img/home.gif' className='menu-icon' alt='home' />
                <div className='menu-title'>
                  <h3>หน้าหลัก</h3>
                </div>
              </div>
            </li>
          </a>
          <a href='./Camera' className='cctv'>
            <li className='CCTV'>
              <div className='menu-item'>
                <img src='/img/camera.gif' className='menu-icon' alt='cctv' />
                <div className='menu-title'>
                  <h3>กล้องวงจรปิด</h3>
                </div>
              </div>
            </li>
          </a>
          <a href='./History' className='history'>
            <li className='History'>
              <div className='menu-item'>
                <img src='/img/history.gif' className='menu-icon' alt='history' />
                <div className='menu-title'>
                  <h3>ประวัติ</h3>
                </div>
              </div>
            </li>
          </a>
          <a href='./Members' className='member'>
            <li className='Member'>
              <div className='menu-item'>
                <img src='/img/profile.gif' className='menu-icon' alt='profile' />
                <div className='menu-title'>
                  <h3>สมาชิก</h3>
                </div>
              </div>
            </li>
          </a>
          <a href='./Dashboard' className='dashboard'>
            <li className='Dashboard'>
              <div className='menu-item'>
                <img src='/img/presentation.gif' className='menu-icon' alt='dashboard' />
                <div className='menu-title'>
                  <h3>สถิติ</h3>
                </div>
              </div>
            </li>
          </a>
        </div>
      </div>
      <div className='info'>
        <h3 className='text-3xl font-bold'>ประวัติ</h3>
        <Transaction />
      </div>
    </div>
  );
}

export default History;
