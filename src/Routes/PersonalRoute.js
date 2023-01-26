import { Navigate, useLocation, useParams } from "react-router-dom";
import { useContext } from "react";

import AuthContext from '../context/AuthContext';

function PersonalRoute({ children }) {
    const { authorize } = useContext(AuthContext);
    const location = useLocation();
    const url = new URLSearchParams();

    let { id } = useParams();

    url.set("redirect", location.pathname + location.search);

    if (sessionStorage.getItem('authorizedId') === id && id !== null) {
        return (
            children
        );
    } else {
        return (
            <Navigate to={{ pathname: "/" }} />
        );
    }
};

export default PersonalRoute;