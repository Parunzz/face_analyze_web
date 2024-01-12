import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Search from './Search';
import { Box, Container } from '@mui/system';
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
          <h3>Image Path: {image.img_path}</h3>
          {image.base64 ? (
            <img src={`data:image/jpeg;base64,${image.base64}`} alt={`Image ${index}`} />
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
