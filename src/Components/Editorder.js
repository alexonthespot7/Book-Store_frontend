import { useMemo, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import countryList from "react-select-country-list";


export default function EditOrder({ order, updateOrder }) {

    const [open, setOpen] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [nameHelper, setNameHelper] = useState('');
    const [cityError, setCityError] = useState(false);
    const [cityHelper, setCityHelper] = useState('');
    const [streetError, setStreetError] = useState(false);
    const [streetHelper, setStreetHelper] = useState('');
    const [postcodeError, setPostcodeError] = useState(false);
    const [postcodeHelper, setPostcodeHelper] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState('');

    const [orderInfo, setOrderInfo] = useState({
        firstname: '',
        lastname: '',
        country: '',
        status: '',
        city: '',
        street: '',
        postcode: '',
        email: ''
    });

    const statuses = ['Created', 'In progress', 'Packing', 'On delivery', 'Completed'];
    const countries = useMemo(() => countryList().getData(), []);

    const handleClickOpen = () => {
        setOrderInfo({
            firstname: order.firstname,
            lastname: order.lastname,
            country: order.country,
            status: order.status,
            city: order.city,
            street: order.street,
            postcode: order.postcode,
            email: order.email
        });
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const inputChanged = (event) => {
        setOrderInfo({ ...orderInfo, [event.target.name]: event.target.value });
        if (['firstname', 'lastname'].includes(event.target.name)) {
            setNameError(false);
            setNameHelper('');
        } else if (event.target.name === 'city') {
            setCityError(false);
            setCityHelper('');
        } else if (event.target.name === 'street') {
            setStreetError(false);
            setStreetHelper('');
        } else if (event.target.name === 'postcode') {
            setPostcodeError(false);
            setPostcodeHelper('');
        } else if (event.target.name === 'email') {
            setEmailError(false);
            setEmailHelper('');
        }
    }

    const handleSave = () => {
        let check = true;

        if (orderInfo.firstname == '') {
            check = false;
            setNameError(true);
            setNameHelper('Name fields cannot be empty');
        }
        if (orderInfo.city == '') {
            check = false;
            setCityError(true);
            setCityHelper('City cannot be empty');
        }
        if (orderInfo.street == '') {
            check = false;
            setStreetError(true);
            setStreetHelper('Street address cannot be empty');
        }
        if (orderInfo.postcode == '') {
            check = false;
            setPostcodeError(true);
            setPostcodeHelper('postcode cannot be empty');
        }
        if (orderInfo.email === '') {
            check = false;
            setEmailError(true);
            setEmailHelper('Email cannot be empty');
        }
        if (check) {
            updateOrder(orderInfo, `${process.env.REACT_APP_API_URL}updateorder/${order.orderid}`);
            setOpen(false);
        }

    }

    return (
        <div>
            <IconButton color='sidish' onClick={handleClickOpen}>
                <EditIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit order</DialogTitle>
                <DialogContent>
                    <TextField
                        color='sidish'
                        variant='outlined'
                        name="status"
                        select
                        fullWidth
                        label="Status"
                        value={orderInfo.status}
                        onChange={inputChanged}
                        style={{ marginTop: 10 }}
                    >
                        {statuses.map((status, index) => (
                            <MenuItem key={index} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        color='sidish'
                        error={nameError}
                        helperText={nameHelper}
                        margin="dense"
                        name="firstname"
                        value={orderInfo.firstname}
                        onChange={inputChanged}
                        label="Firstname"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={nameError}
                        helperText={nameHelper}
                        margin="dense"
                        name="lastname"
                        value={orderInfo.lastname}
                        onChange={inputChanged}
                        label="Lastname"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        variant='outlined'
                        name="country"
                        select
                        fullWidth
                        label="Country"
                        value={orderInfo.country}
                        onChange={inputChanged}
                        style={{ marginTop: 10 }}
                    >
                        {countries.map((country, index) => (
                            <MenuItem key={index} value={country.label}>
                                {country.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        color='sidish'
                        error={cityError}
                        helperText={cityHelper}
                        margin="dense"
                        name="city"
                        value={orderInfo.city}
                        onChange={inputChanged}
                        label="City"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={streetError}
                        helperText={streetHelper}
                        margin="dense"
                        name="street"
                        value={orderInfo.street}
                        onChange={inputChanged}
                        label="Street, home, apartment"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={postcodeError}
                        helperText={postcodeHelper}
                        margin="dense"
                        name="postcode"
                        value={orderInfo.postcode}
                        onChange={inputChanged}
                        label="Postcode"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        type="email"
                        error={emailError}
                        helperText={emailHelper}
                        margin="dense"
                        name="email"
                        value={orderInfo.email}
                        onChange={inputChanged}
                        label="Email"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ marginTop: -2, display: 'flex', justifyContent: 'space-between', paddingLeft: 2.5, paddingRight: 2.5 }}>
                    <div style={{ display: 'flex' }}>
                        <Button color='sidish' onClick={handleClose}>Cancel</Button>
                        <Button color='sidish' onClick={handleSave}>Save</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}