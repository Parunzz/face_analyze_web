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
import Typography from '@mui/material/Typography';
import Webcam from "react-webcam";
import { drawRect } from "./utilities";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

function Detect() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [imageSrc, setImageSrc] = useState(null);
    const [responseData, setresponseData] = useState([]);
    let isCaptureEnabled = true


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

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            drawRect(faces, ctx);
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
    const theme = createTheme({
        typography: {
            h3: {
                fontSize: 20,
                color: 'green',
            },
            h2: {
                fontSize: 20,
                color: 'red',
            },
        },
    });
    useEffect(() => {
        loadModel();
    }, []);

    return (

        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            <Button variant="contained" color="error" onClick={toggleCamera} style={{ zIndex: 30, marginTop: 16 }}>
                {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            </Button>
            <Container fixed>
                <header>
                    {isCameraOn ? (
                        <Webcam
                            ref={webcamRef}
                            muted={true}
                            screenshotFormat="image/jpeg"
                            // videoConstraints={{ facingMode: 'user', width: 1080, height: 1920, }}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: -1,
                                width: "100%",
                                height: "100%",
                                pointerEvents: "none",
                            }}
                        />
                    ) : (
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: -1,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            backgroundColor: 'black'
                        }}></div>
                    )}
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: -1,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: "0",
                            width: "100%",
                            // width: 565,
                            padding: '20px',
                            zIndex: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        style={{ display: 'block' }}
                    >

                        {Array.isArray(responseData) ? (
                            responseData.map((result, index) => (
                                <ThemeProvider theme={theme} key={index}>
                                    <Typography variant="h3" gutterBottom style={{ zIndex: 20 }}>
                                        <span>Dominant Emotion: {result.dominant_emotion}</span><br />
                                        <span>Person Name: {result.person_name}</span><br />
                                        <span>Response Text: {result.response_text}</span>
                                        {result.base64_image && (
                                            <img
                                                src={`data:image/jpeg;base64,${result.base64_image}`}
                                                alt="Detected Face"
                                                width={50}
                                                height={50}
                                                style={{ marginLeft: '16px' }}
                                            />
                                        )}
                                    </Typography>
                                </ThemeProvider>
                            ))
                        ) : (
                            <div style={{ display: 'inline-flex' }}>
                                <ThemeProvider theme={theme}>

                                    <Typography variant="h2" gutterBottom style={{ zIndex: 20 }}>
                                        Don't find face
                                    </Typography>
                                </ThemeProvider>
                            </div>
                        )}

                    </Box>
                </header>
            </Container>
        </div>


    );
}

export default Detect;