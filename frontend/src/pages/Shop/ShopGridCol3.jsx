import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import assortment from "../../images/assortment-citrus-fruits.png";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

// Dropdown Data
const dropdownData = [
  {
    title: "Dairy, Bread & Eggs",
    items: [
      "Milk",
      "Milk Drinks",
      "Curd & Yogurt",
      "Eggs",
      "Bread",
      "Buns & Bakery",
      "Butter & More",
      "Cheese",
      "Paneer & Tofu",
      "Cream & Whitener",
      "Condensed Milk",
      "Vegan Drinks",
    ],
  },
  {
    title: "Snacks & Munchies",
    items: [
      "Chips & Crisps",
      "Nachos",
      "Popcorn",
      "Bhujia & Mixtures",
      "Namkeen Snacks",
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
      "Organic Fruits & Vegetables",
      "Cuts & Sprouts",
      "Exotic Fruits & Veggies",
      "Flower Bouquets, Bunches",
    ],
  },
  {
    title: "Cold Drinks & Juices",
    items: [
      "Soft Drinks",
      "Fruit Juices",
      "Coldpress",
      "Energy Drinks",
      "Water & Ice Cubes",
      "Soda & Mixers",
      "Concentrates & Syrups",
      "Detox & Energy Drinks",
      "Juice Collection",
    ],
  },
];

export default function ShopGridCol3() {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);

  const navigate = useNavigate(); // ✅ fixed — inside component only

  // ADD TO CART
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to Cart!");
  };

  // BUY NOW
  const buyNow = (product) => {
    navigate("/checkout", { state: { buyNowProduct: product } });
  };

  // Loader
  useEffect(() => {
    setTimeout(() => setLoaderStatus(false), 1000);
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const getImage = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `http://localhost:5000${img}`;
  };

  // 👉 fetchProducts placed OUTSIDE useEffect
  const fetchProducts = React.useCallback(async () => {
    if (!selectedCategory) return;

    try {
      const res = await axios.get("/api/products", {
        params: {
          category: selectedCategory,
          limit: 50,
        },
      });

      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [selectedCategory]);

  // 👉 useEffect (CALL only)
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  return (
    <>
      {loaderStatus ? (
        <div className="loader-container">
          <MagnifyingGlass visible height="100" width="100" color="#0aad0a" />
        </div>
      ) : (
        <div className="container">
          <div className="row fixed-side">

            {/* LEFT SECTION */}
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
                      className={`collapse ${openDropdowns.includes(index) ? "show" : ""
                        }`}
                    >
                      <ul className="nav flex-column ms-3">
                        {dropdown.items.map((item, i) => (
                          <li className="nav-item" key={i}>
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

              <div className="py-4">
                <div className="position-absolute p-4">
                  <h3 className="mb-0">Fresh Fruits</h3>
                  <p>Get Upto 25% Off</p>
                  <Link to="#" className="btn btn-dark">
                    Shop Now <i className="fa fa-arrow-right ms-1" />
                  </Link>
                </div>
                <img src={assortment} alt="" className="img-fluid rounded-3" />
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="col-lg-9 col-md-8">

              <div className="card mb-4 bg-light border-0">
                <div className="card-body p-4">
                  <h1>{selectedCategory || "Select a Category"}</h1>
                </div>
              </div>

              <p>
                {selectedCategory && (
                  <>
                    <span className="text-dark">{products.length}</span> Products Found
                  </>
                )}
              </p>

              <div className="row g-4 mt-2">
                {!selectedCategory ? (
                  <p>Please select a category.</p>
                ) : products.length === 0 ? (
                  <p>No products found.</p>
                ) : (
                  products.map((p) => (
                    <div className="col-lg-4 col-md-6 col-6" key={p._id}>
                      <div className="card card-product p-2 shadow-sm">
                        <img
                          src={getImage(p.images?.[0])}
                          className="img-fluid rounded mb-2"
                          alt={p.name}
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                        <h6 className="fw-bold mt-2">{p.name}</h6>
                        <p className="fw-bold text-success">₹{p.price}</p>

                        <div className="d-flex gap-2 mt-2">

                          <button
                            className="btn btn-outline-primary btn-sm w-50"
                            onClick={() => addToCart(p)}
                          >
                            Add to Cart
                          </button>

                          <button
                            className="btn btn-primary btn-sm w-50"
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
      )}
    </>
  );
}
