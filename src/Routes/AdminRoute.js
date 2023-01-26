import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import AuthContext from '../context/AuthContext';

function AdminRoute({ children }) {
    const { authorize } = useContext(AuthContext);
    const location = useLocation();
    const url = new URLSearchParams();
    url.set("redirect", location.pathname + location.search);

    if (authorize === 'ADMIN' || sessionStorage.getItem('role') === 'ADMIN') {
        return (
            children
        );
    } else if (authorize === 'USER' || sessionStorage.getItem('role') === 'USER') {
        return (
            <Navigate to={url.get("redirect") || "/"} />
        );
    } else {
        return (
            <Navigate
                to={{
                    pathname: "/",
                    search: url.toString(),
                }}
            />
        );
    }
};

export default AdminRoute;