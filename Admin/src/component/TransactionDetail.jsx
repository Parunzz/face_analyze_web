import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import "../css/Historydetail.css"
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
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
    { id: '', label: 'IMG' },
    // { id: 'FullImg', label: 'FullImg' },
];
export default function TransactionDetail() {
    const { Data_id } = useParams();
    const [FullIMG, setFULLIMG] = useState(null);
    const [CUTIMG, setCUTIMG] = useState(null);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const fetchDetail = async () => {
        try {
            const response = await fetch(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/TransactionDetail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // cross cross-origin requests.
                credentials: 'include',
                body: JSON.stringify({ Data_id: Data_id }),
            });
            if (response.ok) {
                const data = await response.json();
                // console.log(data)
                setCUTIMG(data.Cut_Img)
                setFULLIMG(data.Full_Img)
            }
        } catch (error) {
            console.error('Error fetching member detail:', error);

        }
    }
    const FindPerson = async () => {
        try {
            const response = await fetch(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/FindPerson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // cross cross-origin requests.
                credentials: 'include',
                body: JSON.stringify({ Data_id: Data_id, FaceImg: CUTIMG }),
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.find_result)
                if (Array.isArray(responseData.find_result)) {
                    setData(responseData.find_result);
                } else {
                    console.error('Response data is not an array:', responseData);
                }
            }
        } catch (error) {
            console.error('Error fetching member detail:', error);

        }
    }
    const Update = async () => {
        try {
            const response = await fetch(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/Update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // cross cross-origin requests.
                credentials: 'include',
                body: JSON.stringify({ Data_id: Data_id, FaceImg: CUTIMG }),
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.find_result)
                if (Array.isArray(responseData.find_result)) {
                    setData(responseData.find_result);
                } else {
                    console.error('Response data is not an array:', responseData);
                }
            }
        } catch (error) {
            console.error('Error fetching member detail:', error);

        }
    }
    useEffect(() => {
        fetchDetail();
    }, [Data_id]); // Fetch member detail whenever pid changes

    return (
        <div class="mybackground">
            <div class="historypicture">
                <h1>Transaction Detail</h1>
                <Button style={{ display: 'flex', alignItems: 'center' }} variant="contained" size="large" onClick={FindPerson}>
                    FIND
                </Button>
                <Button style={{ display: 'flex', alignItems: 'center' }} variant="contained" size="large" onClick={Update}>
                    Update
                </Button>
                <div class="img1">
                    <img src={`data:image/jpeg;base64, ${FullIMG}`} alt="Full Image" />
                </div>
                <div class="img2">
                    <img src={`data:image/jpeg;base64, ${CUTIMG}`} alt="Full Image" />
                </div>
            </div>
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
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((filePath, index) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                    {/* <TableCell>{filePath}</TableCell> */}
                                    <TableCell>
                                        <img src={`data:image/jpeg;base64, ${filePath}`} style={{width:'500px'}} alt={`Full Image ${index}`} />
                                        {/* <Link to={`/Find/${filePath}`} style={{ color: "blue" }}>
                                            View Details
                                        </Link> */}
                                    </TableCell>
                                </TableRow>
                            ))}

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
        </div>
    )
}
