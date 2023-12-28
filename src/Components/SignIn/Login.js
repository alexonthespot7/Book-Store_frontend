import { useContext, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Paper, TextField } from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginIcon from '@mui/icons-material/Login';

import { useNavigate } from "react-router";

import AuthContext from "../../context/AuthContext";
import useMediaQuery from "../../Hooks/useMediaQuery";
import ResetPassword from "./ResetPassword";
import LoadingDialog from "../LoadingDialog";

const initialUser = {
    username: '',
    password: '',
}

const initialIsError = {
    username: false,
    password: false,
}

function Login({ buttonSize }) {
    const [user, setUser] = useState(initialUser);
    const [isError, setIsError] = useState(initialIsError);
    const [errorText, setErrorText] = useState(initialUser);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [openReset, setOpenReset] = useState(false);
    const [loading, setLoading] = useState(false);

    const { setOpenSnackbar, setSnackbarMessage } = useContext(AuthContext);

    const navigate = useNavigate();

    const matches350px = useMediaQuery("(min-width: 350px)");
    const inputSize = matches350px ? 'medium' : 'small';

    const inputChanged = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
        setIsError({ ...isError, [event.target.name]: false });
        setErrorText({ ...errorText, [event.target.name]: '' });
    }

    const handleBadResponse = (response) => {
        if (response.status === 404) {
            setLoading(false);
            setIsError({ ...isError, username: true });
            setErrorText({ ...errorText, username: 'Wrong username/email' });
        } else if (response.status === 409) {
            setLoading(false);
            setOpenSnackbar(true);
            setSnackbarMessage('Please verify your account first');
        } else if (response.status === 401) {
            setLoading(false);
            setIsError({ ...isError, password: true });
            setErrorText({ ...errorText, password: 'The password is wrong' });
        } else {
            alert('Something is wrong with the server');
        }
    }

    const handleGoodResponse = (response) => {
        sessionStorage.clear();
        const jwtToken = response.headers.get('Authorization');
        const authenticatedId = response.headers.get('Host');
        const role = response.headers.get('Allow');
        sessionStorage.setItem("jwt", jwtToken);
        sessionStorage.setItem('authorizedId', authenticatedId);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem('authorizedUsername', user.username);
        setUser(initialUser);
        setOpenLoginDialog(false);
        setOpenSnackbar(true);
        setSnackbarMessage('Login process went successfully');
        navigate('/');
    }

    const fetchLoginUser = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            if (!response.ok) {
                handleBadResponse(response);
                return null;
            }

            handleGoodResponse(response);
        } catch (error) {
            console.error(error);
            alert('Something is wrong with the server');
        }
    }

    const login = () => {
        for (const field of Object.keys(user)) {
            if (user[field] === '') {
                setIsError({ ...isError, [field]: true });
                setErrorText({ ...errorText, [field]: `${field} is mandatory` });
                return null;
            }
        }
        setIsError(initialIsError);
        setErrorText(initialUser);
        setLoading(true);
        fetchLoginUser();
    }

    const closeLoginDialog = () => {
        setOpenLoginDialog(false);
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleReset = () => {
        setOpenLoginDialog(false);
        setOpenReset(true);
    }

    const handleOpenLoginDialog = () => {
        setOpenLoginDialog(true);
        setUser(initialUser);
        setIsError(initialIsError);
        setErrorText(initialUser);
        setShowPassword(false);
    }

    return (
        <div>
            <Button size={buttonSize} onClick={handleOpenLoginDialog} startIcon={<LoginIcon />} color="inherit">
                Login
            </Button>
            {!loading &&
                <Dialog
                    style={{ margin: 'auto', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    open={openLoginDialog}
                    onClose={closeLoginDialog}
                >
                    <DialogTitle>Login</DialogTitle>
                    <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            size={inputSize}
                            color='sidish'
                            fullWidth
                            value={user.username}
                            type='text'
                            margin='dense'
                            error={isError.username}
                            helperText={errorText.username}
                            name='username'
                            label='Username or Email'
                            variant='outlined'
                            onChange={inputChanged}
                        />
                        <TextField
                            size={inputSize}
                            color='sidish'
                            fullWidth
                            value={user.password}
                            margin='dense'
                            error={isError.password}
                            helperText={errorText.password}
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            label='Password'
                            variant='outlined'
                            onChange={inputChanged}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            edge='end'
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContent>
                    <DialogActions style={{ marginTop: -20 }}>
                        <Button size='small' color='sidish' variant="text" onClick={handleReset}>forgot password?</Button>
                        <Button size="small" color='sidish' sx={{ color: 'white', "&:hover": { filter: 'brightness(50%)', backgroundColor: '#303030' }, transition: '0.45s' }} variant='contained' onClick={login}>Login</Button>
                        <Button size='small' color='sidish' sx={{ "&:hover": { filter: 'brightness(40%)' }, transition: '0.45s' }} variant='outlined' onClick={closeLoginDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            }
            {loading && <LoadingDialog title='Login' open={openLoginDialog} onClose={closeLoginDialog} />}
            <ResetPassword openReset={openReset} setOpenReset={setOpenReset} />
        </div>
    )
}

export default Login;