import { useState, useEffect } from 'react';
import * as React from 'react';
import Nav from './Nav'
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import ImgUpdate from './ImgUpdate';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import GenderInput from './GenderInput';
import MyDatePicker from './MyDatePicker';
import dayjs from 'dayjs';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const MemberDetail = () => {
    const { pid } = useParams();
    const [memberInfo, setMemberInfo] = useState(null);
    const [memberImages, setmemberImages] = useState(null);
    const [date, setDate] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };
    const fetchMemberDetail = async () => {
        try {
            const response = await fetch('http://localhost:3001/Memberdetail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // cross cross-origin requests.
                credentials: 'include',
                body: JSON.stringify({ pid: pid }),
            });
            if (response.ok) {
                const data = await response.json();
                // console.log(data.MemberDetail[0])
                // console.log(data.Base64Images)
                setMemberInfo(data.MemberDetail[0]);
                setmemberImages(data.Base64Images);
                const parsedDate = dayjs(data.MemberDetail[0].DateOfBirth, "ddd, DD MMM YYYY HH:mm:ss z");
                setDate(parsedDate)
            }
            else {
                console.log("Response Error")
                setMemberInfo(null);
            }

        } catch (error) {
            console.error('Error fetching member detail:', error);
        }
    };
    const RemoveMember = async () => {
        try {
            const response = await fetch('http://localhost:3001/removeMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // cross cross-origin requests.
                credentials: 'include',
                body: JSON.stringify({ pid: pid }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                navigate('/Members');
            }
            else {
                console.log("Response Error")
                setMemberInfo(null);
            }

        } catch (error) {
            console.error('Error fetching member detail:', error);
        }
    };
    const RemoveImg = async (imgPath) => {
        try {
            console.log(imgPath)
            const response = await fetch('http://localhost:3001/removeImg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // cross cross-origin requests.
                credentials: 'include',
                body: JSON.stringify({ imgPath: imgPath }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                window.location.reload();
            }
            else {
                console.log("Response Error")
                setMemberInfo(null);
            }

        } catch (error) {
            console.error('Error fetching member detail:', error);
        }
    };
    const defaultTheme = createTheme();
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

        const jsonData = {};
        formData.append('pid', pid);
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        try {
            const response = await fetch('http://localhost:3001/UpdateMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                window.alert(`Update member successfully`);
                // navigate('/Member');
                setLoading(false);
                window.location.reload();
                // Handle success, e.g., redirect to a different page
            } else {
                const errorData = await response.json();
                console.error('Failed to add member:', response);
                if (response.status === 400) {
                    window.alert('dont find your Member');
                }
                window.alert('Error during update member');
                setLoading(false);
            }
        } catch (error) {
            // Handle error
            console.error('Error during update member:', error);
            setLoading(false);

        }
    };
    useEffect(() => {
        fetchMemberDetail();
    }, [pid]); // Fetch member detail whenever pid changes

    return (

        <div>
            <div>
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            {memberInfo && date ? (
                                <div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                variant="standard"
                                                value={memberInfo.FirstName}
                                                autoComplete="given-name"
                                                name="firstName"
                                                fullWidth
                                                id="firstName"
                                                label="First Name"
                                                onChange={(event) => setMemberInfo({ ...memberInfo, FirstName: event.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                variant="standard"
                                                value={memberInfo.LastName}
                                                fullWidth
                                                id="lastName"
                                                label="Last Name"
                                                name="lastName"
                                                autoComplete="family-name"
                                                onChange={(event) => setMemberInfo({ ...memberInfo, LastName: event.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <GenderInput
                                                value={memberInfo.gender}
                                                onChange={(newValue) => setMemberInfo({ ...memberInfo, gender: newValue })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <MyDatePicker
                                                value={date.toDate()}
                                                onChange={(newValue) => (newValue)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <ImgUpdate />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button onClick={RemoveMember} variant="outlined" color="error">
                                                Remove Member
                                            </Button>
                                        </Grid>
                                        <Grid container item xs={12} sm={6} justifyContent="flex-end">
                                            <Grid item>
                                                <Link href="/Members" variant="body2" >
                                                    Back
                                                </Link>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button variant="contained" color="success">
                                                <Link href={`/Map/${pid}`} variant="body2" style={{ color: 'white' }}>
                                                    MAP
                                                </Link>
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
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
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            {memberImages && (
                                                <div>
                                                    <Typography component="h1" variant="h5">
                                                        Member Images
                                                    </Typography>
                                                    {Object.keys(memberImages).map((imgPath, index) => (
                                                        <div key={index}>
                                                            <Typography component="h1" variant="h8">
                                                                Image {index + 1}
                                                            </Typography>
                                                            <img width={500} src={`data:image/jpeg;base64,${memberImages[imgPath]}`} alt={`Image ${index + 1}`} />
                                                            <Button onClick={() => RemoveImg(imgPath)} variant="outlined" color="error">
                                                                Delete Image
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        </Grid>
                                    </Grid>
                                </div>
                            ) : (
                                <p>Loading member detail...</p>
                            )}
                        </Box>
                    </Container>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default MemberDetail