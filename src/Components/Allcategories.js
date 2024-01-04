import { useState, useEffect, useContext } from "react";

import { Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { AnimatePresence, motion } from 'framer-motion';

import AuthContext from "../context/AuthContext";
import useMediaQuery from "../Hooks/useMediaQuery";
import BooksInCategory from "./BooksInCategory";

function AllCategories() {
    const [categories, setCategories] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [searchNow, setSearchNow] = useState('');
    const [openSearch, setOpenSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { setBgrColor, fetchCategories } = useContext(AuthContext);

    const matches1280px = useMediaQuery("(min-width: 1280px)");
    const matches870px = useMediaQuery("(min-width: 870px)");
    const matches800px = useMediaQuery("(min-width: 800px)");
    const matches600px = useMediaQuery("(min-width: 600px)");
    const matches500px = useMediaQuery("(min-width: 500px)");
    const matches440px = useMediaQuery("(min-width: 440px)");
    const matches400px = useMediaQuery("(min-width: 400px)");
    const matches350px = useMediaQuery("(min-width: 350px)");
    const matches320px = useMediaQuery("(min-width: 320px)");
    const matches300px = useMediaQuery("(min-width: 300px)");

    const filteredCategories = categories.filter(
        category => {
            return (
                category.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    );

    const handleFetchCategoriesData = (data) => {
        setCategories(data);
        setDataFetched(true);
    }

    useEffect(() => {
        fetchCategories(handleFetchCategoriesData);
        setBgrColor('#1c1c1c');
    }, []);

    const defineSalesMargin = () => {
        if (matches870px) {
            return 40;
        } else if (matches500px) {
            return 20;
        } else {
            return 10;
        }
    }
    const salesMargin = defineSalesMargin();

    const defineTitleSize = () => {
        if (matches500px) {
            return 'h4';
        } else if (matches350px) {
            return 'h5';
        } else {
            return 'h6';
        }
    }
    const titleSize = defineTitleSize();

    const defineCarouselWidth = () => {
        if (matches1280px) {
            return '65%';
        } else if (matches800px) {
            return 700;
        } else if (matches600px) {
            return 500;
        } else if (matches440px) {
            return 350;
        } else if (matches320px) {
            return 240;
        } else {
            return 200;
        }
    }
    const carouselWidth = defineCarouselWidth();

    const content = filteredCategories.map((category, index) => {
        return (
            <AnimatePresence key={index}>
                <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: salesMargin }}
                    layout
                    initial={{ scale: 0.5, height: 0 }}
                    animate={{ scale: 1, height: 'auto' }}
                    exit={{ scale: 0.5, height: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant={titleSize} sx={{ color: 'white', fontFamily: 'serif', marginBottom: 2.5 }} >{category.name}</Typography>
                    <div style={{ width: carouselWidth }}>
                        <BooksInCategory category={category} />
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    });

    const handleSearchFieldChange = (event) => {
        setSearchNow(event.target.value);
    }

    const search = () => {
        setSearchQuery(searchNow);
    }

    const stopSearch = () => {
        setSearchQuery('');
        setOpenSearch(false);
        setSearchNow('');
    }

    const searchSize = matches500px ? 'medium' : 'small';
    const typoSize = matches800px ? 'h4' : 'h5';
    const defineMarginSearch = () => {
        if (matches500px) {
            return 70;
        } else if (matches400px) {
            return 40;
        } else if (matches300px) {
            return 20;
        } else {
            return 10;
        }
    }
    const marginSearch = defineMarginSearch();

    return (
        <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: 30, marginBottom: 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div style={{ marginBottom: -20, display: 'flex', justifyContent: 'center', gap: 0 }}>
                {!openSearch && <IconButton onClick={() => setOpenSearch(true)}>
                    <SearchIcon color='thirdary' />
                </IconButton>}
                {openSearch && <IconButton onClick={stopSearch}>
                    <SearchOffIcon color='thirdary' />
                </IconButton>}
                <div style={{ display: 'flex', gap: 8 }}>
                    <Typography
                        variant={typoSize}
                        style={{ background: "-webkit-linear-gradient(45deg, #fff 70%, #000000 10%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                        All
                    </Typography>
                    <Typography sx={{ backgroundColor: 'black', color: '#fff', paddingLeft: 1, paddingRight: 1 }} variant={typoSize}>Categories</Typography>
                </div>
            </div>
            {
                dataFetched &&
                <AnimatePresence>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        {openSearch &&
                            <motion.div
                                style={{ display: 'flex', marginLeft: marginSearch, marginRight: marginSearch, gap: 15, marginBottom: -20 }}
                                initial={{ opacity: 0, scale: 0.5, height: 0 }}
                                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                                exit={{ opacity: 0, scale: 0.5, height: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <TextField
                                    size={searchSize}
                                    fullWidth
                                    value={searchNow}
                                    onChange={handleSearchFieldChange}
                                    type='search'
                                    placeholder="Search for categories..."
                                    sx={{ backgroundColor: '#E8E8E8', color: 'black' }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color='sidish' />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    color='thirdary'
                                />
                                <Button
                                    size={searchSize}
                                    onClick={search}
                                    variant='contained'
                                    sx={{
                                        color: 'black',
                                        backgroundColor: 'white',
                                        "&:hover": { backgroundColor: 'gray' },
                                        transition: '0.45s'
                                    }}
                                >
                                    Search
                                </Button>
                            </motion.div>

                        }
                        {(filteredCategories.length > 0) && content}
                        {(filteredCategories.length === 0 && openSearch) && <Typography color='white' variant='h6' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30vh' }}>No categories were found for your query: "{searchQuery}"</Typography>}
                        {(filteredCategories.length === 0 && !openSearch) && <Typography color='white' variant='h6' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30vh' }}>Please reload the page or visit the website later</Typography>}
                    </div>
                </AnimatePresence>
            }
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30vh' }}><CircularProgress color="thirdary" /></div>}
        </motion.div >
    );
}

export default AllCategories;