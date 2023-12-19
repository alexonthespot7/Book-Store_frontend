import { Card, CircularProgress, Divider, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import { useState, useEffect } from "react";
import useMediaQuery from "../Hooks/useMediaQuery";



import BookInCart from "./BookInCart";
import DialogInfo from "./DialogInfo";


function Order({ order, alignProp, marginProp }) {
    const [booksInOrder, setBooksInOrder] = useState([]);
    const [total, setTotal] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [bookInCart, setBookInCart] = useState(null);
    const [openInCart, setOpenInCart] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [textInfo, setTextInfo] = useState('');
    const [infoField, setInfoField] = useState('');

    const matchesXXL = useMediaQuery("(min-width: 1120px)");
    const matchesXL = useMediaQuery("(min-width: 1040px)");
    const matchesM = useMediaQuery("(min-width: 850px)");
    const matchesS = useMediaQuery("(min-width: 440px)");
    const matchesXS = useMediaQuery("(min-width: 360px)");
    const matchesXXS = useMediaQuery("(min-width: 330px)");

    const mDirection = matchesM ? 'row' : 'column-reverse';
    const alignM = matchesM ? 'flex-start' : 'center';
    const orderMarginM = matchesM ? 0 : 1;
    const defineMainGapML = () => {
        if (matchesXXL) {
            return 200;
        } else if (matchesXL) {
            return 150;
        } else if (matchesM) {
            return 130;
        } else {
            return 15;
        }
    }
    const mainGapM = defineMainGapML();
    const defineWidthMinus = () => {
        if (matchesXS) {
            return 0;
        } else if (matchesXXS) {
            return 30;
        } else {
            return 65;
        }
    }
    const defineMarginInsideMinus = () => {
        if (matchesXS) {
            return 0;
        } else if (matchesXXS) {
            return 10;
        } else {
            return 15;
        }
    }

    const defineWidthMinusTitle = () => {
        if (matchesXS) {
            return 0;
        } else if (matchesXXS) {
            return 15;
        } else {
            return 30;
        }
    }

    const widthMinusTitle = defineWidthMinusTitle();
    const widthMinus = defineWidthMinus();
    const marginInsideMinus = defineMarginInsideMinus();

    const fetchTotal = () => {
        fetch(process.env.REACT_APP_API_URL + 'getordertotal/' + order.orderid,
            {
                method: 'GET'
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setTotal(data.total);
                    setDataLoaded(true);
                }
            })
            .catch(err => console.error(err));
    }

    const fetchProductsInOrder = () => {
        fetch(process.env.REACT_APP_API_URL + 'booksinbacket/' + order.orderid,
            {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setBooksInOrder(data);
                    fetchTotal();
                } else {
                    alert('Something went wrong');
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchProductsInOrder();
    }, []);

    const openBookInCart = (thisbookid) => {
        setOpenInCart(true);
        fetch(process.env.REACT_APP_API_URL + 'books/' + thisbookid,
            {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setBookInCart(data);
                } else {
                    alert('There is no such book');
                }
            })
            .catch(err => console.error(err));
    }

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
    }

    const infoTextHandle = (text, field) => {
        if (text.length > 'shevelenkov1aa@eduspbsturu'.length) {
            setOpenInfo(true);
            setTextInfo(text);
            setInfoField(field);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column' }}>
            {dataLoaded && <div>
                <Typography variant='h4' textAlign={matchesM ? alignProp : 'center'} fontSize={22} sx={{ marginLeft: matchesM ? marginProp : 0, marginTop: 2, marginBottom: 2 }}>Order number: {order.orderid}</Typography>
                <div style={{ display: 'flex', flexDirection: mDirection, alignItems: alignM, justifyContent: 'center', gap: mainGapM }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: alignM }}>
                        <Typography sx={{ marginBottom: 1 }} variant='h6'>Delivery details</Typography>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>STATUS </Typography>
                            <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order.status, 'Status')} sx={{ cursor: order.status.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.status}</Typography>
                            <Divider />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>FIRSTNAME </Typography>
                            <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order.firstname, 'Firstname')} sx={{ cursor: order.firstname.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.firstname}</Typography>
                            <Divider />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>LASTNAME </Typography>
                            <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order.lastname, 'Lastname')} sx={{ cursor: order.lastname.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.lastname}</Typography>
                            <Divider />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>EMAIL </Typography>
                            <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order.email, 'Email')} sx={{ cursor: order.email.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.email}</Typography>
                            <Divider />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>COUNTRY </Typography>
                            <Typography textAlign='left' noWrap sx={{ width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.country}</Typography>
                            <Divider />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>CITY </Typography>
                            <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order.city, 'City')} sx={{ cursor: order.city.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.city}</Typography>
                            <Divider />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>STREET, HOME, APARTMENT </Typography>
                            <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order.street, 'Street Address')} sx={{ cursor: order.street.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.street}</Typography>
                            <Divider />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>POSTCODE </Typography>
                            <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order.postcode, 'Postcode')} sx={{ cursor: order.postcode.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.postcode}</Typography>
                            <Divider />
                        </div>
                        {order.note !== '' && <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>NOTE </Typography>
                            <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order.note, 'Note')} sx={{ cursor: order.note.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.note}</Typography>
                            <Divider />
                        </div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: alignM }}>
                        <Typography sx={{ marginBottom: 1 - orderMarginM * 2, marginTop: orderMarginM }} variant='h6'>Your order</Typography>
                        <Card sx={{ borderRadius: '25px', width: 300 - widthMinus, backgroundColor: '#E8E8E8' }}>
                            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', marginBottom: 20 }}>
                                {booksInOrder.map((book, index) =>
                                    <div style={{ marginLeft: 20 - marginInsideMinus, marginRight: 20 - marginInsideMinus, display: 'flex', flexDirection: 'column', gap: 17.5 }} key={index}>
                                        <Typography onClick={() => openBookInCart(book.bookid)} textAlign='left' sx={{ cursor: 'pointer', minWidth: 175, maxWidth: 240 - widthMinusTitle, "&:hover": { color: '#808080' }, marginBottom: -1.75, transition: '0.45s' }} fontSize={17} variant='h7'>{book.author}</Typography>
                                        <Typography onClick={() => openBookInCart(book.bookid)} textAlign='left' sx={{ cursor: 'pointer', minWidth: 175, maxWidth: 240 - widthMinusTitle, "&:hover": { color: '#808080' }, transition: '0.45s' }} fontSize={17} variant='h7'>{book.title}</Typography>
                                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                            <Typography variant='h7' fontSize={16} fontFamily='serif' color='#A9A9A9'>Quantity:</Typography>
                                            <Typography textAlign='left' sx={{ minWidth: 175, maxWidth: 240 - widthMinusTitle }} fontSize={16} variant='h7'>{book.quantity}</Typography>
                                        </div>
                                        <Typography textAlign='left' sx={{ minWidth: 175, maxWidth: 240 - widthMinusTitle }} fontSize={16} variant='h7'>{currencyFormatter(book.price * book.quantity, '€')}</Typography>
                                        {(index !== booksInOrder.length - 1) && <Divider style={{ marginBottom: 30, marginLeft: -20 + marginInsideMinus, marginRight: -20 + marginInsideMinus, marginTop: 12.5 }} />}
                                    </div>
                                )}
                            </div>
                        </Card>
                        <div style={{ display: 'flex', gap: 10, marginLeft: 20, marginBottom: 0, alignItems: 'center' }}>
                            <Typography fontFamily='serif'>TOTAL PAID:</Typography>
                            <Typography fontWeight='bold' fontSize={18}>{currencyFormatter(total, '€')}</Typography>
                        </div>
                        <Divider style={{ width: '100%', marginBottom: 20 }} />
                    </div>
                    <BookInCart bookInCart={bookInCart} setBookInCart={setBookInCart} openInCart={openInCart} setOpenInCart={setOpenInCart} />
                </div >
                <DialogInfo openInfo={openInfo} setOpenInfo={setOpenInfo} textInfo={textInfo} setTextInfo={setTextInfo} infoField={infoField} setInfoField={setInfoField} />
            </div>}
            {!dataLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 22, marginBottom: 22 }}><CircularProgress color="inherit" /></div>}
        </motion.div>
    );
}

export default Order;