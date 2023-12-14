import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { instance } from "../../services/axios/instance";
import { ProductCard } from "../../components/category-product/productCard";
import { authContext } from "../../context/authcontex";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ReactStarRating from "react-star-ratings-component";
import { Stars } from "../../components/stars/stars";

export const Search = () => {
    const { t } = useTranslation();
    let location = useLocation();
    const navigate = useNavigate();
    const { category } = useParams();
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [FilteredProducts, setFilteredProducts] = useState(categoryProducts);
    const [notFound, setNotFound] = useState("");
    if (location.state !== null || location.state !== "") {
        var { searchValue } = location?.state;
        console.log(searchValue,"oooooooooooooooooooooooo");
    } else {
        setCategoryProducts([]);
        setNotFound(`product not found  search again .....`);
        setFilteredProducts([]);
    }
    const { lang, setLang } = useContext(authContext);
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState("");
    const [brand, setBrand] = useState([]);
    const [enBrands, setEnBrands] = useState([]);
    const [arBrands, setArBrands] = useState([]);
    const [categoryProdBrand, setCategoryProdBrand] = useState([]);
    useEffect(() => {
        document.title = `Amazon - search`;
        window.scrollTo({ top: 0, behavior: "smooth" });
        searchfunc();

        // console.log(res.data.data);
    }, [category, searchValue, notFound]);

    const searchfunc = async () => {
        console.log("dttseresdfsfdsd");
        await axios
            .post(
                `${import.meta.env.VITE_BASE_URL}products/result?search=${searchValue}`,
                {
                    category: category,
                    lang: lang,
                }
            )
            .then((res) => {
                console.log(res.data, "text");
                // console.log(res.data.products);
                // console.log(rasult[1]);
                if (res.data.data.length > 0) {
                    console.log("search done");
                    setNotFound("");
                    setCategoryProducts(res.data.data);
                    setFilteredProducts(res.data.data);
                    setCategoryProdBrand(res.data.data);
                    console.log(res.data.data, "next");
                } else {
                    console.log("hhhhhhhhhhh");
                    setCategoryProducts([]);
                    setFilteredProducts([]);
                    setNotFound(`${t("search.part7")}`);
                    // console.log(res.data.message);
                }
            })
            .catch((err) => {
                console.log("error",err);
                setNotFound(`${t("search.part7")}`);
            });
    };
    // for pagination هin results

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 12;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = FilteredProducts?.slice(firstIndex, lastIndex);
    const nPage = Math.ceil(FilteredProducts.length / recordsPerPage);
    const numbers = Array.from({ length: nPage }, (_, index) => index + 1);

    // pagination functions
    const prePage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const nextPage = () => {
        if (currentPage !== nPage) {
            setCurrentPage(currentPage + 1);
        }
    };
    const changeCpage = (num) => {
        setCurrentPage(num);
    };

    // to filter data after fetch from api
    const filterProducts = async (filtervalues) => {
        console.log(filtervalues);
        try {
            const priceThreshold = parseInt(filtervalues.price, 10) || 0;
            const ratingThreshold = parseInt(filtervalues.rating, 10) || 0;
            let filteredData = categoryProducts.filter((item) => {
                let brandMatch;
                const langBrand = lang === "en" ? "en.brand" : "ar.brand";
                const ratingMatch = Math.ceil(item.rating) === ratingThreshold;
                let priceMatch;
                if (priceThreshold <= 10000) {
                    priceMatch = item.price <= priceThreshold;
                } else {
                    priceMatch = item.price > priceThreshold;
                }

                console.log(priceMatch);
                if (lang == "en") {
                    brandMatch = filtervalues["en.brand"].includes(
                        item.en.brand
                    );
                } else {
                    brandMatch = filtervalues["ar.brand"].includes(
                        item.ar.brand
                    );
                }

                if (
                    priceThreshold === 0 &&
                    ratingThreshold === 0 &&
                    filtervalues[langBrand]?.length === 0
                ) {
                    return item;
                } else if (
                    priceThreshold !== 0 &&
                    ratingThreshold !== 0 &&
                    filtervalues[langBrand]?.length !== 0
                ) {
                    return priceMatch && ratingMatch && brandMatch;
                } else if (
                    priceThreshold !== 0 &&
                    ratingThreshold === 0 &&
                    filtervalues[langBrand]?.length === 0
                ) {
                    return priceMatch;
                } else if (
                    priceThreshold === 0 &&
                    ratingThreshold !== 0 &&
                    filtervalues[langBrand]?.length === 0
                ) {
                    return ratingMatch;
                } else if (
                    priceThreshold === 0 &&
                    ratingThreshold === 0 &&
                    filtervalues[langBrand]?.length !== 0
                ) {
                    return brandMatch;
                } else if (
                    priceThreshold !== 0 &&
                    ratingThreshold !== 0 &&
                    filtervalues[langBrand]?.length === 0
                ) {
                    return priceMatch && ratingMatch;
                } else if (
                    priceThreshold !== 0 &&
                    ratingThreshold === 0 &&
                    filtervalues[langBrand]?.length !== 0
                ) {
                    return priceMatch && brandMatch;
                } else if (
                    priceThreshold === 0 &&
                    ratingThreshold !== 0 &&
                    filtervalues[langBrand]?.length !== 0
                ) {
                    return ratingMatch && brandMatch;
                } else {
                    return false;
                }
            });
            // console.log(filteredData, "fouced");

            setFilteredProducts(filteredData);
        } catch (error) {
            console.error(error);
            setCategoryProducts(categoryProducts);
        }
    };
    useEffect(() => {
        generateBrands();
    }, [categoryProducts, currentPage]);

    const generateBrands = (data) => {
        const enBrandList = Array.from(
            new Set(categoryProducts.map((product) => product.en.brand))
        );
        const arBrandList = Array.from(
            new Set(categoryProducts.map((product) => product.ar.brand))
        );
        setEnBrands(enBrandList);
        setArBrands(arBrandList);
    };
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
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

    useEffect(() => {
        generateBrands();
    }, [categoryProdBrand]);
    useEffect(() => {
        // Cleanup function
        return () => {
            // Set the filtered search data when the component is unmounted
            setFilteredProducts(categoryProducts);
            // setRecords([]);
        };
    }, []);

    useEffect(() => {
        applyFilters();
        // filterProducts();
    }, [price, rating, brand]);
    let filtervalues = [];
    const applyFilters = () => {
        if (price) {
            filtervalues["price"] = price;
        }
        if (rating) {
            filtervalues.rating = rating;
        }
        if (brand) {
            filtervalues[lang === "en" ? "en.brand" : "ar.brand"] = brand;
        }

        filterProducts(filtervalues);
    };
    return (
        // <></>
        <section className='container-fluid'>
            <div className='row mt-2 mb-2'>
                <div className='col-lg-2 col-md-2 filter'>
                    {
                        <div className='row'>
                            {" "}
                            <div className='col-6 col-sm-6 col-md-12 col-lg-12'>
                                <h4 className='mt-3'> {t("search.part1")}</h4>
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
                                <div className='mt-3'>
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
                                </div>
                            </div>
                            <br />
                            <div className='mt-3 col-6 col-sm-6 col-md-12 col-lg-12'>
                                <h4> {t("search.part6")}</h4>
                                {lang === "en"
                                    ? enBrands?.map((bd) => (
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
                                    : arBrands?.map((bd) => (
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
                                      ))}
                            </div>
                        </div>
                    }
                </div>
                <div className='col-lg-10'>
                    <div className='row'>
                        {records?.map((product, index) => (
                            // return (
                            <ProductCard
                                key={index}
                                productID={product._id}
                                productTitle={
                                    lang === "en"
                                        ? product?.en.title
                                        : product?.ar.title
                                }
                                productRating={product.rating}
                                productDiscount={product.discountPercentage}
                                productThumbnail={product.thumbnail}
                                productPrice={product.price}
                                productDescription={
                                    lang === "en"
                                        ? product?.en.description
                                        : product?.ar.description
                                }
                            />
                        ))}
                        {<h1>{notFound}</h1>}
                    </div>
                </div>
                <nav>
                    <ul className='pagination justify-content-center align-items-center'>
                        <li className='page-item'>
                            <button
                                className={`page-link ${
                                    currentPage === 1 ? "disabled" : ""
                                }`}
                                disabled={currentPage === 1 ? true : false}
                                onClick={() => {
                                    prePage();
                                    window.scrollTo({
                                        top: 0,
                                    });
                                }}
                            >
                                Prev
                            </button>
                        </li>
                        {numbers.map((n, i) => (
                            <li
                                key={i}
                                className={`page-item px-2 ${
                                    currentPage === n ? "active" : ""
                                }$`}
                            >
                                <a
                                    className='page-item fs-2'
                                    onClick={() => {
                                        changeCpage(n);
                                        window.scrollTo({
                                            top: 0,
                                        });
                                    }}
                                >
                                    {n}
                                </a>
                            </li>
                        ))}
                        <li className='page-item'>
                            <button
                                className={`page-link ${
                                    currentPage === nPage ? "disabled" : ""
                                }`}
                                onClick={() => {
                                    nextPage();
                                    window.scrollTo({
                                        top: 0,
                                    });
                                }}
                                disabled={currentPage === nPage ? true : false}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>
    );
};
