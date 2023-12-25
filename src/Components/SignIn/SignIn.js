import React, { useContext, useState } from 'react';

import { Menu, MenuItem, Button, IconButton } from '@mui/material';

import LoginIcon from '@mui/icons-material/Login';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import Login from './Login';
import Signup from './Signup';

import useMediaQuery from '../../Hooks/useMediaQuery';
import AuthContext from '../../context/AuthContext';

export default function SignIn() {
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
    const [anchorEl, setAnchorEl] = React.useState(null);

    const { setCartDrawerOpen } = useContext(AuthContext);

    const openMenu = Boolean(anchorEl);

    const matches1028px = useMediaQuery("(min-width: 1028px)");
    const matches870px = useMediaQuery("(min-width: 870px)");
    const matches450px = useMediaQuery("(min-width: 450px)");
    const matches300px = useMediaQuery("(min-width: 300px)");

    const myGap = matches1028px ? 8 : 0;

    const loginButtonSize = matches870px ? 'medium' : 'small';

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
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

    if (matches870px) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', gap: myGap }}>
                <div>
                    <Login loginButtonSize={loginButtonSize} />
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
                    <IconButton size='small' onClick={() => setCartDrawerOpen(true)}>
                        <ShoppingCartOutlinedIcon color='thirdary' />
                    </IconButton>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button sx={{ marginRight: matches300px ? 0 : -1 }} onClick={handleClick} variant='text' endIcon={<ExitToAppIcon />} color='inherit'>
                    {matches450px && 'Sign in'}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openMenu}
                    onClose={handleClose}
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
                        <Login loginButtonSize={loginButtonSize} />
                    </MenuItem>
                    <MenuItem>
                        <Button size='small' onClick={handleClickOpenSignup} startIcon={<ExitToAppIcon />} color="inherit">
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
                    </MenuItem>
                </Menu>
                <IconButton size='small' onClick={() => setCartDrawerOpen(true)}>
                    <ShoppingCartOutlinedIcon color='thirdary' />
                </IconButton>

            </div>
        );
    }
}