
import { useContext, useState, useEffect, useMemo } from 'react';

import { Button, CardActionArea, CircularProgress, Paper, TextField, Typography } from '@mui/material';

import EastIcon from '@mui/icons-material/East';

import { AnimatePresence, motion } from 'framer-motion';

import countryList from 'react-select-country-list';

import Select from 'react-select';

import { createSearchParams, Navigate, useNavigate } from 'react-router-dom';

import visa from '../pictures/visa.png';
import mscard from '../pictures/mscard.png';

import AuthContext from '../context/AuthContext';
import useMediaQuery from '../Hooks/useMediaQuery';
import DialogInfo from './DialogInfo';
import BooksInOrder from './BooksInOrder';

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

const initialAddressInfo = {
    firstname: '',
    lastname: '',
    email: '',
    country: '',
    city: '',
    street: '',
    postcode: '',
    note: ''
}

const initialCountry = {
    value: '',
    label: ''
}

function Cart() {
    const [openInfo, setOpenInfo] = useState(false);
    const [textInfo, setTextInfo] = useState('');
    const [infoField, setInfoField] = useState('');
    const [booksInCart, setBooksInCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [addressInfo, setAddressInfo] = useState(initialAddressInfo);
    const [country, setCountry] = useState(initialCountry);
    const [infoLoaded, setInfoLoaded] = useState(false);
    const [step, setStep] = useState(1);
    const [method, setMethod] = useState('');

    const countries = useMemo(() => countryList().getData(), []);

    const { setOpenSnackbar, setSnackbarMessage, setBgrColor, fetchCart } = useContext(AuthContext);

    const navigate = useNavigate();

    const matches850px = useMediaQuery("(min-width: 850px)");
    const matches440px = useMediaQuery("(min-width: 440px)");
    const matches360px = useMediaQuery("(min-width: 360px)");
    const matches330px = useMediaQuery("(min-width: 330px)");
    const matches300px = useMediaQuery("(min-width: 300px)");

    const handleTotal = (totalData) => {
        setTotal(totalData);
        setInfoLoaded(true);
    }

    const handleBadResponse = () => {
        navigate('/');
        setOpenSnackbar(true);
        setSnackbarMessage('Something is wrong. Please try again');
    }

    const fetchUser = async () => {
        const userId = sessionStorage.getItem('authorizedId');
        const token = sessionStorage.getItem('jwt');
        fetch(process.env.REACT_APP_API_URL + 'users/' + userId,
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
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

    const fetchCartAndUser = async () => {
        if (sessionStorage.getItem('jwt')) await fetchUser();
        await fetchCart(setBooksInCart, handleTotal, handleBadResponse);
    }

    useEffect(() => {
        setBgrColor('#FFFAFA');
        fetchCartAndUser();
    }, []);

    const openOrderInfoDialog = (orderNumber, orderPassword) => {
        setOpenInfo(true);
        setInfoField('Order Info');
        setTextInfo(<p>Thank you for your purchase! Please write down or take a photo of your:<br /><br />Order number: <b>{orderNumber}</b><br /> Order Password: <b>{orderPassword}</b></p>);
    }

    const handleCloseInfoDialog = () => {
        setOpenInfo(false);
        setTextInfo('');
        setInfoField('');
        setTotal(0);
        sessionStorage.removeItem('cartId');
        sessionStorage.removeItem('cartPass');
    }

    const makeSaleNoAuthentication = async () => {
        const backetId = sessionStorage.getItem('cartId');
        const password = sessionStorage.getItem('cartPass');
        const addressInfoNoAuthentication = { ...addressInfo, backetid: backetId, password: password }
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'makesale', {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressInfoNoAuthentication)
            });
            if (!response.ok) {
                handleBadResponse();
                return null;
            }
            await response.json()
                .then(data => {
                    if (!data) {
                        handleBadResponse();
                        return null;
                    }
                    openOrderInfoDialog(data.orderid, data.password);
                    setInfoLoaded(true);
                })
                .catch(err => console.error(err));
        } catch (error) {
            handleBadResponse();
        }
    }

    const makeSaleAuthenticated = async () => {
        const token = sessionStorage.getItem('jwt');
        const userId = sessionStorage.getItem('authorizedId');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'makesale/' + userId, {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(addressInfo)
            });
            if (!response.ok) {
                handleBadResponse();
                return null;
            }
            await response.json()
                .then(data => {
                    if (!data) {
                        handleBadResponse();
                        return null;
                    }
                    openOrderInfoDialog(data.orderid, data.password);
                    setInfoLoaded(true);
                })
                .catch(err => console.error(err));
        } catch (error) {
            handleBadResponse();
        }
    }

    const makeSale = async () => {
        if (sessionStorage.getItem('authorizedUsername') !== null) {
            await makeSaleAuthenticated();
        } else if (sessionStorage.getItem('cartId')) {
            await makeSaleNoAuthentication();
        } else {
            handleBadResponse();
        }
    }

    const pay = async () => {
        if (method === '') {
            setOpenSnackbar(true);
            setSnackbarMessage('Please choose payment method');
            return null;
        }
        setInfoLoaded(false);
        await makeSale();
    }

    const isValidEmail = (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    const proceed = () => {
        for (const field of Object.keys(addressInfo)) {
            if (addressInfo[field] === '' && !['country', 'note'].includes(field)) {
                setOpenSnackbar(true);
                setSnackbarMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} is mandatory`);
                return null;
            }
        }
        if (addressInfo.country === '' && country.label === '') {
            setOpenSnackbar(true);
            setSnackbarMessage('Country is mandatory');
            return null;
        }
        if (!isValidEmail(addressInfo.email)) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please provide a valid Email');
            return null;
        }
        if (addressInfo.country === '') {
            setAddressInfo({ ...addressInfo, country: country.label });
        }

        setStep(2);
        window.scrollTo(0, 0);
    }

    const changeAddressInfo = (event) => {
        setAddressInfo({ ...addressInfo, [event.target.name]: event.target.value });
    }

    const changeCountry = (value) => {
        setCountry(value);
        setAddressInfo({ ...addressInfo, country: value.label })
    }

    const mainDivDirection = matches850px ? 'row' : 'column-reverse';
    const alignItems = matches850px ? 'flex-start' : 'center';
    const mainDivGap = matches850px ? 200 : 30;

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

    const dirButtonDiv = matches360px ? 'row' : 'column-reverse';
    const alignButtonDiv = matches360px ? 'flex-end' : 'center';
    const stepsResponsiveMargin = matches360px ? 0 : 10;
    const dirMethods = matches440px ? 'row' : 'column';
    const alignPayButtons = matches440px ? 'flex-end' : 'center';

    return (
        <AnimatePresence>
            <motion.div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h5' textAlign='center' sx={{ marginTop: 2, marginBottom: 2 }}>Checkout</Typography>
                {(infoLoaded && total > 0) &&
                    <div style={{ display: 'flex', flexDirection: mainDivDirection, alignItems: alignItems, justifyContent: 'center', gap: mainDivGap }}>
                        {step === 1 &&
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: alignItems }}>
                                <Typography sx={{ marginBottom: 1 }} variant='h6'>Enter delivery details</Typography>
                                {Object.keys(initialAddressInfo).map((field) => (
                                    <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>{field.toUpperCase()} </Typography>
                                        {field !== 'country' &&
                                            <TextField
                                                onChange={changeAddressInfo}
                                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 255 - responsiveWidth }}
                                                size='small'
                                                name={field}
                                                value={addressInfo[field]}
                                                variant='standard'
                                                InputProps={{ disableUnderline: true }}
                                            />
                                        }
                                        {field === 'country' &&
                                            <Select
                                                styles={{
                                                    control: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        width: 270 - responsiveWidth,
                                                        minHeight: 20,
                                                        height: 35,
                                                        backgroundColor: '#E8E8E8',
                                                        borderRadius: '25px',
                                                        textAlign: 'left'
                                                    }),
                                                    menu: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        width: 270 - responsiveWidth,
                                                        backgroundColor: '#E8E8E8',
                                                        borderRadius: '25px',
                                                        textAlign: 'left'
                                                    }),
                                                    menuList: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        width: 270 - responsiveWidth,
                                                        backgroundColor: '#E8E8E8',
                                                        borderRadius: '25px',
                                                        "::-webkit-scrollbar": {
                                                            display: 'none'
                                                        },
                                                        textAlign: 'left'
                                                    })
                                                }}
                                                options={countries} value={country} onChange={changeCountry}
                                            />
                                        }
                                    </div>
                                ))}
                                <div style={{ display: 'flex', flexDirection: dirButtonDiv, alignItems: alignButtonDiv, justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
                                    <Button onClick={proceed} endIcon={<EastIcon color='white' fontSize='small' />} sx={buttonProceedStyle} component={Paper} elevation={10} >
                                        Proceed
                                    </Button>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 16 - stepsResponsiveMargin, marginLeft: 10 - stepsResponsiveMargin, gap: 5 }}>
                                        <Typography fontFamily='display' fontWeight='bold' fontSize={17}>Step {step}</Typography>
                                        <Typography fontFamily='display' fontSize={17}>of 2</Typography>
                                    </div>
                                </div>
                            </div>
                        }
                        {step === 2 &&
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: alignItems }}>
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
                            </div>
                        }
                        <BooksInOrder booksInCart={booksInCart} total={total} />
                    </div >
                }
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
                <DialogInfo openInfo={openInfo} handleClose={handleCloseInfoDialog} textInfo={textInfo} infoField={infoField} />
            </motion.div>
        </AnimatePresence >
    );
}

export default Cart;