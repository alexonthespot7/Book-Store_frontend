import { Navigate } from "react-router-dom";

function UserRoute({ children }) {

    return (sessionStorage.getItem('role') === 'USER') ? (
        children
    ) : (
        <Navigate
            to={{ pathname: "/" }}
        />
    );
}

export default UserRoute;