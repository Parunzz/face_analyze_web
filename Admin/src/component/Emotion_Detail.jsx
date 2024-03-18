import React, { useState, useEffect } from 'react';
import { Box, Container, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import qs from 'qs';
import TextField from '@mui/material/TextField';

function Emotion_Detail() {
  const [ResponseEmotion, setResponseEmotion] = useState([]);
  const { emotion_id } = useParams();
  async function getResponseText() {
    let url = 'http://localhost:3001/api/ResponseText';
    try {
      const data = { 'emotion_id': emotion_id };
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url,
      };
      const response = await axios(options);
      console.log(response.data);
      setResponseEmotion(response.data)
    } catch (error) {
      console.error(error);
    }
  }
  async function handleSubmit(event) {
    event.preventDefault();

    let url = 'http://localhost:3001/api/SetResponseText';
    try {
      const formData = new FormData(event.currentTarget);
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });
      jsonData['emotion_id'] = emotion_id;
      console.log(jsonData);
      const response = await axios.post(url, jsonData, {
        headers: {
          'Content-Type': 'application/json' // Use multipart/form-data for form submissions
        }
      });
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      window.alert('Error');
      console.error(error);
    }
  }
  async function removeResponseText(response_text_id) {
    const url = `http://localhost:3001/api/removeResponseText/${response_text_id}`;
    try {
      const response = await axios.delete(url);
      console.log(response.data);
      window.alert('REMOVE');
      window.location.reload();
    } catch (error) {
      console.error(error);
      window.alert('Error');
    }
  }
  const handleRemove = (response_text_id) => {
    removeResponseText(response_text_id);
  };
  useEffect(() => {
    //Runs only on the first render
    getResponseText();
  }, []);
  return (
    <div>
      <Container maxWidth="lg">
        <form onSubmit={handleSubmit} id="htmlForm">
          {ResponseEmotion && ResponseEmotion.length > 0 ? (
            <h1>EMOTION : {ResponseEmotion[0].emotion_data}</h1>
          ) : (
            <h1>EMOTION : </h1>
          )}
          <TextField name="ResponseText" label="Add Response Text" variant="standard" />
          <Button type="submit" variant="contained">ADD TEXT</Button>

        </form>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.1 rem' }}>Response Text</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.1 rem' }}>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ResponseEmotion.map((ResponseEmotion, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{ResponseEmotion.response_text}</TableCell>
                  <TableCell align="left">
                    <span
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => handleRemove(ResponseEmotion.response_text_id)}
                    >
                      Remove {ResponseEmotion.response_text_id}
                    </span>                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>

  )
}

export default Emotion_Detail