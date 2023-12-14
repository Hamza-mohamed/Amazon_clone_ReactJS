/* eslint-disable react/prop-types */
import React from "react";
import { ProductCard } from "../category-product/productCard";
import { useEffect } from "react";
import { instance } from "../../services/axios/instance";
import { useState } from "react";
import { useContext } from "react";
import { authContext } from "../../context/authcontex";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";

export const Sugessions = (props) => {
    const { lang } = useContext(authContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        instance.get(`/products/randoms/${props.number}`).then((res) => {
            setProducts(res.data.data);
            setLoading(false);
            // console.log(res.data.data);
        });
    }, []);

    return (
        <>
            {loading ? (
                <div className='m-auto d-flex p-5'>
                    <Spinner
                        style={{ color: "#FF9900" }}
                        className='m-auto'
                        animation='border'
                        role='status'
                    ></Spinner>
                </div>
            ) : (
                <div className='container'>
                    <h3 className='p-1 mt-4'>{t("sugesstion.part1")}</h3>

                    <div className='row'>
                        {products.length > 0 &&
                            products.map((product, index) => (
                                <ProductCard
                                    key={index}
                                    productID={product._id}
                                    productTitle={
                                        lang === "en"
                                            ? product.en?.title
                                            : product.ar?.title
                                    }
                                    productRating={product.rating}
                                    productDiscount={product.discountPercentage}
                                    productThumbnail={product.thumbnail}
                                    productPrice={product.price}
                                    productDescription={
                                        lang === "en"
                                            ? product.en?.description
                                            : product.ar?.description
                                    }
                                    productBrand={
                                        lang === "en"
                                            ? product.en?.brand
                                            : product.ar?.brand
                                    }
                                />
                            ))}
                    </div>
                </div>
            )}
        </>
    );
};
