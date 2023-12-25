import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    if (sessionStorage.getItem('role') === 'ADMIN') {
        return (
            children
        );
    } else {
        return (
            <Navigate
                to={{ pathname: "/" }}
            />
        );
    }
};

export default AdminRoute;