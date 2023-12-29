import { useContext, useEffect, useState } from "react";

import { Button, Card, CardActionArea, CircularProgress, Dialog, DialogContent, IconButton, Paper, Typography } from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { useNavigate } from "react-router-dom";

import useMediaQuery from "../Hooks/useMediaQuery";
import AuthContext from "../context/AuthContext";

function BookDialog({ additionalBook, setAdditionalBook, openAdditional, setOpenAdditional, isInCart }) {
    const [dataFetched, setDataFetched] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const { currencyFormatter, setCartDrawerOpen, addBookToCart } = useContext(AuthContext);

    const navigate = useNavigate();

    const matches900px = useMediaQuery("(min-width: 900px)");
    const matches600px = useMediaQuery("(min-width: 600px)");
    const matches400px = useMediaQuery("(min-width: 400px)");

    useEffect(() => {
        if (additionalBook !== null) {
            setDataFetched(true);
        }
    }, [additionalBook]);

    const handleClose = () => {
        setOpenAdditional(false);
        setAdditionalBook(null);
        setQuantity(1);
    }

    const relocateToBook = () => {
        handleClose();
        setCartDrawerOpen(false);
        navigate(`/book/${additionalBook.id}`);
    }

    const addCartToBookWithCustomQuantity = async (bookId) => {
        handleClose();
        await addBookToCart(bookId, quantity);
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

    // Custom styles
    const defineTitleWidth = () => {
        if (matches600px) {
            return 510;
        } else {
            return 400;
        }
    }
    const titleWidth = defineTitleWidth();

    const dialogDir = matches900px ? 'row' : 'column';
    const alignInfo = matches900px ? 'flex-start' : 'center';
    const alignTitle = matches900px ? 'left' : 'center';
    const titleSize = matches400px ? 'h6' : 'h7';
    const infoSize = matches400px ? 18 : 15;

    const priceWidth = matches400px ? 120 : 97;
    const priceHeight = matches400px ? 37 : 30;
    const priceFontSize = matches400px ? 20 : 17;

    const priceHolderPaper = { borderRadius: '25px', width: priceWidth, height: priceHeight, backgroundColor: 'black', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'display', fontSize: priceFontSize }
    const quantityCard = { borderRadius: '25px', width: 100, height: 35, backgroundColor: 'white', color: 'black', display: 'flex', alignItems: 'center', fontFamily: 'display', fontSize: 20, borderColor: 'black', borderStyle: 'solid', borderWidth: 2 }
    const buttonsPlusMinus = { borderColor: 'black', borderStyle: 'solid', borderWidth: 2, transition: '0.45s', "&:hover": { filter: 'brightness(70%)', backgroundColor: 'white' }, color: 'black', backgroundColor: 'white' }
    const buttonMinus = { ...buttonsPlusMinus, borderRadius: '25px 0px 0px 25px', marginLeft: -3.7, paddingLeft: 5.2 }
    const buttonPlus = { ...buttonsPlusMinus, borderRadius: '0px 25px 25px 0px', marginRight: -3.7, paddingRight: 5.2 }
    const quantityStyle = { width: 35, display: 'flex', justifyContent: 'center', fontFamily: 'display', fontSize: 17 }
    const cartStyle = { transition: '0.55s', borderRadius: '25px 25px 25px 25px', width: 175, backgroundColor: 'black', height: 37, color: 'white', fontFamily: 'serif', "&:hover": { backgroundColor: 'white', color: 'black' } }

    return (
        <Dialog fullWidth maxWidth='md' style={{ maxWidth: 850, margin: 'auto', display: 'flex', justifyContent: 'center' }} open={openAdditional} onClose={handleClose}>
            {dataFetched && (additionalBook !== null) &&
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
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
                                <Paper style={priceHolderPaper} elevation={0}>
                                    {currencyFormatter(additionalBook.price, '€')}
                                </Paper>
                                <Typography sx={{ marginBottom: -1 }} variant='h6' fontSize={infoSize}>ISBN: {additionalBook.isbn}</Typography>
                                <Typography sx={{ marginBottom: -1 }} variant='h6' fontSize={infoSize}>Category: {additionalBook.category.name}</Typography>
                                <Typography variant='h6' fontSize={infoSize}>Originally published: {additionalBook.bookYear}</Typography>
                                {!isInCart && <>
                                    <Typography variant='h7' sx={{ color: '#686868', marginBottom: -0.5 }}>Quantity:</Typography>
                                    <Card
                                        style={quantityCard}
                                        elevation={0}
                                    >
                                        <Button onClick={() => handleQuantity('-')} sx={buttonMinus}>-</Button>
                                        <Typography sx={quantityStyle}>{quantity}</Typography>
                                        <Button onClick={() => handleQuantity('+')} sx={buttonPlus}>+</Button>
                                    </Card>
                                </>}
                            </div>
                            {!isInCart && <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button onClick={() => addCartToBookWithCustomQuantity(additionalBook.id)} endIcon={<AddShoppingCartIcon />} sx={cartStyle} component={Paper} elevation={10} >
                                    Add to Cart
                                </Button>
                            </div>}
                        </div>
                    </div>
                </DialogContent>
            }
            {(!dataFetched || (additionalBook === null)) && <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 200 }}>
                    <CircularProgress color="inherit" />
                </div>
            </DialogContent>}
        </Dialog>
    );
}

export default BookDialog;