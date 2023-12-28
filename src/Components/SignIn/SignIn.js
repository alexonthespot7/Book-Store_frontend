import { useContext, useEffect, useState } from 'react';

import { Menu, MenuItem, Button, IconButton } from '@mui/material';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import useMediaQuery from '../../Hooks/useMediaQuery';
import AuthContext from '../../context/AuthContext';
import Login from './Login';
import Signup from './Signup';
import { useLocation } from 'react-router-dom';

export default function SignIn() {
    const [anchorMenu, setAnchorMenu] = useState(null);

    const { setCartDrawerOpen } = useContext(AuthContext);

    const location = useLocation();

    const openMenu = Boolean(anchorMenu);

    const matches1028px = useMediaQuery("(min-width: 1028px)");
    const matches870px = useMediaQuery("(min-width: 870px)");
    const matches450px = useMediaQuery("(min-width: 450px)");
    const matches300px = useMediaQuery("(min-width: 300px)");

    const gapBetweenLoginAndSignupButtons = matches1028px ? 8 : 0;

    const buttonSize = matches870px ? 'medium' : 'small';

    const handleClickMenu = (event) => {
        setAnchorMenu(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setAnchorMenu(null);
    }

    if (matches870px) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', gap: gapBetweenLoginAndSignupButtons }}>
                <div>
                    <Login buttonSize={buttonSize} />
                </div>
                <div>
                    <Signup buttonSize={buttonSize} />
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
                <Button sx={{ marginRight: matches300px ? 0 : -1 }} onClick={handleClickMenu} variant='text' endIcon={<ExitToAppIcon />} color='inherit'>
                    {matches450px && 'Sign in'}
                </Button>
                <Menu
                    anchorEl={anchorMenu}
                    id="account-menu"
                    open={openMenu}
                    onClose={handleCloseMenu}
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
                        <Login buttonSize={buttonSize} />
                    </MenuItem>
                    <MenuItem>
                        <Signup buttonSize={buttonSize} />
                    </MenuItem>
                </Menu>
                {location !== '/cart' &&
                    <IconButton size='small' onClick={() => setCartDrawerOpen(true)}>
                        <ShoppingCartOutlinedIcon color='thirdary' />
                    </IconButton>
                }
            </div>
        );
    }
}