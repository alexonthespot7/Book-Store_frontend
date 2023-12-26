import { useState, useEffect, useContext } from 'react';

import { Button, Card, CardActionArea, CircularProgress, IconButton, InputAdornment, Pagination, Paper, TextField, Typography } from '@mui/material';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';

import useMediaQuery from '../Hooks/useMediaQuery';
import AuthContext from '../context/AuthContext';
import Addbook from './Addbook';

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

function Booklist() {
    const [dataFetched, setDataFetched] = useState(false);
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryHolder, setSearchQueryHolder] = useState('');
    const [openSearch, setOpenSearch] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams({});

    const { currencyFormatter, setOpenSnackbar, setSnackbarMessage, setBgrColor, setCartDrawerOpen, fetchIdsOfBooksInCartAuthenticated, idsOfBooksInCart, setIdsOfBooksInCart, fetchIdsOfBooksInCartNoAuth, resetAuthentication } = useContext(AuthContext);

    const navigate = useNavigate();

    const jwtToken = sessionStorage.getItem('jwt');
    const authorized = sessionStorage.getItem('authorizedUsername') ? true : false;

    const matches1200px = useMediaQuery("(min-width: 1200px)");
    const matches1000px = useMediaQuery("(min-width: 1000px)");
    const matches800px = useMediaQuery("(min-width: 800px)");
    const matches600px = useMediaQuery("(min-width: 600px)");
    const matches500px = useMediaQuery("(min-width: 500px)");
    const matches400px = useMediaQuery("(min-width: 400px)");
    const matches300px = useMediaQuery("(min-width: 300px)");

    const fetchBooks = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'books');
            if (!response.ok) {
                setSnackbarMessage('Something is wrong with the server');
                setOpenSnackbar(true);
                return null;
            }
            response.json()
                .then(data => {
                    setBooks(data);
                    setDataFetched(true);
                })
                .catch(err => {
                    console.error(err);
                    setSnackbarMessage('Something is wrong with the server');
                    setOpenSnackbar(true);
                });
        } catch (error) {
            setSnackbarMessage('Something is wrong with the server');
            setOpenSnackbar(true);
        }
    }

    const handleBadResponseVerification = (response) => {
        if (response.status === 404) {
            setOpenSnackbar(true);
            setSnackbarMessage('Verification code is incorrect');
            navigate('/');
        } else if (response.status === 409) {
            setOpenSnackbar(true);
            setSnackbarMessage('The user is already verified');
            navigate('/');
        } else {
            setDataFetched(false);
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
            navigate('/');
        }
    }

    const fetchVerifyUser = async (token) => {
        try {
            const tokenInfo = { 'token': token };
            const response = await fetch(process.env.REACT_APP_API_URL + 'verify', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tokenInfo)
            });
            if (!response.ok) {
                handleBadResponseVerification(response);
                return null;
            }
            setOpenSnackbar(true);
            setSnackbarMessage('Your account was successfully verified. You can login now!');
            navigate('/');
        } catch (error) {
            console.error(error);
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
            setDataFetched(false);
            navigate('/');
        }
    }

    useEffect(() => {
        // sessionStorage.clear();
        setBgrColor('#FFFAFA');
        setDataFetched(false);
        fetchBooks();

        //fetching ids of books which are already in the cart based on the user authentication status:
        if (authorized) {
            fetchIdsOfBooksInCartAuthenticated();
        } else if (sessionStorage.getItem('cartId') !== null) {
            fetchIdsOfBooksInCartNoAuth(sessionStorage.getItem('cartId'));
        } else {
            setIdsOfBooksInCart([]);
        }

        //verify user case
        if (searchParams.get('token')) {
            fetchVerifyUser(searchParams.get('token'));
        }

        // Case when the cart is empty and the user is redirected to the main page with ?cart=updated param
        if (searchParams.get('cart')) {
            setOpenSnackbar(true);
            setSnackbarMessage('Your cart is empty now!');
            navigate('/');
        }
    }, [authorized]);

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

    const defineAmountOfBooksPerRow = () => {
        if (matches1200px) {
            return 5;
        } else if (matches1000px) {
            return 4;
        } else if (matches800px) {
            return 3;
        } else if (matches500px) {
            return 2;
        } else {
            return 1;
        }
    }
    const amountOfBooksPerRow = defineAmountOfBooksPerRow();
    const amountOfRowsPerPage = 4;
    const pages = Array.from({ length: Math.ceil(filteredBooks.length / (amountOfRowsPerPage * amountOfBooksPerRow)) }, (_, i) => i + 1);
    const totalAmountOfRows = Array.from(Array(Math.ceil(filteredBooks.length / amountOfBooksPerRow)).keys());

    const handleChangePage = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    }

    // Case when the books are filtered and the current page is beyond the edge
    useEffect(() => {
        if (page > pages.length) setPage(1);
    }, [pages]);

    const horizontalMarginOfMainDiv = matches600px ? 20 : 10
    const mainDivStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: horizontalMarginOfMainDiv,
        marginRight: horizontalMarginOfMainDiv,
    }

    const fetchAddBookToCartAuthenticated = async (bookId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'additem/' + bookId, {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': jwtToken
                },
                body: JSON.stringify({ quantity: 1 })
            });
            if (!response.ok) {
                setOpenSnackbar(true);
                setSnackbarMessage('Something is wrong with the server');
                return null;
            }
            fetchBooks();
            fetchIdsOfBooksInCartAuthenticated();
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
            setDataFetched(false);
            fetchBooks();
            setOpenSnackbar(true);
            setSnackbarMessage('Please try again');
        } else {
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    const fetchAddBookToCartNoAuthentication = async (bookid) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'addbook/' + sessionStorage.getItem('cartId'), {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: 1, bookid: bookid, password: sessionStorage.getItem('cartPass') })
            });

            if (!response.ok) {
                handleBadResponseAddBookToCartNoAuth(response);
                return null;
            }
            fetchBooks();
            fetchIdsOfBooksInCartNoAuth(sessionStorage.getItem('cartId'));
            setCartDrawerOpen(true);
            setOpenSnackbar(true);
            setSnackbarMessage('The book was added to your cart');
        } catch (error) {
            console.error(error);
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server');
        }
    }

    const addBookToCartNoAuthentication = (bookid) => {
        if (!sessionStorage.getItem('cartId')) {
            fetchCreateCartNoAuthentication(bookid);
        } else {
            fetchAddBookToCartNoAuthentication(bookid);
        }
    }

    const addBookToCart = async (bookid) => {
        if (authorized) {
            fetchAddBookToCartAuthenticated(bookid);
        } else {
            addBookToCartNoAuthentication(bookid);
        }
    }

    const rowsOfBooks = totalAmountOfRows.map((value, rowIndex) => {
        return (
            (amountOfRowsPerPage * (page - 1) <= rowIndex && rowIndex < amountOfRowsPerPage * page) &&
            <AnimatePresence key={rowIndex}>
                <motion.div style={mainDivStyle}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {filteredBooks.map((book, columnIndex) =>
                        (amountOfBooksPerRow * rowIndex <= columnIndex && columnIndex < amountOfBooksPerRow * (rowIndex + 1)) &&
                        <div key={columnIndex}>
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
                            {!idsOfBooksInCart.includes(book.id) && <Button onClick={() => addBookToCart(book.id)} endIcon={<AddShoppingCartIcon />} sx={buttonStyle} component={Paper} elevation={10} >
                                Add to Cart
                            </Button>}
                            {idsOfBooksInCart.includes(book.id) &&
                                <Button onClick={() => setCartDrawerOpen(true)} endIcon={<ShoppingCartIcon />} sx={buttonTakenStyle} component={Paper} elevation={10} >
                                    Open Cart
                                </Button>
                            }
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        );
    });

    const handleSearchQueryChange = (event) => {
        setSearchQueryHolder(event.target.value);
    }

    const search = () => {
        setSearchQuery(searchQueryHolder);
    }

    function AllBooksHeader() {
        const horizontalGapForElements = sessionStorage.getItem('role') === 'ADMIN' ? 20 : 0;
        const horizontalMarginForElements = sessionStorage.getItem('role') === 'ADMIN' ? -2.5 : 0;
        const typographySize = matches800px ? 'h4' : 'h5';

        const startSearch = () => {
            setOpenSearch(true);
        }
        const stopSearch = () => {
            setSearchQuery('');
            setOpenSearch(false);
            setSearchQueryHolder('');
        }
        function ConditionalSearchIcon() {
            return (
                <IconButton onClick={openSearch ? stopSearch : startSearch} sx={{ marginRight: horizontalMarginForElements }}>
                    {openSearch && <SearchOffIcon color='sidish' />}
                    {!openSearch && <SearchIcon color='sidish' />}
                </IconButton>
            );
        }
        return (
            <div style={{ marginBottom: -20, display: 'flex', justifyContent: 'center', gap: horizontalGapForElements }}>
                {dataFetched && <ConditionalSearchIcon />}
                <div style={{ display: 'flex', gap: 8 }}>
                    {sessionStorage.getItem('role') === 'ADMIN' && <>
                        <Typography variant={typographySize}>All books</Typography>
                        <Addbook fetchBooks={fetchBooks} />
                    </>}
                    {sessionStorage.getItem('role') !== 'ADMIN' && <>
                        <Typography variant={typographySize}>All</Typography>
                        <Typography sx={{ backgroundColor: 'black', color: 'white', paddingLeft: 1, paddingRight: 1 }} variant={typographySize}>Books</Typography>
                    </>}
                </div>
            </div>
        );
    }

    const defineMarginSearch = () => {
        if (matches500px) {
            return 70;
        } else if (matches400px) {
            return 40;
        } else if (matches300px) {
            return 20;
        } else {
            return 10;
        }
    }
    const horizontalMarginSearchField = defineMarginSearch();
    const searchSize = matches500px ? 'medium' : 'small';

    return (
        <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: 30 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <AllBooksHeader />
            {dataFetched &&
                <AnimatePresence>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                        <AnimatePresence>
                            {openSearch &&
                                <motion.div
                                    style={{ display: 'flex', marginLeft: horizontalMarginSearchField, marginRight: horizontalMarginSearchField, gap: 15, marginBottom: -20 }}
                                    initial={{ opacity: 0, scale: 0.5, height: 0 }}
                                    animate={{ opacity: 1, scale: 1, height: 'auto' }}
                                    exit={{ opacity: 0, scale: 0.5, height: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <TextField
                                        size={searchSize}
                                        fullWidth
                                        value={searchQueryHolder}
                                        onChange={handleSearchQueryChange}
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
                        {rowsOfBooks}
                    </div>
                </AnimatePresence>
            }
            {dataFetched &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination sx={{ marginBottom: 5, marginTop: 5 }} count={pages.length} page={page} onChange={handleChangePage} />
                </div>
            }
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh' }}><CircularProgress color="inherit" /></div>}
        </motion.div>
    );
}

export default Booklist;

