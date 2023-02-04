import { CardActionArea, CircularProgress, IconButton, Input, makeStyles, OutlinedInput, Pagination } from '@mui/material';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import Button from '@mui/material/Button';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AuthContext from '../context/AuthContext';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useMediaQuery from '../Hooks/useMediaQuery';
import Editbook from './Editbook';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '../firebase/firebase';

import { motion } from 'framer-motion';
import Carousel from 'nuka-carousel/lib/carousel';
import AdditionalBook from './AdditionalBook';

const firstDiv = { display: 'flex', flexDirection: 'column', alignItems: 'center' };

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Book() {
    const matchesSecond = useMediaQuery("(min-width: 870px)");
    const matchesThird = useMediaQuery("(min-width: 500px)");
    const matchesFourth = useMediaQuery("(min-width: 400px)");
    const matchesFifth = useMediaQuery("(min-width: 350px)");
    const matchesSixth = useMediaQuery("(min-width: 300px)");

    const matchesXL = useMediaQuery("(min-width: 1280px)");
    const matchesM = useMediaQuery("(min-width: 800px)");
    const matchesS = useMediaQuery("(min-width: 600px)");
    const matchesXS = useMediaQuery("(min-width: 440px)");
    const matchesXXS = useMediaQuery("(min-width(320px)");

    const myDir = matchesSecond ? 'row' : 'column';

    const myGap = matchesSecond ? 100 : 20;

    const myAlign = matchesSecond ? 'flex-start' : 'center';

    const defineTitleSize = () => {
        if (matchesThird) {
            return 'h4';
        } else if (matchesFifth) {
            return 'h5';
        } else {
            return 'h6';
        }
    }

    const titleSize = defineTitleSize();

    const defineImgWidth = () => {
        if (matchesThird) {
            return '50%';
        } else if (matchesFourth) {
            return '65%';
        } else if (matchesSixth) {
            return '80%';
        } else {
            return 200;
        }
    }

    const defineCardWidth = () => {
        if (matchesThird) {
            return 400;
        } else if (matchesFourth) {
            return 350;
        } else if (matchesSixth) {
            return 250;
        } else {
            return 225;
        }
    }

    const cardWidth = defineCardWidth();
    const imgWidth = defineImgWidth();

    const alignFifth = matchesFifth ? 'flex-start' : 'center';
    const fifthDir = matchesFifth ? 'row' : 'column';
    const gapFifth = matchesFifth ? 10 : 20;
    const infoSize = matchesFifth ? 'h6' : 'h7';

    const defineArrowMargin = () => {
        if (matchesXS) {
            return -34;
        } else if (matchesXXS) {
            return -10;
        } else {
            return -5;
        }
    }

    const defineSlides = () => {
        if (matchesXL) {
            return 5;
        } else if (matchesM) {
            return 4;
        } else if (matchesS) {
            return 3;
        } else if (matchesXS) {
            return 2;
        } else {
            return 1;
        }
    }

    const defineCarouselWidth = () => {
        if (matchesXL) {
            return '65%';
        } else if (matchesM) {
            return 700;
        } else if (matchesS) {
            return 500;
        } else if (matchesXS) {
            return 350;
        } else if (matchesXXS) {
            return 240;
        } else {
            return 200;
        }
    }

    const carouselWidth = defineCarouselWidth();

    const slidesToShow = defineSlides();

    const defineSalesMargin = () => {
        if (matchesSecond) {
            return 80;
        } else if (matchesThird) {
            return 40;
        } else {
            return 15;
        }
    }

    const salesMargin = defineSalesMargin();

    const arrowMargin = defineArrowMargin();

    const titleMargin = matchesFifth ? 5 : 2

    const renderCenterRightControls = ({
        nextSlide,
        currentSlide,
        slideCount,
        slidesToShow,
    }) => {
        if (!(currentSlide + slidesToShow === slideCount)) {
            return (
                <IconButton
                    style={{ right: arrowMargin }}
                    onClick={nextSlide}
                    color="thirdary"
                >
                    <ArrowForwardIosIcon />
                </IconButton>

            );
        }
    }

    const renderCenterLeftControls = ({
        previousSlide, currentSlide
    }) => {
        if (currentSlide !== 0) {
            return (
                <IconButton
                    style={{ left: arrowMargin }}
                    onClick={previousSlide}
                    color="thirdary"
                >
                    <ArrowBackIosNewIcon />
                </IconButton>

            );
        }
    }

    //styles for return statement
    const secondDiv = { display: 'flex', gap: myGap, flexDirection: myDir, alignItems: 'center' };
    const cardStyle = { height: 325, width: cardWidth, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1c1c1c' };
    const thirdDiv = { display: 'flex', flexDirection: 'column', alignItems: myAlign };
    const priceHolder = { borderRadius: '25px', width: 120, height: 37, backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'display', fontSize: 20 };
    const fourthDiv = { marginTop: 15, display: 'flex', flexDirection: 'column', alignItems: myAlign, gap: 15 };
    const fifthDiv = { display: 'flex', flexDirection: 'column', alignItems: alignFifth, gap: 2 };
    const sixthDiv = { display: 'flex', gap: gapFifth, justifyContent: myAlign, alignItems: alignFifth, marginTop: 5, flexDirection: fifthDir };
    const quantityCard = { borderRadius: '25px', width: 100, height: 35, backgroundColor: 'white', color: 'black', display: 'flex', alignItems: 'center', fontFamily: 'display', fontSize: 20, borderColor: 'white', borderStyle: 'solid', borderWidth: 2 }
    const buttonMinus = { transition: '0.45s', "&:hover": { filter: 'brightness(50%)', backgroundColor: 'black' }, color: 'white', backgroundColor: 'black', borderRadius: '25px 0px 0px 25px', marginLeft: -3.7, paddingLeft: 5.2 };
    const buttonPlus = { transition: '0.45s', "&:hover": { filter: 'brightness(50%)', backgroundColor: 'black' }, color: 'white', backgroundColor: 'black', borderRadius: '0px 25px 25px 0px', marginRight: -3.7, paddingRight: 5.2 };
    const quantityStyle = { width: 35, display: 'flex', justifyContent: 'center', fontFamily: 'display', fontSize: 17 };
    const cartStyle = { transition: '0.4s', borderRadius: '25px 25px 25px 25px', width: 175, backgroundColor: 'white', height: 37, color: 'black', fontFamily: 'serif', "&:hover": { backgroundColor: '#D3D3D3' } }
    const newPriceHolder = { borderRadius: '25px', width: 78, height: 24, backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'display', fontSize: 14 };
    const titleStyle = { color: 'white', fontFamily: 'serif', marginBottom: titleMargin };

    const [book, setBook] = useState({
        id: '',
        title: '',
        author: '',
        isbn: '',
        bookYear: '',
        price: '',
        url: '',
        category: null
    });
    const [dataFetched, setDataFetched] = useState(false);
    const [bookEdited, setBookEdited] = useState(false);
    const [topSales, setTopSales] = useState([]);
    const [cartUpdated, setCartUpdated] = useState(false);

    const [openAdditional, setOpenAdditional] = useState(false);
    const [additionalBook, setAdditionalBook] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const { setBgrColor, setBookDeleted, setSecondDrawerOpen } = useContext(AuthContext);

    let { bookid } = useParams();

    const handleQuantity = (action) => {
        if (action === '-' && quantity > 1) {
            setQuantity(prev => prev - 1);
        } else if (action === '+') {
            setQuantity(prev => prev + 1);
        }
    }

    const fetchTopSales = () => {
        fetch(process.env.REACT_APP_API_URL + 'topsales',
            {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setTopSales(data);
                    setDataFetched(true);
                } else {
                    alert('There are some troubles fetching top sales');
                }
            })
            .catch(err => console.error(err));
    }

    const fetchBook = () => {
        fetch(process.env.REACT_APP_API_URL + 'books/' + bookid,
            {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setBook(data);
                    fetchTopSales();
                } else {
                    alert('There is no such book');
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        setBgrColor('#1c1c1c');
        fetchBook();
    }, []);

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
    }

    const updateBook = (updatedBook, link) => {
        const token = sessionStorage.getItem('jwt');
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(updatedBook)
        })
            .then(response => {
                if (response.ok) {
                    fetchBook();
                    setBookEdited(true);
                } else {
                    alert('Something went wrong during the book update');
                }
            })
            .catch(err => console.error(err))
    }

    const navigate = useNavigate();

    const deleteBook = (link) => {
        if (window.confirm('Do you want to delete this book?')) {
            const token = sessionStorage.getItem('jwt');
            fetch(link,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                }
            )
                .then(response => {
                    if (!response.ok) {
                        alert('Something went wrong in deletion');
                    }
                    else {
                        let previousPictureRef = ref(storage, book.url);
                        deleteObject(previousPictureRef)
                            .then(() => {
                                setBookDeleted(true);
                                navigate("/");
                            })
                            .catch(err => console.error(err));
                    }
                })
                .catch(err => console.error(err))
        }
    }

    const openAdditionalDialog = (thisbookid) => {
        setOpenAdditional(true);
        fetch(process.env.REACT_APP_API_URL + 'books/' + thisbookid,
            {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setAdditionalBook(data);
                } else {
                    alert('There is no such book');
                }
            })
            .catch(err => console.error(err));
    }

    const newRows = topSales.map((sale, index) =>
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <CardActionArea onClick={() => openAdditionalDialog(sale.bookid)} sx={{ width: 120, height: 180, "&:hover": { filter: 'brightness(50%)' }, transition: '0.55s' }}>
                <img
                    width='100%'
                    height='100%'
                    src={sale.url}
                    alt={sale.title}
                />
            </CardActionArea>
            <Paper style={newPriceHolder} elevation={0}>
                {currencyFormatter(sale.price, '€')}
            </Paper>
            <AdditionalBook setCartUpdated={setCartUpdated} additionalBook={additionalBook} setAdditionalBook={setAdditionalBook} openAdditional={openAdditional} setOpenAdditional={setOpenAdditional} />
        </div >
    );

    const addBookForNotLogged = (bookid) => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');
        fetch(process.env.REACT_APP_API_URL + 'addbook/' + backetId, {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: quantity, bookid: bookid, password: password })
        })
            .then(response => {
                if (response.ok) {
                    setSecondDrawerOpen(true);
                    setCartUpdated(true);
                } else {
                    alert('Something went wrong during adding book into the cart');
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
                body: JSON.stringify({ quantity: quantity })
            })
                .then(response => {
                    if (response.ok) {
                        setSecondDrawerOpen(true);
                        setCartUpdated(true);
                    } else {
                        alert('Something went wrong during adding the book into cart');
                    }
                })
                .catch(err => console.error(err));
        } else {
            addToNonuserCart(bookid);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {dataFetched && <div style={firstDiv}>
                <Typography variant={titleSize} sx={titleStyle} >{book.author}: {book.title}</Typography>
                <div style={secondDiv}>
                    <Card sx={cardStyle} elevation={10}>
                        <img
                            height={300}
                            width={imgWidth}
                            src={book.url}
                            alt={book.title}
                        />
                    </Card>
                    <div style={thirdDiv}>
                        <Paper style={priceHolder} elevation={0}>
                            {currencyFormatter(book.price, '€')}
                        </Paper>
                        <div style={fourthDiv}>
                            <Typography variant={infoSize} sx={{ color: 'white' }}>isbn: {book.isbn}</Typography>
                            <Typography variant={infoSize} sx={{ color: 'white' }}>Category: {book.category.name}</Typography>
                            <Typography variant={infoSize} sx={{ color: 'white' }}>Originally published: {book.bookYear}</Typography>
                            <div style={fifthDiv}>
                                <Typography variant='h7' sx={{ color: '#686868' }}>Quantity:</Typography>
                                <div style={sixthDiv}>
                                    <Card
                                        style={quantityCard}
                                        elevation={0}
                                    >
                                        <Button onClick={() => handleQuantity('-')} sx={buttonMinus}>-</Button>
                                        <Typography sx={quantityStyle}>{quantity}</Typography>
                                        <Button onClick={() => handleQuantity('+')} sx={buttonPlus}>+</Button>
                                    </Card>
                                    <Button onClick={() => addToCart(book.id)} endIcon={<AddShoppingCartIcon />} sx={cartStyle} component={Paper} elevation={10} >
                                        Add to Cart
                                    </Button>
                                </div>
                                <div style={{ display: 'flex', gap: 25, marginTop: 20 }}>
                                    {sessionStorage.getItem('role') === 'ADMIN' && <Editbook book={book} updateBook={updateBook} />}
                                    {sessionStorage.getItem('role') === 'ADMIN' &&
                                        <IconButton onClick={() => deleteBook(`${process.env.REACT_APP_API_URL}api/books/${book.id}`)} /**component={Link} to={`/`}*/>
                                            <DeleteIcon color='thirdary' />
                                        </IconButton>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {topSales.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: salesMargin }}>
                    <Typography variant={titleSize} sx={{ color: 'white', fontFamily: 'serif', marginBottom: 2.5 }} >Top Sales</Typography>
                    <div style={{ width: carouselWidth }}>
                        <Carousel
                            dragging={false}
                            slidesToShow={slidesToShow}
                            speed={1250}
                            renderCenterRightControls={renderCenterRightControls}
                            renderCenterLeftControls={renderCenterLeftControls}
                            defaultControlsConfig={{
                                pagingDotsStyle: {
                                    display: 'none'
                                }
                            }}
                        >
                            {newRows}
                        </Carousel>
                    </div>
                </div >}
            </div >}
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100, marginBottom: 100 }}><CircularProgress color="inherit" /></div>}
            <Snackbar open={bookEdited} autoHideDuration={3000} onClose={() => setBookEdited(false)}>
                <Alert onClose={() => setBookEdited(false)} severity="success" sx={{ width: '100%' }}>
                    Book info was updated successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={cartUpdated} autoHideDuration={3000} onClose={() => setCartUpdated(false)}>
                <Alert onClose={() => setCartUpdated(false)} severity='sidish' sx={{ width: '100%' }}>
                    Book was added to your cart
                </Alert>
            </Snackbar>
        </motion.div>
    )
}