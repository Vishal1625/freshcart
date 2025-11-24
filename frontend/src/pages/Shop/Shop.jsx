import React, { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import { Link } from "react-router-dom";
import axios from "axios";
import ScrollToTop from "../ScrollToTop";

axios.defaults.baseURL = "http://localhost:5000";

function Dropdown() {
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  // ⭐ TOGGLE SIDEBAR CATEGORY DROPDOWN
  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  useEffect(() => {
    setTimeout(() => setLoaderStatus(false), 1200);
  }, []);

  // ⭐ PRODUCT IMAGE HANDLER
  const getImage = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `http://localhost:5000${img}`;
  };

  // ⭐ FETCH PRODUCTS FROM BACKEND
  const fetchFilteredProducts = async () => {
    try {
      const res = await axios.get("/api/products", {
        params: {
          category: selectedCategory,
          search: "",
          page: 1,
          limit: 30,
        },
      });

      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Product fetch error:", err);
    }
  };

  // ⭐ AUTO FETCH WHEN CATEGORY CHANGES
  useEffect(() => {
    if (selectedCategory) {
      fetchFilteredProducts();
    }
  }, [selectedCategory]);

  // ⭐ CART FUNCTIONS
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      exist.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to Cart!");
  };

  const buyNow = (product) => {
    localStorage.setItem("buyNowProduct", JSON.stringify(product));
    window.location.href = "/checkout";
  };

  return (
    <div>
      {loaderStatus ? (
        <div className="loader-container">
          <MagnifyingGlass visible height="100" width="100" color="#0aad0a" />
        </div>
      ) : (
        <>
          <ScrollToTop />

          <div className="container">
            <div className="row">

              {/* LEFT SIDEBAR */}
              <div className="col-md-3">
                <h5 className="mb-3 mt-4">Categories</h5>

                {dropdownData.map((dropdown, index) => (
                  <ul className="nav flex-column" key={index}>
                    <li className="nav-item">
                      <button
                        className="nav-link btn btn-link"
                        onClick={() => toggleDropdown(index)}
                      >
                        {dropdown.title} <i className="fa fa-chevron-down" />
                      </button>

                      <div
                        className={`collapse ${openDropdowns.includes(index) ? "show" : ""}`}
                      >
                        <ul className="nav flex-column ms-3">
                          {dropdown.items.map((item, itemIndex) => (
                            <li className="nav-item" key={itemIndex}>
                              <button
                                className="nav-link btn btn-link"
                                onClick={() => setSelectedCategory(item)}
                              >
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  </ul>
                ))}
              </div>

              {/* RIGHT SIDE PRODUCTS */}
              <div className="col-lg-9 col-md-8">
                <div className="card mb-4 bg-light border-0">
                  <div className="card-body p-4">
                    <h1 className="mb-0">{selectedCategory}</h1>
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

                          <div className="d-grid gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => addToCart(p)}
                            >
                              Add to Cart
                            </button>

                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => buyNow(p)}
                            >
                              Buy Now
                            </button>


                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dropdown;


// ⭐ SIDE BAR CATEGORY DATA
const dropdownData = [
  {
    title: "Dairy, Bread & Eggs",
    items: ["Milk", "Curd & Yogurt", "Eggs", "Bread", "Butter & More"],
  },
  {
    title: "Snacks & Munchies",
    items: ["Chips & Crisps", "Bhujia & Mixtures", "Healthy Snacks"],
  },
  {
    title: "Fruits & Vegetables",
    items: ["Fresh Vegetables", "Fresh Fruits", "Organic Veggies"],
  },
];
