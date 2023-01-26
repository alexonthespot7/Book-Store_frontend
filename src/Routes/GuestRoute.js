import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import AuthContext from "../context/AuthContext";

function GuestRoute({ children }) {
    const { authorize } = useContext(AuthContext);
    const location = useLocation();
    const url = new URLSearchParams(location.search.slice(1));

    return (authorize || sessionStorage.getItem('role')) ? <Navigate to={url.get("redirect") || "/"} /> : children;
}

export default GuestRoute;