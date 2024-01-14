import React, { useRef, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: 'user',
};

export default function WebcamCapture() {
  const webRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [autoCaptureInterval, setAutoCaptureInterval] = useState(null);
  const [responseTextemo, setResponseTextemo] = useState('');
  const [responseTextName, setResponseTextName] = useState('');

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };
  const startAutoCapture = () => {
    const interval = setInterval(showImage, 2000); // Auto-capture every 2 seconds
    setAutoCaptureInterval(interval);
  };

  const stopAutoCapture = () => {
    clearInterval(autoCaptureInterval);
    setAutoCaptureInterval(null);
  };
  const showImage = async () => {

    if (webRef.current) {
      const imageSrc = webRef.current.getScreenshot();
      console.log(imageSrc);

      try {
        // Check if the image source is not null or empty
        if (imageSrc) {
          const cachedResponse = localStorage.getItem(imageSrc);

          if (cachedResponse) {
            // Use the cached response
            const data = JSON.parse(cachedResponse);
            setDominantEmotion(data.dominant_emotion);
          }
          // Log the JSON payload before sending the request
          console.log('JSON Payload:', JSON.stringify({ image: imageSrc }));

          setCapturedImage(imageSrc); // Update state to display the captured image

          const response = await fetch('http://localhost:3001/api/save_fullImg', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageSrc }),
          });
          

          // Log the response details
          const responseData = await response.json();
          console.log('API response:', responseData);
          if(responseData){
            setResponseTextemo(responseData.dominant_emotion);
            setResponseTextName(responseData.person_name);
          }
            else{
              setResponseTextemo(responseData.error)
              setResponseTextName(responseData.person_name);
          }

        } else {
          console.error('Image source is empty or null');
        }
      } catch (error) {
        console.error('Error sending image:', error);
        // Handle error (optional)
      }
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <h1>Face Detect</h1>
        {isCameraOn ? (
          <Webcam
          ref={webRef}
          audio={false}
          screenshotFormat="image/jpeg"
          height={500}
          width={500}
          videoConstraints={videoConstraints}
          />
          )
           : (
          <div style={{ width: '500px', height: '500px', backgroundColor: 'black' }}></div>
        )}
        <button onClick={showImage}>Capture photo</button>
        <button onClick={startAutoCapture}>Start Auto-Capture</button>
        <button onClick={stopAutoCapture}>Stop Auto-Capture</button>
        <button onClick={toggleCamera}>
          {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>

        {/* Display the captured image at the bottom */}
        {/* {capturedImage && <img src={capturedImage} alt="Captured" style={{ marginTop: '20px' }} />} */}
        <h1>Emotion : {responseTextemo}</h1>
        <h1>Person name : {responseTextName}</h1>
      </Container>
    </React.Fragment>
  );
}
