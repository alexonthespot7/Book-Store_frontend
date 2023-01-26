import { useContext, useState } from "react";

import { CircularProgress, DialogActions, DialogContent, IconButton, InputAdornment, OutlinedInput, TextField } from "@mui/material";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { Visibility, VisibilityOff } from "@mui/icons-material";

import AuthContext from "../context/AuthContext";

function Signup({ userSignup, setUserSignup, pwdCheck, setPwdCheck, firstnameError, setFirstnameError,
    firstnameHelper, setFirstnameHelper, usernameErrorSignup, lastnameError, setLastnameError,
    lastnameHelper, setLastnameHelper, emailError, setEmailError, emailHelper, setEmailHelper,
    setUsernameErrorSignup, usernameHelperSignup, setUsernameHelperSignup, pwdErrorSignup,
    setPwdErrorSignup, pwdHelperSignup, setPwdHelperSignup, openSignup, setOpenSignup }) {

    const [showPassword, setShowPassword] = useState(false);
    const [progress, setProgress] = useState(false);

    const { setSignupMessage, setSignupSuccess, dialogueWidth } = useContext(AuthContext);

    const inputChanged = (event) => {
        if (event.target.name === 'pwdcheck') {
            setPwdCheck(event.target.value);
        } else {
            setUserSignup({ ...userSignup, [event.target.name]: event.target.value });
        }
        if (event.target.name === 'username') {
            setUsernameErrorSignup(false);
            setUsernameHelperSignup('');
        }
        if (event.target.name === 'password') {
            setPwdErrorSignup(false);
            setPwdHelperSignup('');
        }
        if (event.target.name === 'firstname') {
            setFirstnameError(false);
            setFirstnameHelper('');
        }
        if (event.target.name === 'lastname') {
            setLastnameError(false);
            setLastnameHelper('');
        }
        if (event.target.name === 'email') {
            setEmailError(false);
            setEmailHelper('');
        }
    }

    const signupUser = (creds) => {
        fetch(process.env.REACT_APP_API_URL + 'signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds)
        })
            .then(response => {
                if (response.ok) {
                    setUserSignup({
                        firstname: '',
                        lastname: '',
                        username: '',
                        email: '',
                        password: '',
                    });
                    setProgress(false);
                    setSignupSuccess(true);
                    setSignupMessage('The verification link has been sent to your email');
                    setOpenSignup(false);
                } else if (response.status === 409) {
                    setProgress(false);
                    setUsernameErrorSignup(true);
                    setUsernameHelperSignup('Username is already in use');
                } else if (response.status === 406) {
                    setProgress(false);
                    setEmailError(true);
                    setEmailHelper('Email is already in use');
                } else {
                    setProgress(false);
                    alert('Cannot add user right now');
                }
            })
            .catch(err => {
                console.error(err);
                setProgress(false);
                alert(`Error: ${err}`);
            })
    }

    const signup = () => {
        let check = true;

        if (userSignup.username === '') {
            check = false;
            setUsernameErrorSignup(true);
            setUsernameHelperSignup('Username cannot be empty')
        }
        if (userSignup.password === '') {
            check = false;
            setPwdErrorSignup(true);
            setPwdHelperSignup('Password cannot be empty');
        }
        if (userSignup.password !== pwdCheck) {
            check = false;
            setPwdErrorSignup(true);
            setPwdHelperSignup('Password doesn\'t match');
        }
        if (userSignup.firstname === '') {
            check = false;
            setFirstnameError(true);
            setFirstnameHelper('Firstname cannot be empty');
        }
        if (userSignup.lastname === '') {
            check = false;
            setLastnameError(true);
            setLastnameHelper('Lastname cannot be empty');
        }
        if (userSignup.email === '') {
            check = false;
            setEmailError(true);
            setEmailHelper('Email cannot be empty');
        }

        if (check) {
            setProgress(true)
            signupUser(userSignup);
            setPwdCheck('');
        }
    }

    const handleClose = () => {
        setOpenSignup(false);
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            {!progress && <Dialog open={openSignup} onClose={handleClose}>
                <DialogTitle>Sign up</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        style={{ width: dialogueWidth }}
                        value={userSignup.firstname}
                        type='text'
                        margin='dense'
                        error={firstnameError}
                        helperText={firstnameHelper}
                        name='firstname'
                        label="Firstname"
                        variant='outlined'
                        onChange={inputChanged}
                    />
                    <TextField
                        style={{ width: dialogueWidth }}
                        value={userSignup.lastname}
                        type='text'
                        margin='dense'
                        error={lastnameError}
                        helperText={lastnameHelper}
                        name='lastname'
                        label="Lastname"
                        variant='outlined'
                        onChange={inputChanged}
                    />
                    <TextField
                        style={{ width: dialogueWidth }}
                        value={userSignup.username}
                        type='text'
                        margin='dense'
                        error={usernameErrorSignup}
                        helperText={usernameHelperSignup}
                        name='username'
                        label="Username"
                        variant='outlined'
                        onChange={inputChanged}
                    />
                    <TextField
                        style={{ width: dialogueWidth }}
                        value={userSignup.email}
                        type='email'
                        margin='dense'
                        error={emailError}
                        helperText={emailHelper}
                        name='email'
                        label="Email"
                        variant='outlined'
                        onChange={inputChanged}
                    />
                    <TextField
                        style={{ width: dialogueWidth }}
                        value={userSignup.password}
                        margin='dense'
                        error={pwdErrorSignup}
                        helperText={pwdHelperSignup}
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
                    <TextField
                        style={{ width: dialogueWidth }}
                        value={pwdCheck}
                        margin='dense'
                        error={pwdErrorSignup}
                        helperText={pwdHelperSignup}
                        name='pwdcheck'
                        label='Password control'
                        variant='outlined'
                        onChange={inputChanged}
                        type={showPassword ? 'text' : 'password'}
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
                <DialogActions>
                    <Button color='primary' variant='outlined' onClick={signup}>Sign up</Button>
                    <Button color='primary' variant='outlined' onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>}
            {progress && <Dialog style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} open={openSignup} onClose={handleClose} >
                <DialogTitle>Sign up</DialogTitle>
                <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: dialogueWidth, height: 300 }}>
                    <CircularProgress size={80} />
                </DialogContent>
            </Dialog>}
        </div>

    )
}

export default Signup;