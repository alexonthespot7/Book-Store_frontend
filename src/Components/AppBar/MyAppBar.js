import { IconButton, Toolbar, Typography } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';

import MenuIcon from '@mui/icons-material/Menu';

import { useNavigate } from 'react-router-dom';

import SearchOrder from '../SearchOrder';
import Logout from '../Logout';
import SignIn from '../SignIn/SignIn';

export default function MyAppBar({ matches400px, matches350px, menuDrawerOpen, setMenuDrawerOpen }) {
    const navigate = useNavigate();
    const authorized = sessionStorage.getItem('jwt') ? true : false;

    const barElementsHorizontalIndent = matches400px ? 25 : matches350px ? 20 : 5;
    const headerSize = matches400px ? 'h5' : 'h6';

    const handleDrawerOpen = () => {
        setMenuDrawerOpen(true);
    }

    return (
        <MuiAppBar position="fixed" sx={{ backgroundColor: 'black' }}>
            <Toolbar style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', left: barElementsHorizontalIndent, display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(menuDrawerOpen && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <SearchOrder />
                </div>
                <Typography onClick={() => navigate("/")} style={{ cursor: 'pointer' }} variant={headerSize} component="div">
                    Book Store
                </Typography>
                <div style={{ position: 'absolute', right: barElementsHorizontalIndent }}>
                    {authorized && <Logout />}
                    {!authorized && <SignIn />}
                </div>
            </Toolbar>
        </MuiAppBar>
    );
}