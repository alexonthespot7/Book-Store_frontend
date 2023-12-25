import { useContext, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

import AuthContext from "../../context/AuthContext";
import LoadingDialog from "../LoadingDialog";

const initialEmailInfo = {
    email: ''
}

function ResetPassword({ openReset, setOpenReset }) {
    const [emailInfo, setEmailInfo] = useState(initialEmailInfo);
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState('');
    const [loading, setLoading] = useState(false);

    const { setOpenSnackbar, setSnackbarMessage } = useContext(AuthContext);

    const handleReset = () => {
        setEmailError(false);
        setEmailHelper('');
        setEmailInfo(initialEmailInfo);
    }

    const inputChanged = (event) => {
        setEmailInfo({ ...emailInfo, [event.target.name]: event.target.value });
        setEmailError(false);
        setEmailHelper('');
    }

    const closeResetDialog = () => {
        handleReset();
        setOpenReset(false);
        setLoading(false);
    }

    const handleBadResponse = (response) => {
        if (response.status === 404) {
            setLoading(false);
            setEmailError(true);
            setEmailHelper('No user was found by this email');
        } else if (response.status === 409) {
            setLoading(false);
            setOpenSnackbar(true);
            setSnackbarMessage('Please verify your account first');
        } else if (response.status === 501) {
            setOpenSnackbar(true);
            setSnackbarMessage('The email service is not working at the moment');
            closeResetDialog();
        } else {
            alert('Something is wrong with the server');
        }
    }

    const handleGoodResponse = (response) => {
        setOpenSnackbar(true);
        setSnackbarMessage('A temporary password was sent to your email address');
        closeResetDialog();
    }

    const fetchResetPassword = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'resetpassword', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailInfo)
            });
            if (!response.ok) {
                handleBadResponse(response);
                return null;
            }
            handleGoodResponse(response);
        } catch (error) {
            console.error(error);
            alert('Something is wrong with the server');
        }
    }

    const resetPassword = () => {
        if (emailInfo.email === '') {
            setEmailError(true);
            setEmailHelper('Email field is empty');
            return null;
        } else if (!isValidEmail(emailInfo.email)) {
            setEmailError(true);
            setEmailHelper('Provide a valid email please');
            return null;
        }
        fetchResetPassword(emailInfo);
        setLoading(true);
    }

    const isValidEmail = (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    return loading ? (
        <LoadingDialog title='Reset password' open={openReset} onClose={closeResetDialog} />
    ) : (
        <Dialog style={{ margin: 'auto', height: 500 }} open={openReset} onClose={closeResetDialog}>
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column', width: 400, height: 100, justifyContent: 'center' }}>
                <TextField
                    color='sidish'
                    value={emailInfo.email}
                    type='email'
                    margin='dense'
                    error={emailError}
                    helperText={emailHelper}
                    name='email'
                    label='Email'
                    variant='outlined'
                    onChange={inputChanged}
                />
            </DialogContent>
            <DialogActions style={{ marginTop: -20 }}>
                <Button color='sidish' sx={{ color: 'white', "&:hover": { filter: 'brightness(50%)', backgroundColor: '#303030' }, transition: '0.45s' }} variant='contained' onClick={resetPassword}>Reset Password</Button>
                <Button color='sidish' sx={{ "&:hover": { filter: 'brightness(40%)' }, transition: '0.45s' }} variant='outlined' onClick={closeResetDialog}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ResetPassword;