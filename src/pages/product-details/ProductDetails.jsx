/* eslint-disable react/jsx-no-target-blank */
import ReactStarRating from "react-star-ratings-component";

import { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { instance } from "../../services/axios/instance";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { totalPriceAction, udateQuantity } from "../../Store/Slice/Cart";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import prime from "./1prime.png";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Store/Slice/Cart";
import { addToCartWithAPI } from "../../services/auth";
import { authContext } from "../../context/authcontex";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import { Reviews } from "../../components/review/reviews";

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);

  const { isLogin, setLogin } = useContext(authContext);
  const { lang, setLang } = useContext(authContext);
  const [quantity, setSelectedValue] = useState(1); // Initialize with a default value of '1'

  const handleSelectChange = (event) => {
    setSelectedValue(+event.target.value);
  };
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  var { id } = useParams();
  const dispatch = useDispatch();
  var cartPage = useSelector((state) => state.Cart.cart);
  const handelAdd = (product) => {
    const isProductIncart = cartPage.some(
      (item) => item.product._id === product._id
    );
    console.log(cartPage);
    console.log(isProductIncart);
    if (!isProductIncart) {
      dispatch(addToCart({ product: product, quantity: quantity }));
      toast.success(`${t("prodInfo.part16")}`, {
        position: "bottom-left",
      });
    } else {
      for (const i in cartPage) {
        const product1 = cartPage.find((items) => {
          return items.product._id === product._id;
        });
        let index = cartPage.findIndex(
          (item) => item.product._id === product._id
        );
        // console.log(quantity);
        let updatequantity = product1.quantity + +quantity;
        // updatequantity = product1.quantity + 1;
        dispatch(udateQuantity({ updatequantity, index: index }));
      }
      toast.success(`${t("prodInfo.part17") + quantity}`, {
        position: "bottom-left",
      });
    }
  };
  // const dispatch = useDispatch();

  const hanleAddWithAp = (myProd) => {
    console.log(myProd);
    const items = [
      {
        productId: myProd._id,
        quantity: quantity,
      },
    ];
    console.log(items);
    toast.success(`${t("prodInfo.part16") + " " + quantity}`, {
      position: "bottom-left",
    });
    instance
      .post(
        `cart/`,
        {
          items: items,
        },
        {
          headers: {
            Authorization: localStorage.getItem("userToken"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        dispatch(totalPriceAction());
      });
  };
  const [myProd, setmyProd] = useState();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    instance
      .get(`/products/${id}`)
      .then((res) => {
        setmyProd(res.data.data);
        setLoading(false);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // to handle carousel
  const [currentIndex, setCurrentIndex] = useState();
  function handleChange(index) {
    setCurrentIndex(index);
  }

  return (
    <>
      <div className="container-fluid">
        <Toaster />
        <div className="row m-0 py-2 border-bottom ">
          {/* carousel for product images */}
          <div className="col-lg-5 p-2" dir="ltr">
            <Carousel
              animation={true}
              showArrows={true}
              autoPlay={false}
              infiniteLoop={true}
              verticalSwipe="natural"
              selectedItem={myProd?.images[2]}
              onChange={handleChange}
              className="carousel-container bg-dark h-100 "
            >
              {myProd?.images?.length > 0 ? (
                myProd?.images.map((image, index) => (
                  <div key={index} className="" style={{ height: "400px" }}>
                    <img
                      src={image}
                      alt={"product images"}
                      className="h-100"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                ))
              ) : (
                <div  className="" style={{ height: "400px" }}>
                  <img
                    src={myProd?.thumbnail}
                    alt={"product images"}
                    className="h-100"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              )}
            </Carousel>
          </div>
          {/* product details */}
          <div className="col-lg-4  ">
            <h2 className="product-title fw-normal">
              {lang === "en" ? myProd?.en.description : myProd?.ar.description}
            </h2>
            <Link className="product-link text-decoration-none">
              {t("prodInfo.part1")}
            </Link>
            <div className="border-bottom pb-2">
              <span className="px-1">{Math.round(myProd?.rating)}</span>
              {!loading && (
                <span className="d-inline-block">
                  <ReactStarRating
                    numberOfStar={5}
                    numberOfSelectedStar={Math.round(myProd?.rating)}
                    colorFilledStar="#ff9900"
                    colorEmptyStar="#eee"
                    starSize="30px"
                    spaceBetweenStar="10px"
                  />
                </span>
              )}
              <span className="text-primary p-2">
                {myProd?.ratingQuantity} {t("prodInfo.part2")}
              </span>
            </div>
            <div className="product-price d-flex p-2">
              <span className="new-price text-muted pt-2 fs-3">
                {t("prodInfo.part3")}:
              </span>
              <span className=" text-muted px-1 ">EGP</span>

              <span className="text-dark fw-bold fs-3 ">{myProd?.price}</span>
              <span className=" text-muted px-1 ">00</span>
            </div>

            <div className="product-detail border-bottom">
              <ul className="list-group list-group-horizontal ">
                <li className="list-group-item w-50 border-0 fw-bold">
                  {t("prodInfo.part4")}:
                </li>
                <li className="list-group-item border-0">
                  {lang === "en" ? myProd?.en.brand : myProd?.ar.brand}
                </li>
              </ul>

              <ul className=" list-unstyled list-group list-group-horizontal ">
                <li className="list-group-item w-50 border-0 fw-bold">
                  {t("prodInfo.part5")}:
                </li>
                <li className="list-group-item border-0">
                  {lang === "en" ? myProd?.en.title : myProd?.ar.title}
                </li>
              </ul>

              <ul className="list-group list-group-horizontal">
                <li className="list-group-item w-50 border-0 fw-bold">
                  {t("prodInfo.part6")}:
                </li>
                <li className="list-group-item border-0">Black</li>
              </ul>

              <ul className="list-group list-group-horizontal">
                <li className="list-group-item border-0 w-50  fw-bold">
                  {t("prodInfo.part7")}:
                </li>
                <li className="list-group-item border-0">
                  {lang === "en"
                    ? myProd?.category?.en?.name
                    : myProd?.category?.ar?.name}
                </li>
              </ul>

              <ul className="list-group list-group-horizontal">
                <li className="list-group-item border-0 w-50 fw-bold small">
                  {t("prodInfo.part8")}:
                </li>
                <li className="list-group-item border-0">.......</li>
              </ul>
              <ul className="list-group list-group-horizontal">
                <li className="list-group-item w-50 border-0 fw-bold">
                  {t("prodInfo.part9")}:
                </li>
                <li className="list-group-item border-0">
                  {myProd?.quantityInStock}
                </li>
              </ul>

              <ul className="list-group list-group-horizontal">
                <li className="list-group-item border-0 w-50 fw-bold">
                  {t("prodInfo.part10")}:
                </li>
                <li className="list-group-item border-0">
                  {t("prodInfo.part12")}
                </li>
              </ul>

              <ul className="list-group list-group-horizontal ">
                <li className="list-group-item border-0 w-50 fw-bold">
                  {t("prodInfo.part11")}:
                </li>
                <li className="list-group-item border-0">
                  {t("prodInfo.part13")}
                </li>
              </ul>
            </div>
            <div>
              <span className="fs-4 fw-bold">{t("prodInfo.part14")}:</span>
              <p>{myProd?.description}</p>
            </div>

            <div className="d-block">
              <p>{t("prodInfo.part15")}:</p>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                className="text-decoration-none"
              >
                <i className="fa-brands fa-facebook px-3"></i>
              </a>
              <a
                href="https://twitter.com/?lang=en"
                target="_blank"
                className="text-decoration-none"
              >
                <i className="fab fa-twitter px-3"></i>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                className="text-decoration-none"
              >
                <i className="fab fa-instagram px-3"></i>
              </a>
              <a
                href="https://web.whatsapp.com/"
                target="_blank"
                className="text-decoration-none"
              >
                <i
                  className="fab fa-solid fa-whatsapp px-3"
                  style={{ color: "green" }}
                ></i>
              </a>
            </div>
          </div>
          <div className="col-lg-3  ">
            {/* style={{position:"fixed",right:"10px"}} */}
            {/*  amazon prime section */}
            <div className=" bg-white border p-1 w-100 m-1">
              <div className="p-1 text-center bg-secondary">
                <input type="checkbox" id="Fdelevir" name="Fdelevir" />
                <label htmlFor="Fdelevir">{t("prime.part1")}</label>
              </div>
              <p className="text-center">{t("prime.part2")}</p>
              <p className="text-center">
                <a href="" className="text-decoration-none">
                  {t("prime.part3")}
                </a>
              </p>
              <img className="mx-auto d-block image-fluid w-50 " src={prime} />
            </div>
            {/*  add to cart and buy section */}
            <div className="border d-block  p-1 w-100 m-1">
              <div className=" d-flex  p-2">
                <span className=" text-muted px-1 ">EGP</span>
                <span className="text-dark  fs-3 ">{myProd?.price}</span>
                <span className=" text-muted px-1 ">00</span>
              </div>
              <div className="p-1">
                <ul className="list-unstyled p-1 small ">
                  <li className="pb-1">
                    <Link className="text-decoration-none ">
                      {t("prime.part4")}
                    </Link>
                  </li>
                  <li className="py-1">
                    <Link className="text-decoration-none">
                      {t("prime.part5")}
                    </Link>
                  </li>
                  <li className="py-1">
                    <Link className="text-decoration-none " aria-disabled>
                      <i className="fa-solid fa-location-dot pe-2"></i>
                      {t("prime.part6")}
                    </Link>
                  </li>
                </ul>
                <span className="text-success ps-2 fs-5">
                  {t("prime.part7")}
                </span>
                <div className="d-flex px-2 pt-3">
                  <span className="pe-2">Qty : </span>
                  <select value={quantity} onChange={handleSelectChange}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>
              </div>

              <div className="text-center my-2">
                <button
                  id="add-to-cart-button "
                  type="button"
                  className="btn rounded-pill bg-warning w-75"
                  onClick={() =>
                    isLogin ? hanleAddWithAp(myProd) : handelAdd(myProd)
                  }
                >
                  <span className="pe-2">{t("prime.part8")}</span>

                  <i className="fas fa-shopping-cart"></i>
                </button>
                {isLogin ? (
                  <div>
                    <button
                      type="button"
                      className="btn w-75 rounded-pill text-center my-2 "
                      style={{
                        backgroundColor: "#FFA41C",
                      }}
                    >
                      <button
                        className="pe-3 btn"
                        onClick={() =>
                          navigate("/checkout", {
                            state: {
                              product: [myProd, { quantity }],
                              totalPrice: myProd?.price,
                            },
                          })
                        }
                      >
                        {t("prime.part9")}
                      </button>
                      <i className="fa-solid fa-money-check"></i>
                    </button>{" "}
                    <ul className="list-group list-group-horizontal ">
                      <li className="list-group-item w-50 border-0">
                        {t("prime.part10")}:
                      </li>
                      <li className="list-group-item border-0">
                        {t("prime.part11")}
                      </li>
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className=" p-0 small lh-1">
                <ul className=" list-unstyled list-group list-group-horizontal ">
                  <li className="list-group-item w-50 border-0">
                    {t("prime.part12")} :
                  </li>
                  <li className="list-group-item border-0">Amazon.eg</li>
                </ul>

                <ul className="list-group list-group-horizontal">
                  <li className="list-group-item w-50 border-0">
                    {t("prime.part13")} :
                  </li>
                  <li className="list-group-item border-0">Amazon.eg</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* search section */}
        <Reviews productId={id} />
      </div>
    </>
  );
};

export default ProductDetails;
