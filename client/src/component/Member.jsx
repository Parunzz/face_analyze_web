import React from 'react'
import Nav from './Nav'
import Search from './Search'
import { Box, Container } from '@mui/system';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function Member() {
    return (
        <div>
            <Nav/>
            <Container maxWidth="lg">
                <Box sx={{ p:2 ,bgcolor: 'white',display: 'flex',alignItems: 'space-between', justifyContent: 'space-between'}} >
                    <h1 style={{paddingBottom: 30}}>Member</h1>
                    <Fab color="primary" aria-label="add" href='AddMember'>
                        <AddIcon />
                    </Fab>
                </Box>
                <Search/>

            </Container>

        </div>
  )
}

export default Member       