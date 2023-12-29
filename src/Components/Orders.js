import { useEffect, useState, useRef, useContext, useMemo, useCallback } from "react";

import { Button, CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

import AuthContext from "../context/AuthContext";
import EditOrder from "./EditOrder";

export default function Orders() {
    const [dataFetched, setDataFetched] = useState(false);
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    const { setOpenSnackbar, setSnackbarMessage, setBgrColor } = useContext(AuthContext);

    const gridRef = useRef();

    const fetchOrders = async () => {
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'orders',
                {
                    method: 'GET',
                    headers: { 'Authorization': token }
                });
            if (!response.ok) {
                navigate('/');
                return null;
            }
            await response.json()
                .then(data => {
                    if (!data) {
                        navigate('/');
                        return null;
                    }
                    setOrders(data);
                    setDataFetched(true);
                })
                .catch(err => console.error(err));
        } catch (error) {
            navigate('/');
        }
    }

    useEffect(() => {
        fetchOrders();
        setBgrColor('#FFFAFA')
    }, []);

    const handleBadResponseUpdateOrder = (response) => {
        if (response.status === 500) {
            navigate('/');
        } else {
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server. Please try again later');
        }
    }

    const updateOrder = async (updatedOrderInfo, link) => {
        setDataFetched(false);
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(link, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(updatedOrderInfo)
            });
            if (!response.ok) {
                handleBadResponseUpdateOrder(response);
                return null;
            }
            await fetchOrders();
            setOpenSnackbar(true);
            setSnackbarMessage('The order info was updated');
        } catch (error) {
            console.error(error);
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server. Please try again later');
        }
    }

    const idGetter = (params) => {
        if (params.data.backet.user !== null) {
            return params.data.backet.user.id;
        }
    }

    const columns = [
        {
            headerName: 'Number',
            cellRenderer: params => <Link to={{ pathname: '/orders/admin/' + params.data.orderid }}>{params.data.orderid}</Link>,
            type: 'narrow'
        },
        { field: 'status' },
        { field: 'firstname' },
        { field: 'lastname' },
        { field: 'country' },
        { field: 'city' },
        { field: 'street' },
        { field: 'postcode' },
        { headerName: 'Order email', field: 'email' },
        {
            headerName: 'User id',
            valueGetter: idGetter,
            cellRenderer: params => {
                if (params.data.backet !== null) {
                    return (
                        <Link to={{ pathname: "/userlist" }}>{params.value}</Link>
                    );
                }
            },
            type: 'narrow'
        },
        { headerName: 'User email', field: 'backet.user.email' },
        {
            headerName: '',
            cellRenderer: params => <EditOrder order={params.data} updateOrder={updateOrder} />
        },
    ];

    const defaultColDef = useMemo(() => {
        return {
            width: 140,
            filter: 'agTextColumnFilter',
            resizable: true,
            sortable: true,
            cellStyle: { 'textAlign': 'left' }
        };
    }, []);

    const columnTypes = useMemo(() => {
        return {
            narrow: { width: 120, filter: 'agNumberColumnFilter' }
        }
    }, []);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);

    return (
        <motion.div
            className="ag-theme-alpine"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 15,
                height: 617,
                width: '90%',
                margin: 'auto',
                marginTop: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Typography color='#424242' variant="h5">Orders</Typography>
            {dataFetched && <>
                <div style={{ display: 'flex', gap: 10 }}>
                    <TextField
                        type='search'
                        fullWidth={false}
                        size='small'
                        id="filter-text-box"
                        placeholder="Search for orders..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        onChange={onFilterTextBoxChanged}
                    />
                    <Button onClick={onBtnExport} variant="text" color="sidish">Export</Button>
                </div>
                <AgGridReact
                    ref={gridRef}
                    defaultColDef={defaultColDef}
                    columnTypes={columnTypes}
                    columnDefs={columns}
                    rowData={orders}
                    pagination={true}
                    paginationPageSize={10}
                    suppressCellFocus={true}
                    animateRows="true"
                />
            </>}
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '25vh' }}><CircularProgress color="inherit" /></div>}
        </motion.div>
    );
}