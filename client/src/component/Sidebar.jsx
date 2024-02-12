import React from 'react'
import '../css/Body.css'
import Home from './Home'
// import { Link } from "react-router-dom";
// import Datetime from 'react-datetime';
import UseAuth from './UseAuth';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

function Sidebar() {
   const { authenticated } = UseAuth();
   const handleLogout = () => {
      Cookies.remove('token');
      // Redirect or perform other actions upon logout
   };

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


      <div className="Body">
         
         
         <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
               <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
         </button>
         
         <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-white-800">
               <a href="./" className="flex items-center ps-2.5 mb-5">
                  <img src="/img/LOGO-app-removebg-preview.png" className="h-6 me-3 sm:h-7" alt="Analyze Logo" />
                  <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-black">Analyze</span>
               </a>
               <ul className="space-y-2 font-medium">
                  
                  <li>
                     <a href="./" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-stone-400 group">
                        <svg className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M11.2929 3.29289C11.6834 2.90237 12.3166 2.90237 12.7071 3.29289L18.7071 9.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071C20.3166 13.0976 19.6834 13.0976 19.2929 12.7071L19 12.4142V19C19 20.1046 18.1046 21 17 21H14C13.4477 21 13 20.5523 13 20V17H11V20C11 20.5523 10.5523 21 10 21H7C5.89543 21 5 20.1046 5 19V12.4142L4.70711 12.7071C4.31658 13.0976 3.68342 13.0976 3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929L5.29289 9.29289L11.2929 3.29289Z" />
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">หน้าหลัก</span>
                     </a>
                  </li>
                  {authenticated &&
                  <li>
                     <a href="./Camera" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-stone-400 group">
                        <svg className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M19 5h-1.382l-.171-.342A2.985 2.985 0 0 0 14.764 3H9.236a2.984 2.984 0 0 0-2.683 1.658L6.382 5H5a3 3 0 0 0-3 3v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a3 3 0 0 0-3-3Zm-3.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"></path>
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">กล้องบันทึกภาพ</span>
                     </a>
                  </li>
                  }
                  {authenticated &&
                  <li>
                     <a href="./Transaction" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-stone-400 group">
                        <svg className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                           <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z"></path>
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">ประวัติ</span>
                     </a>
                  </li>
                  }
                  {authenticated &&
                  <li>
                     <a href="./Member" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-stone-400 group">
                        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                           <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">สมาชิก</span>
                     </a>
                  </li>
                  }
                  {authenticated &&
                  <li>
                     <a href="./Dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-stone-400 group">
                        <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                           <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                           <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                        </svg>
                        <span className="ms-3">Dashboard</span>
                     </a>
                  </li>
                  }
                  {authenticated ? (
                     <li>
                        <a href='/' onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-stone-400 group">
                           <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                           </svg>
                           <span className="flex-1 ms-3 whitespace-nowrap">Log out</span>
                        </a>
                     </li>
                  ) : (
                     <li>
                        <a href="./SignIn" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-stone-400 group">
                           <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                           </svg>
                           <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                        </a>
                     </li>
                  )}
               </ul>
            </div>
         </aside>
         <div className="bg">
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
               <div>
                  <div className='top-menu'>
                     <div className='data' style={{ display: 'flex', flexDirection: 'row' }}>
                        <div className='date text-white'>{currentDate}</div>
                        <div className='time text-white' style={{ marginLeft: '10px' }}>{currentTime}</div>
                  </div>
               </div>
            </div>
         </div>

            {/* <img className="img" src="https://i.pinimg.com/564x/bc/87/87/bc8787543bda61ed3659925bbc7c9e62.jpg" alt="bg" /> */}
            
         </div>
         
      </div>
   )
}

export default Sidebar