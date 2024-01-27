import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ImgUpdate() {
  const [selectedImage, setSelectedImage] = useState(null);
  const isImageType = (fileType) => {
    return fileType.startsWith('image/');
  };
  const fileSelectHandler = (event) => {
    // console.log(event.target.files[0])
    const selectedFile = event.target.files[0];
    if (selectedFile && isImageType(selectedFile.type)) {
      // console.log('Selected file:', selectedFile);
      setSelectedImage(selectedFile.name)
    } else {
      // console.error('Invalid file type. Please select an image file.');
      setSelectedImage(null)
      window.alert("Invalid file type. Please select an image file.")
    }
  }
  return (
    <>
      <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        Upload Your face Image
        <VisuallyHiddenInput
          type="file"
          onChange={fileSelectHandler}
          accept="image/*"
          id="imgUpload" 
        />
      </Button>
      {selectedImage && (
        <p>Selected Image: {selectedImage}</p>
      )}
    </>
  );
}