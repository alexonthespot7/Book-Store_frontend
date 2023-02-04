import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from '@mui/material/MenuItem';

export default function Editcategory({ params, updateCategory }) {
  const [open, setOpen] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [nameHelper, setNameHelper] = useState('');

  const [category, setCategory] = useState({
    name: '',
  });

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
    let check = true;
    if (category.name == '') {
      check = false;
      setNameErr(true);
      setNameHelper('Name cannot be empty');
    }
    if (check) {
      updateCategory(category, params.value);
      setOpen(false);
    }

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