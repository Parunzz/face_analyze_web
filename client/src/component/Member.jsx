import React, { useState, useEffect } from 'react';
import Nav from './Nav';
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
import '../css/Body.css'

function Member() {
    const [responseData, setResponseData] = useState([]);
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/getMember', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          setResponseData(data.Member)
          // console.log(responseData)
        } else {
          console.error('Failed to get images:', response);
          window.alert('Error during fetching images');
        }
      } catch (error) {
        console.error('Error during fetching images:', error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []); // Empty dependency array means this effect runs once when the component mounts
  return (
    <div className='Member'>
      <Container maxWidth="lg">
        <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ paddingBottom: 30 }}>Member</h1>
          <Fab color="primary" aria-label="add" href='AddMember'>
            <AddIcon />
          </Fab>
        </Box>
        <Search />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.1 rem' }}>Member No.</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold', fontSize: '1.1 rem' }}>FirstName</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold', fontSize: '1.1 rem' }}>LastName</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold', fontSize: '1.1 rem' }}>Member Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responseData.map((responseData, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{index+1}</TableCell>
                  <TableCell align="left">{responseData.FirstName}</TableCell>
                  <TableCell align="left">{responseData.LastName}</TableCell>
                  <TableCell align="left">
                    <Link to={`/member/${responseData.pid}`} style={{ color:"blue" }}>
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
  );
}

export default Member;
