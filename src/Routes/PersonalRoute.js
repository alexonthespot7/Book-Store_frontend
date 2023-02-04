import { Navigate, useParams } from "react-router-dom";


function PersonalRoute({ children }) {

    let { id } = useParams();

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