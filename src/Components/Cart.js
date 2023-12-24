
import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext, useState, useEffect, useMemo } from 'react';

import MuiAlert from '@mui/material/Alert';

import { Button, Card, CardActionArea, CircularProgress, Divider, Paper, Snackbar, TextField, Typography } from '@mui/material';

import EastIcon from '@mui/icons-material/East';

import countryList from 'react-select-country-list';
import Select from 'react-select';

import AuthContext from '../context/AuthContext';
import BookInCart from './BookInCart';

import visa from '../pictures/visa.png';

import mscard from '../pictures/mscard.png';
import { createSearchParams, Navigate } from 'react-router-dom';
import useMediaQuery from '../Hooks/useMediaQuery';

const defaultFont = 16;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const buttonProceedStyle = {
    transition: '0.4s',
    borderRadius: '25px 25px 25px 25px',
    marginBottom: 2.5,
    width: 175, height: 40,
    backgroundColor: 'black',
    color: 'white',
    fontFamily: 'serif',
    "&:hover": { backgroundColor: '#585858' }
}

function Cart() {
    const [booksInCart, setBooksInCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [user, setUser] = useState({});
    const [addressInfo, setAddressInfo] = useState({
        firstname: '',
        lastname: '',
        email: '',
        country: '',
        city: '',
        street: '',
        postcode: '',
        note: ''
    });
    const [country, setCountry] = useState({
        value: '',
        label: ''
    });
    const [infoLoaded, setInfoLoaded] = useState(false);
    const [step, setStep] = useState(1);

    const [bookInCart, setBookInCart] = useState(null);
    const [openInCart, setOpenInCart] = useState(false);

    const [method, setMethod] = useState('');
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const options = useMemo(() => countryList().getData(), []);

    const { setBgrColor } = useContext(AuthContext);

    const matchesM = useMediaQuery("(min-width: 850px)");
    const matchesS = useMediaQuery("(min-width: 440px)");
    const matchesXS = useMediaQuery("(min-width: 360px)");
    const matchesXXS = useMediaQuery("(min-width: 330px)");
    const matchesXXXS = useMediaQuery("(min-width: 300px)");

    const mDirection = matchesM ? 'row' : 'column-reverse';
    const alignM = matchesM ? 'flex-start' : 'center';
    const orderMarginM = matchesM ? 0 : 1;
    const mainGapM = matchesM ? 200 : 30;

    const defineWidthMinus = () => {
        if (matchesXS) {
            return 0;
        } else if (matchesXXS) {
            return 30;
        } else if (matchesXXXS) {
            return 65;
        } else {
            return 80;
        }
    }
    const defineMarginInsideMinus = () => {
        if (matchesXS) {
            return 0;
        } else if (matchesXXS) {
            return 10;
        } else if (matchesXXXS) {
            return 15;
        } else {
            return 16;
        }
    }

    const defineWidthMinusTitle = () => {
        if (matchesXS) {
            return 0;
        } else if (matchesXXS) {
            return 15;
        } else if (matchesXXXS) {
            return 30;
        } else {
            return 40;
        }
    }

    const widthMinusTitle = defineWidthMinusTitle();
    const widthMinus = defineWidthMinus();
    const marginInsideMinus = defineMarginInsideMinus();
    const dirButtonDiv = matchesXS ? 'row' : 'column-reverse';
    const alignButtonDiv = matchesXS ? 'flex-end' : 'center';
    const stepsMargin = matchesXS ? 0 : 10;

    const dirMethods = matchesS ? 'row' : 'column';
    const alignMethods = matchesS ? 'flex-start' : 'center';
    const alignPayButtons = matchesS ? 'flex-end' : 'center';

    const fetchUser = (userid) => {
        const token = sessionStorage.getItem('jwt');
        fetch(process.env.REACT_APP_API_URL + 'users/' + userid,
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setInfoLoaded(true);
                    setUser(data);
                    setAddressInfo({
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email,
                        country: '',
                        city: data.city,
                        street: data.street,
                        postcode: data.postcode,
                        note: ''
                    });
                    if (data.country !== '') {
                        setCountry({
                            value: countryList().getValue(data.country),
                            label: data.country
                        });
                    }
                }
            })
            .catch(err => console.error(err));
    }

    const fetchTotal = (token, userId) => {
        fetch(process.env.REACT_APP_API_URL + 'getcurrenttotal',
            {
                method: 'GET',
                headers: { 'Authorization': token }
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setTotal(data.total);
                    fetchUser(userId);
                }
            })
            .catch(err => console.error(err));
    }

    const fetchCartByUserId = () => {
        const token = sessionStorage.getItem('jwt');
        const id = sessionStorage.getItem('authorizedId');

        fetch(process.env.REACT_APP_API_URL + 'showcart/' + id,
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setBooksInCart(data);
                    fetchTotal(token, id);
                }
            })
            .catch(err => console.error(err));
    }

    const fetchTotalNotLogged = (backetId, password) => {
        fetch(process.env.REACT_APP_API_URL + 'totalofbacket', {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: backetId, password: password })
        })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setTotal(data.total);
                    setAddressInfo({
                        firstname: '',
                        lastname: '',
                        email: '',
                        country: '',
                        city: '',
                        street: '',
                        postcode: '',
                        note: ''
                    });
                    setInfoLoaded(true);
                }
            })
            .catch(err => console.error(err));
    }

    const fetchCartByBacketId = () => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');
        fetch(process.env.REACT_APP_API_URL + 'showcart', {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: backetId, password: password })
        })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setBooksInCart(data);
                    fetchTotalNotLogged(backetId, password);
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        setBgrColor('#FFFAFA');
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            fetchCartByUserId();
        } else if (sessionStorage.getItem('cartId') !== null) {
            fetchCartByBacketId();
        }
    }, []);

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
    }

    const changeAddressInfo = (event) => {
        setAddressInfo({ ...addressInfo, [event.target.name]: event.target.value });
    }

    const changeCountry = (value) => {
        setCountry(value);
        setAddressInfo({ ...addressInfo, country: value.label })
    }

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

    const proceed = () => {
        let check = true;

        if (addressInfo.firstname === '') {
            check = false;
            setError(true);
            setErrorMsg('Please fill in the firstname');
        }
        if (addressInfo.lastname === '') {
            check = false;
            setError(true);
            setErrorMsg('Please fill in the lastname to proceed')
        }
        if (addressInfo.email === '') {
            check = false;
            setError(true);
            setErrorMsg('Please fill in the email to proceed')
        }
        if (addressInfo.country === '' && country.label === '') {
            check = false;
            setError(true);
            setErrorMsg('Please fill in the country to proceed')
        }
        if (addressInfo.city === '') {
            check = false;
            setError(true);
            setErrorMsg('Please fill in the city to proceed')
        }
        if (addressInfo.street === '') {
            check = false;
            setError(true);
            setErrorMsg('Please fill in the address to proceed')
        }
        if (addressInfo.postcode === '') {
            check = false;
            setError(true);
            setErrorMsg('Please fill in the postocode to proceed')
        }

        if (check) {
            if (addressInfo.country === '') {
                setAddressInfo({ ...addressInfo, country: country.label });
            }
            setStep(2);
            window.scrollTo(0, 0);
        }
    }

    const makeSaleNotLogged = () => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');

        const notUserAddressInfo = { ...addressInfo, backetid: backetId, password: password }
        fetch(process.env.REACT_APP_API_URL + 'makesale', {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notUserAddressInfo)
        })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setInfoLoaded(true);
                    setTotal(0);
                    sessionStorage.removeItem('cartId');
                    sessionStorage.removeItem('cartPass');
                    alert('Thank you for your purchase! Please write down or take a photo of your:\nOrder number: ' + data.orderid + '\nOrder Password: ' + data.password);
                } else {
                    alert('Something went wrong during making the sale')
                }
            })
            .catch(err => console.error(err));
    }

    const makeSale = () => {
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            const token = sessionStorage.getItem('jwt');
            const localUserId = sessionStorage.getItem('authorizedId');

            fetch(process.env.REACT_APP_API_URL + 'makesale/' + localUserId, {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(addressInfo)
            })
                .then(response => response.json())
                .then(data => {
                    if (data !== null) {
                        fetchTotal(token, localUserId);
                        setInfoLoaded(true);
                        alert('Thank you for your purchase! Please write down or take a photo of your:\nOrder number: ' + data.orderid + '\nOrder Password: ' + data.password);
                    } else {
                        alert('Something went wrong during making the sale')
                    }
                })
                .catch(err => console.error(err));
        } else if (sessionStorage.getItem('cartId')) {
            makeSaleNotLogged();
        } else {
            alert('It is impossible to make purchase right now');
        }
    }

    const pay = () => {
        let check = true;

        if (method === '') {
            check = false;
            setError(true);
            setErrorMsg('Please choose payment method');
        }
        if (check);
        setInfoLoaded(false);
        makeSale();
    }

    return (
        <AnimatePresence>
            <motion.div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h5' textAlign='center' sx={{ marginTop: 2, marginBottom: 2 }}>Checkout</Typography>
                {(infoLoaded && total > 0) && <div style={{ display: 'flex', flexDirection: mDirection, alignItems: alignM, justifyContent: 'center', gap: mainGapM }}>
                    {step === 1 && <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: alignM }}>
                        <Typography sx={{ marginBottom: 1 }} variant='h6'>Enter delivery details</Typography>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>FIRSTNAME </Typography>
                            <TextField
                                onChange={changeAddressInfo}
                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 255 - widthMinus }}
                                size='small'
                                name='firstname'
                                value={addressInfo.firstname}
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>LASTNAME </Typography>
                            <TextField
                                onChange={changeAddressInfo}
                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 255 - widthMinus }}
                                size='small'
                                name='lastname'
                                value={addressInfo.lastname}
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>EMAIL </Typography>
                            <TextField
                                onChange={changeAddressInfo}
                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 255 - widthMinus }}
                                size='small'
                                name='email'
                                value={addressInfo.email}
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>COUNTRY </Typography>
                            <Select
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        width: 270 - widthMinus,
                                        minHeight: 20,
                                        height: 35,
                                        backgroundColor: '#E8E8E8',
                                        borderRadius: '25px',
                                        textAlign: 'left'
                                    }),
                                    menu: (baseStyles, state) => ({
                                        ...baseStyles,
                                        width: 270 - widthMinus,
                                        backgroundColor: '#E8E8E8',
                                        borderRadius: '25px',
                                        textAlign: 'left'
                                    }),
                                    menuList: (baseStyles, state) => ({
                                        ...baseStyles,
                                        width: 270 - widthMinus,
                                        backgroundColor: '#E8E8E8',
                                        borderRadius: '25px',
                                        "::-webkit-scrollbar": {
                                            display: 'none'
                                        },
                                        textAlign: 'left'
                                    })
                                }} options={options} value={country} onChange={changeCountry} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>CITY </Typography>
                            <TextField
                                onChange={changeAddressInfo}
                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 255 - widthMinus }}
                                size='small'
                                name='city'
                                value={addressInfo.city}
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>STREET, HOME, APARTMENT  </Typography>
                            <TextField
                                onChange={changeAddressInfo}
                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 255 - widthMinus }}
                                size='small'
                                name='street'
                                value={addressInfo.street}
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>POSTCODE </Typography>
                            <TextField
                                onChange={changeAddressInfo}
                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 255 - widthMinus }}
                                size='small'
                                name='postcode'
                                value={addressInfo.postcode}
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>NOTE </Typography>
                            <TextField
                                onChange={changeAddressInfo}
                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 255 - widthMinus }}
                                size='small'
                                name='note'
                                value={addressInfo.note}
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: dirButtonDiv, alignItems: alignButtonDiv, justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
                            <Button onClick={proceed} endIcon={<EastIcon color='white' fontSize='small' />} sx={buttonProceedStyle} component={Paper} elevation={10} >
                                Proceed
                            </Button>
                            <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 16 - stepsMargin, marginLeft: 10 - stepsMargin, gap: 5 }}>
                                <Typography fontFamily='display' fontWeight='bold' fontSize={17}>Step {step}</Typography>
                                <Typography fontFamily='display' fontSize={17}>of 2</Typography>
                            </div>
                        </div>
                    </div>}
                    {step === 2 && <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: alignM }}>
                        <Typography sx={{ marginBottom: 1 }} variant='h6'>Payment method</Typography>
                        <div style={{ display: 'flex', gap: 40, flexDirection: dirMethods }}>
                            <CardActionArea onClick={() => setMethod('visa')} sx={{ filter: method === 'visa' ? 'brightness(70%)' : 'default', transition: '0.55s', "&:hover": { filter: 'brightness(70%)' } }} style={{ backgroundColor: '#E8E8E8', width: 175, height: 175, borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img
                                    src={visa}
                                    width={150}
                                    height={84.37}
                                    alt='Visa payment method'
                                />
                            </CardActionArea>
                            <CardActionArea onClick={() => setMethod('ms')} sx={{ filter: method === 'ms' ? 'brightness(70%)' : 'default', transition: '0.55s', "&:hover": { filter: 'brightness(70%)' } }} style={{ backgroundColor: '#E8E8E8', width: 175, height: 175, borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img
                                    src={mscard}
                                    width={150}
                                    height={150}
                                    alt='Mastercard payment method'
                                />
                            </CardActionArea>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 20, flexDirection: dirMethods, alignItems: alignPayButtons }}>
                            <Typography
                                onClick={() => {
                                    setStep(1);
                                    window.scrollTo(0, 0);
                                }}
                                style={{ marginBottom: 20, marginRight: 10 }}
                                sx={{ cursor: 'pointer', textDecoration: 'underline', "&:hover": { filter: 'brightness(125%)' }, transition: '0.45s', display: 'flex', alignItems: 'flex-end' }}
                                variant='body'
                                color='#A9A9A9'
                                fontSize={14}
                            >
                                Back
                            </Typography>
                            <Button onClick={pay} endIcon={<EastIcon color='white' fontSize='small' />} sx={buttonProceedStyle} component={Paper} elevation={10} >
                                Pay
                            </Button>
                            <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 16, marginLeft: 10, gap: 5 }}>
                                <Typography fontFamily='display' fontWeight='bold' fontSize={17}>Step {step}</Typography>
                                <Typography fontFamily='display' fontSize={17}>of 2</Typography>
                            </div>
                        </div>
                    </div>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: alignM }}>
                        <Typography sx={{ marginBottom: 1 - orderMarginM * 2, marginTop: orderMarginM }} variant='h6'>Your order</Typography>
                        <Card sx={{ borderRadius: '25px', width: 300 - widthMinus, backgroundColor: '#E8E8E8' }}>
                            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', marginBottom: 20 }}>
                                {booksInCart.map((book, index) =>
                                    <div style={{ marginLeft: 20 - marginInsideMinus, marginRight: 20 - marginInsideMinus, display: 'flex', flexDirection: 'column', gap: 17.5 }} key={index}>
                                        <Typography onClick={() => openBookInCart(book.bookid)} textAlign='left' sx={{ cursor: 'pointer', minWidth: 175, maxWidth: 240 - widthMinusTitle, "&:hover": { color: '#808080' }, marginBottom: -1.75, transition: '0.45s' }} fontSize={17} variant='h7'>{book.author}</Typography>
                                        <Typography onClick={() => openBookInCart(book.bookid)} textAlign='left' sx={{ cursor: 'pointer', minWidth: 175, maxWidth: 240 - widthMinusTitle, "&:hover": { color: '#808080' }, transition: '0.45s' }} fontSize={17} variant='h7'>{book.title}</Typography>
                                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                            <Typography variant='h7' fontSize={defaultFont} fontFamily='serif' color='#A9A9A9'>Quantity:</Typography>
                                            <Typography textAlign='left' sx={{ minWidth: 175, maxWidth: 240 - widthMinusTitle }} fontSize={16} variant='h7'>{book.quantity}</Typography>
                                        </div>
                                        <Typography textAlign='left' sx={{ minWidth: 175, maxWidth: 240 - widthMinusTitle }} fontSize={16} variant='h7'>{currencyFormatter(book.price * book.quantity, '€')}</Typography>
                                        {(index !== booksInCart.length - 1) && <Divider style={{ marginBottom: 30, marginLeft: -20 + marginInsideMinus, marginRight: -20 + marginInsideMinus, marginTop: 12.5 }} />}
                                    </div>
                                )}

                            </div>
                        </Card>
                        <div style={{ display: 'flex', gap: 10, marginLeft: 20, marginBottom: 0, alignItems: 'center' }}>
                            <Typography fontFamily='serif'>TOTAL DUE:</Typography>
                            <Typography fontWeight='bold' fontSize={18}>{currencyFormatter(total, '€')}</Typography>
                        </div>
                        <Divider style={{ width: '100%', marginBottom: 20 }} />
                    </div>
                    <BookInCart bookInCart={bookInCart} setBookInCart={setBookInCart} openInCart={openInCart} setOpenInCart={setOpenInCart} />
                </div >}
                {(infoLoaded && total === 0) &&
                    <Navigate
                        to={{
                            pathname: "/",
                            search: createSearchParams({
                                cart: 'updated'
                            }).toString()
                        }}
                    />
                }
                {!infoLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 77, marginBottom: 77 }}><CircularProgress color="inherit" /></div>}
                <Snackbar open={error} autoHideDuration={3000} onClose={() => setError(false)}>
                    <Alert onClose={() => setError(false)} severity='sidish' sx={{ width: '100%' }}>
                        {errorMsg}
                    </Alert>
                </Snackbar>
            </motion.div>
        </AnimatePresence >
    );
}

export default Cart;