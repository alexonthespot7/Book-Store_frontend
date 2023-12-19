import { CircularProgress, IconButton, InputAdornment, Pagination, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import Order from './Order';

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import useMediaQuery from '../Hooks/useMediaQuery';

const mainStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
}

function Myorders() {
    const [page, setPage] = useState(1);
    const [openSearch, setOpenSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const matchesL = useMediaQuery("(min-width: 1000px)");
    const matchesM = useMediaQuery("(min-width: 850px)");

    const defineMainMargin = () => {
        if (matchesL) {
            return 35;
        } else if (matchesM) {
            return 100
        } else {
            return 0;
        }
    }

    const defineMarginTopPagi = () => {
        if (matchesL) {
            return 5;
        } else if (matchesM) {
            return 0;
        } else {
            return 2.5
        }
    }

    const defineMarginLeftPagi = () => {
        if (matchesL) {
            return 30;
        } else if (matchesM) {
            return 25.5;
        } else {
            return 0;
        }
    }
    const defineMarginBottomPagi = () => {
        if (matchesL) {
            return 5;
        } else if (matchesM) {
            return 2.5;
        } else {
            return 0;
        }
    }

    const mainMargin = defineMainMargin();
    const alignMyOrders = matchesM ? 'flex-start' : 'center';
    const marginHeader = matchesM ? 0 : 0;
    const marginTopPagi = defineMarginTopPagi();
    const marginLeftPagi = defineMarginLeftPagi();
    const marginBottomPagi = defineMarginBottomPagi();


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

    const fetchOrders = () => {
        const token = sessionStorage.getItem('jwt');
        const userId = sessionStorage.getItem('authorizedId');

        fetch(process.env.REACT_APP_API_URL + 'users/' + userId + '/orders',
            {
                method: 'GET',
                headers: { 'Authorization': token }
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setOrders(data);
                    setDataFetched(true);
                } else {
                    alert('Something went wrong');
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOrders();
    }, []);

    //used to use raw books here
    const pages = Array.from({ length: filteredOrders.length }, (_, i) => i + 1);
    const divs = Array.from(Array(filteredOrders.length).keys());

    const ordersElements = divs.map((number, index) =>
        (page - 1 === index) &&
        <motion.div key={index} style={mainStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {filteredOrders.map((order, indexs) => {
                return (
                    (number === indexs) &&
                    <Order order={order} alignProp={'left'} marginProp={22.5} key={indexs} />
                );
            })}

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

    const changeQuery = (event) => {
        setSearchQuery(event.target.value);
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', marginLeft: mainMargin }}
            >
                {(dataFetched && orders.length > 0) && <div style={{ display: 'flex', flexDirection: 'column', alignItems: alignMyOrders }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: marginHeader }}>
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
                                        onChange={changeQuery}
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
                    {filteredOrders.length > 0 && ordersElements}
                    {filteredOrders.length === 0 && <Typography variant='h6' textAlign='left' sx={{ marginTop: 5, marginBottom: 2 }}>No orders were found for your search query: "{searchQuery}"</Typography>}
                    <div style={{ display: 'flex', justifyContent: 'left' }}>
                        <Pagination sx={{ marginBottom: marginBottomPagi, marginTop: marginTopPagi, marginLeft: marginLeftPagi }} count={pages.length} page={page} onChange={changePage} />
                    </div>
                </div>}
                {(dataFetched && orders.length === 0) && <Typography variant='h6' textAlign='left' sx={{ marginTop: 2, marginBottom: 2, marginLeft: 27 }}>You have no orders</Typography>}
                {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100, marginBottom: 100 }}><CircularProgress color="inherit" /></div>}
            </motion.div>
        </AnimatePresence>
    );
}

export default Myorders;