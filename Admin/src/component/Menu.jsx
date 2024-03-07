import { useState, useEffect } from 'react';
import vdoBg from '../assets/video/Kiosk.mp4'
import UseAuth from './UseAuth';
import Cookies from 'js-cookie';


function Menu() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showIntroduce, setShowIntroduce] = useState(false);
  const handleLogout = () => {
  Cookies.remove('token');
  }
  useEffect(() => {

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const introduceSection = document.querySelector('.Introduce-section');

      if (introduceSection) {
        const introduceSectionTop = introduceSection.getBoundingClientRect().top;

        // If the top of the introduce section is within the viewport, show it
        if (introduceSectionTop < windowHeight) {
          setShowIntroduce(true);
        } else {
          setShowIntroduce(false);
        }
      }
    };

  

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
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
    window.removeEventListener('scroll', handleScroll);}
    
  }, []);

  return (

    <>
    <div className='container'>
      <div className='left-menu'>
      <div className='logo'>
            <a href="./">
              <img src='/img/logo_analyze.png' className='icon'></img>
            </a>
          </div>
          <div className='menu'>
            <a href='./' className='home'>
              <li className='Home' >
                <div className='menu-item' href='./'>
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
        <div className='info-home'>   
          <div className='video-section'>
            <div className='video'>
              <div className='shadow'></div>
              <video src={vdoBg} autoPlay loop muted/>
            </div>
          </div>
          <div className='Introduces'>
            <div className='Intro-bar'>
                <div className='bar-security'>
                  <img src='/img/bar/eye.png' className='bar-icon'></img>
                  <h3 className='bar-text'>This security is the best</h3>
                </div>
                <div className='bar-security'>
                  <img src='/img/bar/facerecognition.png' className='bar-icon'></img>
                  <h3 className='bar-text'>This security is the best</h3>
                </div>
                <div className='bar-security'>
                  <img src='/img/bar/secure.png' className='bar-icon'></img>
                  <h3 className='bar-text'>This security is the best</h3>
                </div>
            </div>              
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Menu;
