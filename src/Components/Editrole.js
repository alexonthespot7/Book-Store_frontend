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
import { RollerShadesClosedRounded } from '@mui/icons-material';

export default function Editrole({ params, updateRole }) {
  const [open, setOpen] = useState(false);

  const [roleInfo, setRoleInfo] = useState({
    role: '',
  });

  const handleClickOpen = () => {
    setRoleInfo({
      role: params.data.role,
    });
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const inputChanged = (event) => {
    setRoleInfo({ ...roleInfo, [event.target.name]: event.target.value });
  }

  const handleSave = () => {
    updateRole(roleInfo, params.value);
    setOpen(false);
  }

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color='sidish' />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change role for {params.data.username}</DialogTitle>
        <DialogContent>
          <TextField
            color='sidish'
            sx={{ color: 'black' }}
            variant="outlined"
            name="role"
            select
            fullWidth
            label="Role"
            value={roleInfo.role}
            onChange={inputChanged}
            style={{ marginTop: 10 }}
          >
            {["ADMIN", "USER"].map((role, index) => (
              <MenuItem key={index} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}