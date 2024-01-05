import { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

const initialCategory = {
    name: '',
}

export default function EditCategory({ params, updateCategory }) {
    const [open, setOpen] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [nameHelper, setNameHelper] = useState('');
    const [category, setCategory] = useState(initialCategory);

    const handleClickOpen = () => {
        setCategory({
            name: params.data.name,
        });
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const inputChanged = (event) => {
        setCategory({ ...category, [event.target.name]: event.target.value });
        setNameErr(false);
        setNameHelper('');
    }

    const handleSave = () => {
        if (category.name == '') {
            setNameErr(true);
            setNameHelper('Name cannot be empty');
            return null;
        }
        updateCategory(category, params.value);
        setOpen(false);
    }

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <EditIcon color='sidish' />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField
                        color="sidish"
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