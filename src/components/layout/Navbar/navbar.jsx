import "./navbar.css";
import amzonlogo from "../../../assets/nav-images/amzon-logo.png";
import cartImage from "../../../assets/nav-images/cart.png";
import egyptFlage from "../../../assets/nav-images/egypt-flag.svg";
import { IoSearchOutline, IoLocationOutline, IoLogOut } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { instance } from "../../../services/axios/instance";
import { useContext } from "react";
import { authContext } from "../../../context/authcontex";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import { clearCart, totalPriceAction } from "../../../Store/Slice/Cart";
import Spinner from "react-bootstrap/Spinner";
import { changeLoader } from "../../../Store/Slice/Loader";

// import Navbar from 'react-bootstrap/Navbar';

export const Header = () => {
    var loading = useSelector((state) => state.Loader.loader);
    let cartPageRedux = useSelector((state) => state.Cart.cart);
    const totalPrice = useSelector((state) => state.Cart.totalPrice);
    const dispatch = useDispatch();
    // const [loading, setLoading] = useState(true);

    // const [numberItems, setNumberItems] = useState(0);
    const name = localStorage.getItem("name");
    const navigate = useNavigate();
    const { isLogin, setLogin } = useContext(authContext);
    const { lang, setLang } = useContext(authContext);

    const [searchText, setSearchText] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    //   for category
    const searchSubmit = (e) => {
        const { value } = e.target;
        if (value === "All") {
            setSearchCategory("All");
        } else if (value === "groceries") {
            setSearchCategory("65527c22376a52ea210d9708");
        } else if (value === "laptops") {
            setSearchCategory("65527a31376a52ea210d9703");
        } else if (value === "smart") {
            setSearchCategory(value);
            setSearchCategory("65522f3250f3b49965ea7807");
        } else if (value === "fashion") {
            setSearchCategory("65527ac3376a52ea210d9706");
        } else if (value === "beauty") {
            setSearchCategory("65527c8c376a52ea210d970a");
        } else if (value === "electronics") {
            setSearchCategory("65527a31376a52ea210d9703");
        } else if (value === "sports") {
            setSearchCategory("65527d1a376a52ea210d970e");
        } else {
            setSearchCategory("All");
        }
    };
    useEffect(() => {
    }, [searchCategory]);
    //   for text
    useEffect(() => {
        dispatch(totalPriceAction());
    }, []);
    const handleChange = (e) => {
        setSearchText(e.target.value);
    };
    const logOut = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("cart");
        localStorage.removeItem("name");
        dispatch(clearCart(cartPageRedux));
        setLogin(false);
    };
    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            navigate(`/products/search/${searchCategory || "All"}`, {
                state: { searchValue: searchText },
            });
        } catch (err) {
            navigate("/");
        }
    };
    //
    const { t } = useTranslation();
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        if (language === "ar") {
            setLang("ar");
        } else {
            setLang("en");
        }
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    };
    //

    const catogories = {
        electronics: {
            name: `${t("nav2.part7")}`,
            id: "65527a31376a52ea210d9703",
        },
        fashion: {
            name: `${t("nav2.part8")}`,
            id: "65527ac3376a52ea210d9706",
        },
        grocery: {
            name: `${t("nav2.part9")}`,
            id: "65527c22376a52ea210d9708",
        },
        beauty: {
            name: `${t("nav2.part10")}`,
            id: "65527c8c376a52ea210d970a",
        },
        sports: {
            name: `${t("nav2.part11")}`,
            id: "65527d1a376a52ea210d970e",
        },
        mobilephones: {
            name: `${t("nav2.part12")}`,
            id: "656e35518ab097079167136f",
        },
        ToyGames: {
            name: `${t("nav2.part5")}`,
            id: "65657a1ae686c668a4d18968",
        },
    };

    // console.log(catogories);
    const cart = useSelector((state) => state.Cart.cart);

    return (
        <>
            <nav className='navbar navbar-expand-lg'>
                <div className='container-fluid'>
                    <NavLink className='navbar-brand' to='/'>
                        <img
                            src={amzonlogo}
                            style={{
                                width: "120px",
                                height: "40px",
                            }}
                        />
                    </NavLink>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarNavDropdown'
                        aria-controls='navbarNavDropdown'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div
                        className='collapse navbar-collapse'
                        id='navbarNavDropdown'
                    >
                        <ul className='navbar-nav align-items-lg-center'>
                            <li className='nav-item location-item'>
                                <div className='d-flex'>
                                    <div className='me-1'>
                                        <span className='location'>
                                            <IoLocationOutline />
                                        </span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <p className='deliver'>
                                            {t("navTop.part1")}
                                        </p>
                                        <a
                                            className='nav-link active address text-decoration-none'
                                            aria-current='page'
                                            href='#'
                                        >
                                            {t("navTop.part6")}
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <ul className='navbar-nav'>
                                <li className='nav-item d-flex justify-content-between search1 search-nav-larg'>
                                    <form
                                        className='d-flex'
                                        role='search'
                                        onSubmit={(e) => {
                                            handleSubmit(e);
                                        }}
                                    >
                                        <li className='nav-item dropdown all-category-search'>
                                            <select
                                                style={{
                                                    width: "100%",
                                                    fontSize: "18px",
                                                    padding: "8px",
                                                }}
                                                onChange={(e) => {
                                                    searchSubmit(e);
                                                }}
                                                className='nav-item dropdown all-category-search py-2'
                                                defaultValue='All'
                                            >
                                                <option
                                                    style={{
                                                        padding: "8px", // Adjust this value as needed
                                                    }}
                                                    className='dropdown-item'
                                                    value='All'
                                                >
                                                    {t("navTop.part9")}
                                                </option>
                                                <option
                                                    className='dropdown-item'
                                                    value='groceries'
                                                >
                                                    {t("navTop.part14")}
                                                </option>
                                                <option
                                                    className='dropdown-item p-2'
                                                    value='laptops'
                                                >
                                                    {t("navTop.part17")}
                                                </option>
                                                <option
                                                    className='dropdown-item'
                                                    value='fashion'
                                                >
                                                    {t("navTop.part15")}
                                                </option>
                                                <option
                                                    className='dropdown-item'
                                                    value='sports'
                                                >
                                                    {t("navTop.part16")}
                                                </option>
                                                <option
                                                    className='dropdown-item'
                                                    value='beauty'
                                                >
                                                    {t("navTop.part28")}
                                                </option>
                                                <option
                                                    className='dropdown-item'
                                                    value='electronics'
                                                >
                                                    {t("navTop.part29")}
                                                </option>
                                            </select>
                                        </li>

                                        <input
                                            className='form-control serch-input1'
                                            type='text'
                                            placeholder={t("navTop.part11")}
                                            aria-label='Search'
                                            value={searchText}
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                        />
                                        <button
                                            type='submit'
                                            className='button-search'
                                        >
                                            <span className='mt-1'>
                                                <IoSearchOutline className='search-icon-new-1' />
                                            </span>
                                        </button>
                                    </form>
                                </li>
                            </ul>
                            <li className='nav-item dropdown text-decoration-none '>
                                <a
                                    className='nav-link dropdown-toggle langugae-location text-decoration-none'
                                    href='#'
                                    role='button'
                                    data-bs-toggle='dropdown'
                                    aria-expanded='false'
                                >
                                    <img
                                        src={egyptFlage}
                                        style={{
                                            width: "25px",
                                        }}
                                    />
                                    {t("navTop.part5")}
                                </a>
                                <ul className='dropdown-menu px-2 dropdMenuLanguageAccount'>
                                    <li>
                                        <input
                                            type='radio'
                                            id='arabic'
                                            name='languge'
                                            onClick={() => changeLanguage("ar")}
                                        />
                                        <label htmlFor='arabic'>
                                            العربية- AR
                                        </label>
                                    </li>
                                    <hr />
                                    <li>
                                        <input
                                            type='radio'
                                            id='english'
                                            name='languge'
                                            onClick={() => changeLanguage("en")}
                                        />
                                        <label htmlFor='english'>
                                            English - EN
                                        </label>
                                    </li>
                                    <p>
                                        <a href='#'>{t("navTop.part25")}</a>
                                    </p>
                                    <hr />
                                    <p>
                                        <img
                                            src={egyptFlage}
                                            style={{
                                                width: "25px",
                                            }}
                                        />
                                        {t("navTop.part26")}
                                    </p>
                                    <p>
                                        {/* <a href='#'>
											{t(
												"navTop.part27"
											)}
										</a> */}
                                    </p>
                                </ul>
                            </li>
                            <li className='nav-item dropdown nav-account'>
                                <a
                                    className='nav-link dropdown-toggle'
                                    href='#'
                                    role='button'
                                    data-bs-toggle='dropdown'
                                    aria-expanded='false'
                                >
                                    <span className='account-lists'>
                                        {isLogin ? (
                                            <span className='hello'>
                                                {t("navTop.part2")},{name}
                                            </span>
                                        ) : (
                                            <span className='hello'>
                                                {t("navTop.part2")},
                                                {t("SignIn.part1")}
                                                <br />
                                            </span>
                                        )}

                                        {t("navTop.part7")}
                                    </span>
                                </a>
                                <ul className='dropdown-menu dropdMenuLanguageAccount'>
                                    <li>
                                        {isLogin ? (
                                            <NavLink
                                                className='me-auto dropdown-item drop-account shadow text-decoration-none'
                                                to='./login'
                                                onClick={logOut}
                                            >
                                                {t("navTop.part13")}
                                            </NavLink>
                                        ) : (
                                            <NavLink
                                                to='/login'
                                                className='me-auto dropdown-item drop-account shadow text-decoration-none '
                                            >
                                                {t("SignIn.part1")}
                                            </NavLink>
                                        )}
                                        {isLogin ? (
                                            ""
                                        ) : (
                                            <>
                                                <p className='register'>
                                                    {t("navTop.part20")}
                                                    <Link to='./signUp'>
                                                        {t("navTop.part21")}
                                                    </Link>
                                                </p>
                                                <hr />
                                            </>
                                        )}
                                    </li>
                                    <li>
                                        <p className='border-3 fw-bold d-inline-block'>
                                            {t("navTop.part22")}
                                        </p>
                                        <p className='fw-bold mb-0'>
                                            {t("navTop.part23")}
                                        </p>
                                        <Link
                                            to='/account'
                                            className='text-decoration-none text-dark'
                                        >
                                            {t("navTop.part23")}
                                        </Link>
                                        <br />
                                        <NavLink
                                            to='/orders/'
                                            className='text-decoration-none text-dark'
                                        >
                                            {t("navTop.part24")}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className='nav-item'>
                                <NavLink
                                    className='nav-link order text-decoration-none'
                                    to='/orders/'
                                >
                                    {t("navTop.part3")}
                                </NavLink>
                            </li>
                            <li className=''>
                                <NavLink
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-decoration-none cart-container d-flex active-link p-1"
                                            : "text-decoration-none cart-container d-flex p-1"
                                    }
                                    to={"/cart"}
                                >
                                    <span className='item-count'>
                                        {isLogin ? (
                                            loading ? (
                                                <Spinner
                                                    style={{
                                                        display: "block",
                                                        width: "16px",
                                                        height: "16px",
                                                        marginLeft: "-4px",
                                                        marginBottom: "8px",
                                                        // color: "#ffff",
                                                    }}
                                                    animation='border'
                                                    role='status'
                                                ></Spinner>
                                            ) : (
                                                totalPrice
                                            )
                                        ) : (
                                            cart?.length
                                        )}
                                    </span>
                                    <img className='mb-2' src={cartImage} />
                                    <span className='cart text-decoration-none'>
                                        {t("navTop.part4")}
                                    </span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className='search-bar-meduim d-lg-none'>
                {/* <div className='d-flex justify-content-between search1'> */}
                <form
                    className='d-flex'
                    role='search'
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}
                >
                    <div
                        className='all-category-search'
                        style={{ width: "35%" }}
                    >
                        <select
                            style={{
                                width: "100%",
                                textAlign: "center",
                            }}
                            onChange={(e) => {
                                searchSubmit(e);
                            }}
                            className='nav-item dropdown all-category-search py-2'
                            defaultValue='All'
                        >
                            <option className='dropdown-item' value='All'>
                                {t("navTop.part9")}
                            </option>
                            <option className='dropdown-item' value='groceries'>
                                {t("navTop.part14")}
                            </option>
                            <option className='dropdown-item' value='laptops'>
                                {t("navTop.part17")}
                            </option>
                            <option className='dropdown-item' value='fashion'>
                                {t("navTop.part15")}
                            </option>
                            <option className='dropdown-item' value='sports'>
                                {t("navTop.part16")}
                            </option>
                            <option className='dropdown-item' value='beauty'>
                                {t("navTop.part28")}
                            </option>
                            <option
                                className='dropdown-item'
                                value='electronics'
                            >
                                {t("navTop.part29")}
                            </option>
                        </select>
                    </div>

                    <input
                        className='form-control serch-input1'
                        type='text'
                        placeholder={t("navTop.part11")}
                        aria-label='Search'
                        value={searchText}
                        onChange={(e) => {
                            handleChange(e);
                        }}
                    />
                    <button type='submit' className='button-search'>
                        <span className='mt-1'>
                            <IoSearchOutline className='search-icon-new-1' />
                        </span>
                    </button>
                </form>
            </div>
            {/* </div> */}
            <div className='menu'>
                <ul className='list-unstyled d-flex flex-row'>
                    <li>
                        <NavLink
                            className='text-capitalize'
                            to={`/products/category/${catogories.electronics.id}`}
                        >
                            {catogories.electronics.name}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className='text-capitalize'
                            to={`/products/category/${catogories.fashion.id}`}
                        >
                            {catogories.fashion.name}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className='text-capitalize'
                            to={`/products/category/${catogories.grocery.id}`}
                        >
                            {catogories.grocery.name}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className='text-capitalize'
                            to={`/products/category/${catogories.beauty.id}`}
                        >
                            {catogories.beauty.name}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className='text-capitalize'
                            to={`/products/category/${catogories.sports.id}`}
                        >
                            {catogories.sports.name}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className='text-capitalize'
                            to={`/products/SubSubCategory/${catogories.mobilephones.id}`}
                        >
                            {catogories.mobilephones.name}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className='text-capitalize'
                            to={`/products/category/${catogories.ToyGames.id}`}
                        >
                            {catogories.ToyGames.name}
                        </NavLink>
                    </li>
                    <li>
                        <Link to={"/help"}>{t("nav2.part6")}</Link>
                    </li>
                </ul>
            </div>
        </>
    );
};
