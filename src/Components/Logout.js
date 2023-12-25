import React, { useContext } from 'react';

import { Menu, MenuItem, Button, ListItemIcon, Divider, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import AuthContext from '../context/AuthContext';

import useMediaQuery from '../Hooks/useMediaQuery';
import { Link, useNavigate } from 'react-router-dom';

export default function Logout() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const { setCartDrawerOpen, setOpenSnackbar, setSnackbarMessage } = useContext(AuthContext);

    const navigate = useNavigate();

    const openMenu = Boolean(anchorEl);
    const username = sessionStorage.getItem('authorizedUsername');

    const matchesXXL = useMediaQuery("(min-width: 1700px)");
    const matchesXL = useMediaQuery("(min-width: 1400px)");
    const matchesL = useMediaQuery("(min-width: 1228px)");
    const matchesFirst = useMediaQuery("(min-width: 1028px)");
    const matchesSecond = useMediaQuery("(min-width: 870px)");
    const matchesM = useMediaQuery("(min-width: 700px)");
    const matchesThird = useMediaQuery("(min-width: 430px)");

    const myGap = matchesFirst ? 8 : 0;

    const marginSmall = matchesThird ? 0 : -3

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('jwt');
        sessionStorage.removeItem('authorizedUsername');
        sessionStorage.removeItem('authorizedId');
        setOpenSnackbar(true);
        setSnackbarMessage('You\'ve just logged out');
        navigate('/');
    }

    const showName = () => {
        if (username.length <= 7) {
            if (matchesThird) {
                return true;
            } else {
                return false;
            }
        } else if (username.length <= 13) {
            if (matchesM) {
                return true;
            } else {
                return false;
            }
        } else if (username.length < 26) {
            if (matchesL) {
                return true;
            } else {
                return false;
            }
        } else if (username.length < 32) {
            if (matchesXL) {
                return true;
            } else {
                return false;
            }
        } else {
            if (matchesXXL) {
                return true;
            } else {
                return false;
            }
        }
    }

    if (matchesSecond) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', gap: myGap }}>
                {showName() && <Button onClick={handleClick} variant='text' startIcon={<AccountCircleIcon />} color='inherit'>
                    {username}
                </Button>}
                {!showName() && <IconButton onClick={handleClick} color='thirdary'><AccountCircleIcon /></IconButton>}
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
                    <MenuItem button component={Link} to={`/users/${sessionStorage.getItem('authorizedId')}`} >
                        <ListItemIcon style={{ marginRight: -10 }}>
                            <AccountBoxIcon fontSize="small" />
                        </ListItemIcon>
                        Profile
                    </MenuItem>
                </Menu>
                <Button onClick={logout} endIcon={<LogoutIcon />} color="inherit">
                    Logout
                </Button>
                <IconButton onClick={() => setCartDrawerOpen(true)}>
                    <ShoppingCartOutlinedIcon color='thirdary' />
                </IconButton>
            </div >
        )
    } else {
        return (
            <div>
                {matchesThird && showName() && <Button size='small' sx={{ marginRight: !showName() ? 0 : marginSmall }} onClick={handleClick} variant='text' startIcon={<AccountCircleIcon />} color='inherit'>
                    {username}
                </Button>}
                {!(matchesThird && showName()) && <IconButton size="small" sx={{ marginRight: !showName() ? 0 : marginSmall }} onClick={handleClick} color='thirdary'><AccountCircleIcon /></IconButton>}
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
                    <MenuItem button component={Link} to={`/users/${sessionStorage.getItem('authorizedId')}`} >
                        <ListItemIcon style={{ marginRight: -10 }}>
                            <AccountBoxIcon fontSize="small" />
                        </ListItemIcon>
                        Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem button onClick={logout} >
                        Logout
                        <ListItemIcon>
                            <LogoutIcon style={{ marginLeft: 5 }} fontSize="small" />
                        </ListItemIcon>
                    </MenuItem>
                </Menu>
                <IconButton size='small' onClick={() => setCartDrawerOpen(true)}>
                    <ShoppingCartOutlinedIcon color='thirdary' />
                </IconButton>
            </div>
        )
    }
}



