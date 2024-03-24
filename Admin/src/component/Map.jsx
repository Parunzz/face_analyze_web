import { useState, useEffect } from 'react';
import Member from './Member'
import UseAuth from './UseAuth';
import Cookies from 'js-cookie';;
import { SteppedLineTo } from 'react-lineto';
import LineTo from 'react-lineto';
import '../css/Map.css'
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function Members() {
  const { pid } = useParams();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [responseData, setresponseData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const handleLogout = () => {
    Cookies.remove('status');
  }
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  const fetchMemberDetail = async () => {
    try {
      const response = await fetch('http://localhost:3001/Map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // cross cross-origin requests.
        credentials: 'include',
        body: JSON.stringify({ pid: pid, pickdate: selectedDate.format('YYYY-MM-DD') }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setresponseData(data)
      }
      else {
        console.log("Response Error")
      }

    } catch (error) {
      console.error('Error fetching member detail:', error);
    }
  };
  useEffect(() => {
    fetchMemberDetail();
  }, [pid, selectedDate]);
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
  const linesData = [
    { from: '1floor_main', to: '1floor_back' },
    { from: '1floor_back', to: '6floor_back' },
    { from: '1floor_main', to: '6floor_main' },
    { from: '6floor_main', to: '6floor_back' }
  ];



  const renderLineToComponents = () => {
    if (responseData && responseData.length > 0) {
      return linesData.map((line, index) => {
        const { from, to } = line;
        let borderWidth = '2px'; // Default border width
        let borderColor = 'red'
        // Check if responseData contains the place for this line and increase border if found
        const places = responseData.map(item => item.place);
        if (places.includes(from) && places.includes(to)) {
          borderWidth = '10px';
          borderColor = 'green';
        }

        return <LineTo key={index} from={from} to={to} delay="0" borderWidth={borderWidth} borderColor={borderColor} />;
      });
    } else {
      return linesData.map((line, index) => {
        const { from, to } = line;
        return <LineTo key={index} from={from} to={to} delay="0" borderWidth="2px" borderColor="red" />;
      });
    }
  };



  return (
    <>
      <div className='container'>
        <div className='left-menu'>
          <div className='logo'>
            <a href="/">
              <img src='/img/logo_analyze.png' className='icon'></img>
            </a>
          </div>
          <div className='menu'>
            <a href='/' className='home'>
              <li className='Home' >
                <div className='menu-item' href='./'>
                  <img src='/img/home.gif' className='menu-icon'></img>
                  หน้าหลัก
                </div>
              </li>
            </a>
            <a href='/Camera' className='cctv'>
              <li className='CCTV'>
                <div className='menu-item'>
                  <img src='/img/camera.gif' className='menu-icon'></img>
                  กล้องวงจรปิด
                </div>
              </li>
            </a>
            <a href='/History' className='history'>
              <li className='History'>
                <div className='menu-item'>
                  <img src='/img/history.gif' className='menu-icon'></img>ประวัติ
                </div>
              </li>
            </a>
            <a href='/Members' className='member'>
              <li className='Member'>
                <div className='menu-item'>
                  <img src='/img/profile.gif' className='menu-icon'></img>
                  สมาชิก
                </div>
              </li>
            </a>
            <a href='/Dashboard' className='dashboard'>
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  name="mydate"
                  id="mydate"
                  label="Map Date"
                  disableFuture
                  sx={{ width: 400, left: '15%' }}
                />
              </LocalizationProvider>
              <div style={{ margin: '5% 0 0 -10%' }}>
                <div style={{marginTop: '-8%', position: 'fixed', maxWidth: '200px', maxHeight: '200px' }}>
                  <img src="../../img/location2.gif" alt="" />
                <div style={{ display: 'inline', paddingBottom: '1%', position: 'fixed' }} className="1floor_main">ทางเข้าด้านหน้าชั้น 1</div>
                </div>
                <div style={{ display: 'inline', marginLeft: '50%', paddingBottom: '1%', position: 'fixed' }} className="1floor_back">ทางเข้าด้านหลังชั้น 1</div><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <div style={{ display: 'inline', paddingTop: '1.5%', position: 'fixed' }} className="6floor_main">ทางเข้าด้านหน้าชั้น 6</div>
                <div style={{ display: 'inline', marginLeft: '50%', paddingTop: '1.5%', position: 'fixed' }} className="6floor_back">ทางเข้าด้านหลังชั้น 1</div>
              </div>
              {/* <LineTo from="1floor_main" to="1floor_back" delay="0" />
              <LineTo from="1floor_back" to="6floor_back" delay="0" />
              <LineTo from="1floor_main" to="6floor_main" delay="0" />
              <LineTo from="6floor_main" to="6floor_back" delay="0" /> */}
              {renderLineToComponents()}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Members;
