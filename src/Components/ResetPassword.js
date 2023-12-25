import { useContext, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import AuthContext from "../context/AuthContext";

function ResetPassword({ openReset, setOpenReset, emailInfo, setEmailInfo, emailError, setEmailError, emailHelper, setEmailHelper }) {

    const [loading, setLoading] = useState(false);

    const { setOpenSnackbar, setSnackbarMessage } = useContext(AuthContext);

    const inputChanged = (event) => {
        setEmailInfo({ ...emailInfo, [event.target.name]: event.target.value });
        setEmailError(false);
        setEmailHelper('');
    }

    const handleClose = () => {
        setOpenReset(false);
        setLoading(false);
    }

    const fetchResetPassword = (emailForm) => {
        fetch(process.env.REACT_APP_API_URL + 'resetpassword', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailForm)
        })
            .then(response => {
                if (response.ok) {
                    setOpenSnackbar(true);
                    setSnackbarMessage('A temporary password was sent to your email address');
                    setEmailInfo({
                        email: ''
                    });
                    handleClose();
                } else if (response.status === 401) {
                    setOpenSnackbar(true);
                    setSnackbarMessage(`User with this email (${emailInfo.email}) doesn\'t exist`);
                    setEmailError(true);
                    setEmailHelper(`User with this email (${emailInfo.email}) doesn\'t exist`);
                    setLoading(false);
                } else if (response.status === 409) {
                    setOpenSnackbar(true);
                    setSnackbarMessage(`User with this email (${emailInfo.email}) is not verified`);
                    setEmailError(true);
                    setEmailHelper(`User with this email (${emailInfo.email}) is not verified`);
                    setLoading(false);
                } else {
                    setOpenSnackbar(true);
                    setSnackbarMessage('Something went wrong');
                    handleClose();
                }
            })
            .catch(err => console.error(err))
    }

    const resetPassword = () => {
        if (emailInfo.email === '') {
            setEmailError(true);
            setEmailHelper('Email field is empty');
        } else {
            fetchResetPassword(emailInfo);
            setLoading(true);
        }
    }

    return loading ? (
        <Dialog style={{ margin: 'auto', height: 500 }} open={openReset} onClose={handleClose}>
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column', width: 400, height: 100, justifyContent: 'center' }}>
                <Typography variant="h6">Please wait...</Typography>
            </DialogContent>
        </Dialog>
    ) : (
        <Dialog style={{ margin: 'auto', height: 500 }} open={openReset} onClose={handleClose}>
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
                    label="Email"
                    variant='outlined'
                    onChange={inputChanged}
                />
            </DialogContent>
            <DialogActions style={{ marginTop: -20 }}>
                <Button color='sidish' sx={{ color: 'white', "&:hover": { filter: 'brightness(50%)', backgroundColor: '#303030' }, transition: '0.45s' }} variant='contained' onClick={resetPassword}>Reset Password</Button>
                <Button color='sidish' sx={{ "&:hover": { filter: 'brightness(40%)' }, transition: '0.45s' }} variant='outlined' onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ResetPassword;