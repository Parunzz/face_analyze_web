import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

export default function Search({ setSelectedUser }) {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    axios.get(`http://${import.meta.env.VITE_SERVER_IP}/getMember`)
      .then(response => {
        setAllUsers(response.data.Member);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const handleSearch = (event, value) => {
    const selectedUser = allUsers.find(user => {
      return `${user.FirstName} ${user.LastName}` === value;
    });
    setSelectedUser(selectedUser);
  };

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id="free-solo-demo"
        options={allUsers.map(user => `${user.FirstName} ${user.LastName}`)}
        onInputChange={handleSearch}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
    </Stack>
  );
}
