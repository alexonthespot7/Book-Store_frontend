import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

function DialogInfo({ openInfo, setOpenInfo, setTextInfo, textInfo, setInfoField, infoField }) {
    const handleClose = () => {
        setOpenInfo(false);
        setTextInfo('');
        setInfoField('');
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
            >
                <Dialog open={openInfo} onClose={handleClose}>
                    <DialogTitle>{infoField}</DialogTitle>
                    <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography>
                            {textInfo}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ transition: '0.45s' }} color='sidish' onClick={handleClose}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </motion.div>
        </AnimatePresence >

    );
}

export default DialogInfo;