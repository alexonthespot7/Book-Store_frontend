import { CardActionArea, CircularProgress, Dialog, DialogContent, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from "../Hooks/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function BookInCart({ bookInCart, setBookInCart, openInCart, setOpenInCart }) {
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

    const [dataFetched, setDataFetched] = useState(false);

    const { setCartDrawerOpen } = useContext(AuthContext);

    useEffect(() => {
        if (bookInCart !== null) {
            setDataFetched(true);
        }
    }, [bookInCart]);

    const handleClose = () => {
        setCartDrawerOpen(false);
        setOpenInCart(false);
        setBookInCart(null);
    }

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
    }

    const navigate = useNavigate();

    const relocateToBook = () => {
        handleClose();
        navigate(`/book/${bookInCart.id}`);
    }

    return (
        <Dialog fullWidth maxWidth='md' style={{ maxWidth: 850, margin: 'auto', display: 'flex', justifyContent: 'center' }} open={openInCart} onClose={handleClose}>
            {dataFetched && (bookInCart !== null) && <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
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
                            alt={bookInCart.title + ' cover'}
                            src={bookInCart.url}
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
                                {bookInCart.author + ': ' + bookInCart.title}
                            </Typography>
                            <Paper style={priceHolderDialog} elevation={0}>
                                {currencyFormatter(bookInCart.price, '€')}
                            </Paper>
                            <Typography sx={{ marginBottom: -1 }} variant='h6' fontSize={infoSize}>ISBN: {bookInCart.isbn}</Typography>
                            <Typography sx={{ marginBottom: -1 }} variant='h6' fontSize={infoSize}>Category: {bookInCart.category.name}</Typography>
                            <Typography variant='h6' fontSize={infoSize}>Originally published: {bookInCart.bookYear}</Typography>
                        </div>
                    </div>
                </div>
            </DialogContent>}
            {(!dataFetched || (bookInCart === null)) && <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 200 }}>
                    <CircularProgress color="inherit" />
                </div>
            </DialogContent>}
        </Dialog>
    )
}

export default BookInCart;