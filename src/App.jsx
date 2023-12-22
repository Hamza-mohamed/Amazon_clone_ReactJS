import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider, createBrowserRouter, parsePath } from "react-router-dom";
// import { Navbar } from "./layout/Navbar/Navbar";

import { Home } from "./pages/home/home";
import { Cart } from "./pages/cart/cart";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Applayout from "./components/layout/AppLayout/applayout";
import { Category } from "./pages/category/category";
import ProductDetails from "./pages/product-details/ProductDetails";
import CheckOut from "./pages/CheckOut/CheckOut";

import { store } from "./Store/store";
import { Provider } from "react-redux";
import LoginStep2 from "./pages/Login/loginStep2";
import { Search } from "./pages/search/search";
import { AuthProvider } from "./context/authcontex";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { SubCategory } from "./pages/subCategory/subCategory";
// import { SubSubcategory } from "./pages/subSubCategory/subSubcategory";
import Order from "./pages/Orders/order";
import { Help } from "./pages/help/help";
import { Account } from "./pages/account/account";
import { SubSubcategory } from "./pages/subSubCategory/subSubcategory";
import { ButtonToTop } from "./components/button/buttonToTop";
import NotFound from "./pages/not-found/not-found";

const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_KEY);

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
        path: "/",
        element: <Applayout />,
        children: [
            { path: "cart", element: <Cart /> },
            {
                path: "products/category/:categoryID",
                element: <Category />,
            },
            {
                path: "products/SubCategory/:SubCategoryID",
                element: <SubCategory />,
            },
            {
                path: "products/SubSubCategory/:SubSubCategoryID",
                element: <SubSubcategory />,
            },

            { path: "products/:id", element: <ProductDetails /> },
            { path: "products/search/:category", element: <Search /> },
            { path: "orders/", element: <Order /> },
            { path: "help", element: <Help /> },
            { path: "account", element: <Account /> },
        ],
    },
    { path: "login", element: <Login /> },
    { path: "login/loginStep2", element: <LoginStep2 /> },
    { path: "signup", element: <Register /> },
    { path: "checkout", element: <CheckOut /> },
	{path:'*' ,element:<NotFound/> }

]);

function App() {
    // const currentPage = "parsePath"; // Replace this with your current page or route

    // // Function to change body class based on the current page
    // function changeBodyClass() {
    //     const body = document.querySelector("body");
    //     if (currentPage !== "/") {
    //         body.classList.remove("bg-body-tertiary");
    //     } else {
    //         body.classList.add("bg-white");
    //     }
    //     // Add more conditions for other pages if needed
    // }

    // Call the function to change the body class on page load
    // changeBodyClass();
    const [isLogin, setLogin] = useState(
        localStorage.getItem("userToken") ? true : false
    );
    const [lang, setLang] = useState("en");
    //    const {t,i18nKey}=useTranslation()
    //    const changeLanguage=(language)=>{
    //     i18n.changeLanguage(language)
    //     }
    return (
        <>
            {/* <button onClick={()=>changeLanguage('en')}>En</button>
   <button onClick={()=>changeLanguage('ar')}>De</button>
    <hr/>   
         <Trans i18nKey="description.part1">
             hi <div>{t("description.part1")}</div>
         </Trans> */}
            <Elements stripe={stripePromise}>
                <AuthProvider value={{ isLogin, setLogin, lang, setLang }}>
                    <Provider store={store}>
                        <ButtonToTop />
                        <RouterProvider router={router} />
                    </Provider>
                </AuthProvider>
            </Elements>
        </>
    );
}

export default App;
