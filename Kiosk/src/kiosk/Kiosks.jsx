import { useRef, useState, useEffect } from 'react';
import './Camera.css';
import Webcam from "react-webcam";
import { drawRect } from "./utilities";

// Define a function to save input value to local storage
const saveInputValueToLocalStorage = (value) => {
    localStorage.setItem('place', value);
};

// Define a function to load input value from local storage
const loadInputValueFromLocalStorage = () => {
    return localStorage.getItem('place') || '';
};
function Camera() {
    const [inputValue, setInputValue] = useState(loadInputValueFromLocalStorage());

    // Function to handle input change
    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        saveInputValueToLocalStorage(newValue);
    };

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [imageSrc, setImageSrc] = useState(null);
    const [responseData, setresponseData] = useState([]);
    const [response, setresponse] = useState([]);
    const [Response, setResponse] = useState([]);
    let isCaptureEnabled = true

    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const aspectRatio = 9 / 16;
    const handleLogout = () => {
        Cookies.remove('token');
    }

    const getScreenshot = (video, width, height) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        // Convert base64 to Blob
        const base64Data = canvas.toDataURL('image/jpeg');
        const blob = dataURItoBlob(base64Data);

        return blob;
    };

    // Function to convert base64 to Blob
    function dataURItoBlob(dataURI) {
        // Convert base64 to binary
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // Create Blob object
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    const sendApi = async (video, videoWidth, videoHeight, responseData) => {
        try {
            const place = document.getElementById('place').value;
            console.log(responseData);
            // const screenshot = getScreenshot(video, videoWidth, videoHeight);
            const response = await fetch('http://192.168.1.33:3001/api/save_img', {
            // const response = await fetch('http://localhost:3001/api/save_img', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'responseData':responseData,'place':place}),
            });

            // Handle the API response as needed
            const responseInfo = await response.json();
            // console.log(responseInfo)
            if (response.ok) {
                console.log(responseInfo)
                setresponse(responseInfo);
            }
        } catch (error) {
            console.error('Error sending API request:', error);
        }
    };

    const sendDetectApi = async (video, videoWidth, videoHeight) => {
        try {
            const screenshot = getScreenshot(video, videoWidth, videoHeight);
            // Create a FormData object
            const formData = new FormData();
            // Append the image data to FormData
            formData.append('image', screenshot, 'screenshot.jpg');

            // Make the API request
            const response = await fetch('http://localhost:3001/api/Detect_face', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseInfo = await response.json();
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            drawRect(responseInfo, ctx);
            return responseInfo;
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error gracefully, e.g., display an error message to the user
        }
    };

    const detect = async () => {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const r = await sendDetectApi(video, videoWidth, videoHeight);
            // console.log(r)
            setResponse(r);
            for (let index = 0; index < r.length; index++) {
                // console.log(r[index].NewPerson)
                if (r[index].NewPerson == 'True') {
                    // console.log("emotion")
                    sendApi(video, videoWidth, videoHeight, r);
                }
            }
        }
    };
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            // const seconds = now.getSeconds().toString().padStart(2, '0');
            const month = now.toLocaleString('default', { month: 'long' }); // Get full month name
            const date = now.getDate();
            const year = now.getFullYear();

            setCurrentTime(`${hours}:${minutes}`);
            setCurrentDate(`${date} ${month} ${year}`);
            //   setKioskTime(`${hours} ${minutes}`);
        };

        // Update time and date initially and then every second
        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        setInterval(() => {
            detect();
        }, 1000);
        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className='container-camera'>
                <div style={{
                    margin: '10px',
                    display: 'flex',
                    position: 'absolute',
                    top: 0, zIndex: '1000',
                    color: 'white'
                }}>
                    <input type="text"
                        name="place"
                        id="place"
                        value={inputValue}
                        onChange={handleInputChange}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: 'none',
                            borderBottom: '1px solid white',
                            textAlign: 'center',
                            fontSize: '30px'
                        }}
                    />
                </div>
                <div className='info-data-cam'>
                    <div className='shadows'>

                    </div>
                    <div className='web-cam-section'>
                        <div className='web-cam'>
                            <Webcam
                                ref={webcamRef}
                                muted={true}
                                screenshotFormat="image/jpeg"
                                height={3840} width={2160}
                                className='webcams'
                                videoConstraints={{ aspectRatio: aspectRatio }} />
                            <canvas
                                ref={canvasRef}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    zIndex: 997,
                                    width: 'calc(100vh * ${aspectRatio})',
                                    height: '100%',
                                    pointerEvents: "none",
                                    roundRect: (10, 10, 40, 0),
                                }}
                            />
                        </div>
                        <div className='times'>
                            <div className='time text-white'>{currentTime}</div>
                        </div>
                        {Array.isArray(response) ? (
                            <ul>
                                {response.map((result, index) => (
                                    <li key={index}>
                                        <div className='box1'>
                                            <img src={result.base64_image} className='emoji' alt={`Emoji ${index}`} />
                                            <img src={`data:image/jpeg;base64,${result.BLOB}`} className='emoji' alt={`Emoji ${index}`} />
                                            <h3 className='Name'>{result.person_name}</h3>
                                            <h4 className='Text'>{result.response_text}</h4>

                                            {/* เพิ่มเงื่อนไขเพื่อตรวจสอบว่ามีข้อมูลในฐานข้อมูลหรือไม่ */}
                                            {result.person_gender && (
                                                <h4 className='Text'>เพศ: {result.person_gender}</h4>
                                            )}

                                            {result.person_age && (
                                                <h4 className='Text'>อายุ: {result.person_age} ปี</h4>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className='box1'>
                                <h3 className='Name'>Don't find face</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Camera;
