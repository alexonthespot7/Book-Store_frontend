import { Button, Card, CardActionArea, CircularProgress, Dialog, DialogContent, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import useMediaQuery from "../Hooks/useMediaQuery";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdditionalBook({ additionalBook, setAdditionalBook, openAdditional, setOpenAdditional }) {
    const matchesFirst = useMediaQuery("(min-width: 900px)");
    const matchesSecond = useMediaQuery("(min-width: 600px)");
    const matchesThird = useMediaQuery("(min-width: 400px)");


    const defineTitleWidth = () => {
        if (matchesSecond) {
            return 510;
        } else {
            return 400;
        }
    }

    const dialogDir = matchesFirst ? 'row' : 'column';
    const alignInfo = matchesFirst ? 'flex-start' : 'center';
    const alignTitle = matchesFirst ? 'left' : 'center';
    const titleWidth = defineTitleWidth();
    const titleSize = matchesThird ? 'h6' : 'h7';
    const infoSize = matchesThird ? 18 : 15;

    const priceWidth = matchesThird ? 120 : 97;
    const priceHeight = matchesThird ? 37 : 30;
    const priceFontSize = matchesThird ? 20 : 17;

    const priceHolderDialog = { borderRadius: '25px', width: priceWidth, height: priceHeight, backgroundColor: 'black', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'display', fontSize: priceFontSize };
    const quantityCard = { borderRadius: '25px', width: 100, height: 35, backgroundColor: 'white', color: 'black', display: 'flex', alignItems: 'center', fontFamily: 'display', fontSize: 20, borderColor: 'black', borderStyle: 'solid', borderWidth: 2 }
    const buttonMinus = { borderColor: 'black', borderStyle: 'solid', borderWidth: 2, transition: '0.45s', "&:hover": { filter: 'brightness(70%)', backgroundColor: 'white' }, color: 'black', backgroundColor: 'white', borderRadius: '25px 0px 0px 25px', marginLeft: -3.7, paddingLeft: 5.2 };
    const buttonPlus = { borderColor: 'black', borderStyle: 'solid', borderWidth: 2, transition: '0.45s', "&:hover": { filter: 'brightness(70%)', backgroundColor: 'white' }, color: 'black', backgroundColor: 'white', borderRadius: '0px 25px 25px 0px', marginRight: -3.7, paddingRight: 5.2 };
    const quantityStyle = { width: 35, display: 'flex', justifyContent: 'center', fontFamily: 'display', fontSize: 17 };
    const cartStyle = { transition: '0.55s', borderRadius: '25px 25px 25px 25px', width: 175, backgroundColor: 'black', height: 37, color: 'white', fontFamily: 'serif', "&:hover": { backgroundColor: 'white', color: 'black' } }

    const [dataFetched, setDataFetched] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const { setSecondDrawerOpen, setAction, setActionMsg } = useContext(AuthContext);

    useEffect(() => {
        if (additionalBook !== null) {
            setDataFetched(true);
        }
    }, [additionalBook]);

    const handleClose = () => {
        setOpenAdditional(false);
        setAdditionalBook(null);
    }

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
    }

    const handleQuantity = (operation) => {
        if (operation === '-') {
            if (quantity > 1) {
                setQuantity(prev => prev - 1);
            }
        } else {
            setQuantity(prev => prev + 1);
        }
    }

    const createCart = (bookid) => {
        fetch(process.env.REACT_APP_API_URL + 'createbacket', {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                sessionStorage.setItem('cartId', data.id);
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
            body: JSON.stringify({ quantity: quantity, bookid: bookid, password: password })
        })
            .then(response => {
                if (response.ok) {
                    handleClose();
                    setSecondDrawerOpen(true);
                    setAction(true);
                    setActionMsg('The book was added to cart')
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
                body: JSON.stringify({ quantity: quantity })
            })
                .then(response => {
                    if (response.ok) {
                        handleClose();
                        setSecondDrawerOpen(true);
                        setAction(true);
                        setActionMsg('The book was added to cart');
                    } else {
                        alert('Something went wrong during adding new category');
                    }
                })
                .catch(err => console.error(err));
        } else {
            addToNonuserCart(bookid);
        }
    }

    const navigate = useNavigate();

    const relocateToBook = () => {
        handleClose();
        navigate(`/book/${additionalBook.id}`);
    }

    return (
        <Dialog fullWidth maxWidth='md' style={{ maxWidth: 850, margin: 'auto', display: 'flex', justifyContent: 'center' }} open={openAdditional} onClose={handleClose}>
            {dataFetched && (additionalBook !== null) && <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <IconButton onClick={handleClose} sx={{ width: 30, height: 30, marginTop: -2, marginRight: -2 }} color='black'>
                    <CloseIcon />
                </IconButton>
                <div style={{ display: 'flex', flexDirection: dialogDir, gap: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <CardActionArea
                        onClick={relocateToBook}
                        sx={{
                            width: 200,
                            height: 300,
                            "&:hover": { filter: 'brightness(50%)' },
                            transition: '0.45s'
                        }}
                    >
                        <img
                            alt={additionalBook.title + ' cover'}
                            src={additionalBook.url}
                            width='100%'
                            height='100%'
                        />
                    </CardActionArea>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: alignInfo }}>
                            <Typography
                                align={alignTitle}
                                sx={{ maxWidth: titleWidth }}
                                fontWeight='bold'
                                variant={titleSize}
                            >
                                {additionalBook.author + ': ' + additionalBook.title}
                            </Typography>
                            <Paper style={priceHolderDialog} elevation={0}>
                                {currencyFormatter(additionalBook.price, '€')}
                            </Paper>
                            <Typography sx={{ marginBottom: -1 }} variant='h6' fontSize={infoSize}>ISBN: {additionalBook.isbn}</Typography>
                            <Typography sx={{ marginBottom: -1 }} variant='h6' fontSize={infoSize}>Category: {additionalBook.category.name}</Typography>
                            <Typography variant='h6' fontSize={infoSize}>Originally published: {additionalBook.bookYear}</Typography>
                            <Typography variant='h7' sx={{ color: '#686868', marginBottom: -0.5 }}>Quantity:</Typography>
                            <Card
                                style={quantityCard}
                                elevation={0}
                            >
                                <Button onClick={() => handleQuantity('-')} sx={buttonMinus}>-</Button>
                                <Typography sx={quantityStyle}>{quantity}</Typography>
                                <Button onClick={() => handleQuantity('+')} sx={buttonPlus}>+</Button>
                            </Card>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button onClick={() => addToCart(additionalBook.id)} endIcon={<AddShoppingCartIcon />} sx={cartStyle} component={Paper} elevation={10} >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>}
            {(!dataFetched || (additionalBook === null)) && <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 200 }}>
                    <CircularProgress color="inherit" />
                </div>
            </DialogContent>}
        </Dialog>
    );
}

export default AdditionalBook;