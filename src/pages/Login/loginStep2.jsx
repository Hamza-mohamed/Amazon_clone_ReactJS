import amzonlogo from "../../assets/download.png";
import { useContext, useState } from "react";
import { instance } from "../../services/axios/instance";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import "./login.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { authContext } from "../../context/authcontex";
import { totalPriceAction } from "../../Store/Slice/Cart";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const LoginStep2 = () => {
    const body = document.querySelector("body");
    body.classList.remove("bg-body-tertiary");
    let location = useLocation();
    const navigate = useNavigate();
    const { setLogin } = useContext(authContext);
    //   const [loggeduser, setLoggedUser] = useState({})
    const dispatch = useDispatch();
    const [userEmail, setuserEmail] = useState(location.state?.Email);
    const [userPassword, setPassword] = useState("");
    const [user, setUser] = useState({
        password: "",
    });
    const [errors, setErrors] = useState({
        passwordError: "",
    });
    const [visible, setvisible] = useState(false);

    console.log(userEmail, userPassword);

    const handelChange = (eve) => {
        var regexPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-+.]).{8,20}$/;
        if (eve.target.name == "password") {
            setUser({ ...user, password: eve.target.value });
            // setErrors({
            //     ...errors,
            //     passwordError:
            //         eve.target.value.length == 0
            //             ? "password is Required"
            //             : regexPassword.test(eve.target.value)
            //             ? ""
            //             : "Your password must have at least one lower case letter ,number,upperCase,symbol",
            // }),
            // eslint-disable-next-line no-undef
            setPassword(eve.target.value);
        }
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
    };

    const logIn = async (e) => {
        if (userEmail) {
            try {
                console.log(userEmail);
                let setLog = {
                    email: userEmail,
                    password: userPassword,
                };
                console.log(setLog);
                const { data } = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}api/user/login`,
                    setLog
                );
                if (data.message == "welcome to our site ") {
                    // console.log(data.yourToken);
                    localStorage.setItem("userToken", data.yourToken);
                    localStorage.setItem("name", data.name);
                    setLogin(true);
                    // const cart = JSON.parse(localStorage.getItem("cart"));
                    // console.log(cart);

                    const cart = JSON.parse(localStorage.getItem("cart"));
                    console.log(cart);
                    if (cart) {
                        const items = cart.map((item) => ({
                            productId: item.product._id,
                            quantity: item.quantity,
                        }));
                        console.log(items);
                        instance
                            .post(
                                `cart/`, // Endpoint to handle updating multiple items in the cart
                                {
                                    items: items,
                                },
                                {
                                    headers: {
                                        Authorization:
                                            localStorage.getItem("userToken"),
                                    },
                                }
                            )
                            .then(() => {
                                dispatch(totalPriceAction());
                                // Perform actions after the request is processed
                                navigate("/");
                            })
                            .catch((error) => {
                                // Handle errors here
                                console.error(error);
                                navigate("/");
                            });
                    }
                    navigate("/");
                } else if (
                    data.message == "please enter your email and password "
                ) {
                    console.log("invalid email or password");
                    navigate("/login");
                }
            } catch (err) {
                navigate("/login");

                console.log(err);
            }
        } else {
            console.log("provide email first");
            navigate("/login");
        }
    };
    const { t } = useTranslation();

    return (
        <>
            <div className='vh-100 '>
                <div className='mask d-flex align-items-center gradient-custom-3'>
                    <div className='container '>
                        <div className='row d-flex justify-content-center '>
                            <Link to='/'>
                                <div className='text-center'>
                                    <img src={amzonlogo} className='rounded' />
                                </div>
                            </Link>
                        </div>
                        <div className='row d-flex justify-content-center align-items-center'>
                            <div className='col-sm-6 col-md-6 col-lg-4 col-xl-4 '>
                                <div
                                    className='card'
                                    style={{ borderRadius: " 15px" }}
                                >
                                    <div className='card-body'>
                                        <h2>{t("SignIn.part1")}</h2>

                                        <form
                                            autoComplete='off'
                                            onSubmit={(e) => {
                                                handleSubmit(e);
                                            }}
                                        >
                                            <div className='form-outline mb-3'>
                                                <label
                                                    className='form-label'
                                                    htmlFor='form3Example3cg'
                                                    style={{ fontSize: "16px" }}
                                                >
                                                    {t("SignIn.part8")}
                                                </label>
                                                <input
                                                    type={
                                                        visible
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    required
                                                    id='formGroupExampleInput'
                                                    className={`form-control
            ${errors.passwordError ? "border-danger shadow-none" : ""}`}
                                                    name='password'
                                                    value={user.password}
                                                    onChange={(e) => {
                                                        handelChange(e);
                                                    }}
                                                />
                                                <div
                                                    onClick={() =>
                                                        setvisible(!visible)
                                                    }
                                                >
                                                    {visible ? (
                                                        <FaRegEye />
                                                    ) : (
                                                        <FaRegEyeSlash />
                                                    )}
                                                </div>
                                            </div>
                                            <div className='form-outline mb-2'>
                                                <NavLink className='text-decoration-none'>
                                                    <input
                                                        type='submit'
                                                        id='form3Example4cdg'
                                                        className='form-control submit'
                                                        value={t(
                                                            "SignIn.part1"
                                                        )}
                                                        onClick={logIn}
                                                    />
                                                </NavLink>
                                            </div>
                                            <div className='form-check d-flex  mb-3 ptn'>
                                                <p>
                                                    <a href=''>
                                                        {t("SignIn.part9")}
                                                    </a>
                                                </p>
                                            </div>
                                            <a id='lab'>
                                                <i className='fa-solid fa-arrow-right'></i>
                                                {t("SignIn.part8")}
                                            </a>
                                            <a
                                                id='para'
                                                style={{ display: "none" }}
                                            >
                                                {t("SignIn.part9")}
                                            </a>
                                            <a
                                                id='par2'
                                                style={{ display: "none" }}
                                            >
                                                Other issues with Sign-In
                                            </a>
                                        </form>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='foot mt-5 d-flex pt-3 col-12'>
                                        <a href='../help-page/help.html'>
                                            {" "}
                                            {t("signUp.part12")}{" "}
                                        </a>
                                        <a href='../help-page/help.html'>
                                            {t("signUp.part13")}{" "}
                                        </a>
                                        <a href='../help-page/help.html'>
                                            {" "}
                                            {t("signUp.part14")}{" "}
                                        </a>
                                    </div>
                                </div>
                                <p
                                    style={{
                                        fontWeight: " lighter",
                                        fontSize: "12px",
                                    }}
                                    className='text-center mt-4'
                                >
                                    {t("signUp.part15")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginStep2;
