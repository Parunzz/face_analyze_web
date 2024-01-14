import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const TestAutocap = () => {
  const webcamRef = useRef(null);
  const [autoCaptureInterval, setAutoCaptureInterval] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const startAutoCapture = () => {
    const interval = setInterval(captureImage, 5000); // Auto-capture every 5 seconds
    setAutoCaptureInterval(interval);
  };

  const stopAutoCapture = () => {
    clearInterval(autoCaptureInterval);
    setAutoCaptureInterval(null);
  };

  const captureImage = async () => {
    // Capture an image from the webcam
    const base64Image = webcamRef.current.getScreenshot();

    try {
      // Send the captured image to the Flask API using fetch
      await fetch('http://localhost:3001/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Image.split(',')[1],
        }),
      });

      // Update the captured image state to display it
      setCapturedImage(base64Image);
      console.log('Image captured successfully!');
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  return (
    <div className="App">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
      />
      <button onClick={captureImage}>Capture Image</button>
      <button onClick={startAutoCapture}>Start Auto-Capture</button>
      <button onClick={stopAutoCapture}>Stop Auto-Capture</button>

      {capturedImage && (
        <div>
          <h2>Captured Image</h2>
          <img src={capturedImage} alt="Captured" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default TestAutocap;
