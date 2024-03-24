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
import axios from 'axios';

function Member() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.15.227:3001/getMember')
      .then(response => {
        setAllUsers(response.data.Member);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div>
      <h1 className='text-3xl font-bold' style={{ paddingBottom: '1%' }}>สมาชิก</h1>
      <Container maxWidth="lg">
        <Fab color="primary" aria-label="add" href='AddMember' sx={{display: 'flex', position: 'relative', marginLeft: '22em', marginBottom: '-3.8em', width: '50px', height: '50px'}}>
          <AddIcon />
        </Fab>
        <Search setSelectedUser={setSelectedUser} />
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
              {selectedUser ? (
                <TableRow>
                  <TableCell>{selectedUser && allUsers.findIndex(user => user.pid === selectedUser.pid) + 1}</TableCell>
                  <TableCell>{selectedUser.FirstName}</TableCell>
                  <TableCell>{selectedUser.LastName}</TableCell>
                  <TableCell>
                    <Link to={`/member/${selectedUser.pid}`} style={{ color: "blue" }}>
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                allUsers.map((user, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{index + 1}</TableCell>
                    <TableCell align="left">{user.FirstName}</TableCell>
                    <TableCell align="left">{user.LastName}</TableCell>
                    <TableCell align="left">
                      <Link to={`/member/${user.pid}`} style={{ color: "blue" }}>
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default Member;
