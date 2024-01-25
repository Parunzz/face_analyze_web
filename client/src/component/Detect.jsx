// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
//--------------------Import the libraries---------------------
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
//--------------------Import the libraries---------------------

import Webcam from "react-webcam";
import { drawRect } from "./utilities";

function Detect() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [responseText, setResponseText] = useState('');
    const [responseName, setResponseName] = useState('');
    const [screenshotCounter, setScreenshotCounter] = useState(0);
    const [isVideoRunning, setIsVideoRunning] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [imageSrc, setImageSrc] = useState(null);
    let isCaptureEnabled = true; // Add this variable

    const toggleCamera = () => {
        setIsCameraOn((prev) => !prev);
      };
    // Main function
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
            }, 1500);

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
            const estimationConfig = {flipHorizontal: false};
            const faces = await net.estimateFaces(video,estimationConfig);
            console.log(faces)

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            drawRect(faces, ctx);
            // Check if 'face' is detected
            const noFaceDetected = !faces || faces.length === 0;
            if(!noFaceDetected && isCaptureEnabled){
                isCaptureEnabled = false;
                const facescreenshot = getFaceScreenshot(video, videoWidth, videoHeight, faces[0]);
                setImageSrc(facescreenshot);
                console.log("facescreenshot")
                
            }
            else{
                isCaptureEnabled = true;
                setImageSrc(null);
            }
            if (false) {
                // Take a screenshot
                const screenshot = getScreenshot(video, videoWidth, videoHeight);

                // Send the screenshot to the API
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
                const responseData = await response.json();
                console.log('API response:', responseData);
                setResponseText(responseData.dominant_emotion);
                console.log(screenshotCounter);
                setResponseName(responseData.person_name)
                // Increment the counter
                // setScreenshotCounter(screenshotCounter + 1);
            }else {
                // If 'person' is not detected, reset the counter
                // setScreenshotCounter(0);
            }

        }
    };

    useEffect(() => {
        loadModel();
    }, []);

    return (
        <div className="">
            <header className="">
                {isCameraOn ? (
                <Webcam
                    ref={webcamRef}
                    muted={true}
                    screenshotFormat="image/jpeg"
                    // mirrored={true}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                    />
                ) : (
                    <div style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480, 
                         backgroundColor: 'black' 
                        }}></div>
                  )}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 8,
                        width: 640,
                        height: 480,
                    }}
                    />
            </header>
            <h1>Name : {responseName}</h1>
            <h1>Response Text: {responseText}</h1>
            <button onClick={toggleCamera}>
                {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            </button>
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="Detected Face"
                    width={200}
                    height={200}
                />
            )}
        </div>
    );
}

export default Detect;