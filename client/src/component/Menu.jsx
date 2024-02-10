import { useState, useEffect } from 'react';
import '../css/Menu.css';
import vdoBg from '../assets/video/Kiosk.mp4'


function Homepage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

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
            <li className='Home' >
                <div className='menu-item' a href='./'>
                    <img src='../../public/img/home.gif' className='menu-icon'></img>
                    <a href='./' className='home'>หน้าหลัก</a>
                </div>
            </li>
            <li className='CCTV'>
                <div className='menu-item'>
                    <img src='../../public/img/camera.gif' className='menu-icon'></img>
                    <a href='./Camera' className='cctv'>กล้องวงจรปิด</a>
                </div>
            </li>
            <li className='History'>
                <div className='menu-item'>
                    <img src='../../public/img/history.gif' className='menu-icon'></img>
                    <a href='./History' className='history'>ประวัติ</a>
                </div>
            </li>
            <li className='Member'>
                <div className='menu-item'>
                    <img src='../../public/img/profile.gif' className='menu-icon'></img>
                    <a href='./Member' className='member'>สมาชิก</a>
                </div>
            </li>
            <li className='Dashboard'>
                <div className='menu-item'>
                    <img src='../../public/img/presentation.gif' className='menu-icon'></img>
                    <a href='./Dashboard' className='dashboard'>สถิติ</a>
                </div>
            </li>
          </div>
          <div className='setting'>
            <div className='admin_name'>สวัสดี [User] </div>
            <div className='button'></div>
            <div className=''></div>
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
          <div className='video-section'>
            <div className='video'>
              <div className='shadow'></div>
              <video src={vdoBg} autoPlay loop muted/>
            </div>
          </div>
          <div className='Introduce-section'>
              <h3 className='text-3xl font-bold title	'>What is Analyze Company</h3>
              <p className='paragraph text-xl'>
                บริษัท Analyze เป็นผู้นำด้านนวัตกรรมและเทคโนโลยีที่ตั้งคติที่จะเปลี่ยนแปลงโลกด้วยการใช้ประโยชน์จากปัญญาประดิษฐ์ 
                (Artificial Intelligence: AI) ให้กับสังคมและธุรกิจต่างๆ ทั่วโลก ด้วยการนำเสนอและพัฒนาเทคโนโลยี AI ที่
                โดดเด่นและมีประสิทธิภาพสูง บริษัท Analyze ได้เป็นส่วนสำคัญในการสร้างความสะดวกสบายให้แก่คนทั่วโลกผ่านการปรับใช้ 
                AI ในหลากหลายด้านด้วยความคิดสร้างสรรค์และการพัฒนาที่ไม่หยุดยั้ง
              </p>
              <div className='img-section'>
                <img src ='../../public/img/1.png' className='img-1'></img>
                <img src='../../public/img/1.png' className='img-1'></img>
              </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Homepage;
