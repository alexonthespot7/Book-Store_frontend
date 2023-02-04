import React, { useContext, useState } from 'react';

import { Menu, MenuItem, Button, IconButton } from '@mui/material';

import LoginIcon from '@mui/icons-material/Login';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import Login from './Login';
import Signup from './Signup';

import useMediaQuery from '../Hooks/useMediaQuery';
import AuthContext from '../context/AuthContext';

export default function SignIn({ setAuthorizedSuccess }) {
    const [userSignup, setUserSignup] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
    });
    const [pwdCheck, setPwdCheck] = useState('');
    const [firstnameError, setFirstnameError] = useState(false);
    const [firstnameHelper, setFirstnameHelper] = useState('');
    const [lastnameError, setLastnameError] = useState(false);
    const [lastnameHelper, setLastnameHelper] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState('');
    const [usernameErrorSignup, setUsernameErrorSignup] = useState(false);
    const [usernameHelperSignup, setUsernameHelperSignup] = useState('');
    const [pwdErrorSignup, setPwdErrorSignup] = useState(false);
    const [pwdHelperSignup, setPwdHelperSignup] = useState('');
    const [openSignup, setOpenSignup] = useState(false);

    const [user, setUser] = useState({
        username: '',
        password: '',
    });
    const [open, setOpen] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [usernameHelper, setUsernameHelper] = useState('');
    const [pwdError, setPwdError] = useState(false);
    const [pwdHelper, setPwdHelper] = useState('');

    const { setSecondDrawerOpen } = useContext(AuthContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const matchesFirst = useMediaQuery("(min-width: 1028px)");

    const matchesSecond = useMediaQuery("(min-width: 870px)");

    const matchesFourth = useMediaQuery("(min-width: 450px)");

    const matchesFifth = useMediaQuery("(min-width: 300px)");

    const myGap = matchesFirst ? 8 : 0;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOpen = () => {
        setOpen(true);
        setUser({
            username: '',
            password: ''
        });
        setPwdError(false);
        setPwdHelper('');
        setUsernameError(false);
        setUsernameHelper('');
    }

    const handleClickOpenSignup = () => {
        setOpenSignup(true);
        setUserSignup({
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
        });
        setFirstnameError(false);
        setFirstnameHelper('');
        setLastnameError(false);
        setLastnameHelper('');
        setEmailError(false);
        setEmailHelper('');
        setPwdErrorSignup(false);
        setPwdHelperSignup('');
        setUsernameErrorSignup(false);
        setUsernameHelperSignup('');
        setPwdCheck('');
    }

    if (matchesSecond) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', gap: myGap }}>
                <div>
                    <Button size='medium' onClick={handleClickOpen} startIcon={<LoginIcon />} color="inherit">
                        Login
                    </Button>
                    <Login open={open} setOpen={setOpen} usernameError={usernameError}
                        setUsernameError={setUsernameError} usernameHelper={usernameHelper}
                        setUsernameHelper={setUsernameHelper} pwdError={pwdError}
                        setPwdError={setPwdError} pwdHelper={pwdHelper} setPwdHelper={setPwdHelper}
                        user={user} setUser={setUser} setAuthorizedSuccess={setAuthorizedSuccess}
                    />
                </div>
                <div>
                    <Button size='medium' onClick={handleClickOpenSignup} startIcon={<ExitToAppIcon />} color="inherit">
                        Sign up
                    </Button>
                    <Signup userSignup={userSignup} setUserSignup={setUserSignup} pwdCheck={pwdCheck}
                        setPwdCheck={setPwdCheck} firstnameError={firstnameError} setFirstnameError={setFirstnameError}
                        firstnameHelper={firstnameHelper} setFirstnameHelper={setFirstnameHelper} usernameErrorSignup={usernameErrorSignup}
                        lastnameError={lastnameError} setLastnameError={setLastnameError} lastnameHelper={lastnameHelper}
                        setLastnameHelper={setLastnameHelper} emailError={emailError} setEmailError={setEmailError}
                        emailHelper={emailHelper} setEmailHelper={setEmailHelper}
                        setUsernameErrorSignup={setUsernameErrorSignup} usernameHelperSignup={usernameHelperSignup}
                        setUsernameHelperSignup={setUsernameHelperSignup} pwdErrorSignup={pwdErrorSignup}
                        setPwdErrorSignup={setPwdErrorSignup} pwdHelperSignup={pwdHelperSignup}
                        setPwdHelperSignup={setPwdHelperSignup} openSignup={openSignup} setOpenSignup={setOpenSignup}
                    />
                </div>
                <div>
                    <IconButton size='small' onClick={() => setSecondDrawerOpen(true)}>
                        <ShoppingCartOutlinedIcon color='thirdary' />
                    </IconButton>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button sx={{ marginRight: matchesFifth ? 0 : -1 }} onClick={handleClick} variant='text' endIcon={<ExitToAppIcon />} color='inherit'>
                    {matchesFourth && 'Sign in'}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openMenu}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem>
                        <Button size='small' onClick={handleClickOpen} startIcon={<LoginIcon />} color="inherit">
                            Login
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button size='small' onClick={handleClickOpenSignup} startIcon={<ExitToAppIcon />} color="inherit">
                            Sign up
                        </Button>
                    </MenuItem>
                </Menu>
                <IconButton size='small' onClick={() => setSecondDrawerOpen(true)}>
                    <ShoppingCartOutlinedIcon color='thirdary' />
                </IconButton>
                <Login open={open} setOpen={setOpen} usernameError={usernameError}
                    setUsernameError={setUsernameError} usernameHelper={usernameHelper}
                    setUsernameHelper={setUsernameHelper} pwdError={pwdError}
                    setPwdError={setPwdError} pwdHelper={pwdHelper} setPwdHelper={setPwdHelper}
                    user={user} setUser={setUser} setAuthorizedSuccess={setAuthorizedSuccess}
                />
                <Signup userSignup={userSignup} setUserSignup={setUserSignup} pwdCheck={pwdCheck}
                    setPwdCheck={setPwdCheck} firstnameError={firstnameError} setFirstnameError={setFirstnameError}
                    firstnameHelper={firstnameHelper} setFirstnameHelper={setFirstnameHelper} usernameErrorSignup={usernameErrorSignup}
                    lastnameError={lastnameError} setLastnameError={setLastnameError} lastnameHelper={lastnameHelper}
                    setLastnameHelper={setLastnameHelper} emailError={emailError} setEmailError={setEmailError}
                    emailHelper={emailHelper} setEmailHelper={setEmailHelper}
                    setUsernameErrorSignup={setUsernameErrorSignup} usernameHelperSignup={usernameHelperSignup}
                    setUsernameHelperSignup={setUsernameHelperSignup} pwdErrorSignup={pwdErrorSignup}
                    setPwdErrorSignup={setPwdErrorSignup} pwdHelperSignup={pwdHelperSignup}
                    setPwdHelperSignup={setPwdHelperSignup} openSignup={openSignup} setOpenSignup={setOpenSignup}
                />
            </div>
        )
    }
}