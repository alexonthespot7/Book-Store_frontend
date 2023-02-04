import { Navigate } from "react-router-dom";
import { useContext } from "react";

import AuthContext from '../context/AuthContext';

function AdminRoute({ children }) {
    const { authorize } = useContext(AuthContext);

    if (authorize === 'ADMIN' || sessionStorage.getItem('role') === 'ADMIN') {
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