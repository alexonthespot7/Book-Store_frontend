import React, { useState, useEffect, useContext } from "react";

import MuiAlert from '@mui/material/Alert';
import { Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { AnimatePresence, motion } from 'framer-motion';

import useMediaQuery from "../Hooks/useMediaQuery";
import AuthContext from "../context/AuthContext";
import BooksinCategory from "./Booksincategory";

function Allcategories() {
    const [categories, setCategories] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const [searchNow, setSearchNow] = useState('');
    const [openSearch, setOpenSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { setBgrColor, fetchCategories } = useContext(AuthContext);

    const matchesSecond = useMediaQuery("(min-width: 870px)");
    const matchesThird = useMediaQuery("(min-width: 500px)");
    const matchesFourth = useMediaQuery("(min-width: 400px)");
    const matchesFifth = useMediaQuery("(min-width: 350px)");
    const matchesSixth = useMediaQuery("(min-width: 300px)");

    const matchesXL = useMediaQuery("(min-width: 1280px)");
    const matchesYL = useMediaQuery("(min-width: 1200px)");
    const matchesL = useMediaQuery("(min-width: 1000px)");
    const matchesM = useMediaQuery("(min-width: 800px)");
    const matchesS = useMediaQuery("(min-width: 600px)");
    const matchesSmall2 = useMediaQuery("(min-width: 500px)");
    const matchesXS = useMediaQuery("(min-width: 440px)");
    const matchesXSmall2 = useMediaQuery("(min-width: 400px)");
    const matchesXXS = useMediaQuery("(min-width(320px)");
    const matchesXXSmall2 = useMediaQuery("(min-width: 300px)");

    const defineMarginSearch = () => {
        if (matchesSmall2) {
            return 70;
        } else if (matchesXSmall2) {
            return 40;
        } else if (matchesXXSmall2) {
            return 20;
        } else {
            return 10;
        }
    }

    const marginSearch = defineMarginSearch();

    const searchSize = matchesSmall2 ? 'medium' : 'small';

    const typoSize = matchesM ? 'h4' : 'h5';

    const defineTitleSize = () => {
        if (matchesThird) {
            return 'h4';
        } else if (matchesFifth) {
            return 'h5';
        } else {
            return 'h6';
        }
    }

    const titleSize = defineTitleSize();

    const defineCarouselWidth = () => {
        if (matchesXL) {
            return '65%';
        } else if (matchesM) {
            return 700;
        } else if (matchesS) {
            return 500;
        } else if (matchesXS) {
            return 350;
        } else if (matchesXXS) {
            return 240;
        } else {
            return 200;
        }
    }

    const carouselWidth = defineCarouselWidth();

    const defineSalesMargin = () => {
        if (matchesSecond) {
            return 40;
        } else if (matchesThird) {
            return 20;
        } else {
            return 10;
        }
    }

    const salesMargin = defineSalesMargin();

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
        setDataFetched(true)
        setBgrColor('#1c1c1c');
    }, []);



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
                        <BooksinCategory category={category} />
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    });

    const handleLocalChange = (event) => {
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
                                    onChange={handleLocalChange}
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

export default Allcategories;