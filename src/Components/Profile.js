import { useEffect, useState, useContext, forwardRef } from "react";

import { Box, Button, Card, CircularProgress, Divider, IconButton, InputAdornment, Paper, TextField, Typography, useMediaQuery } from "@mui/material";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import RemoveIcon from '@mui/icons-material/Remove';

import AuthContext from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { motion } from 'framer-motion';

import countryList from 'react-select-country-list';
import Select from 'react-select';
import { useMemo } from "react";
import MyOrders from "./MyOrders";
import DialogInfo from "./DialogInfo";


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

    const [passwordInfo, setPasswordInfo] = useState({
        username: sessionStorage.getItem('authorizedUsername'),
        oldPassword: '',
        newPassword: ''
    });

    const [passwordCheck, setPasswordCheck] = useState('');

    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [oldPasswordHelper, setOldPasswordHelper] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelper, setPasswordHelper] = useState('');
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCheck, setShowCheck] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const [allowChangePersonal, setAllowChangePersonal] = useState(false);
    const [allowChangeAddress, setAllowChangeAddress] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [textInfo, setTextInfo] = useState('');
    const [infoField, setInfoField] = useState('');

    const matchesXL = useMediaQuery("(min-width: 1120px)");
    const matchesL1 = useMediaQuery("(min-width: 1050px)");
    const matchesL = useMediaQuery("(min-width: 1000px)");
    const matchesM1 = useMediaQuery("(min-width: 800px)");
    const matchesM = useMediaQuery("(min-width: 650px)");
    const matchesX = useMediaQuery("(min-width: 400px)");

    const typoSize = 'h4';
    const alignMain = matchesL ? 'left' : 'center';
    const alignSidebar = matchesL ? 'left' : 'center';
    const mainDirection = matchesM ? 'row' : 'column';
    const defineMainGap = () => {

        if (matchesXL) {
            return 225;
        } else if (matchesL1) {
            return 175;
        } else if (matchesM1) {
            return 140;
        } else if (matchesM) {
            return 125
        } else {
            return 25;
        }
    }
    const mainGap = defineMainGap();
    const footerMargin = matchesM ? 5 : 2.5;

    const gridStyle = matchesL ? {
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
    const widthMinusFields = matchesX ? 0 : 30;
    const widthMinusPannel = matchesX ? 0 : 50;
    const buttonPasswordSize = matchesX ? 'medium' : 'small';

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
        if (sessionStorage.getItem('authorizedUsername')) {
            fetchUser();
        }
    }, []);

    const handleCloseChangePasswordDialog = () => {
        setOpenChangePasswordDialog(false);
    }

    const handleOpenChangePasswordDialog = () => {
        setOpenChangePasswordDialog(true);
        setPasswordInfo({
            username: sessionStorage.getItem('authorizedUsername'),
            oldPassword: '',
            newPassword: ''
        });
        setOldPasswordError(false);
        setOldPasswordHelper('');
        setPasswordError(false);
        setPasswordHelper('');
        setPasswordCheck('');
    }

    const inputChanged = (event) => {
        if (event.target.name === 'passwordCheck') {
            setPasswordCheck(event.target.value);
        } else {
            setPasswordInfo({ ...passwordInfo, [event.target.name]: event.target.value });
        }
        if (event.target.name === 'passwordCheck') {
            setPasswordError(false);
            setPasswordHelper('');
        } else if (event.target.name === 'oldPassword') {
            setOldPasswordError(false);
            setOldPasswordHelper('');
        } else {
            setPasswordError(false);
            setPasswordHelper('');
        }
    }

    const changePassword = (passwordInfo) => {
        const token = sessionStorage.getItem('jwt');

        fetch(process.env.REACT_APP_API_URL + 'changepassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(passwordInfo)
        })
            .then(response => {
                if (response.ok) {
                    fetchUser();
                    setOpenSnackbar(true);
                    setSnackbarMessage('Password was changed successfully');
                    setOpenChangePasswordDialog(false);
                } else if (response.status === 409) {
                    setOldPasswordError(true);
                    setOldPasswordHelper('Old password is incorrect');
                } else {
                    setOpenChangePasswordDialog(false);
                    setOpenSnackbar(true);
                    setSnackbarMessage('You cannot change password at the moment');
                }
            })
            .catch(err => console.error(err))
    }

    const handleSave = () => {
        let check = true;
        if (passwordInfo.oldPassword === '') {
            check = false;
            setOldPasswordError(true);
            setOldPasswordHelper('This field cannot be empty');
        }
        if (passwordInfo.newPassword === '') {
            check = false;
            setPasswordError(true);
            setPasswordHelper('Password cannot be empty');
        }
        if (passwordCheck !== passwordInfo.newPassword) {
            check = false;
            setPasswordError(true);
            setPasswordHelper('Password doesn\'t match');
        }

        if (check) {
            changePassword(passwordInfo);
            setPasswordInfo({
                username: sessionStorage.getItem('authorizedId'),
                oldPassword: '',
                newPassword: ''
            });
            setPasswordCheck('');
        }

    }

    const handleClickShowPassword = (info) => {
        if (info === 'new') {
            setShowPassword((show) => !show);
        } else if (info === 'check') {
            setShowCheck((show) => !show);
        } else {
            setShowOld((show) => !show);
        }
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
                    <Typography sx={{ backgroundColor: 'black', color: 'white', paddingLeft: 1, paddingRight: 1 }} variant={typoSize}>My</Typography>
                    <Typography variant={typoSize}>Profile</Typography>
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
                    <Button size={buttonPasswordSize} sx={{ borderRadius: '20px', width: 200 - widthMinusFields, height: 35, marginTop: footerMargin, marginBottom: 2.5, "&:hover": { filter: 'brightness(70%)' }, transition: '0.45s' }} variant='contained' color='sidish' onClick={handleOpenChangePasswordDialog}>Change password</Button>
                </Box>}
            </Box >}
            {!dataLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 77, marginBottom: 77 }}><CircularProgress color="inherit" /></div>}

            <Dialog open={openChangePasswordDialog} onClose={handleCloseChangePasswordDialog}>
                <DialogTitle>Change password</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        color="sidish"
                        type={showOld ? 'text' : 'password'}
                        error={oldPasswordError}
                        helperText={oldPasswordHelper}
                        margin="dense"
                        name="oldPassword"
                        value={passwordInfo.oldPassword}
                        onChange={inputChanged}
                        label="Old password"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleClickShowPassword('old')}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showOld ? <VisibilityOff color='sidish' /> : <Visibility color='sidish' />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        color="sidish"
                        type={showPassword ? 'text' : 'password'}
                        error={passwordError}
                        helperText={passwordHelper}
                        margin="dense"
                        name="newPassword"
                        value={passwordInfo.newPassword}
                        onChange={inputChanged}
                        label="Password"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleClickShowPassword('new')}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff color='sidish' /> : <Visibility color='sidish' />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        color="sidish"
                        type={showCheck ? 'text' : 'password'}
                        error={passwordError}
                        helperText={passwordHelper}
                        margin="dense"
                        name="passwordCheck"
                        value={passwordCheck}
                        onChange={inputChanged}
                        label="Password Control"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleClickShowPassword('check')}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showCheck ? <VisibilityOff color='sidish' /> : <Visibility color='sidish' />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button sx={{ transition: '0.45s' }} color='sidish' onClick={handleCloseChangePasswordDialog}>Cancel</Button>
                    <Button sx={{ "&:hover": { filter: 'brightness(70%)' }, transition: '0.45s' }} color='sidish' variant='contained' onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
            <DialogInfo openInfo={openInfo} setOpenInfo={setOpenInfo} textInfo={textInfo} setTextInfo={setTextInfo} infoField={infoField} setInfoField={setInfoField} />
        </motion.div>
    );
}

export default Profile;

