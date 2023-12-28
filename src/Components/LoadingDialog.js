import { useContext } from "react";

import { CircularProgress, Dialog, DialogContent, DialogTitle } from "@mui/material";

import AuthContext from "../context/AuthContext";

export default function LoadingDialog({ title, open, onClose }) {
    const { dialogueWidth } = useContext(AuthContext);

    return (
        <Dialog style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} open={open} onClose={onClose} >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: dialogueWidth, height: 300 }}>
                <CircularProgress color='sidish' size={80} />
            </DialogContent>
        </Dialog>
    );
}