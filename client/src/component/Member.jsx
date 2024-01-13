import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Search from './Search';
import { Box, Container, Button } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function Member() {
    const [images, setImages] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3001/getimg', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            // Assuming data structure is { images: [...] }
            setImages(data.images || []);
          } else {
            console.error('Failed to get images:', response);
            window.alert('Error during fetching images');
          }
        } catch (error) {
          // Handle error
          console.error('Error during fetching images:', error);
        }
      };
    
      // Call the fetchData function when the component mounts
      fetchData();
    }, []); // Empty dependency array means this effect runs once when the component mounts
    const handleRemoveImage = async (pid) => {
      try {
        const response = await fetch('http://localhost:3001/rmimg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pid }),
        });
  
        if (response.ok) {
          // Update the images after successful removal
          const updatedImages = images.filter((image) => image.pid !== pid);
          setImages(updatedImages);
        } else {
          console.error('Failed to remove image:', response);
          window.alert('Error during image removal');
        }
      } catch (error) {
        // Handle error
        console.error('Error during image removal:', error);
      }
    };
  return (
    <div>
      <Nav />
      <Container maxWidth="lg">
        <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ paddingBottom: 30 }}>Member</h1>
          <Fab color="primary" aria-label="add" href='AddMember'>
            <AddIcon />
          </Fab>
        </Box>
        <Search />

        <div>
          {images.map((image, index) => (
            <div key={index}>
              <h3>Name: {image.fname + ' ' + image.lname}</h3>
              {image.base64 ? (
                <>
                  <img src={`data:image/jpeg;base64,${image.base64}`} alt={`Image ${index}`} />
                  <Button onClick={() => handleRemoveImage(image.pid)} variant="contained" color="error">
                    Remove Image
                  </Button>
                </>
              ) : (
                <p>No image available</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Member;
