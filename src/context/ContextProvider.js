import { useState } from "react";

import AuthContext from "./AuthContext";
import useMediaQuery from '../Hooks/useMediaQuery';

function ContextProvider(props) {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [bgrColor, setBgrColor] = useState('#FFFAFA');
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [idsOfBooksInCart, setIdsOfBooksInCart] = useState([]);

    const matches550px = useMediaQuery("(min-width: 550px)");
    const dialogueWidth = matches550px ? 419 : '86%';

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
    }

    const resetAuthentication = () => {
        sessionStorage.clear();
        setOpenSnackbar(true);
        setSnackbarMessage('Please login again to prove your identity');
    }

    const handleBadResponseBooksInCartAuth = (response) => {
        if (response.status === 500) {
            resetAuthentication();
        } else {
            sessionStorage.clear();
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    const fetchIdsOfBooksInCartAuthenticated = async () => {
        try {
            const token = sessionStorage.getItem('jwt');
            const response = await fetch(process.env.REACT_APP_API_URL + 'booksids',
                {
                    method: 'GET',
                    headers: { 'Authorization': token }
                });
            if (!response.ok) {
                handleBadResponseBooksInCartAuth(response);
                return null;
            }
            response.json()
                .then(data => setIdsOfBooksInCart(data))
                .catch(err => console.error(err));
        } catch (error) {
            sessionStorage.clear();
            console.error(error);
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    const handleBadResponseBooksInCartNoAuth = (response) => {
        if ([401, 404].includes(response.status)) {
            sessionStorage.clear();
        } else {
            sessionStorage.clear();
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    const fetchIdsOfBooksInCartNoAuth = async (backetid) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'booksids/' + backetid,
                {
                    method: 'GET'
                });
            if (!response.ok) {
                handleBadResponseBooksInCartNoAuth(response);
                return null;
            }
            response.json()
                .then(data => setIdsOfBooksInCart(data))
                .catch(err => console.error(err));
        } catch (error) {
            sessionStorage.clear();
            console.error(error);
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    return (
        <AuthContext.Provider value={{
            currencyFormatter, openSnackbar, setOpenSnackbar, snackbarMessage, setSnackbarMessage,
            dialogueWidth, bgrColor, setBgrColor, cartDrawerOpen, setCartDrawerOpen,
            fetchIdsOfBooksInCartAuthenticated, idsOfBooksInCart, setIdsOfBooksInCart, fetchIdsOfBooksInCartNoAuth,
            resetAuthentication
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default ContextProvider;