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

    const fetchAddBookToCartAuthenticated = async (bookId, quantity) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'additem/' + bookId, {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('jwt')
                },
                body: JSON.stringify({ quantity: quantity })
            });
            if (!response.ok) {
                setOpenSnackbar(true);
                setSnackbarMessage('Something is wrong with the server');
                return null;
            }
            setCartDrawerOpen(true);
            setOpenSnackbar(true);
            setSnackbarMessage('The book was added to your cart');
        } catch (error) {
            console.error(error);
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    const fetchCreateCartNoAuthentication = async (bookid) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'createbacket', {
                method: 'POST'
            });
            if (!response.ok) {
                setOpenSnackbar(true);
                setSnackbarMessage('Something is wrong with the server');
                return null;
            }
            response.json()
                .then(data => {
                    sessionStorage.setItem('cartId', data.id);
                    sessionStorage.setItem('cartPass', data.password);
                    fetchAddBookToCartNoAuthentication(bookid);
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    const handleBadResponseAddBookToCartNoAuth = (response) => {
        if ([400, 401, 404, 409].includes(response.status)) {
            sessionStorage.clear();
            setOpenSnackbar(true);
            setSnackbarMessage('Please try again');
        } else {
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    const fetchAddBookToCartNoAuthentication = async (bookid, quantity) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'addbook/' + sessionStorage.getItem('cartId'), {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: quantity, bookid: bookid, password: sessionStorage.getItem('cartPass') })
            });

            if (!response.ok) {
                handleBadResponseAddBookToCartNoAuth(response);
                return null;
            }
            setCartDrawerOpen(true);
            setOpenSnackbar(true);
            setSnackbarMessage('The book was added to your cart');
        } catch (error) {
            console.error(error);
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    const addBookToCartNoAuthentication = async (bookid, quantity) => {
        if (!sessionStorage.getItem('cartId')) {
            await fetchCreateCartNoAuthentication(bookid);
        } else {
            await fetchAddBookToCartNoAuthentication(bookid, quantity);
        }
    }

    const addBookToCart = async (bookid, quantity = 1) => {
        if (sessionStorage.getItem('jwt') !== null) {
            await fetchAddBookToCartAuthenticated(bookid, quantity);
            fetchIdsOfBooksInCartAuthenticated();
        } else {
            await addBookToCartNoAuthentication(bookid, quantity);
            fetchIdsOfBooksInCartNoAuth(sessionStorage.getItem('cartId'));
        }
    }

    const fetchBook = async (bookId, handleData) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'books/' + bookId);
            if (!response.ok) {
                alert('Something is wrong with the server');
                return null;
            }
            response.json()
                .then(data => {
                    handleData(data);
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
            alert('Something is wrong with the server');
        }
    }

    const fetchCategories = async (handleData) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'categories');
            if (!response.ok) {
                alert('Something is wrong with the server');
                return null;
            }
            response.json()
                .then(data => handleData(data))
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{
            currencyFormatter, openSnackbar, setOpenSnackbar, snackbarMessage, setSnackbarMessage,
            dialogueWidth, bgrColor, setBgrColor, cartDrawerOpen, setCartDrawerOpen,
            fetchIdsOfBooksInCartAuthenticated, idsOfBooksInCart, setIdsOfBooksInCart, fetchIdsOfBooksInCartNoAuth,
            resetAuthentication, addBookToCart, fetchBook, fetchCategories
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default ContextProvider;