import { useState, useEffect } from "react";

import { CardActionArea, CircularProgress, IconButton, Paper } from "@mui/material";

import Carousel from "nuka-carousel/lib/carousel";

import AdditionalBook from "./AdditionalBook";

import useMediaQuery from "../Hooks/useMediaQuery";

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const newPriceHolder = { borderRadius: '25px', width: 78, height: 24, backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'display', fontSize: 14 };

export default function BooksinCategory({ category, setCartUpdated }) {
    const [books, setBooks] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const [openAdditional, setOpenAdditional] = useState(false);
    const [additionalBook, setAdditionalBook] = useState(null);

    const matchesXL = useMediaQuery("(min-width: 1280px)");
    const matchesM = useMediaQuery("(min-width: 800px)");
    const matchesS = useMediaQuery("(min-width: 600px)");
    const matchesXS = useMediaQuery("(min-width: 440px)");
    const matchesXXS = useMediaQuery("(min-width(320px)");


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

    const slidesToShow = defineSlides();

    const arrowMargin = defineArrowMargin();

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

    const fetchBooksByCat = () => {
        fetch(process.env.REACT_APP_API_URL + 'books', {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category)
        })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setBooks(data);
                    setDataFetched(true);
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchBooksByCat();
    }, []);

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
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

    const carouselStyle = (books.length < slidesToShow) ? { display: 'flex', justifyContent: 'center' } : {};

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
            {dataFetched && books.map((book, indexb) =>
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
                    <AdditionalBook setCartUpdated={setCartUpdated} additionalBook={additionalBook} setAdditionalBook={setAdditionalBook} openAdditional={openAdditional} setOpenAdditional={setOpenAdditional} />
                </div >
            )}
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 22, marginBottom: 22 }}><CircularProgress color="thirdary" /></div>}
        </Carousel>
    )
}