import { Button, CardActionArea, CircularProgress, Divider, IconButton, Paper, Snackbar, Typography } from "@mui/material";
import { useState, useEffect, useContext, forwardRef } from "react";

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import MuiAlert from '@mui/material/Alert';

import AuthContext from "../context/AuthContext";
import useMediaQuery from "../Hooks/useMediaQuery";
import BookInCart from "./BookInCart";
import { useNavigate } from "react-router-dom";

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

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CartMenu() {
    const [quantityChanges, setQuantityChanges] = useState(false);
    const [infoLoaded, setInfoLoaded] = useState(false);
    const [total, setTotal] = useState(0);
    const [booksInCart, setBooksInCart] = useState([]);

    const [bookInCart, setBookInCart] = useState(null);
    const [openInCart, setOpenInCart] = useState(false);

    const { action, setAction, actionMsg, setActionMsg, setActionReset, setTypeReset, setMsgReset, setSecondDrawerOpen, fetchIds, fetchIdsNotLogged } = useContext(AuthContext);

    const matchesFifth = useMediaQuery("(min-width: 310px)");
    const matchesSixth = useMediaQuery("(min-width: 305px)");
    const matchesSeventh = useMediaQuery("(min-width: 300px)");

    const defineAuthorTitleSize = () => {
        if (matchesFifth) {
            return 16;
        } else if (matchesSixth) {
            return 14;
        } else {
            return 12;
        }
    }

    const myDir = matchesSeventh ? 'row' : 'column';
    const myWidth = matchesSeventh ? 30 : 60;

    const myPurchaseSize = matchesFifth ? 30 : 24;
    const defaultFont = matchesFifth ? 16 : 14;
    const authorTitleSize = defineAuthorTitleSize();

    const fetchTotal = (token) => {
        fetch(process.env.REACT_APP_API_URL + 'getcurrtotal',
            {
                method: 'GET',
                headers: { 'Authorization': token }
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setTotal(data.total);
                    setInfoLoaded(true);
                }
            })
            .catch(err => console.error(err));
    }

    const fetchCartByUserId = () => {
        const token = sessionStorage.getItem('jwt');
        const id = sessionStorage.getItem('authorizedId');

        fetch(process.env.REACT_APP_API_URL + 'showcart/' + id,
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setBooksInCart(data);
                    fetchTotal(token);
                }
            })
            .catch(err => console.error(err));
    }

    const fetchTotalNotLogged = (backetId, password) => {
        fetch(process.env.REACT_APP_API_URL + 'gettotal', {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookid: backetId, password: password })
        })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setTotal(data.total);
                    setInfoLoaded(true);
                }
            })
            .catch(err => console.error(err));
    }

    const fetchCartByBacketId = () => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');
        fetch(process.env.REACT_APP_API_URL + 'showcart', {
            method: 'GET',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookid: backetId, password: password })
        })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setBooksInCart(data);
                    fetchTotalNotLogged(backetId, password);
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            fetchCartByUserId();
        } else if (sessionStorage.getItem('cartId')) {
            fetchCartByBacketId();
        } else {
            setInfoLoaded(true);
        }
    }, []);

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
    }

    const deleteBookNotLogged = (id) => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');
        fetch(process.env.REACT_APP_API_URL + 'deletebook/' + backetId,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookid: id, password: password })
            })
            .then(response => {
                if (response.ok) {
                    setAction(true);
                    setActionMsg('Book was deleted from your cart');
                    fetchCartByBacketId();
                    fetchIdsNotLogged(backetId);
                    fetchTotalNotLogged(backetId, password);
                } else {
                    setAction(true);
                    setActionMsg('Cannot delete book right now');
                }
            })
            .catch(err => {
                setAction(true);
                setActionMsg(err);
            });
    }

    const deleteBook = (id) => {
        setInfoLoaded(false);
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            const token = sessionStorage.getItem('jwt');

            fetch(process.env.REACT_APP_API_URL + 'deleteitem/' + id,
                {
                    method: 'GET',
                    headers: { 'Authorization': token }
                })
                .then(response => {
                    if (response.ok) {
                        setAction(true);
                        setActionMsg('Book was deleted from your cart');
                        fetchCartByUserId();
                        fetchIds();
                        fetchTotal(sessionStorage.getItem('jwt'));
                    } else {
                        setAction(true);
                        setActionMsg('Cannot delete book right now');
                    }
                })
                .catch(err => {
                    setAction(true);
                    setActionMsg(err);
                });

        } else if (sessionStorage.getItem('cartId')) {
            deleteBookNotLogged(id);
        }
    }

    const navigate = useNavigate();

    const checkout = () => {
        if (total === 0) {
            setAction(true);
            setActionMsg('There are no products in the cart');
        } else {
            setSecondDrawerOpen(false);
            navigate('/cart');
        }
    }

    const fetchAddQuantityNonLogged = (id) => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');
        fetch(process.env.REACT_APP_API_URL + 'addbook/' + backetId, {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: 1, bookid: id, password: password })
        })
            .then(response => {
                if (response.ok) {
                    fetchCartByBacketId();
                    fetchIdsNotLogged(backetId);
                    fetchTotalNotLogged(backetId, password);
                    setQuantityChanges(false);
                    setAction(true);
                    setActionMsg('Item in your cart was changed');
                } else {
                    alert('Something went wrong during adding book quantity');
                }
            })
            .catch(err => console.error(err));
    }

    const fetchAddQuantity = (id) => {
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            const token = sessionStorage.getItem('jwt');
            fetch(process.env.REACT_APP_API_URL + 'additem/' + id, {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ quantity: 1 })
            })
                .then(response => {
                    if (response.ok) {
                        fetchIds();
                        fetchCartByUserId();
                        fetchTotal(sessionStorage.getItem('jwt'));
                        setQuantityChanges(false);
                        setAction(true);
                        setActionMsg('Item in your cart was changed');
                    } else {
                        alert('Something went wrong during adding book quantity');
                    }
                })
                .catch(err => console.error(err));
        } else if (sessionStorage.getItem('cartId') !== null) {
            fetchAddQuantityNonLogged(id);
        }
    }

    const fetchReduceQuantityNotLogged = (id) => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');

        fetch(process.env.REACT_APP_API_URL + 'reduceitem/' + backetId, {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookid: id, password: password })
        })
            .then(response => {
                if (response.ok) {
                    fetchCartByBacketId();
                    fetchIdsNotLogged(backetId);
                    fetchTotalNotLogged(backetId, password);
                    setQuantityChanges(false);
                    setAction(true);
                    setActionMsg('Item in your cart was changed');
                } else {
                    alert('Something went wrong during reducing the book quantity');
                }
            })
            .catch(err => console.error(err));
    }

    const fetchReduceQuantity = (id) => {
        if (sessionStorage.getItem('authorizedUsernmae') !== null) {
            const token = sessionStorage.getItem('jwt');
            fetch(process.env.REACT_APP_API_URL + 'reduceitem/' + id, {
                method: 'GET',
                headers:
                {
                    'Authorization': token
                }
            })
                .then(response => {
                    if (response.ok) {
                        fetchIds();
                        fetchCartByUserId();
                        fetchTotal(sessionStorage.getItem('jwt'));
                        setQuantityChanges(false);
                        setAction(true);
                        setActionMsg('Item in your cart was changed');
                    } else {
                        alert('Something went wrong during reducing the book quantity');
                    }
                })
                .catch(err => console.error(err));
        } else if (sessionStorage.getItem('cartId') !== null) {
            fetchReduceQuantityNotLogged(id);
        }
    }

    const changeQuantity = (id, operation) => {
        if (!quantityChanges) {
            setQuantityChanges(true);
            if (operation === '+') {
                fetchAddQuantity(id);
            } else {
                fetchReduceQuantity(id);
            }
        }
    }

    const openBookInCart = (thisbookid) => {
        setOpenInCart(true);
        fetch(process.env.REACT_APP_API_URL + 'books/' + thisbookid,
            {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setBookInCart(data);
                } else {
                    alert('There is no such book');
                }
            })
            .catch(err => console.error(err));
    }

    const items = booksInCart.map((book, index) =>
        <div key={index} style={firstDiv}>
            <div>
                <IconButton onClick={() => deleteBook(book.bookid)} size='small' sx={{ marginBottom: -2.5, zIndex: 4, marginLeft: -1.5 }}>
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
                        {matchesSeventh && <Divider orientation="vertical" flexItem sx={{ border: '1px solid #D3D3D3', height: 15, marginTop: 0.5, marginLeft: 1 }} />}
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={thirdDiv}>
                <Typography sx={{ fontFamily: 'serif', fontSize: myPurchaseSize }} color='sidish'>My purchases</Typography>
                <Divider sx={{ width: '30%', border: '2px solid black', marginTop: 0.5 }} />
            </div>
            {infoLoaded &&
                <div>
                    <div>
                        {items}
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
                    <BookInCart bookInCart={bookInCart} setBookInCart={setBookInCart} openInCart={openInCart} setOpenInCart={setOpenInCart} />
                </div>
            }
            {!infoLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 }}><CircularProgress color="sidish" /></div>}
            <Snackbar open={action} autoHideDuration={3000} onClose={() => setAction(false)}>
                <Alert onClose={() => setAction(false)} severity='sidish' sx={{ width: '100%' }}>
                    {actionMsg}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default CartMenu;