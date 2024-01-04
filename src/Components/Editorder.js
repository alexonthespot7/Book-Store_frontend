import { useMemo, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';

import countryList from "react-select-country-list";

const initialOrderInfo = {
    status: '',
    firstname: '',
    lastname: '',
    country: '',
    city: '',
    street: '',
    postcode: '',
    email: ''
}

const initialIsError = {
    firstname: false,
    lastname: false,
    country: false,
    status: false,
    city: false,
    street: false,
    postcode: false,
    email: false
}

export default function EditOrder({ order, updateOrder }) {
    const [open, setOpen] = useState(false);
    const [orderInfo, setOrderInfo] = useState(initialOrderInfo);
    const [isError, setIsError] = useState(initialIsError);
    const [errorText, setErrorText] = useState(initialOrderInfo);

    const countries = useMemo(() => countryList().getData(), []);

    const statuses = ['Created', 'In progress', 'Packing', 'On delivery', 'Completed'];

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
        setOrderInfo(initialOrderInfo);
    }

    const inputChanged = (event) => {
        setOrderInfo({ ...orderInfo, [event.target.name]: event.target.value });
        setIsError({ ...isError, [event.target.name]: false });
        setErrorText({ ...errorText, [event.target.name]: '' });
    }

    const isValidEmail = (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    const handleSave = async () => {
        for (const field of Object.keys(initialOrderInfo)) {
            if (orderInfo[field] === '') {
                setIsError({ ...isError, [field]: true });
                setErrorText({ ...errorText, [field]: `${field} is mandatory` });
                return null;
            }
        }
        if (!isValidEmail(orderInfo.email)) {
            setIsError({ ...isError, email: true });
            setErrorText({ ...errorText, email: 'Please provide a valid email' });
            return null;
        }
        await updateOrder(orderInfo, `${process.env.REACT_APP_API_URL}updateorder/${order.orderid}`);
        setOpen(false);
    }

    return (
        <div>
            <IconButton color='sidish' onClick={handleClickOpen}>
                <EditIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit order</DialogTitle>
                <DialogContent>
                    {Object.keys(initialOrderInfo).map((field) => {
                        if (field === 'status') {
                            return (
                                <TextField
                                    key={field}
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
                            );
                        } else if (field === 'country') {
                            return (
                                <TextField
                                    key={field}
                                    color='sidish'
                                    error={isError[field]}
                                    helperText={errorText[field]}
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
                            );
                        } else {
                            return (
                                <TextField
                                    key={field}
                                    color='sidish'
                                    error={isError[field]}
                                    helperText={errorText[field]}
                                    margin="dense"
                                    name={field}
                                    value={orderInfo[field]}
                                    onChange={inputChanged}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    fullWidth
                                    variant="outlined"
                                />
                            );
                        }
                    })}
                </DialogContent>
                <DialogActions sx={{ marginTop: -2, display: 'flex', justifyContent: 'space-between', paddingLeft: 2.5, paddingRight: 2.5 }}>
                    <Button color='sidish' onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color='sidish' onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}