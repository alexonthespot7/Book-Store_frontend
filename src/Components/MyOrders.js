import { useState, useEffect } from 'react';

import { CircularProgress, IconButton, InputAdornment, Pagination, TextField, Typography } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { AnimatePresence, motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

import useMediaQuery from '../Hooks/useMediaQuery';
import Order from './Order';

const mainStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
}

function MyOrders() {
    const [page, setPage] = useState(1);
    const [openSearch, setOpenSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const navigate = useNavigate();

    const matches1000px = useMediaQuery("(min-width: 1000px)");
    const matches850px = useMediaQuery("(min-width: 850px)");

    const fetchOrders = async () => {
        const token = sessionStorage.getItem('jwt');
        const userId = sessionStorage.getItem('authorizedId');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'users/' + userId + '/orders',
                {
                    method: 'GET',
                    headers: { 'Authorization': token }
                }
            );
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
        window.scrollTo(0, 0);
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(
        order => {
            return (
                order.orderid.toString().includes(searchQuery) ||
                order.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.postcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.note.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    );

    //used to use raw books here
    const pages = Array.from({ length: filteredOrders.length }, (_, i) => i + 1);

    const ordersContent = filteredOrders.map((order, index) =>
        (page - 1 === index) &&
        <motion.div key={index} style={mainStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Order order={order} alignProp={'left'} marginProp={22.5} />
        </motion.div>
    );

    const changePage = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    }

    const stopSearch = () => {
        setSearchQuery('');
        setOpenSearch(false);
    }

    const changeSearchQuery = (event) => {
        setSearchQuery(event.target.value);
    }

    const defineMainMargin = () => {
        if (matches1000px) {
            return 35;
        } else if (matches850px) {
            return 100
        } else {
            return 0;
        }
    }
    const mainMargin = defineMainMargin();

    const defineMarginTopPagination = () => {
        if (matches1000px) {
            return 5;
        } else if (matches850px) {
            return 0;
        } else {
            return 2.5
        }
    }
    const marginTopPagination = defineMarginTopPagination();
    const defineMarginLeftPagination = () => {
        if (matches1000px) {
            return 30;
        } else if (matches850px) {
            return 25.5;
        } else {
            return 0;
        }
    }
    const marginLeftPagination = defineMarginLeftPagination();
    const defineMarginBottomPagination = () => {
        if (matches1000px) {
            return 5;
        } else if (matches850px) {
            return 2.5;
        } else {
            return 0;
        }
    }
    const marginBottomPagination = defineMarginBottomPagination();
    const alignMyOrders = matches850px ? 'flex-start' : 'center';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', marginLeft: mainMargin }}
            >
                {(dataFetched && orders.length > 0) &&
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: alignMyOrders }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            {!openSearch && <IconButton onClick={() => setOpenSearch(true)} sx={{ marginRight: -2.5 }}>
                                <SearchIcon color='sidish' />
                            </IconButton>}
                            {openSearch && <IconButton onClick={stopSearch} sx={{ marginRight: -2.5 }}>
                                <SearchOffIcon color='sidish' />
                            </IconButton>}
                            <Typography variant='h5' fontSize={22}>My orders</Typography>
                            <AnimatePresence>
                                {openSearch &&
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <TextField
                                            size='small'
                                            fullWidth
                                            value={searchQuery}
                                            onChange={changeSearchQuery}
                                            type='search'
                                            placeholder="Search for orders..."
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon color='sidish' />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="outlined"
                                            color='sidish'
                                        />
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                        {filteredOrders.length > 0 && ordersContent}
                        {filteredOrders.length === 0 && <Typography variant='h6' textAlign='left' sx={{ marginTop: 5, marginBottom: 2 }}>No orders were found for your search query: "{searchQuery}"</Typography>}
                        <div style={{ display: 'flex', justifyContent: 'left' }}>
                            <Pagination sx={{ marginBottom: marginBottomPagination, marginTop: marginTopPagination, marginLeft: marginLeftPagination }} count={pages.length} page={page} onChange={changePage} />
                        </div>
                    </div>
                }
                {(dataFetched && orders.length === 0) && <Typography variant='h6' textAlign='left' sx={{ marginTop: '2.5vh', marginLeft: 27 }}>You have no orders</Typography>}
                {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30vh' }}><CircularProgress color="inherit" /></div>}
            </motion.div>
        </AnimatePresence>
    );
}

export default MyOrders;