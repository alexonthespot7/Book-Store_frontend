import React, { useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import useMediaQuery from '../Hooks/useMediaQuery';

import AuthContext from '../context/AuthContext';

import Addbook from './Addbook';
import '../App.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardActionArea, CircularProgress, IconButton, InputAdornment, Pagination, Paper, TextField } from '@mui/material';

import { AnimatePresence, motion } from 'framer-motion';

const buttonStyle = {
    transition: '0.4s',
    borderRadius: '25px 25px 25px 25px',
    width: 200, backgroundColor: 'white',
    color: 'black',
    fontFamily: 'serif',
    "&:hover": { color: 'white', backgroundColor: 'black' }
}

const buttonTakenStyle = {
    transition: '0.4s',
    borderRadius: '25px 25px 25px 25px',
    width: 200, backgroundColor: 'black',
    color: 'white',
    fontFamily: 'serif',
    "&:hover": { color: 'black', backgroundColor: 'white' }
}

const priceHolder = {
    borderRadius: '25px 0px 15px 0px',
    width: 80, height: 27,
    backgroundColor: 'black',
    color: 'white', display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'display',
    fontSize: 18
}

const cardStyle = {
    borderRadius: '25px',
    display: 'flex',
    flexDirection: 'column',

    backgroundColor: 'white',
    width: 200,
    height: 300,
    marginBottom: 15
}

const cardAction = {
    height: '100%',
    width: '100%',
    marginTop: 0,
    "&:hover": { filter: 'brightness(40%)' },
    transition: '0.4s'
}

const imageDiv = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 15
}


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Booklist() {
    const [dataFetched, setDataFetched] = useState(false);
    const [books, setBooks] = useState([]);
    const [bookAdded, setBookAdded] = useState(false);
    const [cartUpdated, setCartUpdated] = useState(false);
    const [page, sestPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchNow, setSearchNow] = useState('');
    const [openSearch, setOpenSearch] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams({});


    const matchesXL = useMediaQuery("(min-width: 1200px)");
    const matchesL = useMediaQuery("(min-width: 1000px)");
    const matchesM = useMediaQuery("(min-width: 800px)");
    const matchesMidM = useMediaQuery("(min-width: 600px)");
    const matchesS = useMediaQuery("(min-width: 500px)");
    const matchesXS = useMediaQuery("(min-width: 400px)");
    const matchesXXS = useMediaQuery("(min-width: 300px)");

    const defineMarginSearch = () => {
        if (matchesS) {
            return 70;
        } else if (matchesXS) {
            return 40;
        } else if (matchesXXS) {
            return 20;
        } else {
            return 10;
        }
    }

    const marginSearch = defineMarginSearch();

    const searchSize = matchesS ? 'medium' : 'small';

    const defineItemsPerDiv = () => {
        if (matchesXL) {
            return 5;
        } else if (matchesL) {
            return 4;
        } else if (matchesM) {
            return 3;
        } else if (matchesS) {
            return 2;
        } else {
            return 1;
        }
    }

    let truthly = true;

    const typoSize = matchesM ? 'h4' : 'h5';

    const marg = matchesMidM ? 0 : 10

    const mainStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20 - marg,
        marginRight: 20 - marg,
    }

    const itemsPerDiv = defineItemsPerDiv();

    const filteredBooks = books.filter(
        book => {
            return (
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.bookYear.toString().includes(searchQuery) ||
                book.price.toString().includes(searchQuery) ||
                book.category.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    );

    const divsPerPage = 4;

    //used to use raw books here
    const pages = Array.from({ length: Math.ceil(filteredBooks.length / (divsPerPage * itemsPerDiv)) }, (_, i) => i + 1);
    const divs = Array.from(Array(Math.ceil(filteredBooks.length / itemsPerDiv)).keys());

    const handleChange = (event, value) => {
        sestPage(value);
    }

    const { setSignupMessage, setSignupSuccess, setActionReset, actionReset, typeReset, setTypeReset, msgReset, setMsgReset, setBgrColor, bookDeleted, setBookDeleted, setSecondDrawerOpen, fetchIds, takenIds, setTakenIds, fetchIdsNotLogged } = useContext(AuthContext);

    const fetchBooks = () => {
        fetch(process.env.REACT_APP_API_URL + 'books')
            .then(response => response.json())
            .then(data => {
                setBooks(data);
                setDataFetched(true);
            })
            .catch(err => console.error(err));
    }

    const navigate = useNavigate();

    let quant = 1;

    const checkToken = (token) => {
        quant += 1;
        const tokenInfo = { 'token': token };
        fetch(process.env.REACT_APP_API_URL + 'verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tokenInfo)
        })
            .then(response => {
                if (response.ok) {
                    navigate('/');
                    console.log('VERIFICATION: ', quant);
                    setSignupSuccess(true);
                    setSignupMessage('Your account was successfully verified. You can login now!');
                } else {
                    setSignupSuccess(true);
                    setSignupMessage('Verification code is incorrect or you are already verified');
                    navigate('/');
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        setBgrColor('#FFFAFA');
        fetchBooks();
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            fetchIds(); //fetching ids of books which are already in the cart
        } else if (sessionStorage.getItem('cartId') !== null) {
            fetchIdsNotLogged(sessionStorage.getItem('cartId'));
        } else {
            setTakenIds([]);
        }
        if (searchParams.get('token') && quant === 1) {
            checkToken(searchParams.get('token'));
        }
        if (searchParams.get('cart')) {
            setActionReset(true);
            setTypeReset('sidish');
            setMsgReset('Your cart is empty now!');
            navigate('/');
        }
    }, []);

    //used to use raw books here
    if (filteredBooks.length > 0 && truthly) {
        truthly = false;
    }

    if (page > pages.length && !truthly) {
        sestPage(1);
    }

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
    }

    const addBook = (newBook) => {
        const token = sessionStorage.getItem('jwt');
        fetch(process.env.REACT_APP_API_URL + 'api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(newBook)
        })
            .then(response => {
                if (response.ok) {
                    fetchBooks();
                    setBookAdded(true);
                } else {
                    alert('Something went wrong during adding the book');
                }
            })
            .catch(err => console.error(err));
    }

    const createCart = (bookid) => {
        fetch(process.env.REACT_APP_API_URL + 'createbacket')
            .then(response => response.json())
            .then(data => {
                sessionStorage.setItem('cartId', data.bookid);
                sessionStorage.setItem('cartPass', data.password);
                addBookForNotLogged(bookid);
            })
            .catch(err => console.error(err));
    }

    const addBookForNotLogged = (bookid) => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');
        fetch(process.env.REACT_APP_API_URL + 'addbook/' + backetId, {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: 1, bookid: bookid, password: password })
        })
            .then(response => {
                if (response.ok) {
                    fetchBooks();
                    fetchIdsNotLogged(backetId);
                    setSecondDrawerOpen(true);
                    setCartUpdated(true);
                } else {
                    alert('Something went wrong during adding book into the cart');
                }
            })
            .catch(err => console.error(err));
    }

    const addToNonuserCart = (bookid) => {
        if (sessionStorage.getItem('authorizedUsername') === null) {
            if (!sessionStorage.getItem('cartId')) {
                createCart(bookid);
            } else {
                addBookForNotLogged(bookid);
            }
        }
    }

    const addToCart = (bookid) => {
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            const token = sessionStorage.getItem('jwt');
            fetch(process.env.REACT_APP_API_URL + 'additem/' + bookid, {
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
                        fetchBooks();
                        fetchIds();
                        setSecondDrawerOpen(true);
                        setCartUpdated(true);
                    } else {
                        alert('Something went wrong during adding book into the cart');
                    }
                })
                .catch(err => console.error(err));
        } else {
            addToNonuserCart(bookid);
        }
    }

    //used to use raw books

    const rows = divs.map((number, index) =>
        (divsPerPage * (page - 1) <= index && index < divsPerPage * page) &&
        <AnimatePresence>
            <motion.div key={index} style={mainStyle}
                layout
                initial={{ scale: 0.5, height: 0, width: 0 }}
                animate={{ scale: 1, height: 'auto', width: 'auto' }}
                exit={{ scale: 0.5, height: 0, width: 0 }}
                transition={{ duration: 0.5 }}
            >
                {filteredBooks.map((book, indexs) =>
                    (itemsPerDiv * number <= indexs && indexs < itemsPerDiv * (number + 1)) &&
                    <div>
                        <Card
                            style={cardStyle}
                            elevation={10}
                        >
                            <div style={{ display: 'flex', justifyContent: 'left', marginTop: 0 }}>
                                <Paper style={priceHolder} elevation={0}>
                                    {currencyFormatter(book.price, "€")}
                                </Paper>
                            </div>
                            <CardActionArea
                                component={Link}
                                to={`/book/${book.id}`}
                                sx={cardAction}
                            >
                                <div style={imageDiv}>
                                    <img
                                        height={240}
                                        width='80%'
                                        src={book.url}
                                        alt={book.title}
                                    />

                                </div>
                            </CardActionArea>


                        </Card>
                        {((sessionStorage.getItem('authorizedUsername') === null && sessionStorage.getItem('cartId') === null) || !takenIds.includes(book.id)) && <Button onClick={() => addToCart(book.id)} endIcon={<AddShoppingCartIcon />} sx={buttonStyle} component={Paper} elevation={10} >
                            Add to Cart
                        </Button>}
                        {takenIds.includes(book.id) && <Button onClick={() => setSecondDrawerOpen(true)} endIcon={<ShoppingCartIcon />} sx={buttonTakenStyle} component={Paper} elevation={10} >
                            Open Cart
                        </Button>}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );

    const handleLocalChange = (event) => {
        setSearchNow(event.target.value);
    }

    const search = () => {
        setSearchQuery(searchNow);
    }

    const stopSearch = () => {
        setSearchQuery('');
        setOpenSearch(false);
        setSearchNow('');
    }

    return (

        <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: 30 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {sessionStorage.getItem('role') === 'ADMIN' &&
                <div style={{ marginBottom: -20, display: 'flex', justifyContent: 'center', gap: 20 }}>
                    {!openSearch && <IconButton onClick={() => setOpenSearch(true)} sx={{ marginRight: -2.5 }}>
                        <SearchIcon color='sidish' />
                    </IconButton>}
                    {openSearch && <IconButton onClick={stopSearch} sx={{ marginRight: -2.5 }}>
                        <SearchOffIcon color='sidish' />
                    </IconButton>}
                    <Typography variant={typoSize}>All books</Typography>
                    <Addbook addBook={addBook} />
                </div>}
            {sessionStorage.getItem('role') !== 'ADMIN' &&
                <div style={{ marginBottom: -20, display: 'flex', justifyContent: 'center', gap: 0 }}>
                    {!openSearch && <IconButton onClick={() => setOpenSearch(true)}>
                        <SearchIcon color='sidish' />
                    </IconButton>}
                    {openSearch && <IconButton onClick={stopSearch}>
                        <SearchOffIcon color='sidish' />
                    </IconButton>}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Typography variant={typoSize}>All</Typography>
                        <Typography sx={{ backgroundColor: 'black', color: 'white', paddingLeft: 1, paddingRight: 1 }} variant={typoSize}>Books</Typography>
                    </div>
                </div>}
            {dataFetched &&
                <AnimatePresence><div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                    <AnimatePresence>{openSearch &&
                        <motion.div
                            style={{ display: 'flex', marginLeft: marginSearch, marginRight: marginSearch, gap: 15, marginBottom: -20 }}
                            initial={{ opacity: 0, scale: 0.5, height: 0 }}
                            animate={{ opacity: 1, scale: 1, height: 'auto' }}
                            exit={{ opacity: 0, scale: 0.5, height: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TextField
                                size={searchSize}
                                fullWidth
                                value={searchNow}
                                onChange={handleLocalChange}
                                type='search'
                                placeholder="Search for books..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color='sidish' />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                color='sidish'
                            />
                            <Button
                                size={searchSize}
                                onClick={search}
                                variant='contained'
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'black',
                                    "&:hover": { backgroundColor: 'gray' },
                                    transition: '0.45s'
                                }}
                            >
                                Search
                            </Button>
                        </motion.div>
                    }
                    </AnimatePresence>
                    {rows}
                </div></AnimatePresence>}
            {dataFetched &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination sx={{ marginBottom: 5, marginTop: 5 }} count={pages.length} page={page} onChange={handleChange} />
                </div>
            }
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 77, marginBottom: 77 }}><CircularProgress color="inherit" /></div>}

            <Snackbar
                open={bookDeleted}
                autoHideDuration={3000}
                onClose={() => setBookDeleted(false)}
                message='Book was deleted successfully'
            />
            <Snackbar open={bookAdded} autoHideDuration={3000} onClose={() => setBookAdded(false)}>
                <Alert onClose={() => setBookAdded(false)} severity="success" sx={{ width: '100%' }}>
                    New book was added successfully!
                </Alert>
            </Snackbar>

            <Snackbar open={actionReset} autoHideDuration={3000} onClose={() => setActionReset(false)}>
                <Alert onClose={() => setActionReset(false)} severity={typeReset} sx={{ width: '100%' }}>
                    {msgReset}
                </Alert>
            </Snackbar>
            <Snackbar open={cartUpdated} autoHideDuration={3000} onClose={() => setCartUpdated(false)}>
                <Alert onClose={() => setCartUpdated(false)} severity='sidish' sx={{ width: '100%' }}>
                    Book was added to your cart
                </Alert>
            </Snackbar>
        </motion.div>
    );
}

export default Booklist;

