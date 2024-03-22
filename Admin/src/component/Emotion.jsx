import React, { useState, useEffect } from 'react';
import Search from './Search';
import { Box, Container, Button } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Emotion() {
  const [ResponseEmotion, setResponseEmotion] = useState([]);
  async function getUser() {
    try {
      const response = await axios.get('http://192.168.15.227:3001/api/GetEmotion');
      console.log(response.data);
      setResponseEmotion(response.data)
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    //Runs only on the first render
    getUser();
  }, []);
  return (
    <div>
      <Container maxWidth="lg">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.1 rem' }}>Emotion</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold', fontSize: '1.1 rem' }}>Text Setting</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ResponseEmotion.map((ResponseEmotion, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{ResponseEmotion.emotion_data}</TableCell>
                  <TableCell align="left">
                    <Link to={`/Camera/${ResponseEmotion.emotion_id}`} style={{ color: "blue" }}>
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>

  )
}

export default Emotion