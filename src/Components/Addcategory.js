import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';


export default function Addcategory({ addCategory }) {
    const [open, setOpen] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [nameHelper, setNameHelper] = useState('');

    const [category, setCategory] = useState({
        name: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
        setCategory({ name: '' });
        setNameErr(false);
        setNameHelper('');
    }

    const handleClose = () => {
        setOpen(false);
    }

    const inputChanged = (event) => {
        setCategory({ ...category, [event.target.name]: event.target.value });
        if (event.target.name === 'name') {
            setNameErr(false);
            setNameHelper('');
        }
    }

    const handleSave = () => {
        let check = true;
        if (category.name == '') {
            check = false;
            setNameErr(true);
            setNameHelper('Name cannot be empty');
        }
        if (check) {
            addCategory(category);
            setCategory({
                name: ''
            });
            setOpen(false);
        }

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
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
