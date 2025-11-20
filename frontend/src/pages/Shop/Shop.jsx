

import React, { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import assortment from "../../images/assortment-citrus-fruits.png";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import ScrollToTop from "../ScrollToTop";

axios.defaults.baseURL = "http://localhost:5000";

function Dropdown() {
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [products, setProducts] = useState([]);

  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Loader
  useEffect(() => {
    setTimeout(() => setLoaderStatus(false), 1200);
  }, []);

  // FIXED IMAGE PATH
  const getImage = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `http://localhost:5000${img}`;
  };

  // Fetch products by category
  const fetchFilteredProducts = async () => {
    try {
      const res = await axios.get("/api/products", {
        params: {
          search: "",
          category: "Snacks & Munchies",
          page: 1,
          limit: 20,
        },
      });

      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Product fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, []);

  return (
    <div>
      {loaderStatus ? (
        <div className="loader-container">
          <MagnifyingGlass
            visible={true}
            height="100"
            width="100"
            glassColor="#c0efff"
            color="#0aad0a"
          />
        </div>
      ) : (
        <>
          <ScrollToTop />

          <div className="container">
            <div className="row">

              {/* ------- LEFT SIDEBAR ------- */}
              <h5 className="mb-3 mt-4">Categories</h5>

              <div className="col-md-3">
                {dropdownData.map((dropdown, index) => (
                  <ul className="nav flex-column" key={index}>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#"
                        onClick={() => toggleDropdown(index)}
                      >
                        {dropdown.title} <i className="fa fa-chevron-down" />
                      </Link>

                      <div
                        className={`collapse ${openDropdowns.includes(index) ? "show" : ""
                          }`}
                      >
                        <ul className="nav flex-column ms-3">
                          {dropdown.items.map((item, itemIndex) => (
                            <li className="nav-item" key={itemIndex}>
                              <Link className="nav-link" to="#">
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  </ul>
                ))}

                {/* Store Filters */}
                <div className="py-4">
                  <h5 className="mb-3">Stores</h5>
                  <input
                    type="search"
                    className="form-control mb-3"
                    placeholder="Search by store"
                  />

                  {[
                    "E-Grocery",
                    "DealShare",
                    "DMart",
                    "Blinkit",
                    "BigBasket",
                    "StoreFront",
                    "Spencers",
                    "Online Grocery",
                  ].map((store, idx) => (
                    <div className="form-check mb-2" key={idx}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={store}
                        defaultChecked={idx === 0}
                      />
                      <label className="form-check-label" htmlFor={store}>
                        {store}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Banner */}
                <div className="py-4 position-relative">
                  <div className="position-absolute p-4">
                    <h3 className="mb-0">Fresh Fruits</h3>
                    <p>Get Upto 25% Off</p>
                    <Link to="#" className="btn btn-dark">
                      Shop Now <i className="fa fa-arrow-right ms-1" />
                    </Link>
                  </div>
                  <img
                    src={assortment}
                    alt="assortment"
                    className="img-fluid rounded-3"
                  />
                </div>
              </div>

              {/* ------- PRODUCT GRID ------- */}
              <div className="col-lg-9 col-md-8">
                <div className="card mb-4 bg-light border-0">
                  <div className="card-body p-4">
                    <h1 className="mb-0">Snacks & Munchies</h1>
                  </div>
                </div>

                <div className="row g-4 mt-2">
                  {products.length === 0 ? (
                    <p>No products found.</p>
                  ) : (
                    products.map((p) => (
                      <div className="col-md-4 col-6" key={p._id}>
                        <div className="card card-product p-2 shadow-sm">

                          <img
                            src={getImage(p.images?.[0])}
                            className="img-fluid rounded mb-2"
                            alt={p.name}
                            style={{ height: "180px", objectFit: "cover" }}
                          />

                          <h6 className="fw-bold mt-2">{p.name}</h6>
                          <p className="fw-bold text-success">₹{p.price}</p>

                          <Link
                            to={`/product/${p._id}`}
                            className="btn btn-primary btn-sm w-100"
                          >
                            View Product
                          </Link>

                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination UI (static for now) */}
                <div className="row mt-4">
                  <div className="col">
                    <nav>
                      <ul className="pagination">
                        <li className="page-item disabled">
                          <Link className="page-link" to="#">
                            <i className="fa fa-chevron-left" />
                          </Link>
                        </li>

                        <li className="page-item active">
                          <Link className="page-link" to="#">1</Link>
                        </li>

                        <li className="page-item">
                          <Link className="page-link" to="#">2</Link>
                        </li>

                        <li className="page-item">
                          <Link className="page-link" to="#">...</Link>
                        </li>

                        <li className="page-item">
                          <Link className="page-link" to="#">12</Link>
                        </li>

                        <li className="page-item">
                          <Link className="page-link" to="#">
                            <i className="fa fa-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

const dropdownData = [
  {
    title: "Dairy, Bread & Eggs",
    items: [
      "Milk",
      "Curd & Yogurt",
      "Eggs",
      "Bread",
      "Butter & More",
      "Cheese",
      "Cream & Whitener",
      "Condensed Milk",
      "Vegan Drinks",
    ],
  },
  {
    title: "Snacks & Munchies",
    items: [
      "Chips & Crisps",
      "Bhujia & Mixtures",
      "Healthy Snacks",
      "Cakes & Rolls",
      "Energy Bars",
      "Papad & Fryums",
      "Rusks & Wafers",
    ],
  },
  {
    title: "Fruits & Vegetables",
    items: [
      "Fresh Vegetables",
      "Herbs & Seasonings",
      "Fresh Fruits",
      "Organic Veggies",
      "Cuts & Sprouts",
      "Exotic Fruits",
      "Flower Bouquets",
    ],
  },
];

export default Dropdown;
