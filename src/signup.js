import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';

export default function SignUp() {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [image, setImage] = useState({ preview: '', raw: '' });

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.files.length) {
            const selectedImage = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImage({
                    preview: reader.result,
                    raw: selectedImage,
                });
            };
            reader.readAsDataURL(selectedImage);
        }
    };


    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image.raw);
        try {
            await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (fullName && phoneNumber && email && password && image.preview) {

            if (!phoneNumber || phoneNumber.replace(/[^0-9]/g, '').length !== 10) {
                setPhoneNumberError(true);
                return;
            } else {
                setPhoneNumberError(false);
            }
            if (!password || password.length < 8) {
                setPasswordError(true);
                return;
            } else {
                setPasswordError(false);
            }

            try {

                let formData = {
                    fullName: fullName,
                    phoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
                    email: email,
                    password: password,
                    image: image?.preview
                }

                await axios.post('http://localhost:5000/users/signup', formData);
                setSignUpSuccess(true);

                console.log('Signup successful');
                navigate('/');
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred. Please try again.');
            }
        } else {
            alert('Please fill in all the fields');
        }
    };

    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    return (
        <div className='signup' >

            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{

                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        padding: '10px',
                        borderRadius: '8px',
                        boxShadow: 2,
                        marginLeft: -60,
                        marginRight: 60,
                        height: 850,
                        width: 400,

                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    {signUpSuccess ? (
                        <Typography component="p" variant="subtitle1" color="success">
                            Sign Up Successful!
                        </Typography>
                    ) : null}
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Grid item xs={12}>
                                <div>
                                    <label htmlFor="upload-button">
                                        {image.preview ? (
                                            <img src={image.preview} alt="dummy" width="300" height="300" />
                                        ) : (
                                            <>
                                                <span className="fa-stack fa-2x mt-3 mb-2">
                                                    <i className="fas fa-circle fa-stack-2x" />
                                                    <i className="fas fa-store fa-stack-1x fa-inverse" />
                                                </span>
                                                <h5 className="text-center">Upload your photo</h5>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        id="upload-button"
                                        style={{ display: 'none' }}
                                        onChange={handleChange}
                                    />
                                    <br />

                                </div>
                                <TextField
                                    autoComplete="name"
                                    name="fullName"
                                    required
                                    fullWidth
                                    id="fullName"
                                    label="Full Name"
                                    autoFocus
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </Grid>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    label="Phone Number"
                                    name="phoneNumber"
                                    autoComplete="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        const enteredValue = e.target.value;
                                        const onlyNumbers = enteredValue.replace(/[^0-9]/g, '');
                                        const formattedNumber = onlyNumbers.slice(0, 10);
                                        setPhoneNumber(formattedNumber);
                                    }}
                                    error={phoneNumberError}
                                    helperText={phoneNumberError ? 'Please enter a valid phone number' : ''}
                                />
                            </Grid>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={!isValidEmail(email)}
                                    helperText={isValidEmail(email) ? '' : 'Please enter a valid email address'}
                                />
                            </Grid>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={passwordError}
                                    helperText={passwordError ? 'Please enter a valid password' : ''}
                                />
                            </Grid>
                        </Box>

                        <Button type="submit" color="success" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/" variant="body2">
                                    Already have an account? Login in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}
