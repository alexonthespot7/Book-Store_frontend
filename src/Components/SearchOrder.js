import { Button, Dialog, DialogContent, Divider, IconButton, Paper, Snackbar, TextField, Typography } from "@mui/material";
import useMediaQuery from "../Hooks/useMediaQuery";
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import EastIcon from '@mui/icons-material/East';

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const thirdDiv = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 8, marginTop: -16 }
const buttonProceedStyle = {
    transition: '0.4s',
    borderRadius: '25px 25px 25px 25px',
    marginBottom: 2.5,
    width: 205, height: 32.5,
    backgroundColor: 'black',
    color: 'white',
    "&:hover": { backgroundColor: '#585858' }
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SearchOrder() {
    const [orderInfo, setOrderInfo] = useState({
        orderNumber: '',
        orderPassword: ''
    });
    const [open, setOpen] = useState(false);

    const { setOpenSnackbar, setSnackbarMessage } = useContext(AuthContext);

    const matchesSecond = useMediaQuery("(min-width: 550px)");
    const matchesS = useMediaQuery("(min-width: 430px)");
    const matchesThird = useMediaQuery("(min-width: 400px)");
    const matchesFourth = useMediaQuery("(min-width: 350px)");
    const matchesFifth = useMediaQuery("(min-width: 325px)");

    const defineOrderTypoSize = () => {
        if (matchesSecond) {
            return 17;
        } else if (matchesThird) {
            return 16;
        } else if (matchesFourth) {
            return 14;
        } else {
            return 13;
        }
    }
    const orderTypoSize = defineOrderTypoSize();
    const defineOrderMargin = () => {
        if (matchesSecond) {
            return 0;
        } else if (matchesS) {
            return -15;
        } else if (matchesFourth) {
            return -20;
        } else {
            return -23;
        }
    }
    const orderMargin = defineOrderMargin();

    const handleChange = (event) => {
        setOrderInfo({ ...orderInfo, [event.target.name]: event.target.value })
    }

    const navigate = useNavigate();

    const findOrder = () => {
        fetch(process.env.REACT_APP_API_URL + 'checkordernumber', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderid: orderInfo.orderNumber, password: orderInfo.orderPassword })
        })
            .then(response => {
                if (response.ok) {
                    sessionStorage.setItem('orderPass', orderInfo.orderPassword);
                    navigate('/orders/' + orderInfo.orderNumber);
                    setOpen(false);
                } else {
                    setOpenSnackbar(true);
                    setSnackbarMessage('There is no order with that number!');
                }
            })
            .catch(err => console.error(err));
    }

    const searchOrder = () => {
        let check = true;
        if (orderInfo.orderNumber === '') {
            check = false;
            setOpenSnackbar(true);
            setSnackbarMessage('Please type in order number');
        }
        if (isNaN(parseInt(orderInfo.orderNumber))) {
            check = false;
            setOpenSnackbar(true);
            setSnackbarMessage('Order numbers can include only digits');
        }
        if (orderInfo.orderPassword === '') {
            check = false;
            setOpenSnackbar(true);
            setSnackbarMessage('Please type in order password');
        }
        if (check) {
            findOrder();
        }
    }

    return (
        <div>
            <Typography onClick={() => setOpen(true)} sx={{ cursor: 'pointer', "&:hover": { filter: 'brightness(70%)' }, transition: '0.45s' }} style={{ marginLeft: orderMargin }} variant='h6' fontSize={orderTypoSize}>{matchesFifth ? 'Your Order' : 'Order'}</Typography>
            <Dialog style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }} open={open} onClose={() => setOpen(false)}>
                <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => setOpen(false)} sx={{ width: 30, height: 30, marginTop: -2, marginRight: -2 }} color='black'>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={thirdDiv}>
                            <Divider sx={{ width: '24%', border: '1px solid black', marginTop: 0.5 }} />
                            <Typography sx={{ width: 250, fontFamily: 'display', fontSize: 24 }} color='sidish'>Order Status</Typography>
                            <Divider sx={{ width: '24%', border: '1px solid black', marginTop: 0.5 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>ORDER NUMBER </Typography>
                            <TextField
                                onChange={handleChange}
                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 250 }}
                                size='small'
                                name='orderNumber'
                                value={orderInfo.orderNumber}
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>ORDER PASSWORD </Typography>
                            <TextField
                                onChange={handleChange}
                                sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 250 }}
                                size='small'
                                type="password"
                                name='orderPassword'
                                value={orderInfo.orderPassword}
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, marginBottom: -16 }}>
                            <Button onClick={searchOrder} endIcon={<EastIcon color='white' fontSize='small' />} sx={buttonProceedStyle} component={Paper} elevation={10} >
                                Find the order
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}