import { useState, useEffect, useContext } from "react";

import { CardActionArea, CircularProgress, IconButton, Paper } from "@mui/material";

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import Carousel from "nuka-carousel/lib/carousel";

import useMediaQuery from "../Hooks/useMediaQuery";
import AuthContext from "../context/AuthContext";
import BookDialog from "./BookDialog";

const newPriceHolder = { borderRadius: '25px', width: 78, height: 24, backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'display', fontSize: 14 };

export default function BooksinCategory({ category }) {
    const [books, setBooks] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [openAdditional, setOpenAdditional] = useState(false);
    const [additionalBook, setAdditionalBook] = useState(null);

    const { currencyFormatter, fetchBook } = useContext(AuthContext);

    const matches1280px = useMediaQuery("(min-width: 1280px)");
    const matches800px = useMediaQuery("(min-width: 800px)");
    const matches600px = useMediaQuery("(min-width: 600px)");
    const matches440px = useMediaQuery("(min-width: 440px)");
    const matches320px = useMediaQuery("(min-width(320px)");

    const fetchBooksByCategory = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'booksbycategory', {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(category)
            });
            if (!response.ok) {
                return null;
            }
            await response.json()
                .then(data => {
                    if (data !== null) {
                        setBooks(data);
                        setDataFetched(true);
                    }
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchBooksByCategory();
    }, []);

    const openAdditionalDialog = async (bookId) => {
        await fetchBook(bookId, setAdditionalBook);
        setOpenAdditional(true);
    }

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
    const slidesToShow = defineSlides();

    const renderCenterRightControls = ({
        nextSlide,
        currentSlide,
        slideCount,
        slidesToShow,
    }) => {
        if (!((currentSlide + slidesToShow === slideCount) || books.length < slidesToShow)) {
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
        if (currentSlide !== 0 && books.length > slidesToShow) {
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

    const carouselStyle = (books.length < slidesToShow) ? { display: 'flex', justifyContent: 'center' } : {}

    return (
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
            {dataFetched && books.length > 0 && books.map((book, indexb) =>
                <div key={indexb} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <CardActionArea onClick={() => openAdditionalDialog(book.id)} sx={{ width: 120, height: 180, "&:hover": { filter: 'brightness(50%)' }, transition: '0.55s' }}>
                        <img
                            width='100%'
                            height='100%'
                            src={book.url}
                            alt={book.title}
                        />
                    </CardActionArea>
                    <Paper style={newPriceHolder} elevation={0}>
                        {currencyFormatter(book.price, '€')}
                    </Paper>
                    <BookDialog additionalBook={additionalBook} setAdditionalBook={setAdditionalBook} openAdditional={openAdditional} setOpenAdditional={setOpenAdditional} />
                </div >
            )}
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2.5vh', marginBottom: '2.5vh' }}><CircularProgress color="thirdary" /></div>}
        </Carousel>
    );
}