import { useState, useEffect } from 'react';
import '../css/Dashboard.css';
import UseAuth from './UseAuth';
import Cookies from 'js-cookie';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { axisClasses } from '@mui/x-charts';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const status = Cookies.get('status');
  const navigate = useNavigate();
  
  if(status != 'true'){
    navigate('/SignIn');
  }
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [Emotion, setEmotion] = useState([]);
  const [CountMember, setCountMember] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const valueFormatter = (value) => `${value}`;

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const TOTALemotion = Emotion.map((item) => item.value).reduce((a, b) => a + b, 0);
  const TOTALUnknown = CountMember.map((item) => item.value).reduce((a, b) => a + b, 0);
  const EmotionSizing = {
    margin: {
      left: 0,
      right: 150,
    },
    width: 400,
    height: 400,
  };

  const BarchartSetting = {
    width: 900,
    height: 400,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
      },
    },
  };
  const getArcLabel = (params) => {
    const percent = params.value / TOTALemotion;
    if (percent > 0) {
      return `${(percent * 100).toFixed(0)}%`;
    }
    return '';
  };
  const getArcLabelUnknown = (params) => {
    const percent = params.value / TOTALUnknown;
    if (percent > 0) {
      return `${(percent * 100).toFixed(0)}%`;
    }
    return '';
  };
  // Generate datetime values for one day
  const datetimeLabels = Array.from({ length: 24 }, (_, i) => new Date().setHours(i));

  const formattedLabels = genderData.map(entry => entry.HourlyDateTime);

  const NoformattedLabels = datetimeLabels.map((timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:00`; // Adjust format as needed (e.g., "HH:mm")
  });

  const fetchEmotions = async () => {
    try {
      const response = await fetch('http://192.168.15.227:3001/emotion_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ pickdate: selectedDate.format('YYYY-MM-DD') }),
      });
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((entry, index) => ({
          id: index,
          value: entry.count,
          label: entry.emotion_data,
        }));
        // console.log(formattedData)
        setEmotion(formattedData);
      }
      else {
        console.log("Response Error")
      }

    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };
  const fetchCountMembers = async () => {
    try {
      const response = await fetch('http://192.168.15.227:3001/CountMembers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ pickdate: selectedDate.format('YYYY-MM-DD') }),
      });
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((entry, index) => ({
          id: index,
          value: entry.Count,
          label: entry.Name,
        }));
        // console.log(data)
        setCountMember(formattedData);
      }
      else {
        console.log("Response Error")
      }

    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };
  const fetchGender = async () => {
    try {
      const response = await fetch('http://192.168.15.227:3001/DashBoardGender', {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ pickdate: selectedDate.format('YYYY-MM-DD') }),
      });
      if (response.ok) {
        const data = await response.json();
        // console.log(data)
        const formattedData = data.map(entry => ({
          HourlyDateTime: entry.HourlyDateTime,
          Male: entry.Gender === 'male' ? entry.Count : 0,
          Female: entry.Gender === 'female' ? entry.Count : 0,
          Unknown: entry.Gender === null ? entry.Count : 0,
        }));
        // Set the formatted data as the genderData state
        console.log(formattedData)
        setGenderData(formattedData);
        console.log(genderData)
      }
      else {
        console.log("Response Error")
      }

    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };
  useEffect(() => {
    fetchEmotions();
    fetchCountMembers();
    fetchGender();
  }, [selectedDate]);
  const handleLogout = () => {
    Cookies.remove('status');
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

  // email
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [image, setImage] = useState(null);
  const captureScreenshot = async () => {
    try {
      const canvas = await html2canvas(document.body); // Capture screenshot of the entire body
      return canvas.toDataURL(); // Convert screenshot to data URL
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      return null;
    }
  };
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      // Capture screenshot
      const screenshotDataUrl = await captureScreenshot();
  
      // Create form data
      const formData = new FormData();
      formData.append('recipient_email', recipientEmail);
      formData.append('subject', subject);
      formData.append('message_body', messageBody);
      
      // Append screenshot data
      if (screenshotDataUrl) {
        formData.append('image', screenshotDataUrl);
      }
  
      // Send API request
      const response = await fetch('http://192.168.15.227:3001/send_email', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('Email sent successfully');
        window.alert('Email sent successfully');
      } else {
        window.alert('Error during sending email');
      }
    } catch (error) {
      console.error('Error during sending email:', error);
      window.alert('Error during sending email', error);
    }
  };
  

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
          <div className='info'>
            <div className='title'>
              <h3 className='text-3xl font-bold'>สถิติ
              </h3>
            </div>
            <div className='data-info'>
              <div style={{ display: 'block' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    name="mydate"
                    id="mydate"
                    label="Map Date"
                    disableFuture
                    sx={{ width: 400 }}
                  />
                </LocalizationProvider>
              </div>
              <div className='Emotion' style={{ display: 'inline-block', width: '30%' }}>
                <h1 style={{ textAlign: 'center' }}>Emotion</h1>
                {Emotion.length > 0 ? (
                  <PieChart
                    colors={['red', 'blue', 'green', 'black', 'purple', 'orange', 'gray']}
                    series={[
                      {
                        data: Emotion,
                        arcLabel: getArcLabel,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontSize: 20,
                      },
                    }}
                    {...EmotionSizing}
                  />
                ) : (
                  <PieChart
                    colors={['gray']}
                    series={[
                      {
                        data: [
                          { id: 0, value: 100, label: 'No Data' },
                        ],
                      },
                    ]}
                    {...EmotionSizing}
                  />

                )}
              </div>
              <div className='Members' style={{ display: 'inline-block', width: '30%' }}>
                <h1 style={{ textAlign: 'center' }}>Members</h1>
                {CountMember.length > 0 ? (
                  <PieChart
                    colors={['red', 'blue', 'green', 'black', 'purple', 'orange', 'gray']}
                    series={[
                      {
                        data: CountMember,
                        arcLabel: getArcLabelUnknown,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontSize: 20,
                      },
                    }}
                    {...EmotionSizing}
                  />
                ) : (
                  <PieChart
                    colors={['gray']}
                    series={[
                      {
                        data: [
                          { id: 0, value: 100, label: 'No Data' },
                        ],
                      },
                    ]}
                    {...EmotionSizing}
                  />
                )
                }
              </div>
              <div className='Members' style={{ display: 'inline-block', width: '50%' }}>
                {/* <h1 style={{ textAlign: 'center' }}>Male vs Female</h1> */}
                {genderData.length > 0 ? (
                  <BarChart
                    series={[
                      { data: genderData.map(entry => entry.Male), label: 'Male' },
                      { data: genderData.map(entry => entry.Female), label: 'Female' },
                      { data: genderData.map(entry => entry.Unknown), label: 'Unknown' },
                    ]}
                    xAxis={[{ scaleType: 'band', data: genderData.map(entry => entry.HourlyDateTime.split(' ')[1].slice(0, 5)) }]}
                    {...BarchartSetting}
                  />
                ) : (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>No data available</div>
                )}
              </div>

              <div className='Members' style={{ display: 'inline-block', width: '50%' }}>
                <form onSubmit={handleSubmit}>
                  <input
                    style={{ textAlign: 'center', margin: '10px' }}
                    type="email"
                    placeholder="Recipient Email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                  />
                  <br />
                  <input
                    style={{ textAlign: 'center', margin: '10px' }}
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                  <br />
                  <textarea
                    style={{ textAlign: 'center', margin: '10px' }}
                    placeholder="Message Body"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    required
                  ></textarea>
                  <br />
                  <button type="submit">Send Email</button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
