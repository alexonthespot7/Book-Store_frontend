import { Navigate, useLocation } from "react-router-dom";

function GuestRoute({ children }) {
    const location = useLocation();
    const url = new URLSearchParams(location.search.slice(1));

    return sessionStorage.getItem('role') ? <Navigate to={url.get("redirect") || "/"} /> : children;
}

export default GuestRoute;