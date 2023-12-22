/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { instance } from "../../services/axios/instance";
import "./category.css";
import { ProductCard } from "../../components/category-product/productCard";
import { authContext } from "../../context/authcontex";
import Spinner from "react-bootstrap/Spinner";
// import { PaginationFilter } from "../../components/PaginationFilter/PaginationFilter";
import ReactPaginate from "react-paginate";
import { Stars } from "../../components/stars/stars";
import { useTranslation } from "react-i18next";

export const Category = () => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const { lang } = useContext(authContext);
    const [loading, setLoading] = useState(true);
    let { categoryID } = useParams();

    const navigate = useNavigate();
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState("");
    const [brand, setBrand] = useState([]);
    const [sorting, setSorting] = useState("");
    // const [brandCollection, setBrandCollection] = useState([]);
    // const [ArbrandCollection, setArBrandCollection] = useState([]);
    const [subCategories, setSubcategories] = useState([]);
    const [productlength, setProductLength] = useState("");
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState("1");
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `Amazon`;
        window.scrollTo({ top: 0, behavior: "smooth" });
        fetchProducts();
    }, [categoryID, navigate, currentPage]);

    let fetchProducts = async (params) => {
        // console.log(currentPage, params);
        setLoading(true);
        // console.log(params);
        try {
            await instance
                .get(
                    `/products/categoryPrd/${categoryID}?page=${currentPage}`,
                    {
                        params: {
                            ...params,
                        },
                    }
                )
                .then((res) => {
                    // console.log(res);
                    setCategoryProducts(res.data.data);
                    // console.log(res.data.results);
                    setProductLength(res.data.results);
                    setPagination(res.data.pagination);
                    setLoading(false);

                });
        } catch (error) {
            setLoading(false);
            // console.error(error);
            setCategoryProducts([]);
        }
    };
    const [loadingBrands, setLoadingBrands] = useState(true);
    useEffect(() => {
        setLoadingBrands(true);
        instance
            .get(`/products/categoryPrd/${categoryID}?page=${currentPage}`)
            .then((res) => {
                // console.log(res);
                generateBrands(res.data.data);
                setLoadingBrands(false);
            });
    }, [categoryID, currentPage]);
    const [enBrands, setEnBrands] = useState([]);
    const [arBrands, setArBrands] = useState([]);

    const generateBrands = (data) => {
        const enBrandList = Array.from(
            new Set(data.map((product) => product.en.brand))
        );
        const arBrandList = Array.from(
            new Set(data.map((product) => product.ar.brand))
        );
        setEnBrands(enBrandList);
        setArBrands(arBrandList);
    };
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
        // console.log(price);
    };

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleBrandChange = (event) => {
        let value = event.target.value;
        if (value === "") {
            setBrand("");
        } else if (event.target.checked === true) {
            setBrand([...brand, value]);
        } else if (event.target.checked === false) {
            const newArr = brand.filter((e) => e !== value);
            setBrand([...newArr]);
        }
    };

    const handleSorting = (event) => {
        setSorting(event.target.value);
        // console.log(event.target.value);
    };

    useEffect(() => {
        applyFilters();
    }, [price, rating, brand, sorting, currentPage]);

    let params = [];
    const applyFilters = () => {
        if (price <= 10000 && price !== "") {
            // console.log(price);
            params["price[lte]"] = price;
        } else if (price > 10000) {
            // console.log(price);
            params["price[gte]"] = price;
        }
        if (rating) {
            params.rating = rating;
        }
        if (brand.length > 0) {
            params[lang === "en" ? "en.brand" : "ar.brand"] = brand;
        }
        if (sorting) {
            params.sort = sorting;
        }

        fetchProducts(params);
    };

    const [catogories, setCatogories] = useState([]);
    useEffect(() => {
        instance
            .get("category/")
            .then((res) => {
                setCatogories(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [categoryID]);

    var categoryName;
    for (const category in catogories) {
        // console.log(categoriesArr[category].id, categoryID);
        if (catogories[category]._id === categoryID) {
            // categoryName = catogories[category].name;
            categoryName =
                lang === "en"
                    ? catogories[category].en?.name
                    : catogories[category].ar?.name;
        }
    }
    // console.log(categoryProducts);

    useEffect(() => {
        instance
            .get(`/subcategory/subs/${categoryID}`)
            .then((res) => {
                setSubcategories(res.data.data);
                // console.log(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [categoryID, navigate]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };

    return (
        // <></>
        <section className='container-fluid'>
            <div className='row  mt-1 py-1 rounded border border-light-subtle shadow'>
                <div className='col-sm-10 '>
                    <p className='fs-6 ms-5 pt-2'>
                        {pagination.skip + 1} -
                        {pagination.currentPage == pagination.numberOfPages
                            ? productlength
                            : pagination.limit + pagination.skip}
                        {/* {pagination.limit + pagination.skip} */}{" "}
                        {t("category.part18")} {productlength}{" "}
                        {t("category.part19")}
                        <span className='text-danger fw-bold'>
                            {categoryName}
                        </span>
                    </p>
                </div>
                <div className='col-sm-2 pt-1 me-0 pe-0 '>
                    <div className='dropdown'>
                        <button
                            className='p-1 px-3 btn btn-light btn-outline-secondary shadow-sm dropdown-toggle'
                            type='button'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                        >
                            {t("category.part1")}
                        </button>
                        <ul className='dropdown-menu'>
                            <li>
                                <button
                                    type='button'
                                    className='btn btn-light'
                                    value={"price"}
                                    onClick={() => handleSorting(event)}
                                >
                                    {t("category.part2")}
                                </button>
                            </li>
                            <li>
                                <button
                                    type='button'
                                    className='btn btn-light'
                                    value='-price'
                                    onClick={() => handleSorting(event)}
                                >
                                    {t("category.part3")}
                                </button>
                            </li>
                            <li>
                                <button
                                    type='button'
                                    className='btn btn-light'
                                    value={"-rating"}
                                    onClick={() => handleSorting(event)}
                                >
                                    {t("category.part4")}
                                </button>
                            </li>
                            <li>
                                <button
                                    type='button'
                                    className='btn btn-light'
                                    value={"-sold"}
                                    onClick={() => handleSorting(event)}
                                >
                                    {t("category.part5")}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='row mt-2 mb-2'>
                <div className='col-lg-2 col-md-2 filter'>
                    <div className='row'>
                        {" "}
                        <div className='col-6 col-sm-6 col-md-12 col-lg-12'>
                            <p className='fs-5  fw-bold mb-0 mt-3'>
                                {categoryName}
                            </p>
                            <div>
                                {lang === "en"
                                    ? subCategories.map((sub) => (
                                          <Link
                                              key={sub._id}
                                              onClick={() =>
                                                  navigate(
                                                      `/products/SubCategory/${sub._id}`
                                                      // , {params:sub.en.name}
                                                  )
                                              }
                                          >
                                              <p className='p-0 my-0 ms-4 text-truncate mb-1 text-wrap fs-6 text-dark'>
                                                  {sub.en.name}
                                              </p>
                                          </Link>
                                      ))
                                    : subCategories.map((sub) => (
                                          <Link
                                              key={sub._id}
                                              onClick={() =>
                                                  navigate(
                                                      `/products/SubCategory/${sub._id}`
                                                      // , {params:sub.en.name}
                                                  )
                                              }
                                          >
                                              <p className='p-0 my-0 ms-4 text-truncate mb-1 text-wrap fs-6 text-dark'>
                                                  {sub.ar.name}
                                              </p>
                                          </Link>
                                      ))}
                                <h4 className='mt-3 fs-5 fw-bold'>
                                    {t("category.part4")}
                                </h4>{" "}
                                <div className='d-flex row'>
                                    <label className='d-block fs-6 ms-2'>
                                        <input
                                            className='price-rating'
                                            type='radio'
                                            name='rating'
                                            value=''
                                            onChange={handleRatingChange}
                                        />
                                        {t("category.part6")}
                                    </label>
                                </div>
                                <div className='d-flex'>
                                    <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                        <input
                                            type='radio'
                                            name='rating'
                                            value={5}
                                            onChange={handleRatingChange}
                                        />
                                    </label>
                                    <Stars starSize={24} productRating={5} />
                                </div>
                                <div className='d-flex'>
                                    <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                        <input
                                            type='radio'
                                            name='rating'
                                            value={4}
                                            onChange={handleRatingChange}
                                        />
                                    </label>
                                    <Stars starSize={24} productRating={4} />
                                </div>
                                <div className='d-flex'>
                                    <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                        <input
                                            type='radio'
                                            name='rating'
                                            value={3}
                                            onChange={handleRatingChange}
                                        />
                                    </label>
                                    <Stars starSize={24} productRating={3} />
                                </div>
                                <div className='d-flex'>
                                    <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                        <input
                                            type='radio'
                                            name='rating'
                                            value={2}
                                            onChange={handleRatingChange}
                                        />
                                    </label>
                                    <Stars starSize={24} productRating={2} />
                                </div>
                                <div className='d-flex'>
                                    <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                        <input
                                            type='radio'
                                            name='rating'
                                            value={1}
                                            onChange={handleRatingChange}
                                        />
                                    </label>
                                    <Stars starSize={24} productRating={1} />
                                </div>
                            </div>{" "}
                        </div>
                        <div className='col-6 col-sm-6 col-md-12 col-lg-12'>
                            <div className='mt-3'>
                                <h4>{t("category.part7")}</h4>
                                <div className='d-flex'>
                                    <label className='d-block fs-6 ms-2  pe-1'>
                                        <input
                                            className='price-rating'
                                            type='radio'
                                            name='price'
                                            value={""}
                                            onChange={handlePriceChange}
                                        />
                                        {t("category.part8")}{" "}
                                    </label>{" "}
                                </div>
                            </div>
                            <div className='d-flex'>
                                <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                    <input
                                        className='price-rating'
                                        type='radio'
                                        name='price'
                                        value='100'
                                        onChange={handlePriceChange}
                                    />
                                    {t("category.part9")}
                                </label>
                            </div>
                            <div className='d-flex'>
                                <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                    <input
                                        className='price-rating'
                                        type='radio'
                                        name='price'
                                        value='300'
                                        onChange={handlePriceChange}
                                    />
                                    {t("category.part10")}
                                </label>
                            </div>
                            <div className='d-flex'>
                                <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                    <input
                                        className='price-rating'
                                        type='radio'
                                        name='price'
                                        value='1000'
                                        onChange={handlePriceChange}
                                    />
                                    {t("category.part11")}
                                </label>
                            </div>
                            <div className='d-flex'>
                                <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                    <input
                                        className='price-rating'
                                        type='radio'
                                        name='price'
                                        value='3000'
                                        onChange={handlePriceChange}
                                    />
                                    {t("category.part12")}
                                </label>
                            </div>
                            <div className='d-flex'>
                                <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                    <input
                                        className='price-rating'
                                        type='radio'
                                        name='price'
                                        value='5000'
                                        onChange={handlePriceChange}
                                    />
                                    {t("category.part13")}
                                </label>
                            </div>{" "}
                            <div className='d-flex'>
                                <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                    <input
                                        className='price-rating'
                                        type='radio'
                                        name='price'
                                        value='10000'
                                        onChange={handlePriceChange}
                                    />
                                    {t("category.part14")}
                                </label>
                            </div>
                            <div className='d-flex'>
                                <label className='d-block fs-6 ms-2 mt-1 pe-1'>
                                    <input
                                        className='price-rating'
                                        type='radio'
                                        name='price'
                                        value='10001'
                                        onChange={handlePriceChange}
                                    />
                                    {t("category.part15")}
                                </label>
                            </div>
                            <br />
                            <h4> {t("category.part16")}</h4>
                            {loadingBrands ? (
                                <Spinner
                                    style={{
                                        color: "#FF9900",
                                    }}
                                    className='m-auto'
                                    animation='border'
                                    role='status'
                                ></Spinner>
                            ) : lang === "en" ? (
                                enBrands?.map((bd) => (
                                    <label
                                        key={bd}
                                        className='d-block fs-6 ms-2'
                                    >
                                        <input
                                            className='price-rating'
                                            type='checkbox'
                                            value={bd}
                                            onChange={(ev) =>
                                                handleBrandChange(ev)
                                            }
                                            // checked={brand.includes(bd)}
                                        />
                                        {bd}
                                    </label>
                                ))
                            ) : (
                                arBrands?.map((bd) => (
                                    <label
                                        key={bd}
                                        className='d-block fs-6 ms-2'
                                    >
                                        <input
                                            className='price-rating'
                                            style={{
                                                marginRight: "6px",
                                            }}
                                            type='checkbox'
                                            value={bd}
                                            onChange={(ev) =>
                                                handleBrandChange(ev)
                                            }
                                            // checked={brand.includes(bd)}
                                        />
                                        {bd}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>{" "}
                </div>
                <div className='col-lg-10 col-md-10'>
                    <div className='row'>
                        {loading ? (
                            <div className='m-auto d-flex vh-100'>
                                <Spinner
                                    style={{ color: "#FF9900" }}
                                    className='m-auto'
                                    animation='border'
                                    role='status'
                                ></Spinner>
                            </div>
                        ) : categoryProducts.length > 0 ? (
                            categoryProducts.map((product, index) => (
                                // return (
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
                            ))
                        ) : (
                            <h5>{t("category.part17")}</h5>
                        )}
                    </div>
                </div>
            </div>

            {/* <PaginationFilter pageCount={pagination.numberOfPages} /> */}

            <ReactPaginate
                breakLabel='...'
                nextLabel={t("pagination.part1")}
                onPageChange={handlePageClick}
                marginPagesDisplayed={2}
                pageRangeDisplayed={4}
                pageCount={pagination.numberOfPages}
                previousLabel={t("pagination.part2")}
                containerClassName='pagination justify-content-center'
                pageClassName='page-item'
                pageLinkClassName='page-link '
                previousClassName='page-item'
                nextClassName='page-item'
                previousLinkClassName='page-link'
                nextLinkClassName='page-link'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                activeClassName='active'
            />
        </section>
    );
};
