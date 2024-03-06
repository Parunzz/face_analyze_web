import { useState, useEffect } from 'react';
import Member from './Member'
import UseAuth from './UseAuth';
import Cookies from 'js-cookie';;
import { SteppedLineTo  } from 'react-lineto';
import LineTo from 'react-lineto';
import '../css/Map.css'



function Members() {

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
          <div className='info-homes'>
            <img src='/img/map-bg.png ' className='bg'></img>
          <div className='map'>
            <div >
                <div style={{display:'inline', paddingBottom: '5%'}} className="1">1 FLOOR</div>
                <div style={{display:'inline',marginLeft:'50%', paddingBottom: '5%'}} className="6">6 FLOOR</div><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />ควย<br /><br /><br /><br />
                <div style={{display:'inline', paddingTop: '5%'}} className="2">2 FLOOR</div>
                <div style={{display:'inline',marginLeft:'50%', paddingTop: '5%'}} className="3">3 FLOOR</div>
            </div>
            <LineTo  from="1" to="2" delay="0" borderWidth="10px"/>
            <LineTo  from="1" to="3" delay="0"/>
            <LineTo  from="1" to="6" delay="0"/>
            <LineTo  from="2" to="6" delay="0"/>
            <LineTo  from="2" to="3" delay="0"/>
            <LineTo  from="3" to="6" delay="0"/>
        </div>
        <div style={{marginLeft: '17.4%', marginTop: '-33%', position: 'fixed', width: '200px', height: '200px'}}>
          <img src="/img/location2.gif" alt="" />
        </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Members;
