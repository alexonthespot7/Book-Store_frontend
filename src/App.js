import './App.css';

import React, { forwardRef, useContext, useEffect } from 'react';

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
import MuiAlert from '@mui/material/Alert';

import { styled } from '@mui/material/styles';

import { Link } from 'react-router-dom';

import Myfooter from './Components/Myfooter';
import Logout from './Components/Logout';
import SignIn from './Components/SignIn';

import AuthContext from './context/AuthContext';

import useMediaQuery from './Hooks/useMediaQuery';
import BookRoutes from './Routes/BookRoutes';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

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

  const { authorize, setAuthorize, setAuthorizedUsername, signupMessage, signupSuccess, setSignupSuccess } = useContext(AuthContext);

  const matchesThird = useMediaQuery("(min-width: 400px)");

  const matchesFourth = useMediaQuery("(min-width: 350px)");

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
    } else {
      return '/userlist';
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

  const pages = sessionStorage.getItem('role') === 'ADMIN' ? ['Books', 'Categories', 'Users'] : ['Books'];

  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed">
          <Toolbar style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <IconButton
              style={{ position: 'absolute', left: myIndent - indentMinus }}
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant={typography} component="div">
              Book Store
            </Typography>
            <div style={{ position: 'absolute', right: myIndent - indentMinus }}>
              {authorize && <Logout logout={logout} />}
              {!authorize && <SignIn setAuthorizedSuccess={setAuthorizedSuccess} />}
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={drawerOpen}
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
                  {index === 0 && <MenuBookIcon />}
                  {index === 1 && <CategoryIcon />}
                  {index === 2 && <GroupIcon />}
                </ListItemIcon>
                <ListItemText primary={value} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} open={drawerOpen}>
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
    </div>

  );
}

export default App;
