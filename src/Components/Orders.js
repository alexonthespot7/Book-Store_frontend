import React, { useEffect, useState, useRef, useContext, useMemo, useCallback } from "react";

import { Button, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';

import { AnimatePresence, motion } from "framer-motion";

import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

import AuthContext from "../context/AuthContext";
import useMediaQuery from "../Hooks/useMediaQuery";
import EditOrder from "./EditOrder";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Orders() {
    const [orders, setOrders] = useState([]);

    const { setOpenSnackbar, setSnackbarMessage, setBgrColor } = useContext(AuthContext);

    const gridRef = useRef();

    const matches = useMediaQuery("(min-width: 908px)");

    const gridWidth = matches ? '818px' : '90%';

    useEffect(() => {
        fetchOrders();
        setBgrColor('#FFFAFA')
    }, []);

    const fetchOrders = () => {
        const token = sessionStorage.getItem('jwt');

        fetch(process.env.REACT_APP_API_URL + 'orders',
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err));
    }

    const updateOrder = (updatedOrderInfo, link) => {
        const token = sessionStorage.getItem('jwt');
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(updatedOrderInfo)
        })
            .then(response => {
                if (response.ok) {
                    fetchOrders();
                    setOpenSnackbar(true);
                    setSnackbarMessage('The order info was updated')
                } else {
                    alert('Something went wrong during the order update');
                }
            })
            .catch(err => console.error(err))
    }

    const idGetter = (params) => {
        if (params.data.backet.user !== null) {
            return params.data.backet.user.id;
        }
    }

    const [columns, setColumns] = useState([
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
                    )
                }
            },
            type: 'narrow'
        },
        { headerName: 'User email', field: 'backet.user.email' },
        {
            headerName: '',
            width: '100%',
            cellRenderer: params => <EditOrder order={params.data} updateOrder={updateOrder} />
        },
    ]);

    const defaultColDef = useMemo(() => {
        return {
            width: 140,
            filter: 'agTextColumnFilter',
            resizable: true,
            sortable: true,
            cellStyle: { 'text-align': 'left' }
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
        </motion.div>
    )
}