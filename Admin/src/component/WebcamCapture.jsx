import React, { useState ,useRef,  } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: 'user',
  mirrored: true,
};

export default function WebcamCapture() {
  const webRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [autoCaptureInterval, setAutoCaptureInterval] = useState(null);
  const [responseData, setResponseData] = useState([]);

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
      // console.log(imageSrc);

      try {
        // Check if the image source is not null or empty
        if (imageSrc) {
          setCapturedImage(imageSrc); // Update state to display the captured image

          const response = await fetch('http://192.168.15.227:3001/api/save_fullImg', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageSrc }),
          });
          // console.log(JSON.stringify({ image: imageSrc }))

          // Log the response details
          const responseData = await response.json();
          console.log('API response:', responseData);
          setResponseData(responseData);

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
            mirrored= {true}
            videoConstraints={videoConstraints}
            style={{ width: '500px', height: '500px' }}
          />
          ) : (
          <div style={{ width: '500px', height: '500px', backgroundColor: 'black' }}></div>
        )}
        <button onClick={showImage}>Capture photo</button><br />
        <button onClick={startAutoCapture}>Start Auto-Capture</button><br />
        <button onClick={stopAutoCapture}>Stop Auto-Capture</button><br />
        <button onClick={toggleCamera}>
          {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button><br />

        <div>
            {Array.isArray(responseData) ? (
                responseData.map((result, index) => (
                    <div key={index}>
                        <p>Dominant Emotion: {result.dominant_emotion}</p>
                        <p>Person Name: {result.person_name}</p>
                        <p>Response Text: {result.response_text}</p>
                    </div>
                ))
            ) : (
                <div>
                  <p>Don't find face</p>
                </div>
            )}
        </div>
      </Container>
    </React.Fragment>
  );
}
