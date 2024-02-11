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
            function euclideanDistance(point1, point2) {
                return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
            }

            // Function to check if keypoints belong to the same person
            function isSamePerson(oldKeypoints, newKeypoints, threshold) {
                // Check if both old and new keypoints have the same length
                if (oldKeypoints.length !== newKeypoints.length) {
                    return false;
                }

                // Iterate through corresponding keypoints and check their distances
                for (let i = 0; i < oldKeypoints.length; i++) {
                    const distance = euclideanDistance(oldKeypoints[i], newKeypoints[i]);
                    // console.log("dis : ", distance);
                    if (distance > threshold) {
                        return false;
                    }
                }
                // If all distances are within the threshold, consider them to be the same person
                // console.log("SAME");
                return true;
            }

            // Function to track persons and preserve their identities
            function trackPersons(detections, trackedPersons) {
                let newTrackedPersons = [];
                let newPersonId = 1; // Initialize the ID counter

                // Loop through each prediction
                detections.forEach(prediction => {
                    // Extract keypoints
                    const keypoints = prediction.keypoints;

                    // Check if keypoints match any existing person
                    let matchedPerson = null;
                    for (let i = 0; i < trackedPersons.length; i++) {
                        if (isSamePerson(trackedPersons[i].keypoints, keypoints, 0)) {
                            matchedPerson = trackedPersons[i];
                            break;
                        }
                    }

                    if (matchedPerson !== null) {
                        // Key points matched with an existing person
                        // Update keypoints and preserve ID
                        matchedPerson.keypoints = keypoints;
                        newTrackedPersons.push(matchedPerson);
                    } else {
                        // Key points did not match any existing person
                        // Create a new person entry with a new ID
                        newTrackedPersons.push({ id: newPersonId, keypoints: keypoints });
                        newPersonId++; // Increment the ID counter
                    }
                });

                return newTrackedPersons;
            }




            trackedPersons = trackPersons(faces, trackedPersons);
            // console.log("Tracked persons:", trackedPersons);
            if (trackedPersons.length === 0) {
                // console.log("No face");
                seenIds = [];
            } else {
                // Loop through each tracked person and print their ID
                trackedPersons.forEach(face => {
                    // console.log("ID:", face.id);
                    // Check if the current ID is not in the list of seen IDs
                    if (!seenIds.includes(face.id)) {
                        // console.log("New"); // Print "New" if the ID is new
                        seenIds.push(face.id); // Add the current ID to the list of seen IDs
                    }
                });
            }
            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            drawRect(faces, ctx, trackedPersons);
            // Check if 'face' is detected
            // const noFaceDetected = !faces || faces.length === 0;
            // if (!noFaceDetected && isCaptureEnabled) {
            //     isCaptureEnabled = false
            //     setTimeout(async () => {
            //         console.log("detect")
            //         const facescreenshot = getFaceScreenshot(video, videoWidth, videoHeight, faces[0]);
            //         setImageSrc(facescreenshot);
            //         const screenshot = getScreenshot(video, videoWidth, videoHeight);
            //         const response = await fetch('http://localhost:3001/api/save_fullImg', {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify({
            //                 image: screenshot,
            //             }),
            //         });

            //         // Handle the API response as needed
            //         const responseInfo = await response.json();
            //         if (response.ok) {
            //             setresponseData(responseInfo)
            //             // console.log(responseInfo);
            //         }
            //         else {
            //             setresponseData(responseInfo)
            //             // console.log("response Error");
            //         }
            //         setTimeout(() => {
            //             isCaptureEnabled = true;
            //         }, 5000);
            //     }, 1000);
            // }
            // else if (noFaceDetected) {
            //     isCaptureEnabled = true
            //     setImageSrc(null);
            // }
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
    const aspectRatio = 9 / 16;

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
                            videoConstraints={{
                                facingMode: 'user',
                                aspectRatio: aspectRatio
                            }}
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
                            width: `calc(100vh * ${aspectRatio})`, // Calculate width based on aspect ratio
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
                            width: `calc(100vh * ${aspectRatio})`, 
                            height: "100%",
                            pointerEvents: "none",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "25%",
                            padding: '20px',
                            zIndex: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        style={{
                            display: 'block',
                            // width: `calc(100vh * ${aspectRatio})`,
                        }}
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
                            <div style={{
                                display: 'inline-flex',
                                width: `calc(100vh * ${aspectRatio})`,
                            }}>
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