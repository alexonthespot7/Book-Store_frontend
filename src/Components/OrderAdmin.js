import { useContext, useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import Order from "./Order";

export default function OrderAdmin() {
    const [dataFetched, setDataFetched] = useState(false);
    const [order, setOrder] = useState(null);

    let { orderid } = useParams();

    const { setOpenSnackbar, setSnackbarMessage, setBgrColor } = useContext(AuthContext);

    const handleBadResponseFindOrderById = (response) => {
        if (response.status === 404) {
            setOpenSnackbar(true);
            setSnackbarMessage('No order was found by this id');
        }
        navigate('/');
    }

    const fetchOrder = async () => {
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'orders/' + orderid, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });
            if (!response.ok) {
                handleBadResponseFindOrderById(response);
                return null;
            }
            await response.json()
                .then(data => {
                    if (!data) {
                        navigate('/');
                        setOpenSnackbar(true);
                        setSnackbarMessage('Something is wrong with the server');
                        return null;
                    }
                    setOrder(data);
                    setDataFetched(true);
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
        }
    }
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrder();
        setBgrColor('#FFFAFA');
    }, []);

    return (
        <div>
            {dataFetched && <Order order={order} alignProp={'center'} marginProp={0} />}
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh' }}><CircularProgress color="inherit" /></div>}
        </div>
    );
}