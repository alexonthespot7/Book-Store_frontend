import { IconButton, Toolbar, Typography } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';

import MenuIcon from '@mui/icons-material/Menu';

import { useNavigate } from 'react-router-dom';

import SearchOrder from '../SearchOrder';
import Logout from '../Logout';
import SignIn from '../SignIn';

export default function MyAppBar({
    matchesFirstSize, matchesSecondSize,
    menuDrawerOpen, setMenuDrawerOpen
}) {
    const navigate = useNavigate();

    const barElementsHorizontalIndent = matchesFirstSize ? 25 : matchesSecondSize ? 20 : 5;
    const headerSize = matchesFirstSize ? 'h5' : 'h6';

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
                    {sessionStorage.getItem('jwt') && <Logout />}
                    {!sessionStorage.getItem('jwt') && <SignIn />}
                </div>
            </Toolbar>
        </MuiAppBar>
    );
}