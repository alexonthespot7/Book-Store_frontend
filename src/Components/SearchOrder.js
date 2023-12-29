import { useContext, useState } from "react";

import { Button, Dialog, DialogContent, Divider, IconButton, Paper, TextField, Typography } from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';

import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import useMediaQuery from "../Hooks/useMediaQuery";

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

const initialOrderInfo = {
    number: '',
    password: ''
}

const inputType = {
    number: 'number',
    password: 'password'
}

export default function SearchOrder() {
    const [orderInfo, setOrderInfo] = useState(initialOrderInfo);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const { setOpenSnackbar, setSnackbarMessage } = useContext(AuthContext);

    const matches550px = useMediaQuery("(min-width: 550px)");
    const matches430px = useMediaQuery("(min-width: 430px)");
    const matches400px = useMediaQuery("(min-width: 400px)");
    const matches350px = useMediaQuery("(min-width: 350px)");
    const matches325px = useMediaQuery("(min-width: 325px)");

    const handleClose = () => {
        setOpen(false);
        setOrderInfo(initialOrderInfo);
    }

    const handleChange = (event) => {
        setOrderInfo({ ...orderInfo, [event.target.name]: event.target.value });
    }

    const handleBadResponse = (response) => {
        if (response.status === 404) {
            setOpenSnackbar(true);
            setSnackbarMessage('The order wasn\'t found by this number');
        } else if (response.status === 400) {
            setOpenSnackbar(true);
            setSnackbarMessage('The password is incorrect');
        } else {
            navigate('/');
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server. Please try again');
        }
    }

    const findOrder = async () => {
        const orderInfoToSend = { orderid: orderInfo.number, password: orderInfo.password }
        console.log(orderInfoToSend);
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'checkordernumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderInfoToSend)
            });
            if (!response.ok) {
                handleBadResponse(response);
                return null;
            }
            sessionStorage.setItem('orderPass', orderInfo.password);
            navigate('/orders/' + orderInfo.number);
            handleClose();
        } catch (error) {
            console.error(error);
            navigate('/');
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server. Please try again');
        }
    }

    const searchOrder = () => {
        for (const field of Object.keys(initialOrderInfo)) {
            if (orderInfo[field] === '') {
                setOpenSnackbar(true);
                setSnackbarMessage(`Order ${field.charAt(0).toUpperCase() + field.slice(1)} is mandatory`);
                return null;
            }
        }
        findOrder();
    }

    const defineOrderMargin = () => {
        if (matches550px) {
            return 0;
        } else if (matches430px) {
            return -15;
        } else if (matches350px) {
            return -20;
        } else {
            return -23;
        }
    }
    const orderMargin = defineOrderMargin();
    const defineOrderTypographySize = () => {
        if (matches550px) {
            return 17;
        } else if (matches400px) {
            return 16;
        } else if (matches350px) {
            return 14;
        } else {
            return 13;
        }
    }
    const orderTypographySize = defineOrderTypographySize();
    const text = matches325px ? 'Your Order' : 'Order';
    return (
        <div>
            <Typography onClick={() => setOpen(true)} sx={{ cursor: 'pointer', "&:hover": { filter: 'brightness(70%)' }, transition: '0.45s' }} style={{ marginLeft: orderMargin }} variant='h6' fontSize={orderTypographySize}>{text}</Typography>
            <Dialog style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }} open={open} onClose={handleClose}>
                <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={handleClose} sx={{ width: 30, height: 30, marginTop: -2, marginRight: -2 }} color='sidish'>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={thirdDiv}>
                            <Divider sx={{ width: '24%', border: '1px solid black', marginTop: 0.5 }} />
                            <Typography sx={{ width: 250, fontFamily: 'display', fontSize: 24 }} color='sidish'>Order Status</Typography>
                            <Divider sx={{ width: '24%', border: '1px solid black', marginTop: 0.5 }} />
                        </div>
                        {Object.keys(initialOrderInfo).map((field) => (
                            <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>{`ORDER ${field.toUpperCase()}`}</Typography>
                                <TextField
                                    onChange={handleChange}
                                    sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 250 }}
                                    size='small'
                                    name={field}
                                    value={orderInfo[field]}
                                    variant='standard'
                                    InputProps={{ disableUnderline: true }}
                                    type={inputType[field]}
                                />
                            </div>
                        ))}
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