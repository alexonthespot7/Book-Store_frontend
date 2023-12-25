import { useContext, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField } from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import AuthContext from "../../context/AuthContext";
import useMediaQuery from "../../Hooks/useMediaQuery";
import LoadingDialog from "../LoadingDialog";

const initialSignupForm = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
}

const initialIsError = {
    firstname: false,
    lastname: false,
    username: false,
    email: false,
    password: false,
    repeatPassword: false
}

const initialErrorText = { ...initialSignupForm, repeatPassword: '' }

function Signup({ buttonSize }) {
    const [openSignup, setOpenSignup] = useState(false);
    const [signupForm, setSignupForm] = useState(initialSignupForm);
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isError, setIsError] = useState(initialIsError);
    const [errorText, setErrorText] = useState(initialErrorText);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputType = {
        default: 'text',
        password: (showPassword ? 'text' : 'password')
    }

    const matches350 = useMediaQuery("(min-width: 350px)");

    const inputSize = matches350 ? 'medium' : 'small';

    const { setOpenSnackbar, setSnackbarMessage, dialogueWidth } = useContext(AuthContext);

    const clearFormErrors = () => {
        setIsError(initialIsError);
        setErrorText(initialErrorText);
        setRepeatPassword('');
    }

    const isValidEmail = (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const maxLength = 34;
        return pattern.test(email) && email.length <= maxLength;
    }

    const inputChanged = (event) => {
        if (event.target.name === 'repeatPassword') {
            setRepeatPassword(event.target.value);
        } else {
            setSignupForm({ ...signupForm, [event.target.name]: event.target.value });
        }
        setIsError({ ...isError, [event.target.name]: false });
        setErrorText({ ...errorText, [event.target.name]: '' });
    }

    const handleBadResponse = (response) => {
        if (response.status === 406) {
            setLoading(false);
            setIsError({ ...isError, email: true });
            setErrorText({ ...errorText, email: 'The email is already in use' });
        } else if (response.status === 409) {
            setLoading(false);
            setIsError({ ...isError, username: true });
            setErrorText({ ...errorText, username: 'The username is already in use' });
        } else {
            alert('Something is wrong with the server');
        }
    }

    const handleGoodResponse = (response) => {
        if (response.status === 200) {
            setSignupForm(initialSignupForm);
            clearFormErrors();
            setLoading(false);
            setOpenSnackbar(true);
            setSnackbarMessage('The verification link has been sent to your email');
            setOpenSignup(false);
        } else {
            setSignupForm(initialSignupForm);
            clearFormErrors();
            setLoading(false);
            setOpenSnackbar(true);
            setSnackbarMessage('The registration went well, you can login now');
            setOpenSignup(false);
        }
    }

    const fetchSignupUser = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupForm)
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

    const signup = () => {
        for (const field of Object.keys(signupForm)) {
            if (signupForm[field] === '') {
                setIsError({ ...isError, [field]: true });
                setErrorText({ ...errorText, [field]: `${field} is mandatory` });
                return null;
            }
        }
        if (signupForm.password !== repeatPassword) {
            setIsError({ ...isError, repeatPassword: true });
            setErrorText({ ...errorText, repeatPassword: 'The passwords don\'t match' });
            return null;
        }
        if (!isValidEmail(signupForm.email)) {
            setIsError({ ...isError, email: true });
            setErrorText({ ...errorText, email: 'Please provide a valid email' });
            return null;
        }
        if (signupForm.username.includes(' ')) {
            setIsError({ ...isError, username: true });
            setErrorText({ ...errorText, username: 'Username shouldn\'t contain whitespaces' });
            return null;
        }
        if (signupForm.username.length > 34) {
            setIsError({ ...isError, username: true });
            setErrorText({ ...errorText, username: 'Username can\'t be that long' });
            return null;
        }

        setLoading(true)
        clearFormErrors();
        fetchSignupUser();
    }

    const handleClose = () => {
        setOpenSignup(false);
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickOpenSignup = () => {
        setShowPassword(false);
        setOpenSignup(true);
        setSignupForm(initialSignupForm);
        clearFormErrors();
    }

    return (
        <div>
            <Button size={buttonSize} onClick={handleClickOpenSignup} startIcon={<ExitToAppIcon />} color="inherit">
                Sign up
            </Button>
            {!loading &&
                <Dialog open={openSignup} onClose={handleClose}>
                    <DialogTitle>Sign up</DialogTitle>
                    <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                        {Object.keys(initialSignupForm).map((field) => (
                            <TextField
                                key={field}
                                margin='dense'
                                type={inputType[field] || inputType.default}
                                name={field}
                                value={signupForm[field]}
                                onChange={inputChanged}
                                error={isError[field]}
                                helperText={errorText[field]}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                size={inputSize}
                                variant='outlined'
                                color='sidish'
                            />
                        ))}
                        <TextField
                            size={inputSize}
                            color='sidish'
                            style={{ width: dialogueWidth }}
                            value={repeatPassword}
                            margin='dense'
                            error={isError.repeatPassword}
                            helperText={errorText.repeatPassword}
                            name='repeatPassword'
                            label='Password control'
                            variant='outlined'
                            onChange={inputChanged}
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color='sidish' sx={{ "&:hover": { filter: 'brightness(40%)' }, transition: '0.45s' }} variant='outlined' onClick={signup}>Sign up</Button>
                        <Button color='sidish' sx={{ "&:hover": { filter: 'brightness(40%)' }, transition: '0.45s' }} variant='outlined' onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            }
            {loading && <LoadingDialog title='Sign up' open={openSignup} onClose={handleClose} />}
        </div>

    )
}

export default Signup;