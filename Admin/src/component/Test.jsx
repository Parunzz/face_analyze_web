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
import '../css/Test.css';
import { Link } from 'react-router-dom';


function Test() {
   
  return (
    <div>  
        <div className='Container'>
            <div className='Text'>
                สวัสดีพ่อมึงตายยัง
            </div>
            <div className='Button'> </div>
        </div>
    </div>
  );
}

export default Test;
