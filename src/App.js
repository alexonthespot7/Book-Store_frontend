import './App.css';

import React, { useContext, useEffect, useState } from 'react';

import { Box, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';

import AuthContext from './context/AuthContext';
import useMediaQuery from './Hooks/useMediaQuery';
import BookRoutes from './Routes/BookRoutes';
import MyAppBar from './Components/AppBar/MyAppBar';
import Myfooter from './Components/Myfooter';
import MenuDrawer from './Components/AppBar/MenuDrawer';
import CartMenuDrawer from './Components/AppBar/CartMenuDrawer';

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
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const { openSnackbar, setOpenSnackbar, snackbarMessage, bgrColor } = useContext(AuthContext);

  const matches400px = useMediaQuery("(min-width: 400px)");
  const matches350px = useMediaQuery("(min-width: 350px)");

  // useEffect(() => {
  //   sessionStorage.clear();
  // }, [])


  return (
    <div className="App">
      <Box sx={{ display: 'flex', minHeight: '75vh' }} >
        <MyAppBar
          matches400px={matches400px}
          matches350px={matches350px}
          menuDrawerOpen={menuDrawerOpen}
          setMenuDrawerOpen={setMenuDrawerOpen}
        />
        <MenuDrawer
          DrawerHeader={DrawerHeader}
          matches400px={matches400px}
          menuDrawerOpen={menuDrawerOpen}
          setMenuDrawerOpen={setMenuDrawerOpen}
        />
        <CartMenuDrawer
          DrawerHeader={DrawerHeader}
          matches400px={matches400px}
        />
        <Main style={{ display: 'flex', flexDirection: 'column', backgroundColor: bgrColor }} >
          <DrawerHeader />
          <BookRoutes />
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message={snackbarMessage}
          />
        </Main>
      </Box>
      <Myfooter />
    </div >
  );
}

export default App;
