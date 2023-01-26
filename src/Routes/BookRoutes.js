import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Booklist from "../Components/Booklist";
import Categories from "../Components/Categories";
import Profile from "../Components/Profile";
import Users from "../Components/Users";

import AdminRoute from "./AdminRoute";
import PersonalRoute from "./PersonalRoute";


function BookRoutes() {
    const location = useLocation();
    const url = new URLSearchParams();
    url.set("redirect", location.pathname + location.search);

    return (
        <Routes>
            <Route path="/" element={<Booklist />} />
            <Route
                path="/categories"
                element={
                    <AdminRoute>
                        <Categories />
                    </AdminRoute>
                }
            />
            <Route
                path="/users/:id"
                element={
                    <PersonalRoute>
                        <Profile />
                    </PersonalRoute>
                }
            />
            <Route
                path="/userlist"
                element={
                    <AdminRoute>
                        <Users />
                    </AdminRoute>
                }
            />
            <Route
                path="*"
                element={
                    <Navigate to={{ pathname: "/" }} />
                }
            />
        </Routes>
    );
}

export default BookRoutes;