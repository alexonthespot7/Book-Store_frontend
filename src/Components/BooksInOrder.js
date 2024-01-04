import { useContext, useState } from "react";

import { Card, Divider, Typography, useMediaQuery } from "@mui/material";

import AuthContext from "../context/AuthContext";
import BookDialog from "./BookDialog";

const defaultFont = 16;

export default function BooksInOrder({ booksInCart, total }) {
    const [bookInCart, setBookInCart] = useState(null);
    const [openInCart, setOpenInCart] = useState(false);

    const { currencyFormatter, fetchBook } = useContext(AuthContext);

    const matches850px = useMediaQuery("(min-width: 850px)");
    const matches360px = useMediaQuery("(min-width: 360px)");
    const matches330px = useMediaQuery("(min-width: 330px)");
    const matches300px = useMediaQuery("(min-width: 300px)");

    const openBookInCart = async (bookId) => {
        await fetchBook(bookId, setBookInCart);
        setOpenInCart(true);
    }

    const orderHeaderMargin = matches850px ? 0 : 1;

    const defineResponsiveWidth = () => {
        if (matches360px) {
            return 0;
        } else if (matches330px) {
            return 30;
        } else if (matches300px) {
            return 65;
        } else {
            return 80;
        }
    }
    const responsiveWidth = defineResponsiveWidth();

    const defineOrderBodyResponsiveMargin = () => {
        if (matches360px) {
            return 0;
        } else if (matches330px) {
            return 10;
        } else if (matches300px) {
            return 15;
        } else {
            return 16;
        }
    }
    const orderBodyResponsiveMargin = defineOrderBodyResponsiveMargin();

    const defineOrderBodyResponsiveWidth = () => {
        if (matches360px) {
            return 0;
        } else if (matches330px) {
            return 15;
        } else if (matches300px) {
            return 30;
        } else {
            return 40;
        }
    }
    const orderBodyResponsiveWidth = defineOrderBodyResponsiveWidth();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
            <Typography sx={{ marginBottom: 1 - orderHeaderMargin * 2, marginTop: orderHeaderMargin }} variant='h6'>Order</Typography>
            <Card sx={{ borderRadius: '25px', width: 300 - responsiveWidth, backgroundColor: '#E8E8E8' }}>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', marginBottom: 20 }}>
                    {booksInCart.map((book, index) =>
                        <div style={{ marginLeft: 20 - orderBodyResponsiveMargin, marginRight: 20 - orderBodyResponsiveMargin, display: 'flex', flexDirection: 'column', gap: 17.5 }} key={index}>
                            <Typography onClick={() => openBookInCart(book.bookid)} textAlign='left' sx={{ cursor: 'pointer', minWidth: 175, maxWidth: 240 - orderBodyResponsiveWidth, "&:hover": { color: '#808080' }, marginBottom: -1.75, transition: '0.45s' }} fontSize={17} variant='h7'>{book.author}</Typography>
                            <Typography onClick={() => openBookInCart(book.bookid)} textAlign='left' sx={{ cursor: 'pointer', minWidth: 175, maxWidth: 240 - orderBodyResponsiveWidth, "&:hover": { color: '#808080' }, transition: '0.45s' }} fontSize={17} variant='h7'>{book.title}</Typography>
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                <Typography variant='h7' fontSize={defaultFont} fontFamily='serif' color='#A9A9A9'>Quantity:</Typography>
                                <Typography textAlign='left' sx={{ minWidth: 175, maxWidth: 240 - orderBodyResponsiveWidth }} fontSize={16} variant='h7'>{book.quantity}</Typography>
                            </div>
                            <Typography textAlign='left' sx={{ minWidth: 175, maxWidth: 240 - orderBodyResponsiveWidth }} fontSize={16} variant='h7'>{currencyFormatter(book.price * book.quantity, '€')}</Typography>
                            {(index !== booksInCart.length - 1) && <Divider style={{ marginBottom: 30, marginLeft: -20 + orderBodyResponsiveMargin, marginRight: -20 + orderBodyResponsiveMargin, marginTop: 12.5 }} />}
                        </div>
                    )}

                </div>
            </Card>
            <div style={{ display: 'flex', gap: 10, marginLeft: 20, marginBottom: 0, alignItems: 'center' }}>
                <Typography fontFamily='serif'>TOTAL DUE:</Typography>
                <Typography fontWeight='bold' fontSize={18}>{currencyFormatter(total, '€')}</Typography>
            </div>
            <Divider style={{ width: '100%', marginBottom: 20 }} />
            <BookDialog additionalBook={bookInCart} setAdditionalBook={setBookInCart} openAdditional={openInCart} setOpenAdditional={setOpenInCart} isInCart={true} />
        </div>
    );
}