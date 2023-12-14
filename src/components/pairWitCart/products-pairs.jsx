import { useEffect } from "react";
import { instance } from "../../services/axios/instance";
import { useState } from "react";
import { useContext } from "react";
import { authContext } from "../../context/authcontex";
import { Stars } from "../stars/stars";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "react-bootstrap/Spinner";

export const ProductsSide = (props) => {
    const { isLogin } = useContext(authContext);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();

    const { lang } = useContext(authContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        instance.get(`/products/randoms/${4}`).then((res) => {
            setProducts(res.data.data);
            setLoading(false);
        });
    }, []);

    return (
        <>
            {loading ? (
                <div className='m-auto d-flex'>
                    <Spinner
                        style={{ color: "#FF9900" }}
                        className='m-auto'
                        animation='border'
                        role='status'
                    ></Spinner>
                </div>
            ) : (
                products.length > 0 &&
                products.map((product, index) => (
                    <div key={index}>
                        <Link
                            to={`/products/${product._id}`}
                            className='text-decoration-none'
                        >
                            <div className='row mt-2 mb-2 p-2'>
                                <div className='col-md-4 mt-3'>
                                    <img
                                        className='w-100 mt-3'
                                        width='100px'
                                        src={product.thumbnail}
                                    />
                                </div>
                                <div className='col-8'>
                                    <div className='mt-4'>
                                        <p className='m-0 pair-title'>
                                            {lang === "en"
                                                ? product.en?.description
                                                : product.ar?.description}
                                        </p>
                                        <p
                                            className='m-0'
                                            style={{
                                                color: "#C27613",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {product.price} EGP
                                        </p>
                                        <span>
                                            <Stars
                                                starSize={24}
                                                productRating={Math.round(
                                                    product.rating
                                                )}
                                            />
                                        </span>
                                        {/* <Link
                                  
                                    className='to-buy d-block text-decoration-none mt-1 w-75 rounded-5'
                                    style={{ fontSize: "12px" }}
                                >
                                    Add to Cart
                                </Link> */}
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <hr />
                    </div>
                ))
            )}
        </>
    );
};
