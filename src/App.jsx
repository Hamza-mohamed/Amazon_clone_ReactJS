import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import { Navbar } from "./layout/Navbar/Navbar";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Home } from "./pages/home/home";
import { Cart } from "./pages/cart/cart";
import Register from "./pages/Register/Register";
import Login from "./pages/Login.jsx/Login";
import Applayout from "./components/layout/AppLayout/applayout";
import { Category } from "./pages/category/category";
import ProductDetails from "./pages/product-details/ProductDetails";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Applayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "cart", element: <Cart /> },
            { path: "products/category/:categoryname", element: <Category /> },
            { path: "products/:id", element: <ProductDetails/> },
        ],
    },
    { path: "login", element: <Login /> },
    { path: "signup", element: <Register /> },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
