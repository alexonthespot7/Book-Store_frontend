import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Book from "../Components/Book";

import Profile from "../Components/Profile";
import Users from "../Components/Users";

import AdminRoute from "./AdminRoute";
import PersonalRoute from "./PersonalRoute";

import { AnimatePresence } from 'framer-motion';
import Cart from "../Components/Cart";
import Orders from "../Components/Orders";
import OrderByNumber from "../Components/OrderByNumber";
import OrderAdmin from "../Components/OrderAdmin";
import AllBooks from "../Components/AllBooks";
import CategoriesAdmin from "../Components/CategoriesAdmin";
import AllCategories from "../Components/AllCategories";


function BookRoutes() {
    const location = useLocation();
    const url = new URLSearchParams();
    url.set("redirect", location.pathname + location.search);

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname} >
                <Route path="/" element={<AllBooks />} />
                <Route path="/bycategories" element={<AllCategories />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders/:orderid" element={<OrderByNumber />} />
                <Route
                    path="/orders/admin/:orderid"
                    element={
                        <AdminRoute>
                            <OrderAdmin />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <AdminRoute>
                            <Orders />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <AdminRoute>
                            <CategoriesAdmin />
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
                    path="/book/:bookid"
                    element={<Book />}
                />
                <Route
                    path="*"
                    element={
                        <Navigate to={{ pathname: "/" }} />
                    }
                />
            </Routes>
        </AnimatePresence>
    );
}

export default BookRoutes;