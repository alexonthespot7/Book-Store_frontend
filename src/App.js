import './App.css';

import React, { useContext, useEffect } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import Snackbar from '@mui/material/Snackbar';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import { styled } from '@mui/material/styles';

import { Link, useNavigate } from 'react-router-dom';

import Myfooter from './Components/Myfooter';
import Logout from './Components/Logout';
import SignIn from './Components/SignIn';

import AuthContext from './context/AuthContext';

import useMediaQuery from './Hooks/useMediaQuery';
import BookRoutes from './Routes/BookRoutes';
import { Button } from '@mui/material';
import CartMenu from './Components/CartMenu';
import SearchOrder from './Components/SearchOrder';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),

    marginLeft: 0,
  }),
);


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [authorizedSuccess, setAuthorizedSuccess] = React.useState(false);
  const [loggedout, setLoggedout] = React.useState(false);

  const { authorize, setAuthorize, setAuthorizedUsername, signupMessage, signupSuccess, setSignupSuccess, bgrColor, secondDrawerOpen, setSecondDrawerOpen } = useContext(AuthContext);

  const matchesThird = useMediaQuery("(min-width: 400px)");
  const matchesFourth = useMediaQuery("(min-width: 350px)");
  const matchesFifth = useMediaQuery("(min-width: 300px)");

  const secondDrawerWidth = matchesThird ? 350 : '100%';
  const myIndent = matchesThird ? 25 : 10;
  const typography = matchesFourth ? 'h5' : 'h6';
  const indentMinus = matchesFourth ? 0 : 5;


  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  }

  const setLink = (value) => {
    if (value === 'Books') {
      return '/';
    } else if (value === 'Categories') {
      return '/categories';
    } else if (value === 'Users') {
      return '/userlist';
    } else if (value === 'By Categories') {
      return '/bycategories';
    } else if (value === 'Orders') {
      return '/orders';
    }
  }

  useEffect(() => {
    setAuthorize(sessionStorage.getItem('role'));
    setAuthorizedUsername(sessionStorage.getItem('authorizedUsername'));
  }, []);

  const logout = () => {
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('jwt');
    setLoggedout(true);
    sessionStorage.removeItem('authorizedUsername');
    sessionStorage.removeItem('authorizedId')
    if (sessionStorage.getItem('role') === null && sessionStorage.getItem('authorizedUsername') === null && sessionStorage.getItem('authorizedId') === null) {
      window.location.reload();
    }
  }

  const adminPages = sessionStorage.getItem('role') === 'ADMIN' ? ['Categories', 'Users', 'Orders'] : [];
  const pages = ['Books', 'By Categories'];

  const navigate = useNavigate();

  return (
    <div className="App">
      <Box sx={{ display: 'flex' }} >
        <MuiAppBar position="fixed" sx={{ backgroundColor: 'black' }}>
          <Toolbar style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', left: myIndent - indentMinus, display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <SearchOrder />
            </div>
            <Typography onClick={() => navigate("/")} style={{ cursor: 'pointer' }} variant={typography} component="div">
              Book Store
            </Typography>
            <div style={{ position: 'absolute', right: myIndent - indentMinus }}>
              {authorize && <Logout logout={logout} />}
              {!authorize && <SignIn setAuthorizedSuccess={setAuthorizedSuccess} />}
            </div>
          </Toolbar>
        </MuiAppBar>
        <Drawer //first drawer - menu
          transitionDuration={500}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerClose}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {<ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {pages.map((value, index) => (
              <ListItem button onClick={handleDrawerClose} component={Link} to={setLink(value)} >
                <ListItemIcon>
                  {index === 0 && <MenuBookIcon color='sidish' />}
                  {index === 1 && <CategoryIcon color='sidish' />}
                </ListItemIcon>
                <ListItemText primary={value} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {adminPages.map((value, index) => (
              <ListItem button onClick={handleDrawerClose} component={Link} to={setLink(value)} >
                <ListItemIcon>
                  {index === 0 && <CategoryIcon color='sidish' />}
                  {index === 1 && <GroupIcon color='sidish' />}
                  {index === 2 && <MonetizationOnIcon color='sidish' />}
                </ListItemIcon>
                <ListItemText primary={value} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Drawer   //second drawer - cart
          transitionDuration={1000}
          sx={{
            width: secondDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: secondDrawerWidth,
              boxSizing: 'border-box',
            },
          }}
          anchor="right"
          open={secondDrawerOpen}
          onClose={() => setSecondDrawerOpen(false)}
        >
          <DrawerHeader sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button color='sidish' onClick={() => setSecondDrawerOpen(false)}>
              <ChevronLeftIcon color='sidish' />
              Continue Shopping
            </Button>
          </DrawerHeader>
          <Divider />
          <CartMenu />
        </Drawer>
        <Main style={{ display: 'flex', flexDirection: 'column', backgroundColor: bgrColor }} >
          <DrawerHeader />
          <BookRoutes />
          <Snackbar
            open={authorizedSuccess}
            autoHideDuration={3000}
            onClose={() => setAuthorizedSuccess(false)}
            message='Login process went successfully'
          />
          <Snackbar
            open={loggedout}
            autoHideDuration={3000}
            onClose={() => setLoggedout(false)}
            message='You logged out'
          />
          <Snackbar
            open={signupSuccess}
            autoHideDuration={3000}
            onClose={() => setSignupSuccess(false)}
            message={signupMessage}
          />
          <Snackbar
            open={signupSuccess}
            autoHideDuration={3000}
            onClose={() => setSignupSuccess(false)}
            message={signupMessage}
          />
        </Main>
      </Box>
      <Myfooter />
    </div >

  );
}

export default App;
