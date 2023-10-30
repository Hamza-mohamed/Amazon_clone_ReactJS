import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { instance } from "../../services/axios/instance";
import "./category.css";
import { CategoryProduct } from "../../components/category-product/category-product";

export const Category = () => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    let { categoryID } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = `Amazon - ${categoryName}`;
        window.scrollTo({ top: 0, behavior: "smooth" });
        instance
            .get(`products/category/${categoryID}`)
            .then((res) => {
                // console.log(res.data.products);
                setCategoryProducts(res.data.data);
                // console.log(res.data.data);
            })
            .catch((err) => {
                navigate("/");
            });
    }, [categoryID, navigate, categoryName]);
    // console.log(categoryname);
    const [catogories, setCatogories] = useState([]);
    useEffect(() => {
        instance
            .get("category")
            .then((res) => {
                // console.log(res.data);
                setCatogories(res.data);
                // setCategoryProducts(res.data.data);
                // console.log(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    var categoryName;
    for (const category in catogories) {
        // console.log(categoriesArr[category].id, categoryID);
        if (catogories[category]._id === categoryID) {
            categoryName = catogories[category].name;
        }
    }
    // console.log(categoryProducts);
    return (
        // <></>
        <section className='container-fluid'>
            <div className='row mt-2 mb-2'>
                <div className='col-lg-2 filter'></div>
                <div className='col-lg-10'>
                    <h3>{categoryName}</h3>
                    <div className='row mt-5'>
                        <div className='col-12'>
                            <p>
                                5-5 of over 5 results for &nbsp;
                                <span className='text-danger'>
                                    {categoryName}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className='row'>
                        {categoryProducts.map((product, index) => (
                            // return (
                            <CategoryProduct
                                key={index}
                                productID={product._id}
                                productTitle={product.title}
                                productRating={product.rating}
                                productDiscount={product.discountPercentage}
                                productThumbnail={product.thumbnail}
                                productPrice={product.price}
                                productDescription={product.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
