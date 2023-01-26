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

    const matchesSmall = useMediaQuery("(min-width: 550px)");

    const dialogueWidth = matchesSmall ? 419 : '86%';

    return (
        <AuthContext.Provider value={{
            authorize, setAuthorize, authorizedUsername, setAuthorizedUsername,
            signupMessage, setSignupMessage, signupSuccess, setSignupSuccess, dialogueWidth,
            actionReset, setActionReset, typeReset, setTypeReset, msgReset, setMsgReset
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default ContextProvider;