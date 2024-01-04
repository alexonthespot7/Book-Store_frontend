import { useContext, useEffect, useState } from "react";

import { Typography } from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import Order from "./Order";

export default function OrderByNumber() {
    const [foundOrder, setFoundOrder] = useState(false);
    const [order, setOrder] = useState(null);

    const navigate = useNavigate();

    const { setOpenSnackbar, setSnackbarMessage, setBgrColor } = useContext(AuthContext);

    let { orderid } = useParams();

    const handleNoAccess = () => {
        navigate('/');
        setOpenSnackbar(true);
        setSnackbarMessage('You don\'t have access to this order');
    }

    const handleBadResponse = (response) => {
        if (response.status === 404) {
            navigate('/');
            setOpenSnackbar(true);
            setSnackbarMessage('The order with this ID wasn\'t found');
        } else if (response.status === 400) {
            handleNoAccess();
        } else {
            navigate('/');
        }
    }

    const fetchOrder = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'orderbypassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderid: orderid, password: sessionStorage.getItem('orderPass') })
            });
            if (!response.ok) {
                handleBadResponse(response);
                return null;
            }
            await response.json()
                .then(data => {
                    if (!data) {
                        navigate('/');
                        setOpenSnackbar(true);
                        setSnackbarMessage('Something went wrong. Please try again');
                        return null;
                    }
                    setOrder(data);
                    setFoundOrder(true);
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
            navigate('/');
        }
    }

    useEffect(() => {
        setFoundOrder(false);
        if (sessionStorage.getItem('orderPass') !== null) {
            fetchOrder();
        } else {
            handleNoAccess();
        }
        setBgrColor('#FFFAFA');
    }, []);

    return (
        <div>
            {foundOrder && <Order order={order} alignProp={'center'} marginProp={0} />}
            {!foundOrder && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100, marginBottom: 100 }}><Typography variant='h6'>The order was not found</Typography></div>}
        </div>
    );
}