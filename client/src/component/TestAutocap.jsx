import React, { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';

const TestAutocap = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  const startAutoCapture = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auto_capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start: true }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const responseData = await response.json();
      setResponseMessage(responseData.message || '');

      // Start capturing frames every second
      intervalRef.current = setInterval(capture, 1000);
    } catch (error) {
      console.error('Error starting auto-capture:', error);
      setResponseMessage(`Error starting auto-capture: ${error.message}`);
    }
  };

  const stopAutoCapture = async () => {
    clearInterval(intervalRef.current);

    try {
      const response = await fetch('http://localhost:3001/api/auto_capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stop: true }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const responseData = await response.json();
      setResponseMessage(responseData.message || '');
    } catch (error) {
      console.error('Error stopping auto-capture:', error);
      setResponseMessage(`Error stopping auto-capture: ${error.message}`);
    }
  };

  const capture = async () => {
    if (webcamRef && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);

        // Send the captured image to the server for further processing
        await sendFrameToServer(imageSrc);
      }
    }
  };

  const sendFrameToServer = async (imageSrc) => {
    try {
      const response = await fetch('http://localhost:3001/api/capture_frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frame: imageSrc }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error sending frame to server:', error);
    }
  };

  useEffect(() => {
    // Cleanup function: Stop auto-capture when the component unmounts
    return () => {
      clearInterval(intervalRef.current);
      stopAutoCapture();
    };
  }, []);

  return (
    <div>
      <p>Response: {responseMessage}</p>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
      />
      <button onClick={startAutoCapture}>Start Auto-Capture</button>
      <button onClick={stopAutoCapture}>Stop Auto-Capture</button>
      {capturedImage && (
        <div>
          <p>Captured Image:</p>
          <img src={capturedImage} alt="Captured Face" />
        </div>
      )}
    </div>
  );
};

export default TestAutocap;
