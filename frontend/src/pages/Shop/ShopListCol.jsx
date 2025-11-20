import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";

// Images
import assortment from "../../images/assortment-citrus-fruits.png";
import productimg1 from "../../images/product-img-1.jpg";
// Set backend base URL
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

const ShopListCol = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [products, setProducts] = useState([]);

  // Loader timeout
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1200);
  }, []);

  // Fetch API products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/products?category=Snacks&limit=50"
        );
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Dropdown menu state
  const [openDropdowns, setOpenDropdowns] = useState([]);

  const toggleDropdown = (index) => {
    if (openDropdowns.includes(index)) {
      setOpenDropdowns(openDropdowns.filter((item) => item !== index));
    } else {
      setOpenDropdowns([...openDropdowns, index]);
    }
  };
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/addresses");
        console.log("Addresses fetched:", response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);


  return (
    <>
      <div>
        <div className="container">
          <div className="row fixed-side">
            {/* ====================================
                LEFT CATEGORY SIDEBAR
            ======================================= */}
            <h5 className="mb-3 mt-8">Categories</h5>
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
                        {dropdown.items.map((item, idx) => (
                          <li className="nav-item" key={idx}>
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

              <div className="py-4">
                <h5 className="mb-3">Stores</h5>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by store"
                />
              </div>

              {/* Banner */}
              <div className="py-4 position-relative">
                <div className="position-absolute p-5 py-8">
                  <h3 className="mb-0">Fresh Fruits</h3>
                  <p>Get Upto 25% Off</p>
                  <Link to="#" className="btn btn-dark">
                    Shop Now
                  </Link>
                </div>
                <img src={assortment} alt="Banner" className="img-fluid rounded-3" />
              </div>
            </div>

            {/* ====================================
                RIGHT PRODUCT LISTING AREA
            ======================================= */}
            <div className="col-lg-9 col-md-8">
              {loaderStatus ? (
                <div className="loader-container text-center">
                  <MagnifyingGlass
                    visible={true}
                    height="100"
                    width="100"
                    color="#0aad0a"
                  />
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="card mb-4 bg-light border-0">
                    <div className="card-body p-9">
                      <h1 className="mb-0">Snacks & Munchies</h1>
                    </div>
                  </div>

                  {/* Product Found */}
                  <p className="mb-3">
                    <span className="text-dark">{products.length}</span> Products found
                  </p>

                  {/* Product List */}
                  <div className="row g-4 row-cols-1 mt-2">
                    {products.map((product) => (
                      <div className="col" key={product._id}>
                        <div className="card card-product">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-md-4 text-center">
                                <img
                                  src={product.image || productimg1}
                                  className="img-fluid"
                                  alt={product.name}
                                />
                              </div>

                              <div className="col-md-8">
                                <h5>{product.name}</h5>
                                <p className="text-muted small">
                                  {product.description?.slice(0, 40)}...
                                </p>

                                <h6 className="text-dark">₹{product.price}</h6>

                                <Link className="btn btn-primary btn-sm mt-2">
                                  Add to Cart
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="row mt-8">
                    <div className="col text-center">
                      <ul className="pagination justify-content-center">
                        <li className="page-item active">
                          <Link className="page-link">1</Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link">2</Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link">3</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopListCol;
