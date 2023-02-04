import { useEffect, useState } from "react";

import AuthContext from "./AuthContext";

import useMediaQuery from '../Hooks/useMediaQuery';

function ContextProvider(props) {
    const [authorize, setAuthorize] = useState(null);
    const [authorizedUsername, setAuthorizedUsername] = useState('');
    const [signupMessage, setSignupMessage] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);

    const [actionReset, setActionReset] = useState(false);
    const [typeReset, setTypeReset] = useState('');
    const [msgReset, setMsgReset] = useState('');
    const [bgrColor, setBgrColor] = useState('#FFFAFA');
    const [bookDeleted, setBookDeleted] = useState(false);
    const [secondDrawerOpen, setSecondDrawerOpen] = useState(false);
    const [action, setAction] = useState(false);
    const [actionMsg, setActionMsg] = useState('');

    const [takenIds, setTakenIds] = useState([]);

    const matchesSmall = useMediaQuery("(min-width: 550px)");

    const dialogueWidth = matchesSmall ? 419 : '86%';

    const fetchIds = () => {
        const token = sessionStorage.getItem('jwt');
        fetch(process.env.REACT_APP_API_URL + 'listids',
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => setTakenIds(data))
            .catch(err => console.error(err));
    }

    const fetchIdsNotLogged = (backetid) => {
        fetch(process.env.REACT_APP_API_URL + 'listids/' + backetid,
            {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => setTakenIds(data))
            .catch(err => console.error(err));
    }

    return (
        <AuthContext.Provider value={{
            authorize, setAuthorize, authorizedUsername, setAuthorizedUsername,
            signupMessage, setSignupMessage, signupSuccess, setSignupSuccess, dialogueWidth,
            actionReset, setActionReset, typeReset, setTypeReset, msgReset, setMsgReset,
            bgrColor, setBgrColor, bookDeleted, setBookDeleted, secondDrawerOpen, setSecondDrawerOpen,
            fetchIds, takenIds, setTakenIds, action, setAction, actionMsg, setActionMsg, fetchIdsNotLogged

        }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default ContextProvider;