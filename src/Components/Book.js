import { useEffect, useState, useContext } from 'react';

import { Button, Card, CardActionArea, CircularProgress, IconButton, Paper, Typography } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { useNavigate, useParams } from 'react-router-dom';

import { deleteObject, ref } from 'firebase/storage';
import { storage } from '../firebase/firebase';

import { motion } from 'framer-motion';

import Carousel from 'nuka-carousel/lib/carousel';

import AuthContext from '../context/AuthContext';
import useMediaQuery from '../Hooks/useMediaQuery';
import BookDialog from './BookDialog';
import Editbook from './Editbook';

const initialBook = {
    id: '',
    title: '',
    author: '',
    isbn: '',
    bookYear: '',
    price: '',
    url: '',
    category: null
}

export default function Book() {
    const [book, setBook] = useState(initialBook);
    const [dataFetched, setDataFetched] = useState(false);
    const [topSales, setTopSales] = useState([]);
    const [openAdditional, setOpenAdditional] = useState(false);
    const [additionalBook, setAdditionalBook] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const { currencyFormatter, setOpenSnackbar, setSnackbarMessage, setBgrColor, addBookToCart, fetchBook } = useContext(AuthContext);

    let { bookid } = useParams();

    const navigate = useNavigate();

    const matches1280px = useMediaQuery("(min-width: 1280px)");
    const matches870px = useMediaQuery("(min-width: 870px)");
    const matches800px = useMediaQuery("(min-width: 800px)");
    const matches600px = useMediaQuery("(min-width: 600px)");
    const matches500px = useMediaQuery("(min-width: 500px)");
    const matches440px = useMediaQuery("(min-width: 440px)");
    const matches400px = useMediaQuery("(min-width: 400px)");
    const matches350px = useMediaQuery("(min-width: 350px)");
    const matches320px = useMediaQuery("(min-width(320px)");
    const matches300px = useMediaQuery("(min-width: 300px)");

    const handleQuantity = (action) => {
        if (action === '-' && quantity > 1) {
            setQuantity(prev => prev - 1);
        } else if (action === '+') {
            setQuantity(prev => prev + 1);
        }
    }

    const fetchTopSales = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'topsales');
            if (!response.ok) {
                alert('Something is wrong with the server');
                return null;
            }
            response.json()
                .then(data => {
                    setTopSales(data);
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
            alert('Something is wrong with the server');
        }
    }

    const fetchBookAndTopSales = async () => {
        await fetchBook(bookid, setBook);
        await fetchTopSales();
        setDataFetched(true);
    }

    useEffect(() => {
        setBgrColor('#1c1c1c');
        fetchBookAndTopSales();
    }, []);

    useEffect(() => {
        //case when the book request returned a null value
        if (!book) navigate('/');
    }, [book]);

    const openAdditionalDialog = async (bookId) => {
        await fetchBook(bookId, setAdditionalBook);
        setOpenAdditional(true);
    }

    const newPriceHolder = { borderRadius: '25px', width: 78, height: 24, backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'display', fontSize: 14 }
    const topSaledBooks = topSales.map((sale, index) =>
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
            <BookDialog additionalBook={additionalBook} setAdditionalBook={setAdditionalBook} openAdditional={openAdditional} setOpenAdditional={setOpenAdditional} isInCart={false} />
        </div >
    );


    //styles for return statement
    const firstDiv = { display: 'flex', flexDirection: 'column', alignItems: 'center' }

    const secondDivDirection = matches870px ? 'row' : 'column';
    const secondDivGap = matches870px ? 100 : 20;
    const secondDiv = { display: 'flex', gap: secondDivGap, flexDirection: secondDivDirection, alignItems: 'center' }

    const defineCardWidth = () => {
        if (matches500px) {
            return 400;
        } else if (matches400px) {
            return 350;
        } else if (matches300px) {
            return 250;
        } else {
            return 225;
        }
    }
    const cardWidth = defineCardWidth();
    const cardStyle = { height: 325, width: cardWidth, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1c1c1c' }

    const alignBasedOnSize = matches870px ? 'flex-start' : 'center';
    const thirdDiv = { display: 'flex', flexDirection: 'column', alignItems: alignBasedOnSize }
    const priceHolder = { borderRadius: '25px', width: 120, height: 37, backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'display', fontSize: 20 }
    const fourthDiv = { marginTop: 15, display: 'flex', flexDirection: 'column', alignItems: alignBasedOnSize, gap: 15 }

    const fifthAndSixthDivsAlign = matches350px ? 'flex-start' : 'center';
    const fifthDiv = { display: 'flex', flexDirection: 'column', alignItems: fifthAndSixthDivsAlign, gap: 2 }

    const sixthDivGap = matches350px ? 10 : 20;
    const sixthDivDirection = matches350px ? 'row' : 'column';
    const sixthDiv = { display: 'flex', gap: sixthDivGap, justifyContent: alignBasedOnSize, alignItems: fifthAndSixthDivsAlign, marginTop: 5, flexDirection: sixthDivDirection }

    const quantityCard = { borderRadius: '25px', width: 100, height: 35, backgroundColor: 'white', color: 'black', display: 'flex', alignItems: 'center', fontFamily: 'display', fontSize: 20, borderColor: 'white', borderStyle: 'solid', borderWidth: 2 }

    const buttonPlusMinus = { transition: '0.45s', "&:hover": { filter: 'brightness(50%)', backgroundColor: 'black' }, color: 'white', backgroundColor: 'black' }
    const buttonMinus = { ...buttonPlusMinus, borderRadius: '25px 0px 0px 25px', marginLeft: -3.7, paddingLeft: 5.2 }
    const buttonPlus = { ...buttonPlusMinus, borderRadius: '0px 25px 25px 0px', marginRight: -3.7, paddingRight: 5.2 }
    const quantityStyle = { width: 35, display: 'flex', justifyContent: 'center', fontFamily: 'display', fontSize: 17 }

    const cartStyle = { transition: '0.4s', borderRadius: '25px 25px 25px 25px', width: 175, backgroundColor: 'white', height: 37, color: 'black', fontFamily: 'serif', "&:hover": { backgroundColor: '#D3D3D3' } }

    const titleMargin = matches350px ? 5 : 2
    const titleStyle = { color: 'white', fontFamily: 'serif', marginBottom: titleMargin }

    const defineTitleSize = () => {
        if (matches500px) {
            return 'h4';
        } else if (matches350px) {
            return 'h5';
        } else {
            return 'h6';
        }
    }
    const titleSize = defineTitleSize();

    const defineImgWidth = () => {
        if (matches500px) {
            return '50%';
        } else if (matches400px) {
            return '65%';
        } else if (matches300px) {
            return '80%';
        } else {
            return 200;
        }
    }
    const imgWidth = defineImgWidth();

    const infoTextSize = matches350px ? 'h6' : 'h7';

    const defineSalesMargin = () => {
        if (matches870px) {
            return 80;
        } else if (matches500px) {
            return 40;
        } else {
            return 15;
        }
    }
    const salesMargin = defineSalesMargin();

    const defineArrowMargin = () => {
        if (matches440px) {
            return -34;
        } else if (matches320px) {
            return -10;
        } else {
            return -5;
        }
    }
    const arrowMargin = defineArrowMargin();

    const defineSlides = () => {
        if (matches1280px) {
            return 5;
        } else if (matches800px) {
            return 4;
        } else if (matches600px) {
            return 3;
        } else if (matches440px) {
            return 2;
        } else {
            return 1;
        }
    }
    //Carousel styling:
    const slidesToShow = defineSlides();
    const carouselStyle = (topSales.length < slidesToShow) ? { display: 'flex', justifyContent: 'center', width: '60vw' } : { width: '60vw' };
    const renderCenterRightControls = ({
        nextSlide,
        currentSlide,
        slideCount,
        slidesToShow,
    }) => {
        if (!(currentSlide + slidesToShow === slideCount) && (topSales.length >= slidesToShow)) {
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

    const deleteBook = async (link) => {
        if (!window.confirm('Do you want to delete this book?')) {
            return null;
        }
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(link,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                }
            );
            if (!response.ok) {
                alert('Something is wrong with the server');
                return null;
            }
            let previousPictureRef = ref(storage, book.url);
            deleteObject(previousPictureRef)
                .then(() => {
                    setOpenSnackbar(true);
                    setSnackbarMessage('The book was deleted successfully');
                    navigate("/");
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {dataFetched && book &&
                <div style={firstDiv}>
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
                                <Typography variant={infoTextSize} sx={{ color: 'white' }}>isbn: {book.isbn}</Typography>
                                <Typography variant={infoTextSize} sx={{ color: 'white' }}>Category: {book.category.name}</Typography>
                                <Typography variant={infoTextSize} sx={{ color: 'white' }}>Originally published: {book.bookYear}</Typography>
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
                                        <Button onClick={() => addBookToCart(book.id, quantity)} endIcon={<AddShoppingCartIcon />} sx={cartStyle} component={Paper} elevation={10} >
                                            Add to Cart
                                        </Button>
                                    </div>
                                    <div style={{ display: 'flex', gap: 25, marginTop: 20 }}>
                                        {sessionStorage.getItem('role') === 'ADMIN' && <Editbook book={book} setBook={setBook} />}
                                        {sessionStorage.getItem('role') === 'ADMIN' &&
                                            <IconButton onClick={() => deleteBook(`${process.env.REACT_APP_API_URL}api/books/${book.id}`)} >
                                                <DeleteIcon color='thirdary' />
                                            </IconButton>
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    {topSales.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: salesMargin }}>
                        <Typography variant={titleSize} sx={{ color: 'white', fontFamily: 'serif', marginBottom: '2.5vh' }} >Top Sales</Typography>
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
                            style={carouselStyle}
                        >
                            {topSaledBooks}
                        </Carousel>
                    </div >}
                </div >
            }
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30vh' }}><CircularProgress color="inherit" /></div>}
        </motion.div>
    );
}