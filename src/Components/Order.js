import { useState, useEffect, useContext } from "react";

import { CircularProgress, Divider, Typography } from "@mui/material";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import useMediaQuery from "../Hooks/useMediaQuery";
import DialogInfo from "./DialogInfo";
import BooksInOrder from "./BooksInOrder";

const orderInfo = {
    status: '',
    firstname: '',
    lastname: '',
    email: '',
    country: '',
    city: '',
    street: '',
    postcode: '',
}

function Order({ order, alignProp, marginProp }) {
    const [booksInOrder, setBooksInOrder] = useState([]);
    const [total, setTotal] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [textInfo, setTextInfo] = useState('');
    const [infoField, setInfoField] = useState('');

    const { setOpenSnackbar, setSnackbarMessage } = useContext(AuthContext);

    const navigate = useNavigate();

    const matches1120px = useMediaQuery("(min-width: 1120px)");
    const matches1040px = useMediaQuery("(min-width: 1040px)");
    const matches850px = useMediaQuery("(min-width: 850px)");


    const handleBadResponse = () => {
        navigate('/');
        setOpenSnackbar(true);
        setSnackbarMessage('Something is wrong. Please try again');
    }

    const fetchTotal = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'getordertotal/' + order.orderid);
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
                    setTotal(data.total);
                    setDataLoaded(true);
                })
                .catch(err => console.error(err));
        } catch (error) {
            handleBadResponse();
        }
    }

    const fetchBooksInOrder = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'booksinorder/' + order.orderid);
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
                    setBooksInOrder(data);
                    fetchTotal();
                })
                .catch(err => console.error(err));
        } catch (error) {
            handleBadResponse();
        }
    }

    useEffect(() => {
        fetchBooksInOrder();
    }, []);

    const infoTextHandle = (text, field) => {
        if (text.length > 26) {
            setOpenInfo(true);
            setTextInfo(text);
            setInfoField(field);
        }
    }

    const handleCloseInfoDialog = () => {
        setOpenInfo(false);
        setTextInfo('');
        setInfoField('');
    }

    const direction = matches850px ? 'row' : 'column-reverse';
    const align = matches850px ? 'flex-start' : 'center';
    const defineMainGap = () => {
        if (matches1120px) {
            return 200;
        } else if (matches1040px) {
            return 150;
        } else if (matches850px) {
            return 130;
        } else {
            return 15;
        }
    }
    const mainGap = defineMainGap();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column' }}>
            {dataLoaded &&
                <div>
                    <Typography variant='h4' textAlign={matches850px ? alignProp : 'center'} fontSize={22} sx={{ marginLeft: matches850px ? marginProp : 0, marginTop: 2, marginBottom: 2 }}>Order number: {order.orderid}</Typography>
                    <div style={{ display: 'flex', flexDirection: direction, alignItems: align, justifyContent: 'center', gap: mainGap }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: align }}>
                            <Typography sx={{ marginBottom: 1 }} variant='h6'>Delivery details</Typography>

                            {Object.keys(orderInfo).map((field) => (
                                <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>{field.toUpperCase()} </Typography>
                                    <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order[field], field.charAt(0).toUpperCase() + field.slice(1))} sx={{ cursor: order[field].length > 26 ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order[field]}</Typography>
                                    <Divider />
                                </div>
                            ))}
                            {order.note !== '' &&
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>NOTE </Typography>
                                    <Typography textAlign='left' noWrap onClick={() => infoTextHandle(order.note, 'Note')} sx={{ cursor: order.note.length > 26 ? 'pointer' : 'default', width: 200, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{order.note}</Typography>
                                    <Divider />
                                </div>
                            }
                        </div>
                        <BooksInOrder booksInCart={booksInOrder} total={total} />
                    </div >
                    <DialogInfo openInfo={openInfo} handleClose={handleCloseInfoDialog} textInfo={textInfo} infoField={infoField} />
                </div>
            }
            {!dataLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '25vh' }}><CircularProgress color="inherit" /></div>}
        </motion.div>
    );
}

export default Order;