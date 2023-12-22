import React, { useState } from "react";
import logoImage from "./amazon.png";
import "./checkoutStyle.css";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckOut = () => {  
  document.title = `Amazon`;
  const navigate = useNavigate();
  const stripe = useStripe();
  const element = useElements();
  const { t } = useTranslation();
  const location = useLocation();
  const { product, totalPrice, cartID } = location?.state;
  const [isProcessing, setProcessing] = useState(false);
  const [status, setStatus] = useState("pay");
  const [payMethod, setPayMethod] = useState("card");
  const [orderData, setOrderData] = useState({
    fullName: "",
    city: "",
    street: "",
    province: "",
    zip: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    province: "",
    city: "",
    street: "",
    zip: "",
  });

  const handleAddress = (e) => {
    const { name, value } = e.target;

    // Perform your validation logic here
    let error = "";
    if (name === "fullName" && value.trim() === "") {
      error = "Full Name is required";
    } else if (name === "province") {
      if (value.trim().length < 5 || /\d/.test(value)) {
        error =
          "province must be at least 5 characters and should not include numbers";
      }
    } else if (name === "city") {
      if (value.trim().length < 5 || /\d/.test(value)) {
        error =
          "City must be at least 5 characters and should not include numbers";
      }
    } else if (name === "street") {
      if (!/^\d{2}[a-zA-Z ]+$/.test(value)) {
        error = "Street must start with 2 numbers followed by a string";
      }
    } else if (name === "zip") {
      if (!/^\d{5}$/.test(value)) {
        error = "Postal Code must be a 5-digit number";
      }
    }
    // Add other validation checks for other fields
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  const handleRadioChange = (method) => {
    setPayMethod((prevMethod) => (prevMethod === method ? "card" : method));
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((error) => error !== "");

    const cardElement = element.getElement("card");

    if (payMethod == "card" && !hasErrors) {
      try {
        const pamentIntent = await axios.post(
          `https://nodejsapi-amazonclone.onrender.com/order/card`,
          {
            amount: totalPrice * 100,
            orderData,
            product,
            payMethod,
            cartID,
          },
          {
            headers: {
              Authorization: localStorage.getItem("userToken"),
            },
          }
        );
        const paymentMethodObj = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: orderData,
        });
        setProcessing(true);
        navigate("/orders");

        toast.success("successful payment", {
          position: "top-left",
          autoClose: 5000, // 5000 milliseconds = 5 seconds
        });
      } catch (error) {
        console.log(error);
      }
    } else if (payMethod == "cash" && !hasErrors) {
      const pamentIntent = await axios
        .post(
          `https://nodejsapi-amazonclone.onrender.com/order/cash`,
          {
            amount: totalPrice,
            orderData,
            product,
            payMethod,
            cartID,
          },
          {
            headers: {
              Authorization: localStorage.getItem("userToken"),
            },
          }
        )
        .then((res) => {
          setProcessing(true);

          navigate("/orders");
        });
    } else {
      toast.success("failed payment", {
        position: "top-left",
        autoClose: 5000, // 5000 milliseconds = 5 seconds
      });
      return null;
    }
  };
  return (
    <div className="container-fluid">
      <div className="d-flex  checkoutHeader">
        <div className="w-50 ps-5 ">
          <div
            style={{ width: "103px", height: "50px" }}
            className="py-2 d-none d-lg-block d-xl-block "
          >
            <Link to="/">
              <img
                src={logoImage}
                className=" img-fluid d-sm-none d-md-block"
              />
            </Link>
          </div>
        </div>
        <div className="w-50 py-3">
          <span className="fs-4 fw-bold">
            {t("checkOut.part1")} (
            <span className="text-info">1 {t("checkOut.part2")}</span>)
          </span>
        </div>
      </div>
      {/* <!-- main container  --> */}
      <div className="row  mainParent">
        <div className="col-lg-8 col-md-8  p-1 ">
          {/* shipping address section */}
          <form onSubmit={handlePayment}>
            <div className="border-bottom bg-white d-flex m-1">
              <div>
                <Link
                  className="text-decoration-none fw-bold text-dark"
                  href=""
                >
                  <span className="px-1">1-</span>
                  {t("checkOut.part3")}
                </Link>
              </div>
              <div className="mx-5 ">
                <div className="mb-3 d-flex">
                  <label htmlFor="fullName" className="form-label pe-4">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={orderData.fullName}
                    onChange={handleAddress}
                    required
                  />
                </div>
                <div className="d-block text-center">
                  {errors.fullName && (
                    <p className="text-danger">{errors.fullName}</p>
                  )}
                </div>

                <div className="mb-3 d-flex">
                  <label htmlFor="city" className="form-label pe-3">
                    Province
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="province"
                    value={orderData.province}
                    onChange={handleAddress}
                    required
                  />
                </div>
                <div className="d-block text-center">
                  {errors.province && (
                    <p className="text-danger">{errors.province}</p>
                  )}
                </div>
                <div className="mb-3 d-flex">
                  <label htmlFor="city" className="form-label pe-4">
                    city
                  </label>
                  <input
                    type="text"
                    className="form-control ms-3"
                    id="city"
                    name="city"
                    value={orderData.city}
                    onChange={handleAddress}
                    required
                  />
                </div>
                <div className="d-block text-center">
                  {errors.city && <p className="text-danger">{errors.city}</p>}
                </div>
                <div className="mb-3 d-flex">
                  <label htmlFor="street" className="form-label pe-4">
                    street
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    name="street"
                    value={orderData.street}
                    onChange={handleAddress}
                    required
                  />
                </div>
                <div className="d-block text-center">
                  {errors.street && (
                    <p className="text-danger">{errors.street}</p>
                  )}
                </div>
                <div className="mb-3 d-flex">
                  <label htmlFor="zip" className="form-label pe-2 ">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip"
                    name="zip"
                    value={orderData.zip}
                    onChange={handleAddress}
                    required
                  />
                </div>
                <div className="d-block text-center">
                  {errors.zip && <p className="text-danger">{errors.zip}</p>}
                </div>
              </div>
              <div className="pe-3">
                <Link className="text-decoration-none">
                  {" "}
                  {t("checkOut.part5")}
                </Link>
              </div>
            </div>

            {/* payment section */}
            <div className="p-2">
              <h4 className="fs-5"> {t("checkOut.part6")}</h4>
            </div>
            <div className="p-1 pb-0 d-block border rounded ms-2">
              <h5 className="border-bottom p-1 fw-bold">
                {t("checkOut.part7")}
              </h5>
              <div className="d-flex p-3">
                <a className="ps-2 pt-4">
                  <i
                    className="fa-solid fa-plus"
                    // style="color: #c9cfd9"
                  ></i>
                </a>
                <div className="mx-3">
                  <p className="small p-0 m-0 fw-bold">{t("checkOut.part8")}</p>
                  <div>
                    <input
                      type="text"
                      className="d-block w-75"
                      placeholder="Enter code"
                    />
                  </div>
                </div>
                <div className="">
                  <input
                    type="button"
                    className="d-block w-100 bg-white mt-3 border border-light text-muted btn"
                    value="Apply"
                    placeholder=""
                  />
                </div>
              </div>
              <h5 className="border-bottom fw-bold">{t("checkOut.part9")}</h5>

              <div className="d-flex p-3">
                <a className="p-auto">
                  <i
                    className="fa-solid fa-plus"
                    style={{ color: "#c9cfd9" }}
                  ></i>
                </a>
                <div className="mx-3">
                  <CardElement
                    options={{
                      hidePostalCode: true,
                      style: {
                        base: { fontSize: "20px" },
                        invalid: { color: "red" },
                      },
                    }}
                  />
                  <i className="fa-brands fa-cc-amazon-pay"></i>
                  <a
                    disabled={true}
                    target="_blank"
                    className="text-decoration-none ps-1"
                  >
                    {t("checkOut.part10")}
                    &gt;
                    <span className="text-muted small px-2">
                      {t("checkOut.part11")}
                    </span>
                  </a>
                </div>
              </div>
              <h5 className="fw-bold"> {t("checkOut.part12")}</h5>
              <div className="border-top d-flex p-3">
                <div className="mx-2">
                  <label className="py-2">
                    <input
                      className="mx-2 fw-bold"
                      type="radio"
                      value="card"
                      checked={payMethod === "card"} // Represents unselected state
                      onChange={() => handleRadioChange("card")}
                    />
                    <span className="fs-6">pay By  Card</span>
                  </label>
                  <p className="fw-bold">
                    <input
                      className="mx-2"
                      type="radio"
                      value="cash"
                      checked={payMethod === "cash"}
                      onChange={() => handleRadioChange("cash")}
                    />
                    {t("checkOut.part13")}
                    {" cash"}
                  </p>
                  <div className="mx-4">
                    <span>
                      {t("checkOut.part14")}
                      <span className="fw-bold">EGP 12</span>{" "}
                      {t("checkOut.part15")}{" "}
                      <a className="text-decoration-none" disabled={true}>
                        {t("checkOut.part16")}
                      </a>
                      .
                    </span>
                    <p>{t("checkOut.part17")}</p>
                  </div>
                </div>
              </div>
              <div className="border-top bg-light p-3">
                <input
                  type="submit"
                  className="d-block w-30 border rounded paymentButton small p-2"
                  style={{ backgroundColor: "#FFFAE0" }}
                  value="Use this payment method"
                  disabled={isProcessing || !product}
                  placeholder="Use this payment method"
                />
              </div>
            </div>
          </form>
          <div className="border-bottom border-top mt-3">
            <a
              target="_blank"
              aria-disabled
              className="text-decoration-none text-muted fs-3"
            >
              <span className="px-1">3</span>
              {t("checkOut.part18")}
            </a>
          </div>
          <div className="border-bottom">
            <a
              target="_blank"
              aria-disabled
              className="text-decoration-none text-muted fs-3"
            >
              <span className="px-1">4</span> {t("checkOut.part19")}
            </a>
          </div>
          {/* last section info */}
          <div className="row">
            <div className="pt-3 pb-1 text-muted small col-9">
              <p>
                {t("checkOut.part20")}
                <a
                  target="_blank"
                  className="text-decoration-none"
                  disabled={true}
                >
                  {t("checkOut.part21")}
                </a>
              </p>
              <p>
                {t("checkOut.part22")}
                <a target="_blank" className="text-decoration-none">
                  {t("checkOut.part23")}
                </a>
                {t("checkOut.part24")}

                <a target="_blank" className="text-decoration-none">
                  {t("checkOut.part25")}
                </a>
              </p>
              <p>{t("checkOut.part26")}</p>
              <p>
                {t("checkOut.part27")}
                <a target="_blank" className="text-decoration-none">
                  {t("checkOut.part28")}
                </a>
                .
              </p>
              <p>
                {t("checkOut.part29")}
                <a target="_blank" className="text-decoration-none">
                  {t("checkOut.part30")}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white col-lg-4 col-md-4 ps-4 mt-2 stickyDiv  ">
          <div className="border rounded w-100">
            <div className="d-block p-2">
              <div className="border-bottom">
                <input
                  type="button"
                  className="d-block w-100 border rounded text-secondary small p-2"
                  value="Use this payment method"
                  style={{ backgroundColor: "#FFFAE0" }}
                  placeholder=""
                />
                <p className="text-muted small text-center">
                  <span className="mb-0">{t("checkOut.part31")}</span>
                  <span>{t("checkOut.part32")}</span>
                  <span>{t("checkOut.part33")}</span>
                </p>
              </div>
              <div>
                <h4>{t("checkOut.part34")}</h4>
                <ul className="list-unstyled">
                  <li>
                    <span>{t("checkOut.part35")}</span>
                    <span style={{ float: "right" }}>EGP {totalPrice}</span>
                  </li>
                  <li>
                    <span>{t("checkOut.part36")}</span>
                    <span style={{ float: "right" }}>---</span>
                  </li>
                  <li>
                    <span>{t("checkOut.part37")}</span>
                    <span style={{ float: "right" }}>---</span>
                  </li>
                  <li>
                    <span>{t("checkOut.part38")}</span>
                    <span style={{ float: "right" }}>---</span>
                  </li>
                  <hr />
                  <li>
                    <span className="text-danger fw-bold">
                      {t("checkOut.part39")}
                    </span>
                    <span style={{ float: "right" }}>EGP {totalPrice}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-top bg-light m-0">
              <div className="p-3">
                <a target="_blank" className="small text-decoration-none">
                  {t("checkOut.part40")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
