import { useContext, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from 'react-router-dom';

import AuthContext from '../context/AuthContext';

const initialCategory = {
    name: ''
}

export default function Addcategory({ handleData }) {
    const [open, setOpen] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [nameHelper, setNameHelper] = useState('');
    const [category, setCategory] = useState(initialCategory);

    const { setOpenSnackbar, setSnackbarMessage, resetAuthentication, fetchCategories } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
        setCategory(initialCategory);
        setNameErr(false);
        setNameHelper('');
    }

    const handleClose = () => {
        setOpen(false);
    }

    const inputChanged = (event) => {
        setCategory({ ...category, [event.target.name]: event.target.value });
        setNameErr(false);
        setNameHelper('');
    }

    const fetchAddCategory = async (newCategory) => {
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'api/categories', {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(newCategory)
            });
            if (!response.ok) {
                if (response.status === 500) {
                    resetAuthentication();
                    navigate('/');
                } else {
                    alert('Something is wrong with the server');
                }
            }
            fetchCategories(handleData);
            setOpen(false);
            setCategory(initialCategory);
            setOpenSnackbar(true);
            setSnackbarMessage('The category was added');
        } catch (error) {
            console.error(error);
            alert('Something is wrong with the server');
        }
    }

    const handleSave = () => {
        if (category.name == '') {
            setNameErr(true);
            setNameHelper('Name cannot be empty');
            return null;
        }
        fetchAddCategory(category);
    }

    return (
        <div>
            <Button color='sidish' sx={{ color: 'white', "&:hover": { filter: 'brightness(50%)', backgroundColor: '#303030' }, transition: '0.45s' }} variant="contained" onClick={handleClickOpen}>
                <AddIcon color="white" />
                Category
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New category</DialogTitle>
                <DialogContent>
                    <TextField
                        color='sidish'
                        error={nameErr}
                        helperText={nameHelper}
                        margin="dense"
                        name="name"
                        value={category.name}
                        onChange={inputChanged}
                        label="Name"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button color='sidish' onClick={handleClose}>Cancel</Button>
                    <Button color='sidish' onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
