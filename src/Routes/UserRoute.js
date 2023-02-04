import { Navigate } from "react-router-dom";
import { useContext } from "react";

import AuthContext from '../context/AuthContext';

function UserRoute({ children }) {
    const { authorize } = useContext(AuthContext);


    return (authorize === 'USER' || sessionStorage.getItem('role') === 'USER') ? (
        children
    ) : (
        <Navigate
            to={{ pathname: "/" }}
        />
    );
};

export default UserRoute;