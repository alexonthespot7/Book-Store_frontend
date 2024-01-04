import { useContext, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField } from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import useMediaQuery from "../Hooks/useMediaQuery";
import LoadingDialog from "./LoadingDialog";

const initialPasswordInfo = {
    oldPassword: '',
    newPassword: '',
    passwordCheck: ''
}

const initialIsError = {
    oldPassword: false,
    newPassword: false,
    passwordCheck: false
}

const label = {
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    passwordCheck: 'Password Control'
}

export default function ChangePassword({ buttonPasswordSize, responsiveWidthToSubtract }) {
    const [loading, setLoading] = useState(false);
    const [passwordInfo, setPasswordInfo] = useState(initialPasswordInfo);
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(initialIsError);
    const [isError, setIsError] = useState(initialIsError);
    const [errorText, setErrorText] = useState(initialPasswordInfo);

    const navigate = useNavigate();

    const { setOpenSnackbar, setSnackbarMessage } = useContext(AuthContext);

    const matches650px = useMediaQuery("(min-width: 650px)");

    const handleCloseChangePasswordDialog = () => {
        setOpenChangePasswordDialog(false);
        setPasswordInfo(initialPasswordInfo);
        setIsError(initialIsError);
        setShowPassword(initialIsError);
        setErrorText(initialPasswordInfo);
        setLoading(false);
    }

    const handleOpenChangePasswordDialog = () => {
        setOpenChangePasswordDialog(true);
    }

    const handleBadResponse = (response) => {
        if ([401, 500].includes(response.status)) {
            navigate('/');
            handleCloseChangePasswordDialog();
        } else if (response.status === 400) {
            setLoading(false);
            setIsError({ ...isError, oldPassword: true });
            setErrorText({ ...errorText, oldPassword: 'The old password is incorrect' });
        } else {
            navigate('/');
            setOpenSnackbar(true);
            setSnackbarMessage('Something is wrong with the server. Please try again later');
            handleCloseChangePasswordDialog();
        }
    }

    const changePassword = async () => {
        const finalPasswordInfo = {
            userId: sessionStorage.getItem('authorizedId'),
            oldPassword: passwordInfo.oldPassword,
            newPassword: passwordInfo.newPassword
        }
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'changepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(finalPasswordInfo)
            });
            if (!response.ok) {
                handleBadResponse(response);
                return null;
            }
            setOpenSnackbar(true);
            setSnackbarMessage('Password was changed successfully');
            handleCloseChangePasswordDialog();
        } catch (error) {
            console.error();
        }
    }

    const handleSave = () => {
        for (const field of Object.keys(initialPasswordInfo)) {
            if (passwordInfo[field] === '') {
                setIsError({ ...isError, [field]: true });
                setErrorText({ ...errorText, [field]: `${label[field]} is mandatory` });
                return null;
            }
        }
        if (passwordInfo.oldPassword === passwordInfo.newPassword) {
            setIsError({ ...isError, newPassword: true });
            setErrorText({ ...errorText, newPassword: `The new password is the same as the old one` });
            return null;
        }
        if (passwordInfo.newPassword !== passwordInfo.passwordCheck) {
            setIsError({ ...isError, passwordCheck: true });
            setErrorText({ ...errorText, passwordCheck: `Password Control doesn't match new password` });
            return null;
        }
        setLoading(true);
        changePassword();
        setPasswordInfo({ ...passwordInfo, passwordCheck: '' })
    }

    const handleClickShowPassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    }

    const inputChanged = (event) => {
        setPasswordInfo({ ...passwordInfo, [event.target.name]: event.target.value });
        setIsError({ ...isError, [event.target.name]: false });
        setErrorText({ ...errorText, [event.target.name]: '' });
    }

    const footerMargin = matches650px ? 5 : 2.5;
    return (
        <>
            <Button size={buttonPasswordSize} sx={{ borderRadius: '20px', width: 200 - responsiveWidthToSubtract, height: 35, marginTop: footerMargin, marginBottom: 2.5, "&:hover": { filter: 'brightness(70%)' }, transition: '0.45s' }} variant='contained' color='sidish' onClick={handleOpenChangePasswordDialog}>
                Change Password
            </Button>
            {!loading &&
                <Dialog open={openChangePasswordDialog} onClose={handleCloseChangePasswordDialog}>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                        {Object.keys(initialPasswordInfo).map((field) => (
                            <TextField
                                key={field}
                                margin='dense'
                                type={showPassword[field] ? 'text' : 'password'}
                                name={field}
                                value={passwordInfo[field]}
                                onChange={inputChanged}
                                error={isError[field]}
                                helperText={errorText[field]}
                                label={label[field]}
                                variant='outlined'
                                color='sidish'
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => handleClickShowPassword(field)}
                                                edge="end"
                                            >
                                                {showPassword[field] ? <VisibilityOff color='sidish' /> : <Visibility color='sidish' />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        ))}
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Button sx={{ transition: '0.45s' }} color='sidish' onClick={handleCloseChangePasswordDialog}>Cancel</Button>
                        <Button sx={{ "&:hover": { filter: 'brightness(70%)' }, transition: '0.45s' }} color='sidish' variant='contained' onClick={handleSave}>Save</Button>
                    </DialogActions>
                </Dialog>
            }
            {loading && <LoadingDialog open={openChangePasswordDialog} onClose={handleCloseChangePasswordDialog} title='Change Password' />}
        </>
    );
}