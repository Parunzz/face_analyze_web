import { useRef, useState, useEffect } from 'react';
import vdoBg from '../assets/video/Kiosk.mp4'
import UseAuth from './UseAuth';
import Cookies from 'js-cookie';
import '../css/Camera.css';
import Webcam from "react-webcam";
import { drawRect } from "./utilities";

// Register WebGL backend.
import * as tf from "@tensorflow/tfjs";
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';

function Camera() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [imageSrc, setImageSrc] = useState(null);
    const [responseData, setresponseData] = useState([]);
    let isCaptureEnabled = true

    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const aspectRatio = 9 / 16;
    const handleLogout = () => {
        Cookies.remove('token');
    }
    const loadModel = async () => {
        // const net = await cocossd.load();
        try {
            const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
            const detectorConfig = {
                runtime: 'tfjs',
                maxFaces: '10',
                // runtime: 'mediapipe', // or 'tfjs'
                // solutionPath: 'node_modules/@mediapipe/face_detection/',
            }
            const net = await faceDetection.createDetector(model, detectorConfig);
            console.log("Face detection model loaded.");

            //  Loop and detect hands
            setInterval(() => {
                detect(net);
            }, 500);

        } catch (error) {
            console.error("Error loading or using the face detection model:", error);
        }
    };
    const getScreenshot = (video, width, height) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        return canvas.toDataURL(); // returns a base64-encoded data URL
    };
    const getFaceScreenshot = (video, width, height, face) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Check if the face object and its box property are defined
        if (face && face.box) {
            // Extract box coordinates from the face
            const { xMin, xMax, yMin, yMax } = face.box;
            // Draw only the region within the face bounding box
            ctx.drawImage(video, xMin, yMin, xMax - xMin, yMax - yMin, 0, 0, width, height);
        } else {
            // If the face or its box property is undefined, draw the entire video frame
            ctx.drawImage(video, 0, 0, width, height);
        }

        return canvas.toDataURL(); // returns a base64-encoded data URL
    };
    const sendApi = (video, videoWidth, videoHeight, faces) => {
        setTimeout(async () => {
            console.log("detect")
            const facescreenshot = getFaceScreenshot(video, videoWidth, videoHeight, faces[0]);
            setImageSrc(facescreenshot);
            const screenshot = getScreenshot(video, videoWidth, videoHeight);
            const response = await fetch('http://localhost:3001/api/save_fullImg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: screenshot,
                }),
            });

            // Handle the API response as needed
            const responseInfo = await response.json();
            if (response.ok) {
                setresponseData(responseInfo)
                // console.log(responseInfo);
            }
            else {
                // setresponseData(responseInfo)
                // console.log("response Error",responseData);
                // setInterval(() => {
                //     sendApi(video, videoWidth, videoHeight, faces);
                // }, 1000);

            }

        }, 0);
    }
    const sendDetectApi = (video, videoWidth, videoHeight) => {
        setTimeout(async () => {
            console.log("DETECT");
            const screenshot = getScreenshot(video, videoWidth, videoHeight);
            // console.log(screenshot);
            const response = await fetch('http://localhost:3001/api/Detect_face', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: screenshot,
                }),
            });

            // Handle the API response as needed
            const responseInfo = await response.json();
            if (response.ok) {
                console.log(responseInfo);
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                drawRect(responseInfo.faces, ctx);
            }

        }, 0);
    }
    let seenIds = [];
    let trackedPersons = [];
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

            sendDetectApi(video, videoWidth, videoHeight);
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
        }, 2500);
        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className='container-camera'>
                <div className='info-data-cam'>
                    <div className='shadows'>

                    </div>
                    <div className='web-cam-section'>
                        <div className='web-cam'>
                            <Webcam
                                ref={webcamRef}
                                muted={true}
                                screenshotFormat="image/jpeg"
                                height={16} width={9}
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
                        {Array.isArray(responseData) ? (
                            responseData.map((result, index) => (
                                <div className='box1' key={index}>
                                    {/* <img src={`data:image/jpeg;base64,${result.base64_image}`} className='emoji'></img> */}
                                    <img src={`data:image/jpeg;base64,${result.BLOB}`} className='emoji'></img>
                                    <h3 className='Name'>Hello, {result.person_name}</h3>
                                    <h4 className='Text'> {result.response_text} </h4>
                                    <h4 className='Text'> {result.person_gender} </h4>
                                    <h4 className='Text'> {result.person_age} </h4>
                                </div>
                                // <span>Dominant Emotion: {result.dominant_emotion}</span><br />
                                // <span>Person Name: {result.person_name}</span><br />
                                // <span>Response Text: {result.response_text}</span>

                            ))
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
