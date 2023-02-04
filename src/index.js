import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ContextProvider from './context/ContextProvider';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    thirdary: {
      main: '#fff',
      contrastText: '#000'
    },
    sidish: {
      main: '#000',
      contrastText: '#fff'
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ContextProvider>
  </React.StrictMode>
);

reportWebVitals();
