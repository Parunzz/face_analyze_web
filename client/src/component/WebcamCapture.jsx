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

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
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
          // Log the request details
          console.log('Request URL:', 'http://localhost:3001/api/save_fullImg');
          console.log('Request Method:', 'POST');
          console.log('Request Headers:', { 'Content-Type': 'application/json' });
          console.log('Request Body:', JSON.stringify({ image: imageSrc }));

          // Log the response details
          console.log('Response Status:', response.status);
          console.log('Response Headers:', response.headers);
          console.log('Response Body:', await response.text());


          // Inside the showImage function after fetching the API
          // Inside the showImage function after fetching the API
          if (response.ok) {
            try {
              const data = await response.json();
              console.log('Emotion Analysis Result:', data);

              // Check if 'dominant_emotion' is present in the correct location
              if (data && 'dominant_emotion' in data) {
                setDominantEmotion(data.dominant_emotion);
              } else {
                console.error('Dominant emotion not found in the response.');
              }
            } catch (error) {
              console.error('Error parsing JSON from the response:', error);
              // Handle error (optional)
            }
          } else {
            console.error('Failed to analyze emotion:', response.status, response.statusText);
            // Handle error (optional)
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
        ) : (
          <div style={{ width: '500px', height: '500px', backgroundColor: 'black' }}></div>
        )}
        <button onClick={showImage}>Capture photo</button>
        <button onClick={toggleCamera}>
          {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>

        {/* Display the captured image at the bottom */}
        {capturedImage && <img src={capturedImage} alt="Captured" style={{ marginTop: '20px' }} />}
        <h1>Emotion</h1>
        {dominantEmotion && <p>Dominant Emotion: {dominantEmotion}</p>}
      </Container>
    </React.Fragment>
  );
}
