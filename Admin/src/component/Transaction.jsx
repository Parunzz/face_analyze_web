import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';

const columns = [
    // { id: 'Cut_path',label: 'Small-pic'},
    // { id: 'Full_path',label: 'Full-pic'},
    { id: 'Data_id',label: 'Data_id'},
    { id: 'Name',label: 'Person'},
    { id: 'emotion_data',label: 'Emotion'},
    { id: 'Age',label: 'Age'},
    { id: 'Gender',label: 'Gender'},
    {
        id: 'DateTime',
        label: 'Date',
        minWidth: 100,
        // align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    { id: 'place',label: 'Place'},
    { id: 'history',label: 'History Detail'},
];

const Transaction = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        // Fetch data from API when component mounts
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Make API request
            console.log("api")
            // const response = await fetch(`/api/transaction`);
            const response = await fetch(`http://localhost:3001/api/transaction?page=${page}&rowsPerPage=${rowsPerPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '97%', overflow: 'hidden', marginTop: '2%', marginLeft: '1.7%' }}>
            <TableContainer sx={{ maxHeight: 540 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            const Data_id = row['Data_id']
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'history'
                                                        ? 
                                                        <div>
                                                            <Link to={`/History/${Data_id}`} style={{ color:"blue" }}>
                                                                View Details
                                                            </Link>
                                                        </div>
                                                        // <a style={{color:'blue'}} href="">Detail</a>
                                                        : <div></div>}
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default Transaction;
