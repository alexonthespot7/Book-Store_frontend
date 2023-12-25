import { useEffect, useState } from "react";

import AuthContext from "./AuthContext";

import useMediaQuery from '../Hooks/useMediaQuery';

function ContextProvider(props) {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [bgrColor, setBgrColor] = useState('#FFFAFA');
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

    const [takenIds, setTakenIds] = useState([]);

    const matches550px = useMediaQuery("(min-width: 550px)");

    const dialogueWidth = matches550px ? 419 : '86%';

    const fetchIds = () => {
        const token = sessionStorage.getItem('jwt');
        fetch(process.env.REACT_APP_API_URL + 'booksids',
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => setTakenIds(data))
            .catch(err => console.error(err));
    }

    const fetchIdsNotLogged = (backetid) => {
        fetch(process.env.REACT_APP_API_URL + 'booksids/' + backetid,
            {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => setTakenIds(data))
            .catch(err => console.error(err));
    }

    return (
        <AuthContext.Provider value={{
            openSnackbar, setOpenSnackbar, snackbarMessage, setSnackbarMessage,
            dialogueWidth, bgrColor, setBgrColor, cartDrawerOpen, setCartDrawerOpen,
            fetchIds, takenIds, setTakenIds, fetchIdsNotLogged
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default ContextProvider;