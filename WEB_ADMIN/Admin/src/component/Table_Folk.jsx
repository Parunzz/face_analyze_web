import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];



export default function Table_Folk() {
    const status = Cookies.get('status');
    const navigate = useNavigate();
    
    if(status != 'true'){
      navigate('/SignIn');
    }
    const [responseData, setresponseData] = useState([]);
    
    // GET request for remote image in node.js
    useEffect(() => {
        axios({
            method: 'get',
            url: `http://${import.meta.env.VITE_SERVER_IP}/api/transaction`,
            // responseType: 'stream'
        })
            .then(function (response) {
                setresponseData(response.data)
            });
    }, []);
    console.log(responseData)

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow style={{backgroundColor: 'gray'}}>
                        <TableCell align="center">Age</TableCell>
                        <TableCell align="center">Data_ID</TableCell>
                        <TableCell align="center">DateTime</TableCell>
                        <TableCell align="center">Gender</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Emotion_data</TableCell>
                        <TableCell align="center">Place</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {responseData.map((row) => (
                        <TableRow 
                            // key={row.name}
                            // sx={{ '&:last-child td, &:last-child th': { border: 50 } }}
                        >          
                            {row.Age ? (
                                <TableCell align="center">{row.Age}</TableCell>
                            ) : (
                                <TableCell align="center">unknown</TableCell>
                            )}
                            <TableCell align="center">{row.Data_id}</TableCell>
                            <TableCell align="center">{row.DateTime}</TableCell>
                            {row.Gender ? (
                                <TableCell align="center">{row.Gender}</TableCell>
                            ) : (
                                <TableCell align="center">unknown</TableCell>
                            )}
                            <TableCell align="center">{row.Name}</TableCell>
                            <TableCell align="center">{row.emotion_data}</TableCell>
                            {row.Place ? (
                                <TableCell align="center">{row.place}</TableCell>
                            ) : (
                                <TableCell align="center">unknown</TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}