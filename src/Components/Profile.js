import { useEffect, useState, useContext, useMemo } from "react";

import { Box, Button, Card, CircularProgress, Divider, TextField, Typography, useMediaQuery } from "@mui/material";

import RemoveIcon from '@mui/icons-material/Remove';

import { useNavigate } from "react-router-dom";

import { motion } from 'framer-motion';

import countryList from 'react-select-country-list';

import Select from 'react-select';

import AuthContext from "../context/AuthContext";
import MyOrders from "./MyOrders";
import DialogInfo from "./DialogInfo";
import ChangePassword from "./ChangePassword";

const initialAllowChange = {
    personalData: false,
    addressData: false
}

const initialUser = {
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
}

const initialCountry = {
    value: '',
    label: ''
}

const mainDivisions = ['personalData', 'myOrders'];

const dataDivisionFields = {
    personalData: {
        firstColumn: ['firstname', 'lastname'],
        secondColumn: ['email', 'username']
    },
    addressData: {
        firstColumn: ['country', 'city'],
        secondColumn: ['street', 'postcode']
    }
}

function Profile() {
    const [allowChange, setAllowChange] = useState(initialAllowChange);
    const [user, setUser] = useState({});
    const [userUpdate, setUserUpdate] = useState(initialUser);
    const [country, setCountry] = useState(initialCountry);
    const [division, setDivision] = useState('personalData');
    const [dataLoaded, setDataLoaded] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [textInfo, setTextInfo] = useState('');
    const [infoField, setInfoField] = useState('');

    const navigate = useNavigate();

    const { setOpenSnackbar, setSnackbarMessage, setBgrColor, fetchUser } = useContext(AuthContext);

    const countries = useMemo(() => countryList().getData(), []);

    const matches1120px = useMediaQuery("(min-width: 1120px)");
    const matches1050px = useMediaQuery("(min-width: 1050px)");
    const matches1000px = useMediaQuery("(min-width: 1000px)");
    const matches800px = useMediaQuery("(min-width: 800px)");
    const matches650px = useMediaQuery("(min-width: 650px)");
    const matches400px = useMediaQuery("(min-width: 400px)");

    const handleSomethingWentWrong = () => {
        setOpenSnackbar(true);
        setSnackbarMessage('Something went wrong. Please try again later');
    }

    const handleBadResponseFetchUser = (response) => {
        if ([401, 403, 500].includes(response.status)) {
            navigate('/');
        } else {
            handleSomethingWentWrong();
        }
    }

    const handleData = (data) => {
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

    useEffect(() => {
        setBgrColor('#FFFAFA');
        fetchUser(handleBadResponseFetchUser, handleData);
    }, []);

    const definePersonalDataMyOrdersTypographySize = (currentDivision) => {
        return currentDivision === division ? 18 : 17;
    }

    const definePersonalDataMyOrdersTypographyColor = (currentDivision) => {
        return currentDivision === division ? 'thirdary' : '#808080';
    }

    // The function formats camelCase or PascalCase strings by capitalizing the first letter of each word separated by capital letters, 
    // returning the formatted string.
    const formatText = (input) => {
        const words = input.split(/(?=[A-Z])/);
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const toggleAllowChange = (dataDivision) => {
        setAllowChange({ ...allowChange, [dataDivision]: !allowChange[dataDivision] });
    }

    const cancelChanges = (dataDivision) => {
        toggleAllowChange(dataDivision);
        if (dataDivision === 'personalData') {
            setUserUpdate({ ...userUpdate, firstname: user.firstname, lastname: user.lastname });
        } else {
            setUserUpdate({ ...userUpdate, country: user.country, city: user.city, street: user.street, postcode: user.postcode });
        }
    }

    const infoTextHandle = (text, field) => {
        if (text.length > 26) {
            setOpenInfo(true);
            setTextInfo(text);
            setInfoField(field);
        }
    }

    const handleChangeData = (event) => {
        setUserUpdate({ ...userUpdate, [event.target.name]: event.target.value });
    }

    const handleChangeCountry = (value) => {
        setCountry(value);
        setUserUpdate({ ...userUpdate, country: value.label })
    }

    const handleBadResponseUpdateUser = (response) => {
        if ([401, 403, 500].includes(response.status)) {
            navigate('/');
        } else {
            handleSomethingWentWrong();
        }
    }

    const fetchUpdateUser = async () => {
        const token = sessionStorage.getItem('jwt');
        setDataLoaded(false);
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'updateuser/' + userUpdate.id, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(userUpdate)
            });
            if (!response.ok) {
                handleBadResponseUpdateUser(response);
                return null;
            }
            setOpenSnackbar(true);
            setSnackbarMessage('Your personal information was updated');
            setAllowChange(initialAllowChange);
            fetchUser();
        } catch (error) {
            console.error(error);
            handleSomethingWentWrong();
            navigate('/');
        }
    }

    const applyChanges = (dataDivision) => {
        for (const column of Object.values(dataDivisionFields[dataDivision])) {
            for (const field of column) {
                if (userUpdate[field] === '') {
                    setOpenSnackbar(true);
                    setSnackbarMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} is mandatory`);
                    return null;
                }
            }
        }
        fetchUpdateUser();
    }

    const handleCloseLongInfoDialog = () => {
        setOpenInfo(false);
        setTextInfo('');
        setInfoField('');
    }

    // Styles:
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
    const alignSidebar = matches1000px ? 'left' : 'center';
    const mainDivisionsCardWidth = matches400px ? 250 : 200;
    const alignMainAreaBox = matches1000px ? 'left' : 'center';
    const dataDivisionDirection = matches650px ? 'row' : 'column';
    const defineDataDivisionGap = () => {
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
    const dataDivisionGap = defineDataDivisionGap();
    const responsiveWidthToSubtract = matches400px ? 0 : 30;
    const buttonPasswordSize = matches400px ? 'medium' : 'small';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {dataLoaded &&
                <Box sx={gridStyle}>
                    <Box sx={{ gridArea: 'header', display: 'flex', justifyContent: 'center', marginBottom: 2.5, marginTop: 2.5 }}>
                        <Typography sx={{ backgroundColor: 'black', color: 'white', paddingLeft: 1, paddingRight: 1 }} variant='h4'>My</Typography>
                        <Typography variant='h4'>Profile</Typography>
                    </Box>
                    <Box sx={{ gridArea: 'sidebar', display: 'flex', justifyContent: alignSidebar }}>
                        <Card elevation={5} sx={{ borderRadius: '15px', backgroundColor: 'black', color: 'white', width: mainDivisionsCardWidth, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 2 }}>
                            {mainDivisions.map((currentDivision, index) => (
                                <Typography
                                    key={index}
                                    onClick={() => setDivision(currentDivision)}
                                    sx={{ marginLeft: 2, "&:hover": { filter: 'brightness(60%)' }, cursor: 'pointer', transition: '0.45s', display: 'flex', alignItems: 'center' }}
                                    variant='h6'
                                    fontSize={definePersonalDataMyOrdersTypographySize(currentDivision)}
                                    color={definePersonalDataMyOrdersTypographyColor(currentDivision)}
                                >
                                    {(division === currentDivision) && <RemoveIcon fontSize='small' />}
                                    {formatText(currentDivision)}
                                </Typography>
                            ))}
                        </Card>
                    </Box>

                    <Box sx={{ gridArea: 'main', display: 'flex', flexDirection: 'column', gap: 5, alignItems: alignMainAreaBox }}>
                        {(division === 'personalData') &&
                            Object.entries(dataDivisionFields).map(([dataDivision, divisionColumns], dataDivisionIndex) => (
                                <motion.div
                                    key={dataDivisionIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ display: 'flex', flexDirection: 'column' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <Typography variant='h5' fontSize={22}>{formatText(dataDivision)}</Typography>
                                        <Typography
                                            sx={{ cursor: 'pointer', textDecoration: 'underline', "&:hover": { filter: 'brightness(125%)' }, transition: '0.45s' }}
                                            variant='body'
                                            color='#A9A9A9'
                                            fontSize={14}
                                            onClick={() => !allowChange[dataDivision] ? toggleAllowChange(dataDivision) : cancelChanges(dataDivision)}
                                        >
                                            {!allowChange[dataDivision] ? 'Change' : 'Cancel'}
                                        </Typography>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: dataDivisionDirection, justifyContent: 'flex-start', gap: dataDivisionGap, marginTop: 25 }}>
                                        {Object.values(divisionColumns).map((fields, columnIndex) => (
                                            <div key={columnIndex} style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                                                {fields.map((field, fieldIndex) => (
                                                    <div key={fieldIndex} style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#A9A9A9' fontSize={14}>{field.toUpperCase()}</Typography>
                                                        {(!allowChange[dataDivision] || dataDivisionFields.personalData.secondColumn.includes(field)) &&
                                                            <>
                                                                <Typography
                                                                    onClick={() => infoTextHandle(user[field], field.charAt(0).toUpperCase() + field.slice(1))}
                                                                    sx={{ cursor: user[field].length > 26 ? 'pointer' : 'default', minWidth: 225 - responsiveWidthToSubtract, maxWidth: 225 - responsiveWidthToSubtract, marginBottom: 0.5 }}
                                                                    textAlign='left' noWrap fontWeight='bold' fontSize={14} variant='h7'
                                                                >
                                                                    {user[field]}
                                                                </Typography>
                                                                <Divider />
                                                            </>
                                                        }
                                                        {allowChange[dataDivision] && !dataDivisionFields.personalData.secondColumn.includes(field) &&
                                                            <>
                                                                {field !== 'country' &&
                                                                    <TextField
                                                                        onChange={handleChangeData}
                                                                        sx={{ paddingTop: 0.5, paddingBottom: 0.25, paddingLeft: 1, paddingRight: 1, borderRadius: '25px', backgroundColor: '#E8E8E8', width: 225 - responsiveWidthToSubtract }}
                                                                        size='small'
                                                                        name={field}
                                                                        value={userUpdate[field]}
                                                                        variant='standard'
                                                                        InputProps={{ disableUnderline: true }}
                                                                    />
                                                                }
                                                                {field === 'country' &&
                                                                    <Select
                                                                        styles={{
                                                                            control: (baseStyles, state) => ({
                                                                                ...baseStyles,
                                                                                minWidth: 235 - responsiveWidthToSubtract,
                                                                                maxWidth: 235 - responsiveWidthToSubtract,
                                                                                minHeight: 20,
                                                                                height: 35,
                                                                                backgroundColor: '#E8E8E8',
                                                                                borderRadius: '25px',
                                                                                textAlign: 'left'
                                                                            }),
                                                                            menu: (baseStyles, state) => ({
                                                                                ...baseStyles,
                                                                                minWidth: 235 - responsiveWidthToSubtract,
                                                                                maxWidth: 235 - responsiveWidthToSubtract,
                                                                                backgroundColor: '#E8E8E8',
                                                                                borderRadius: '25px',
                                                                                textAlign: 'left'
                                                                            }),
                                                                            menuList: (baseStyles, state) => ({
                                                                                ...baseStyles,
                                                                                minWidth: 235 - responsiveWidthToSubtract,
                                                                                maxWidth: 235 - responsiveWidthToSubtract,
                                                                                backgroundColor: '#E8E8E8',
                                                                                borderRadius: '25px',
                                                                                "::-webkit-scrollbar": {
                                                                                    display: 'none'
                                                                                },
                                                                                textAlign: 'left'
                                                                            })
                                                                        }}
                                                                        options={countries} value={country} onChange={handleChangeCountry}
                                                                    />
                                                                }
                                                            </>
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    {allowChange[dataDivision] &&
                                        <Button
                                            variant='contained' color='sidish' size={buttonPasswordSize}
                                            sx={{ borderRadius: '20px', width: 200 - responsiveWidthToSubtract, height: 35, marginTop: 3, "&:hover": { filter: 'brightness(70%)' }, transition: '0.45s' }}
                                            onClick={() => applyChanges(dataDivision)}
                                        >
                                            Apply Changes
                                        </Button>
                                    }
                                </motion.div>
                            ))
                        }
                        {(division === 'myOrders') && <MyOrders />}
                    </Box>
                    {(division !== 'myOrders') &&
                        <Box sx={{ gridArea: 'footer', display: 'flex', justifyContent: 'center' }}>
                            <ChangePassword buttonPasswordSize={buttonPasswordSize} responsiveWidthToSubtract={responsiveWidthToSubtract} />
                        </Box>
                    }
                </Box>
            }
            {!dataLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '25vh' }}><CircularProgress color="inherit" /></div>}
            <DialogInfo openInfo={openInfo} setOpenInfo={setOpenInfo} handleClose={handleCloseLongInfoDialog} textInfo={textInfo} infoField={infoField} />
        </motion.div>
    );
}

export default Profile;