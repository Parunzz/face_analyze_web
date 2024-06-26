import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import GenderInput from './GenderInput';
import MyDatePicker from './MyDatePicker';
import ImageUpload from './ImageUpload';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Cookies from 'js-cookie';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/">
                Analyze
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function AddMember() {

    const status = Cookies.get('status');
    const navigate = useNavigate();

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };
    const [loading, setLoading] = React.useState(false);
    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // formData.append('imgUpload', event.target.imgUpload.files[0]);
        const selectedFile = event.target.imgUpload.files[0];
        if (selectedFile) {
            // Read the selected file as a base64-encoded string
            const base64String = await readFileAsBase64(selectedFile);

            // Set the base64 string in FormData
            formData.set('imgUpload', base64String);
        }

        console.log({
            firstname: formData.get('firstName'),
            lastname: formData.get('lastName'),
            gender: formData.get('gender'),
            DateOfBirth: formData.get('mydate'),
            imgUpload: formData.get('imgUpload'),
        });
        //---------------------------------api -------------------------------------------

        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        try {
            const response = await fetch(`http://${import.meta.env.VITE_SERVER_IP}/AddMember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                console.log('Add member successfully');
                setLoading(false);
                window.alert(`Add member successfully`);
                navigate('/Members');
                // Handle success, e.g., redirect to a different page
            } else {
                setLoading(false);
                const errorData = await response.json();
                console.error('Failed to add member:', response);
                if (response.status === 400) {
                    window.alert('Member already exists');
                }
                window.alert('Error during add member');
            }
        } catch (error) {
            setLoading(false);
            // Handle error
            console.error('Error during add member:', error);


        }
        //---------------------------------api -------------------------------------------

    };

    useEffect(() => {
        if (status != 'true') {
            navigate('/SignIn');
        }
    }, []);
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Member
                    </Typography>
                    <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <GenderInput />
                            </Grid>
                            <Grid item xs={12}>
                                <MyDatePicker />
                            </Grid>
                            <Grid item xs={12}>
                                <ImageUpload />
                            </Grid>
                        </Grid>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            color="secondary"
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            <span>Save</span>
                        </LoadingButton>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/Members" variant="body2">
                                    Back
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}