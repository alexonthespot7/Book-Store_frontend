import { DialogActions, DialogContent, IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import { useContext, useState } from "react";

import AuthContext from "../context/AuthContext";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';

import ResetPassword from "./ResetPassword";
import useMediaQuery from "../Hooks/useMediaQuery";

function Login({ open, setOpen, usernameError, setUsernameError,
    usernameHelper, setUsernameHelper, pwdError, setPwdError, pwdHelper, setPwdHelper,
    user, setUser }) {

    const [showPassword, setShowPassword] = useState(false);
    const [openReset, setOpenReset] = useState(false);
    const [emailInfo, setEmailInfo] = useState({
        email: ''
    });
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState('');

    const [progress, setProgress] = useState(false);

    const matches350 = useMediaQuery("(min-width: 350px)");

    const inputSize = matches350 ? 'medium' : 'small';

    const { setOpenSnackbar, setSnackbarMessage, dialogueWidth } = useContext(AuthContext);

    const inputChanged = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
        if (event.target.name === 'username') {
            setUsernameError(false);
            setUsernameHelper('');
        } else {
            setPwdError(false);
            setPwdHelper('');
        }
    }

    const loginUser = (creds) => {
        fetch(process.env.REACT_APP_API_URL + 'login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds)
        })
            .then(response => {
                if (response.ok) {
                    const jwtToken = response.headers.get('Authorization');
                    const localId = response.headers.get('Host');
                    if (jwtToken !== null) {
                        sessionStorage.setItem("jwt", jwtToken);
                        sessionStorage.setItem('authorizedId', localId);
                        const role = response.headers.get('Allow');
                        sessionStorage.setItem("role", role);
                        setUser({
                            username: '',
                            password: ''
                        });
                        setOpen(false);
                        sessionStorage.removeItem('cartId');
                        sessionStorage.removeItem('cartPass');
                        sessionStorage.setItem('authorizedUsername', creds.username);
                        setOpenSnackbar(true);
                        setSnackbarMessage('Login process went successfully');
                        if (sessionStorage.getItem('role') !== null && sessionStorage.getItem('authorizedUsername') !== null && sessionStorage.getItem('authorizedId') !== null) {
                            window.location.reload();
                        }
                    }
                } else if (response.status === 401) {
                    setProgress(false);
                    setUsernameError(true);
                    setUsernameHelper('Incorrect credentials');
                    setPwdError(true);
                    setPwdHelper('Incorrect credentials');
                } else if (response.status === 409) {
                    setProgress(false);
                    setUsernameError(true);
                    setUsernameHelper('Verify your email first');
                } else {
                    setProgress(false);
                    alert('Something went wrong');
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error: ' + err);
                setProgress(false);
            })
    }

    const login = () => {
        let check = true;

        if (user.username === '') {
            check = false;
            setUsernameError(true);
            setUsernameHelper('Username cannot be empty')
        }
        if (user.password === '') {
            check = false;
            setPwdError(true);
            setPwdHelper('Password cannot be empty');
        }

        if (check) {
            setProgress(true);
            loginUser(user);
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleReset = () => {
        setOpen(false);
        setEmailError(false);
        setEmailHelper('');
        setOpenReset(true);
        setEmailInfo({
            email: ''
        });
    }

    return (
        <div>
            {!progress && <Dialog style={{ margin: 'auto', width: '100%', height: '100%' }} open={open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        size={inputSize}
                        color="sidish"
                        fullWidth
                        value={user.username}
                        type='text'
                        margin='dense'
                        error={usernameError}
                        helperText={usernameHelper}
                        name='username'
                        label="Username or Email"
                        variant='outlined'
                        onChange={inputChanged}
                    />
                    <TextField
                        size={inputSize}
                        color="sidish"
                        fullWidth
                        value={user.password}
                        margin='dense'
                        error={pwdError}
                        helperText={pwdHelper}
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        label='Password'
                        variant='outlined'
                        onChange={inputChanged}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
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
                    <Button size='small' color='sidish' sx={{ "&:hover": { filter: 'brightness(40%)' }, transition: '0.45s' }} variant='outlined' onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>}
            {progress && <Dialog style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} open={open} onClose={handleClose} >
                <DialogTitle>Login</DialogTitle>
                <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: dialogueWidth, height: 300 }}>
                    <CircularProgress color='sidish' size={80} />
                </DialogContent>
            </Dialog>}
            <ResetPassword openReset={openReset} setOpenReset={setOpenReset} emailInfo={emailInfo} setEmailInfo={setEmailInfo}
                emailError={emailError} setEmailError={setEmailError} emailHelper={emailHelper} setEmailHelper={setEmailHelper} />
        </div>
    )
}

export default Login;