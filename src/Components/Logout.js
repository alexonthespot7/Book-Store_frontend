import React, { useContext } from 'react';

import { Menu, MenuItem, Button, ListItemIcon, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import AuthContext from '../context/AuthContext';

import useMediaQuery from '../Hooks/useMediaQuery';
import { Link } from 'react-router-dom';

export default function Logout({ logout }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const { authorizedUsername } = useContext(AuthContext);

    const matchesFirst = useMediaQuery("(min-width: 1028px)");

    const matchesSecond = useMediaQuery("(min-width: 870px)");

    const myGap = matchesFirst ? 8 : 0;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (matchesSecond) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', gap: myGap }}>
                <Button onClick={handleClick} variant='text' startIcon={<AccountCircleIcon />} color='inherit'>
                    {authorizedUsername}
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
            </div>
        )
    } else {
        return (
            <div>
                <Button onClick={handleClick} variant='text' startIcon={<AccountCircleIcon />} color='inherit'>
                    {authorizedUsername}
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
            </div>
        )
    }
}



