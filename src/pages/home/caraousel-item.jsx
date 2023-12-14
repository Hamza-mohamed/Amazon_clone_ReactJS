/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { instance } from "../../services/axios/instance";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Spinner from "react-bootstrap/Spinner";

export default function CarouselItem(props) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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
    }, []);

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
                                style={{ height: "13rem", width: "11rem" }}
                            />
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
