import { useState, useEffect, useContext } from "react";

import { Button, CardActionArea, CircularProgress, Divider, IconButton, Paper, Typography } from "@mui/material";

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import useMediaQuery from "../Hooks/useMediaQuery";
import BookDialog from "./BookDialog";

const firstDiv = { transition: '0.45s', display: 'flex', justifyContent: 'flex-start', gap: 10, marginLeft: 30, marginRight: 30 }
const imgCart = { height: 176, width: 117, border: '0.5px solid #D3D3D3', borderRadius: 2, backgroundColor: '#F8F8F8', display: 'flex', justifyContent: 'center', alignContent: 'center', "&:hover": { filter: 'brightness(90%)' }, transition: '0.45s' }
const secondDiv = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }
const thirdDiv = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: 8, marginTop: 16 }

const buttonStyle = {
    transition: '0.4s',
    borderRadius: '25px 25px 25px 25px',
    marginBottom: 2.5,
    width: 200, height: 40,
    backgroundColor: 'black',
    color: 'white',
    fontFamily: 'serif',
    "&:hover": { backgroundColor: '#585858' }
}

function CartMenu() {
    const [quantityChanges, setQuantityChanges] = useState(false);
    const [infoLoaded, setInfoLoaded] = useState(false);
    const [total, setTotal] = useState(0);
    const [booksInCart, setBooksInCart] = useState([]);
    const [bookInCart, setBookInCart] = useState(null);
    const [openInCart, setOpenInCart] = useState(false);

    const { currencyFormatter, setOpenSnackbar, setSnackbarMessage, setCartDrawerOpen, fetchIdsOfBooksInCart, addBookToCart, fetchBook, fetchCart } = useContext(AuthContext);

    const navigate = useNavigate();

    const matches310px = useMediaQuery("(min-width: 310px)");
    const matches305px = useMediaQuery("(min-width: 305px)");
    const matches300px = useMediaQuery("(min-width: 300px)");

    const handleTotal = (totalData) => {
        setTotal(totalData);
        setInfoLoaded(true);
    }

    const handleBadResponse = () => {
        setCartDrawerOpen(false);
        navigate('/');
    }

    useEffect(() => {
        fetchCart(setBooksInCart, handleTotal, handleBadResponse);
    }, []);

    const deleteBookNoAuthentication = async (id) => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'deletebook/' + id,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: backetId, password: password })
                });
            if (!response.ok) {
                handleBadResponse();
                return null;
            }
            setOpenSnackbar(true);
            setSnackbarMessage('Book was deleted from your cart');
        } catch (error) {
            console.error(error);
        }
    }

    const deleteBookAuthenticated = async (id) => {
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'deleteitem/' + id,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                });
            if (!response.ok) {
                handleBadResponse();
                return null;
            }
            setOpenSnackbar(true);
            setSnackbarMessage('Book was deleted from your cart');
        } catch (error) {
            console.error(error);
        }
    }

    const deleteBookFromCart = async (id) => {
        setInfoLoaded(false);
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            await deleteBookAuthenticated(id);
        } else if (sessionStorage.getItem('cartId')) {
            await deleteBookNoAuthentication(id);
        }
        await fetchIdsOfBooksInCart();
        await fetchCart(setBooksInCart, handleTotal, handleBadResponse);
    }

    const fetchReduceQuantityAuthentication = async (id) => {
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'reduceitem/' + id, {
                method: 'PUT',
                headers:
                {
                    'Authorization': token
                }
            });
            if (!response.ok) {
                handleBadResponse();
                return null;
            }
            setOpenSnackbar(true);
            setSnackbarMessage('Book in your cart was changed');
        } catch (error) {
            console.error(error);
        }
    }

    const fetchReduceQuantityNoAuthentication = async (id) => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'reduceitemnoauth/' + id, {
                method: 'PUT',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: backetId, password: password })
            });
            if (!response.ok) {
                handleBadResponse();
                return null;
            }
            setOpenSnackbar(true);
            setSnackbarMessage('Book in your cart was changed');
        } catch (error) {
            console.log(error);
        }
    }

    const fetchReduceQuantity = async (id) => {
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            await fetchReduceQuantityAuthentication(id);
        } else if (sessionStorage.getItem('cartId') !== null) {
            await fetchReduceQuantityNoAuthentication(id);
        }
    }

    const changeQuantity = async (id, operation) => {
        if (!quantityChanges) {
            setQuantityChanges(true);
            if (operation === '+') {
                await addBookToCart(id, 1);
            } else {
                await fetchReduceQuantity(id);
                await fetchIdsOfBooksInCart();
            }
            await fetchCart(setBooksInCart, handleTotal, handleBadResponse);
            setQuantityChanges(false);
        }
    }

    const openBookInCart = async (bookId) => {
        await fetchBook(bookId, setBookInCart);
        setOpenInCart(true);
    }

    const defineAuthorTitleSize = () => {
        if (matches310px) {
            return 16;
        } else if (matches305px) {
            return 14;
        } else {
            return 12;
        }
    }
    const authorTitleSize = defineAuthorTitleSize();

    const myDir = matches300px ? 'row' : 'column';
    const myWidth = matches300px ? 30 : 60;
    const defaultFont = matches310px ? 16 : 14;

    const books = booksInCart.map((book, index) =>
        <div key={index} style={firstDiv}>
            <div>
                <IconButton onClick={() => deleteBookFromCart(book.bookid)} size='small' sx={{ marginBottom: -2.5, zIndex: 4, marginLeft: -1.5 }}>
                    <CancelOutlinedIcon fontSize="small" color="sidish" />
                </IconButton>
                <CardActionArea onClick={() => openBookInCart(book.bookid)} sx={imgCart}>
                    <img width={100} height={150} src={book.url} alt={book.title}></img>
                </CardActionArea>
            </div>
            <div style={secondDiv}>
                <Typography fontSize={authorTitleSize} maxWidth={190} >{book.author}</Typography>
                <Typography fontSize={authorTitleSize} maxWidth={190} >{book.title}</Typography>
                <div>
                    <Typography variant='h7' fontSize={defaultFont} fontFamily='serif' color='#A9A9A9'>Quantity:</Typography>
                    <div style={{ display: 'flex', marginTop: 2, flexDirection: myDir }}>
                        <Typography align="center" variant='h7' sx={{ width: myWidth }}>{book.quantity}</Typography>
                        {matches300px && <Divider orientation="vertical" flexItem sx={{ border: '1px solid #D3D3D3', height: 15, marginTop: 0.5, marginLeft: 1 }} />}
                        <div style={{ marginTop: -0.5, marginLeft: 2 }}>
                            <IconButton onClick={() => changeQuantity(book.bookid, '+')} size='small' >
                                <AddIcon fontSize="inherit" color="sidish" />
                            </IconButton>
                            <IconButton onClick={() => changeQuantity(book.bookid, '-')} size='small' >
                                <RemoveIcon fontSize="inherit" color="sidish" />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div>
                    <Typography fontSize={defaultFont} variant='h7' fontFamily='serif' color='#A9A9A9'>Total:</Typography>
                    <div style={{ display: 'flex', marginTop: 2 }}>
                        <Typography align="center" variant='h7' sx={{ width: 30 }}>{currencyFormatter(book.quantity * book.price, '€')}</Typography>
                    </div>
                </div>
            </div>
        </div>
    );

    const checkout = () => {
        if (total === 0) {
            setOpenSnackbar(true);
            setSnackbarMessage('There are no products in the cart');
        } else {
            setCartDrawerOpen(false);
            navigate('/cart');
        }
    }

    const myPurchaseSize = matches310px ? 30 : 24;

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={thirdDiv}>
                <Typography sx={{ fontFamily: 'serif', fontSize: myPurchaseSize }} color='sidish'>My purchases</Typography>
                <Divider sx={{ width: '30%', border: '2px solid black', marginTop: 0.5 }} />
            </div>
            {infoLoaded &&
                <div>
                    <div>
                        {books}
                    </div>
                    <Divider sx={{ border: '1px solid black', marginBottom: 4, marginTop: 4 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 20, marginRight: 20 }}>
                        <Typography variant='h7' fontFamily='serif' color='#A9A9A9'>TOTAL DUE:</Typography>
                        <Typography fontWeight='bold' fontSize={18} sx={{ marginTop: -0.5 }}>{currencyFormatter(total, '€')}</Typography>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                        <Button onClick={checkout} endIcon={<ShoppingCartCheckoutIcon />} sx={buttonStyle} component={Paper} elevation={10} >
                            Checkout
                        </Button>
                    </div>
                    <BookDialog additionalBook={bookInCart} setAdditionalBook={setBookInCart} openAdditional={openInCart} setOpenAdditional={setOpenInCart} isInCart={true} />
                </div>
            }
            {!infoLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 }}><CircularProgress color="sidish" /></div>}
        </div>
    );
}

export default CartMenu;