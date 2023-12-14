// /* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { instance } from "../../services/axios/instance";
import { useNavigate } from "react-router-dom";
import { Stars } from "../../components/stars/stars";
import { authContext } from "../../context/authcontex";
import "./home.css";
import Spinner from "react-bootstrap/Spinner";

export default function RatingSliderItem(props) {
    const { lang } = useContext(authContext);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setLoading(true);
        instance
            .get(`${props.url}?limit=${props.limit}&skip=${props.skip}`)
            // .get(`/products/categoryPrd/65527ac3376a52ea210d9706?limit=${props.limit}&skip=${props.skip}`)
            .then((res) => {
                setProducts(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [props]);

    const navigate = useNavigate();

    return (
        <>
            <div className='row mx-2'>
                {loading ? (
                    <div className='m-auto d-flex' style={{ height: "250px" }}>
                        <Spinner
                            style={{ color: "#FF9900" }}
                            className='m-auto'
                            animation='border'
                            role='status'
                        ></Spinner>
                    </div>
                ) : (
                    products.map((prd) => (
                        <div
                            className='col-6 col-sm-4 col-md-3 col-lg-2 product-details'
                            key={prd._id}
                            onClick={() => {
                                navigate(`/products/${prd._id}`);
                            }}
                        >
                            <img
                                className='my-3 px-1'
                                src={prd.thumbnail}
                                alt=''
                                style={{ height: "13rem", width: "12rem" }}
                            />
                            <div className='card-body'>
                                <h5 className='card-title ms-3 text-truncate'>
                                    {lang === "en"
                                        ? prd.en?.title
                                        : prd.ar?.title}
                                </h5>
                                <div className='ms-2'>
                                    <Stars
                                        starSize={20}
                                        productRating={Math.round(prd.rating)}
                                    />
                                </div>
                                <div className='my-2 ms-2'>
                                    <span className='badge text-bg-dark text-warning mx-1'>
                                        {prd.discountPercentage} % off
                                    </span>
                                    {/* <span className="text-warning">limited time deal</span> */}
                                    <div className='ms-2'>
                                        <span className='ms- '>Only</span>
                                        <span className='m-1  mt-1 text-danger fw-bold'>
                                            {prd.price}
                                        </span>
                                        <span>EGP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
