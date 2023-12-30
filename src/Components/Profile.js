import { useEffect, useState, useContext } from "react";

import { Box, Button, Card, CircularProgress, Divider, TextField, Typography, useMediaQuery } from "@mui/material";

import RemoveIcon from '@mui/icons-material/Remove';

import AuthContext from "../context/AuthContext";
import { useParams } from "react-router-dom";

import { motion } from 'framer-motion';

import countryList from 'react-select-country-list';
import Select from 'react-select';
import { useMemo } from "react";
import MyOrders from "./MyOrders";
import DialogInfo from "./DialogInfo";
import ChangePassword from "./ChangePassword";

function Profile() {
    const [user, setUser] = useState({});
    const [userUpdate, setUserUpdate] = useState({
        id: '',
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        role: '',
        verificationCode: '',
        accountVerified: '',
        country: '',
        city: '',
        street: '',
        postcode: ''
    });

    const [country, setCountry] = useState({
        value: '',
        label: ''
    });

    const [division, setDivision] = useState('personalData');
    const [allowChangePersonal, setAllowChangePersonal] = useState(false);
    const [allowChangeAddress, setAllowChangeAddress] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [textInfo, setTextInfo] = useState('');
    const [infoField, setInfoField] = useState('');

    const { setOpenSnackbar, setSnackbarMessage, setBgrColor } = useContext(AuthContext);

    const options = useMemo(() => countryList().getData(), []);

    let { id } = useParams();

    const fetchUser = () => {
        const token = sessionStorage.getItem('jwt');

        fetch(process.env.REACT_APP_API_URL + 'users/' + id,
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    setDataLoaded(true);
                    setUser(data);
                    setUserUpdate(data);
                    if (data.country !== '') {
                        setCountry({
                            value: countryList().getValue(data.country),
                            label: data.country
                        });
                    }
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        setBgrColor('#FFFAFA');
        fetchUser();
    }, []);

    const matches1120px = useMediaQuery("(min-width: 1120px)");
    const matches1050px = useMediaQuery("(min-width: 1050px)");
    const matches1000px = useMediaQuery("(min-width: 1000px)");
    const matches800px = useMediaQuery("(min-width: 800px)");
    const matches650px = useMediaQuery("(min-width: 650px)");
    const matches400px = useMediaQuery("(min-width: 400px)");

    const alignMain = matches1000px ? 'left' : 'center';
    const alignSidebar = matches1000px ? 'left' : 'center';
    const mainDirection = matches650px ? 'row' : 'column';
    const defineMainGap = () => {

        if (matches1120px) {
            return 225;
        } else if (matches1050px) {
            return 175;
        } else if (matches800px) {
            return 140;
        } else if (matches650px) {
            return 125
        } else {
            return 25;
        }
    }
    const mainGap = defineMainGap();

    const gridStyle = matches1000px ? {
        width: '85%',
        margin: 'auto',
        display: 'grid',
        gridColumnGap: '1em',
        gridRowGap: '20px',
        gridTemplateColumns: '2fr 6fr',
        gridTemplateAreas:
            `"header header"
            "sidebar main"
            "footer footer"`,
    } : {
        width: '100%',
        margin: 'auto',
        display: 'grid',
        gridColumnGap: '1em',
        gridRowGap: '20px',
        gridTemplateAreas: `"header header"
            "main main"
            "footer footer"
            "sidebar sidebar"`,
    }

    const dataSize = (division === 'personalData') ? 18 : 17;
    const dataColor = (division === 'personalData') ? 'thirdary' : '#808080';
    const orderColor = (division === 'myOrders') ? 'thirdary' : '#808080';
    const orderSize = (division === 'myOrders') ? 18 : 17;
    const widthMinusFields = matches400px ? 0 : 30;
    const widthMinusPannel = matches400px ? 0 : 50;
    const buttonPasswordSize = matches400px ? 'medium' : 'small';

    const updateUser = () => {
        const token = sessionStorage.getItem('jwt');
        fetch(process.env.REACT_APP_API_URL + 'updateuser/' + userUpdate.id, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(userUpdate)
        })
            .then(response => {
                if (response.ok) {
                    setOpenSnackbar(true);
                    setSnackbarMessage('Your personal information was updated');
                    setAllowChangePersonal(false);
                    setAllowChangeAddress(false);
                    fetchUser();
                } else {
                    alert('Something went wrong during the user info update');
                }
            })
            .catch(err => console.error(err))
    }

    const handleChangePersonal = (event) => {
        if (allowChangePersonal) {
            setOpenSnackbar(false);
            setSnackbarMessage('');
            setUserUpdate({ ...userUpdate, [event.target.name]: event.target.value });
        }
    }

    const applyChangePersonal = () => {
        let check = true;

        if (userUpdate.firstname === '' && userUpdate.lastname !== '') {
            check = false;
            setOpenSnackbar(true);
            setSnackbarMessage('Firstname must not be empty');
        } else if (userUpdate.lastname === '' && userUpdate.firstname !== '') {
            check = false;
            setOpenSnackbar(true);
            setSnackbarMessage('Lastname must not be empty');
        } else if (userUpdate.lastname === '' && userUpdate.firstname === '') {
            check = false;
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill in lastname and firstname');
        }
        if (check) {
            updateUser();
        }
    }

    const cancelChangesPersonal = () => {
        setAllowChangePersonal(false);
        setUserUpdate(user);
    }

    const handleChangeAddress = (event) => {
        if (allowChangeAddress) {
            setUserUpdate({ ...userUpdate, [event.target.name]: event.target.value });
        }
    }

    const handleChangeCountry = (value) => {
        setCountry(value);
        setUserUpdate({ ...userUpdate, country: value.label })
    }

    const cancelChangesAddress = () => {
        setAllowChangeAddress(false);
        setUserUpdate(user);
    }



    const infoTextHandle = (text, field) => {
        if (text.length > 'shevelenkov1aa@eduspbsturu'.length) {
            setOpenInfo(true);
            setTextInfo(text);
            setInfoField(field);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {dataLoaded && <Box
                sx={gridStyle}
            >
                <Box sx={{ gridArea: 'header', display: 'flex', justifyContent: 'center', marginBottom: 2.5, marginTop: 2.5 }}>
                    <Typography sx={{ backgroundColor: 'black', color: 'white', paddingLeft: 1, paddingRight: 1 }} variant='h4'>My</Typography>
                    <Typography variant='h4'>Profile</Typography>
                </Box>
                <Box sx={{ gridArea: 'sidebar', display: 'flex', justifyContent: alignSidebar }}>
                    <Card elevation={5} sx={{ borderRadius: '15px', backgroundColor: 'black', color: 'white', width: 250 - widthMinusPannel, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 2 }}>
                        <Typography
                            onClick={() => setDivision('personalData')}
                            underline="none"
                            sx={{ marginLeft: 2, "&:hover": { filter: 'brightness(60%)' }, cursor: 'pointer', transition: '0.45s', display: 'flex', alignItems: 'center' }}
                            variant='h6'
                            fontSize={dataSize}
                            color={dataColor}
                        >
                            {(division === 'personalData') && <RemoveIcon fontSize='small' />}
                            Personal Data
                        </Typography>
                        <Typography
                            onClick={() => setDivision('myOrders')}
                            sx={{ marginLeft: 2, "&:hover": { filter: 'brightness(60%)' }, cursor: 'pointer', transition: '0.45s', display: 'flex', alignItems: 'center' }}
                            variant='h6'
                            fontSize={orderSize}
                            color={orderColor}
                        >
                            {(division === 'myOrders') && <RemoveIcon fontSize='small' />}
                            My Orders
                        </Typography>
                    </Card>
                </Box>
                {(division === 'personalData') && <Box sx={{ gridArea: 'main', display: 'flex', flexDirection: 'column', gap: 5, alignItems: alignMain }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Typography variant='h5' fontSize={22}>Personal Data</Typography>
                            {!allowChangePersonal && <Typography
                                sx={{ cursor: 'pointer', textDecoration: 'underline', "&:hover": { filter: 'brightness(125%)' }, transition: '0.45s' }}
                                variant='body'
                                color='#A9A9A9'
                                fontSize={14}
                                onClick={() => setAllowChangePersonal(true)}
                            >
                                Change
                            </Typography>}
                            {allowChangePersonal && <Typography
                                sx={{ cursor: 'pointer', textDecoration: 'underline', "&:hover": { filter: 'brightness(125%)' }, transition: '0.45s' }}
                                variant='body'
                                color='#A9A9A9'
                                fontSize={14}
                                onClick={cancelChangesPersonal}
                            >
                                Cancel
                            </Typography>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: mainDirection, justifyContent: 'flex-start', gap: mainGap, marginTop: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                                {!allowChangePersonal &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>FIRSTNAME </Typography>
                                        <Typography textAlign='left' noWrap onClick={() => infoTextHandle(user.firstname, 'Firstname')} sx={{ cursor: user.firstname.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', minWidth: 225 - widthMinusFields, maxWidth: 225 - widthMinusFields, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{user.firstname}</Typography>
                                        <Divider />
                                    </div>
                                }
                                {allowChangePersonal &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>FIRSTNAME </Typography>
                                        <TextField
                                            onChange={handleChangePersonal}
                                            sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 225 - widthMinusFields }}
                                            size='small'
                                            name='firstname'
                                            value={userUpdate.firstname}
                                            variant='standard'
                                            InputProps={{ disableUnderline: true }}
                                        />
                                    </div>
                                }
                                {!allowChangePersonal &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>LASTNAME </Typography>
                                        <Typography textAlign='left' noWrap onClick={() => infoTextHandle(user.lastname, 'Lastname')} sx={{ cursor: user.lastname.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', minWidth: 225 - widthMinusFields, maxWidth: 225 - widthMinusFields, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{user.lastname}</Typography>
                                        <Divider />
                                    </div>
                                }
                                {allowChangePersonal &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>LASTNAME </Typography>
                                        <TextField
                                            onChange={handleChangePersonal}
                                            sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 225 - widthMinusFields }}
                                            size='small'
                                            name='lastname'
                                            value={userUpdate.lastname}
                                            variant='standard'
                                            InputProps={{ disableUnderline: true }}
                                        />
                                    </div>
                                }
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>EMAIL </Typography>
                                    <Typography textAlign='left' noWrap onClick={() => infoTextHandle(user.email, 'Email')} sx={{ cursor: user.email.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', minWidth: 225 - widthMinusFields, maxWidth: 225 - widthMinusFields, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{user.email}</Typography>
                                    <Divider />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>USERNAME </Typography>
                                    <Typography textAlign='left' noWrap onClick={() => infoTextHandle(user.username, 'Username')} sx={{ cursor: user.username.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', minWidth: 225 - widthMinusFields, maxWidth: 225 - widthMinusFields, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{user.username}</Typography>
                                    <Divider />
                                </div>
                            </div>
                        </div>
                        {allowChangePersonal && <Button size={buttonPasswordSize} sx={{ borderRadius: '20px', width: 200 - widthMinusFields, height: 35, marginTop: 3, "&:hover": { filter: 'brightness(70%)' }, transition: '0.45s' }} variant='contained' color='sidish' onClick={applyChangePersonal} >Apply Changes</Button>}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Typography variant='h5' fontSize={22}>Address Data</Typography>
                            {!allowChangeAddress && <Typography
                                sx={{ cursor: 'pointer', textDecoration: 'underline', "&:hover": { filter: 'brightness(125%)' }, transition: '0.45s' }}
                                variant='body'
                                color='#A9A9A9'
                                fontSize={14}
                                onClick={() => setAllowChangeAddress(true)}
                            >
                                Change
                            </Typography>}
                            {allowChangeAddress && <Typography
                                sx={{ cursor: 'pointer', textDecoration: 'underline', "&:hover": { filter: 'brightness(125%)' }, transition: '0.45s' }}
                                variant='body'
                                color='#A9A9A9'
                                fontSize={14}
                                onClick={cancelChangesAddress}
                            >
                                Cancel
                            </Typography>}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: mainDirection, gap: mainGap, marginTop: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                                {!allowChangeAddress &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>COUNTRY </Typography>
                                        <Typography textAlign='left' noWrap sx={{ minWidth: 225 - widthMinusFields, maxWidth: 225 - widthMinusFields, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{user.country}</Typography>
                                        <Divider />
                                    </div>
                                }
                                {allowChangeAddress &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>COUNTRY </Typography>
                                        <Select
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    minWidth: 235 - widthMinusFields,
                                                    maxWidth: 235 - widthMinusFields,
                                                    minHeight: 20,
                                                    height: 35,
                                                    backgroundColor: '#E8E8E8',
                                                    borderRadius: '25px',
                                                    textAlign: 'left'
                                                }),
                                                menu: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    minWidth: 235 - widthMinusFields,
                                                    maxWidth: 235 - widthMinusFields,
                                                    backgroundColor: '#E8E8E8',
                                                    borderRadius: '25px',
                                                    textAlign: 'left'
                                                }),
                                                menuList: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    minWidth: 235 - widthMinusFields,
                                                    maxWidth: 235 - widthMinusFields,
                                                    backgroundColor: '#E8E8E8',
                                                    borderRadius: '25px',
                                                    "::-webkit-scrollbar": {
                                                        display: 'none'
                                                    },
                                                    textAlign: 'left'
                                                })
                                            }} options={options} value={country} onChange={handleChangeCountry} />
                                    </div>
                                }
                                {!allowChangeAddress &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>CITY </Typography>
                                        <Typography textAlign='left' noWrap onClick={() => infoTextHandle(user.city, 'City')} sx={{ cursor: user.city.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', minWidth: 225 - widthMinusFields, maxWidth: 225 - widthMinusFields, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{user.city}</Typography>
                                        <Divider />
                                    </div>
                                }
                                {allowChangeAddress &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>CITY </Typography>
                                        <TextField
                                            onChange={handleChangeAddress}
                                            sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 225 - widthMinusFields }}
                                            size='small'
                                            name='city'
                                            value={userUpdate.city}
                                            variant='standard'
                                            InputProps={{ disableUnderline: true }}
                                        />
                                    </div>
                                }
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                                {!allowChangeAddress &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>STREET, HOME, APARTMENT </Typography>
                                        <Typography textAlign='left' noWrap onClick={() => infoTextHandle(user.street, 'Street address')} sx={{ cursor: user.street.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', minWidth: 225 - widthMinusFields, maxWidth: 225 - widthMinusFields, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{user.street}</Typography>
                                        <Divider />
                                    </div>
                                }
                                {allowChangeAddress &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>STREET, HOME, APARTMENT  </Typography>
                                        <TextField
                                            onChange={handleChangeAddress}
                                            sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 225 - widthMinusFields }}
                                            size='small'
                                            name='street'
                                            value={userUpdate.street}
                                            variant='standard'
                                            InputProps={{ disableUnderline: true }}
                                        />
                                    </div>
                                }
                                {!allowChangeAddress &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>POSTCODE </Typography>
                                        <Typography textAlign='left' noWrap onClick={() => infoTextHandle(user.postcode, 'postcode')} sx={{ cursor: user.postcode.length > 'shevelenkov1aa@eduspbsturu'.length ? 'pointer' : 'default', minWidth: 225 - widthMinusFields, maxWidth: 225 - widthMinusFields, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{user.postcode}</Typography>
                                        <Divider />
                                    </div>
                                }
                                {allowChangeAddress &&
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>POSTCODE </Typography>
                                        <TextField
                                            onChange={handleChangeAddress}
                                            sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 225 - widthMinusFields }}
                                            size='small'
                                            name='postcode'
                                            value={userUpdate.postcode}
                                            variant='standard'
                                            InputProps={{ disableUnderline: true }}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                        {allowChangeAddress && <Button size={buttonPasswordSize} sx={{ borderRadius: '20px', width: 200 - widthMinusFields, height: 35, marginTop: 3, "&:hover": { filter: 'brightness(70%)' }, transition: '0.45s' }} variant='contained' color='sidish' onClick={applyChangePersonal} >Apply Changes</Button>}
                    </motion.div>
                </Box>}
                {(division === 'myOrders') && <Box sx={{ gridArea: 'main', display: 'flex', flexDirection: 'column', gap: 5, alignItems: alignMain }}><MyOrders /></Box>}
                {division !== 'myOrders' && <Box sx={{ gridArea: 'footer', display: 'flex', justifyContent: 'center' }}>
                    <ChangePassword fetchUser={fetchUser} buttonPasswordSize={buttonPasswordSize} widthMinusFields={widthMinusFields} />
                </Box>}
            </Box >}
            {!dataLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '25vh' }}><CircularProgress color="inherit" /></div>}
            <DialogInfo openInfo={openInfo} setOpenInfo={setOpenInfo} textInfo={textInfo} setTextInfo={setTextInfo} infoField={infoField} setInfoField={setInfoField} />
        </motion.div>
    );
}

export default Profile;

