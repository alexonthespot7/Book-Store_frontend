import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import AuthContext from '../context/AuthContext';

function UserRoute({ children }) {
    const { authorize } = useContext(AuthContext);
    const location = useLocation();
    const url = new URLSearchParams();
    url.set("redirect", location.pathname + location.search);

    return (authorize === 'USER' || sessionStorage.getItem('role') === 'USER') ? (
        children
    ) : (
        <Navigate
            to={{
                pathname: "/",
                search: url.toString(),
            }}
        />
    );
};

export default UserRoute;