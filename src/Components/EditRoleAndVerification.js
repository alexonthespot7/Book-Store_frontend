import { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

const initialRoleVerificationInfo = {
    role: '',
    accountVerified: null
}

export default function EditRoleAndVerification({ params, updateRole }) {
    const [open, setOpen] = useState(false);
    const [roleVerificationInfo, setRoleVerificationInfo] = useState(initialRoleVerificationInfo);

    const initialAccountVerified = params.data.accountVerified;

    const handleClickOpen = () => {
        setRoleVerificationInfo({
            role: params.data.role,
            accountVerified: initialAccountVerified
        });
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const inputChanged = (event) => {
        setRoleVerificationInfo({ ...roleVerificationInfo, [event.target.name]: event.target.value });
    }

    const handleSave = async () => {
        await updateRole(roleVerificationInfo, params.value);
        setOpen(false);
    }

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <EditIcon color='sidish' />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{`Change role${!initialAccountVerified ? `/verification` : ``} for ${params.data.username}`}</DialogTitle>
                <DialogContent>
                    <TextField
                        color='sidish'
                        sx={{ color: 'black' }}
                        variant="outlined"
                        name="role"
                        select
                        fullWidth
                        label="Role"
                        value={roleVerificationInfo.role}
                        onChange={inputChanged}
                        style={{ marginTop: 10 }}
                    >
                        {["ADMIN", "USER"].map((role, index) => (
                            <MenuItem key={index} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </TextField>
                    {!initialAccountVerified &&
                        <TextField
                            color='sidish'
                            sx={{ color: 'black' }}
                            variant="outlined"
                            name="accountVerified"
                            select
                            fullWidth
                            label="Verify"
                            value={roleVerificationInfo.accountVerified}
                            onChange={inputChanged}
                            style={{ marginTop: 10 }}
                        >
                            {[false, true].map((verificationStatus, index) => (
                                <MenuItem key={index} value={verificationStatus}>
                                    {verificationStatus.toString()}
                                </MenuItem>
                            ))}
                        </TextField>
                    }
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button color='sidish' onClick={handleClose}>Cancel</Button>
                    <Button color='sidish' variant='contained' onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}