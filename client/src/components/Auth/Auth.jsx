import { useState } from 'react';
import { Alert, Button, Grid, Typography, Container } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { StyledPaper, StyledAvatar, StyledForm, StyledSubmitButton } from './styles';
import Input from './Input';
import { signin, signup, googleSignin } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

export const Auth = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleShowPassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isSignup && formData.password !== formData.confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        if (isSignup) {
            dispatch(signup(formData, navigate, setError));
        } else {
            dispatch(signin(formData, navigate, setError));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchMode = () => {
        setIsSignup((prev) => !prev);
        setShowPassword(false);
        setFormData(initialState);
        setError('');
    };

    const handleGoogleSuccess = (credentialResponse) => {
        setError('');
        dispatch(googleSignin(credentialResponse.credential, navigate, setError));
    };

    const handleGoogleError = () => {
        setError('Google sign in failed.');
    };

    return (
        <Container component="main" maxWidth="xs">
            <StyledPaper elevation={3}>
                <StyledAvatar>
                    <LockOutlinedIcon />
                </StyledAvatar>
                <Typography variant="h5">
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ width: '100%', marginTop: 2 }}>
                        {error}
                    </Alert>
                )}
                <StyledForm onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignup && (
                            <>
                                <Input name="firstName" label="First Name" value={formData.firstName} handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Last Name" value={formData.lastName} handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" value={formData.email} handleChange={handleChange} type="email" />
                        <Input
                            name="password"
                            label="Password"
                            value={formData.password}
                            handleChange={handleChange}
                            type={showPassword ? 'text' : 'password'}
                            handleShowPassword={handleShowPassword}
                            isPassword
                        />
                        {isSignup && (
                            <Input
                                name="confirmPassword"
                                label="Confirm Password"
                                value={formData.confirmPassword}
                                handleChange={handleChange}
                                type="password"
                            />
                        )}
                    </Grid>
                    <StyledSubmitButton type="submit" fullWidth variant="contained" color="primary">
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </StyledSubmitButton>
                    <Grid container sx={{ justifyContent: 'center', marginTop: 2, marginBottom: 1 }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            width="350"
                            useOneTap={false}
                            auto_select={false}
                        />
                    </Grid>
                    <Grid container sx={{ justifyContent: 'flex-end' }}>
                        <Grid>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                            </Button>
                        </Grid>
                    </Grid>
                </StyledForm>
            </StyledPaper>
        </Container>
    )
}
