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
    const sendApi = (video, videoWidth, videoHeight, faces) =>{
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
    let seenIds = [];
    let trackedPersons = [];
    const detect = async (net) => {
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

            // Make Detections
            // const faces = await net.detect(video);
            const estimationConfig = { flipHorizontal: false };
            const faces = await net.estimateFaces(video, estimationConfig);
            // console.log(faces)
            // Function to calculate the Euclidean distance between two points
            // function euclideanDistance(point1, point2) {
            //     return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
            // }

            // // Function to check if keypoints belong to the same person
            // function isSamePerson(oldKeypoints, newKeypoints, threshold) {
            //     // Check if both old and new keypoints have the same length
            //     if (oldKeypoints.length !== newKeypoints.length) {
            //         return false;
            //     }

            //     // Iterate through corresponding keypoints and check their distances
            //     for (let i = 0; i < oldKeypoints.length; i++) {
            //         const distance = euclideanDistance(oldKeypoints[i], newKeypoints[i]);
            //         // console.log("dis : ", distance);
            //         if (distance > threshold) {
            //             return false;
            //         }
            //     }
            //     // If all distances are within the threshold, consider them to be the same person
            //     // console.log("SAME");
            //     return true;
            // }

            // // Function to track persons and preserve their identities
            // function trackPersons(detections, trackedPersons) {
            //     let newTrackedPersons = [];
            //     let newPersonId = 1; // Initialize the ID counter

            //     // Loop through each prediction
            //     detections.forEach(prediction => {
            //         // Extract keypoints
            //         const keypoints = prediction.keypoints;

            //         // Check if keypoints match any existing person
            //         let matchedPerson = null;
            //         for (let i = 0; i < trackedPersons.length; i++) {
            //             if (isSamePerson(trackedPersons[i].keypoints, keypoints, 1)) {
            //                 matchedPerson = trackedPersons[i];
            //                 break;
            //             }
            //         }

            //         if (matchedPerson !== null) {
            //             // Key points matched with an existing person
            //             // Update keypoints and preserve ID
            //             matchedPerson.keypoints = keypoints;
            //             newTrackedPersons.push(matchedPerson);
            //         } else {
            //             // Key points did not match any existing person
            //             // Create a new person entry with a new ID
            //             newTrackedPersons.push({ id: newPersonId, keypoints: keypoints });
            //             newPersonId++; // Increment the ID counter
                        
            //         }
            //     });

            //     return newTrackedPersons;
            // }




            // trackedPersons = trackPersons(faces, trackedPersons);
            // // console.log("Tracked persons:", trackedPersons);
            // if (trackedPersons.length === 0) {
            //     // console.log("No face");
            //     seenIds = [];
            // } else {
            //     // Loop through each tracked person and print their ID
            //     trackedPersons.forEach(face => {
            //         // console.log("ID:", face.id);
            //         // Check if the current ID is not in the list of seen IDs
            //         if (!seenIds.includes(face.id)) {
            //             console.log("New"); // Print "New" if the ID is new
            //             seenIds.push(face.id); // Add the current ID to the list of seen IDs
            //             sendApi(video, videoWidth, videoHeight, faces);
            //         }
            //     });
            // }
            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            drawRect(faces, ctx, trackedPersons);
            // Check if 'face' is detected
            const noFaceDetected = !faces || faces.length === 0;
            if (!noFaceDetected && isCaptureEnabled) {
                isCaptureEnabled = false
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
                    console.log(responseInfo);
                }
                else {
                    setresponseData(responseInfo)
                    console.log("response Error");
                }


                setTimeout(() => {
                    isCaptureEnabled = true;
                    setImageSrc(null);
                }, 5000);
            }
            else if (noFaceDetected) {
                isCaptureEnabled = true
                setImageSrc(null);
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

        loadModel();


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
                                    roundRect:(10,10,40,0),
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
