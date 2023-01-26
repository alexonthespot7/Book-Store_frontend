import { useEffect, useState, useContext, forwardRef } from "react";

import { Button, IconButton, InputAdornment, Paper, TextField, Typography, useMediaQuery } from "@mui/material";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import AuthContext from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Profile() {
    const [user, setUser] = useState({
        id: '',
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        role: '',
        verificationCode: '',
        accountVerified: ''
    });

    const [passwordInfo, setPasswordInfo] = useState({
        username: sessionStorage.getItem('authorizedUsername'),
        oldPassword: '',
        newPassword: ''
    });

    const [passwordCheck, setPasswordCheck] = useState('');

    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [oldPasswordHelper, setOldPasswordHelper] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelper, setPasswordHelper] = useState('');
    const [open, setOpen] = useState(false);

    const [action, setAction] = useState(false);
    const [msg, setMsg] = useState('');
    const [type, setType] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showCheck, setShowCheck] = useState(false);
    const [showOld, setShowOld] = useState(false);

    const [possessor, setPossessor] = useState('Your');

    const matchesXSmall = useMediaQuery("(min-width: 300px)");

    const firstTypo = matchesXSmall ? 'h5' : 'h6';
    const secondTypo = matchesXSmall ? 'h6' : 'h7';

    const { dialogueWidth } = useContext(AuthContext);

    let { id } = useParams();

    const fetchUser = () => {
        const token = sessionStorage.getItem('jwt');

        fetch(process.env.REACT_APP_API_URL + 'users/' + id,
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }

    useEffect(() => {
        if (sessionStorage.getItem('authorizedUsername')) {
            fetchUser();
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
        setPasswordInfo({
            username: sessionStorage.getItem('authorizedUsername'),
            oldPassword: '',
            newPassword: ''
        });
        setOldPasswordError(false);
        setOldPasswordHelper('');
        setPasswordError(false);
        setPasswordHelper('');
        setPasswordCheck('');
    }

    const inputChanged = (event) => {
        if (event.target.name === 'passwordCheck') {
            setPasswordCheck(event.target.value);
        } else {
            setPasswordInfo({ ...passwordInfo, [event.target.name]: event.target.value });
        }
        if (event.target.name === 'passwordCheck') {
            setPasswordError(false);
            setPasswordHelper('');
        } else if (event.target.name === 'oldPassword') {
            setOldPasswordError(false);
            setOldPasswordHelper('');
        } else {
            setPasswordError(false);
            setPasswordHelper('');
        }
    }

    const changePassword = (passwordInfo) => {
        const token = sessionStorage.getItem('jwt');

        fetch(process.env.REACT_APP_API_URL + 'changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(passwordInfo)
        })
            .then(response => {
                if (response.ok) {
                    fetchUser();
                    setAction(true);
                    setMsg('Password was changed successfully');
                    setType('success');
                    setOpen(false);
                } else if (response.status === 409) {
                    setOldPasswordError(true);
                    setOldPasswordHelper('Old password is incorrect');
                } else {
                    setOpen(false);
                    setAction(true);
                    setMsg('You cannot change password at the moment');
                    setType('warning');
                }
            })
            .catch(err => console.error(err))
    }

    const handleSave = () => {
        let check = true;
        if (passwordInfo.oldPassword === '') {
            check = false;
            setOldPasswordError(true);
            setOldPasswordHelper('This field cannot be empty');
        }
        if (passwordInfo.newPassword === '') {
            check = false;
            setPasswordError(true);
            setPasswordHelper('Password cannot be empty');
        }
        if (passwordCheck !== passwordInfo.newPassword) {
            check = false;
            setPasswordError(true);
            setPasswordHelper('Password doesn\'t match');
        }

        if (check) {
            changePassword(passwordInfo);
            setPasswordInfo({
                username: sessionStorage.getItem('authorizedUsername'),
                oldPassword: '',
                newPassword: ''
            });
            setPasswordCheck('');
        }

    }

    const handleClickShowPassword = (info) => {
        if (info === 'new') {
            setShowPassword((show) => !show);
        } else if (info === 'check') {
            setShowCheck((show) => !show);
        } else {
            setShowOld((show) => !show);
        }
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '90%', gap: 50 }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Typography
                    variant={firstTypo}
                    style={{
                        background: "-webkit-linear-gradient(45deg, #03a9f4 40%, #1b5e20 90%)",
                        webkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {possessor} personal page
                </Typography>
            </div>
            <Typography variant={secondTypo} color='#01579b' style={{ marginBottom: -30 }}>{possessor} account information</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                    style={{ width: dialogueWidth }}
                    value={user.firstname}
                    type='text'
                    margin='dense'
                    name='firstname'
                    label="Firstname"
                    variant='outlined'
                />
                <TextField
                    style={{ width: dialogueWidth }}
                    value={user.lastname}
                    type='text'
                    margin='dense'
                    name='lastname'
                    label="Lastname"
                    variant='outlined'
                />
                <TextField
                    style={{ width: dialogueWidth }}
                    value={user.username}
                    type='text'
                    margin='dense'
                    name='username'
                    label="Username"
                    variant='outlined'
                />
                <TextField
                    style={{ width: dialogueWidth }}
                    value={user.email}
                    type='email'
                    margin='dense'
                    name='email'
                    label="Email"
                    variant='outlined'
                />
            </div>
            <div style={{ display: 'flex', marginTop: -40, justifyContent: 'center' }}>
                <Button onClick={handleOpen}>Change password</Button>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change password</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        type={showOld ? 'text' : 'password'}
                        error={oldPasswordError}
                        helperText={oldPasswordHelper}
                        margin="dense"
                        name="oldPassword"
                        value={passwordInfo.oldPassword}
                        onChange={inputChanged}
                        label="Old password"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleClickShowPassword('old')}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showOld ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        error={passwordError}
                        helperText={passwordHelper}
                        margin="dense"
                        name="newPassword"
                        value={passwordInfo.newPassword}
                        onChange={inputChanged}
                        label="Password"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleClickShowPassword('new')}
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
                        type={showCheck ? 'text' : 'password'}
                        error={passwordError}
                        helperText={passwordHelper}
                        margin="dense"
                        name="passwordCheck"
                        value={passwordCheck}
                        onChange={inputChanged}
                        label="Password Control"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleClickShowPassword('check')}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showCheck ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={action} autoHideDuration={3000} onClose={() => setAction(false)}>
                <Alert severity={type} onClose={() => setAction(false)} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Profile;