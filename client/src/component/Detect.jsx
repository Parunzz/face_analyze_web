// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";

function Detect() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [responseText, setResponseText] = useState('');
    const [screenshotCounter, setScreenshotCounter] = useState(0);
    const [isVideoRunning, setIsVideoRunning] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);

    const toggleCamera = () => {
        setIsCameraOn((prev) => !prev);
      };
    // Main function
    const runCoco = async () => {
        const net = await cocossd.load();
        console.log("Handpose model loaded.");
        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 10);
    };

    const getScreenshot = (video, width, height) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        return canvas.toDataURL(); // returns a base64-encoded data URL
    };
    const stopVideo = () => {
        // Stop the video stream
        if (webcamRef.current && webcamRef.current.video) {
            const tracks = webcamRef.current.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            setIsVideoRunning(false);
        }
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
            const obj = await net.detect(video);

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            drawRect(obj, ctx);
            // Check if 'person' is detected
            const personDetected = obj.some((prediction) => prediction.class === 'person');

            if (personDetected && screenshotCounter < 3) {
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
                // Increment the counter
                setScreenshotCounter(screenshotCounter + 1);
            }else {
                // If 'person' is not detected, reset the counter
                // setScreenshotCounter(0);
            }

        }
    };

    useEffect(() => { runCoco() }, [screenshotCounter]);

    return (
        <div className="">
            <header className="">
                {isCameraOn ? (
                <Webcam
                    ref={webcamRef}
                    muted={true}
                    screenshotFormat="image/jpeg"
                    mirrored={true}
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
            <p>Response Text: {responseText}</p>
            <button onClick={toggleCamera}>
                {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            </button>
        </div>
    );
}

export default Detect;