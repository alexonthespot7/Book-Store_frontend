import { useContext, useState } from 'react';

import { Menu, MenuItem, Button, ListItemIcon, Divider, IconButton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import AuthContext from '../context/AuthContext';
import useMediaQuery from '../Hooks/useMediaQuery';

export default function Logout() {
    const [menuAnchor, setMenuAnchor] = useState(null);

    const { setCartDrawerOpen, setOpenSnackbar, setSnackbarMessage } = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    const openMenu = Boolean(menuAnchor);
    const username = sessionStorage.getItem('authorizedUsername');
    const userId = sessionStorage.getItem('authorizedId');

    const matches1700px = useMediaQuery("(min-width: 1700px)");
    const matches1400px = useMediaQuery("(min-width: 1400px)");
    const matches1228px = useMediaQuery("(min-width: 1228px)");
    const matches1028px = useMediaQuery("(min-width: 1028px)");
    const matches870px = useMediaQuery("(min-width: 870px)");
    const matches700px = useMediaQuery("(min-width: 700px)");
    const matches430px = useMediaQuery("(min-width: 430px)");

    const handleClickMenu = (event) => {
        setMenuAnchor(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    }

    const logout = () => {
        sessionStorage.clear();
        setOpenSnackbar(true);
        setSnackbarMessage('You\'ve just logged out');
        navigate('/');
    }

    // the function to decide if the username/email should be shown 
    // based on the length of the name and the screen width
    const showName = () => {
        if (username.length <= 7) {
            if (matches430px) {
                return true;
            } else {
                return false;
            }
        } else if (username.length <= 13) {
            if (matches700px) {
                return true;
            } else {
                return false;
            }
        } else if (username.length < 26) {
            if (matches1228px) {
                return true;
            } else {
                return false;
            }
        } else if (username.length < 32) {
            if (matches1400px) {
                return true;
            } else {
                return false;
            }
        } else {
            if (matches1700px) {
                return true;
            } else {
                return false;
            }
        }
    }
    const mainDivGap = matches1028px ? 8 : 0;
    const mainDivStyle = matches870px ? { display: 'flex', flexDirection: 'row', gap: mainDivGap } : {}
    const buttonSize = matches870px ? 'medium' : 'small';

    return (
        <div style={mainDivStyle}>
            {showName() &&
                <Button size={buttonSize} onClick={handleClickMenu} variant='text' startIcon={<AccountCircleIcon />} color='inherit'>
                    {username}
                </Button>
            }
            {!showName() && <IconButton size={buttonSize} onClick={handleClickMenu} color='thirdary'><AccountCircleIcon /></IconButton>}
            <Menu
                anchorEl={menuAnchor}
                id="account-menu"
                open={openMenu}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
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
                <MenuItem component={Link} to={`/users/${userId}`} >
                    <ListItemIcon style={{ marginRight: -10 }}>
                        <AccountBoxIcon fontSize='small' />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                {!matches870px && <Divider />}
                {!matches870px &&
                    <MenuItem onClick={logout} >
                        Logout
                        <ListItemIcon>
                            <LogoutIcon style={{ marginLeft: 5 }} fontSize='small' />
                        </ListItemIcon>
                    </MenuItem>
                }
            </Menu>
            {matches870px &&
                <Button onClick={logout} endIcon={<LogoutIcon />} color="inherit">
                    Logout
                </Button>
            }
            {location.pathname !== '/cart' &&
                <IconButton size={buttonSize} onClick={() => setCartDrawerOpen(true)}>
                    <ShoppingCartOutlinedIcon color='thirdary' />
                </IconButton>
            }
        </div >
    );
}



