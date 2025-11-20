// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Grocerylogo from "../images/Grocerylogo.png";
import menubanner from "../images/menu-banner.jpg";

import productimage1 from "../images/product-img-1.jpg";
import productimage2 from "../images/product-img-2.jpg";
import productimage3 from "../images/product-img-3.jpg";
import productimage4 from "../images/product-img-4.jpg";
import productimage5 from "../images/product-img-5.jpg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const userId = localStorage.getItem("userId") || "guest";

  // Toggle hamburger icon
  const handleClick = () => setIsOpen(!isOpen);

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartItems([]); // fail gracefully
    }
  };

  useEffect(() => {
    fetchCartItems();
    // optionally you can refresh cart every X seconds or on storage events
  }, []);

  // Remove item from cart
  const removeCartItem = async (productId) => {
    try {
      // backend expected route: /api/cart/remove/:userId/:productId
      await axios.delete(
        `http://localhost:5000/api/cart/remove/${userId}/${productId}`
      );
      // refresh
      fetchCartItems();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("No products added in cart!");
      return;
    }
    // navigate to checkout page
    window.location.href = "/ShopCheckOut";
  };

  return (
    <div>
      {/* =============== TOP BAR =============== */}
      <div className="border-bottom pb-5">
        <div className="bg-light py-1">
          <div className="container">
            <div className="row">
              {/* left text */}
              <div className="col-md-10 col-12 d-flex" style={{ alignItems: "center" }}>
                <span> Super Value Deals - Save more with coupons</span>
              </div>

              {/* right icons */}
              <div className="col-md-2 col-xxl-1 text-end d-none d-lg-block" style={{ marginLeft: "20px" }}>
                <div className="list-inline">
                  {/* wishlist */}
                  <div className="list-inline-item">
                    <Link to="/ShopWishList" className="text-muted position-relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">5</span>
                    </Link>
                  </div>

                  {/* account */}

                  <div className="list-inline-item">
                    <Link to="/MyAccountSignIn" className="text-muted" data-bs-toggle="modal" data-bs-target="#userModal">
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx={12} cy={7} r={4} />
                      </svg>
                    </Link>
                  </div>

                  {/* cart */}
                  <div className="list-inline-item">
                    <Link to="#" className="text-muted position-relative" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" role="button" aria-controls="offcanvasRight">
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">{cartItems.length}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* end top bar */}

      {/* =============== SEARCH ROW =============== */}
      <div className="container displaydesign">
        <div className="row g-4">
          <div className="col-8 col-sm-4 col-lg-9 py-2">
            <input className="form-control" style={{ width: "100%" }} list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
          </div>

          <div className="col-4 col-sm-4 col-lg-3 py-2 d-flex" style={{ justifyContent: "center" }}>
            <div className="list-inline">
              <div className="list-inline-item">
                <Link to="/ShopWishList" className="text-muted position-relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">5</span>
                </Link>
              </div>

              <div className="list-inline-item">
                <Link to="/MyAccountSignIn" className="text-muted" data-bs-toggle="modal" data-bs-target="#userModal">
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx={12} cy={7} r={4} />
                  </svg>
                </Link>
              </div>

              <div className="list-inline-item">
                <Link to="#" className="text-muted position-relative" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" role="button" aria-controls="offcanvasRight">
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">{cartItems.length}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =============== NAVBAR =============== */}
      <nav className="navbar navbar-expand-lg navbar-light sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/Grocery-react/">
            <img src={Grocerylogo} style={{ width: 200, marginBottom: 10, marginLeft: "-15px" }} alt="eCommerce HTML Template" />
          </Link>

          <input className="form-control responsivesearch" list="datalistOptions" id="exampleDataList2" placeholder="Type to search..." style={{ width: "35%" }} />

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile_nav" aria-controls="mobile_nav" aria-expanded="false" aria-label="Toggle navigation">
            <div className={`containerr ${isOpen ? "change" : ""}`} onClick={handleClick}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </button>

          <div className="collapse navbar-collapse" id="mobile_nav">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0 float-md-right"></ul>
            <ul className="navbar-nav navbar-light">
              <li className="nav-item dmenu dropdown">
                <Link className="nav-link dropdown-toggle" to="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="me-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </span>{" "}
                  All Departments
                </Link>

                <div className="dropdown-menu sm-menu" aria-labelledby="navbarDropdown">
                  <Link className="dropdown-item" to="/Shop">Dairy, Bread &amp; Eggs</Link>
                  <Link className="dropdown-item" to="/Shop">Snacks &amp; Munchies</Link>
                  <Link className="dropdown-item" to="/Shop">Fruits &amp; Vegetables</Link>
                  <Link className="dropdown-item" to="/Shop">Cold Drinks &amp; Juices</Link>
                  <Link className="dropdown-item" to="/Shop">Breakfast &amp; Instant Food</Link>
                  <Link className="dropdown-item" to="/Shop">Bakery &amp; Biscuits</Link>
                  <Link className="dropdown-item" to="/Shop">Chicken, Meat &amp; Fish</Link>
                </div>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/Grocery-react/">Home</Link>
              </li>

              <li className="nav-item dmenu dropdown">
                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">About</Link>
                <div className="dropdown-menu sm-menu" aria-labelledby="navbarDropdown2">
                  <Link className="dropdown-item" to="/Blog">Blog</Link>
                  <Link className="dropdown-item" to="/BlogCategory">Blog Category</Link>
                  <Link className="dropdown-item" to="/AboutUs">About us</Link>
                  <Link className="dropdown-item" to="/Contact">Contact</Link>
                </div>
              </li>

              <li className="nav-item dmenu dropdown">
                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown3" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Shop</Link>
                <div className="dropdown-menu sm-menu" aria-labelledby="navbarDropdown3">
                  <Link className="dropdown-item" to="/Shop">Shop</Link>
                  <Link className="dropdown-item" to="/ShopWishList">Shop Wishlist</Link>
                  <Link className="dropdown-item" to="/ShopCart">Shop Cart</Link>
                  <Link className="dropdown-item" to="/ShopCheckOut">Shop Checkout</Link>
                </div>
              </li>

              <li className="nav-item dmenu dropdown">
                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown4" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Stores</Link>
                <div className="dropdown-menu sm-menu" aria-labelledby="navbarDropdown4">
                  <Link className="dropdown-item" to="/StoreList">Store List</Link>
                  <Link className="dropdown-item" to="/SingleShop">Single Store</Link>
                </div>
              </li>

              <li className="nav-item dropdown megamenu-li dmenu">
                <Link className="nav-link dropdown-toggle" to="/Shop" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">All Services</Link>
                <div className="dropdown-menu megamenu sm-menu border-top" aria-labelledby="dropdown01">
                  <div className="row">
                    <div className="col-sm-6 col-lg-3 border-right mb-4">
                      <h6 className="text-primary ps-3">Dairy, Bread &amp; Eggs</h6>
                      <Link className="dropdown-item" to="/Shop">Butter</Link>
                      <Link className="dropdown-item" to="/Shop">Milk Drinks</Link>
                      <Link className="dropdown-item" to="/Shop">Curd &amp; Yogurt</Link>
                      <Link className="dropdown-item" to="/Shop">Eggs</Link>
                      <Link className="dropdown-item" to="/Shop">Buns &amp; Bakery</Link>
                      <Link className="dropdown-item" to="/Shop">Cheese</Link>
                      <Link className="dropdown-item" to="/Shop">Condensed Milk</Link>
                      <Link className="dropdown-item" to="/Shop">Dairy Products</Link>
                    </div>

                    <div className="col-sm-6 col-lg-3 border-right mb-4">
                      <h6 className="text-primary ps-3">Breakfast &amp; Instant Food</h6>
                      <Link className="dropdown-item" to="/Shop">Breakfast Cereal</Link>
                      <Link className="dropdown-item" to="/Shop">Noodles, Pasta &amp; Soup</Link>
                      <Link className="dropdown-item" to="/Shop">Frozen Veg Snacks</Link>
                      <Link className="dropdown-item" to="/Shop">Frozen Non-Veg Snacks</Link>
                      <Link className="dropdown-item" to="/Shop">Vermicelli</Link>
                      <Link className="dropdown-item" to="/Shop">Instant Mixes</Link>
                      <Link className="dropdown-item" to="/Shop">Batter</Link>
                      <Link className="dropdown-item" to="/Shop">Fruit and Juices</Link>
                    </div>

                    <div className="col-sm-6 col-lg-3 mb-4">
                      <h6 className="text-primary ps-3">Cold Drinks &amp; Juices</h6>
                      <Link className="dropdown-item" to="/Shop">Soft Drinks</Link>
                      <Link className="dropdown-item" to="/Shop">Fruit Juices</Link>
                      <Link className="dropdown-item" to="/Shop">Coldpress</Link>
                      <Link className="dropdown-item" to="/Shop">Water &amp; Ice Cubes</Link>
                      <Link className="dropdown-item" to="/Shop">Soda &amp; Mixers</Link>
                      <Link className="dropdown-item" to="/Shop">Health Drinks</Link>
                      <Link className="dropdown-item" to="/Shop">Herbal Drinks</Link>
                      <Link className="dropdown-item" to="/Shop">Milk Drinks</Link>
                    </div>

                    <div className="col-sm-6 col-lg-3 border-right mb-4">
                      <div className="card border-0">
                        <img src={menubanner} style={{ width: "90%" }} alt="eCommerce" className="img-fluid rounded-3" />
                        <div className="position-absolute ps-6 mt-8">
                          <h5 className="mb-0">Dont miss this <br /> offer today.</h5>
                          <Link to="/Shop" className="btn btn-primary btn-sm mt-3">Shop Now</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item dmenu dropdown">
                <Link className="nav-link dropdown-toggle" to="" id="navbarDropdownAccount" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Account</Link>
                <div className="dropdown-menu sm-menu" aria-labelledby="navbarDropdownAccount">
                  <Link className="dropdown-item" to="/MyAccountSignIn">Sign in</Link>
                  <Link className="dropdown-item" to="/MyAccountSignUp">Signup</Link>
                  <Link className="dropdown-item" to="/MyAccountForgetPassword">Forgot Password</Link>
                  <Link className="dropdown-item" to="/MyAccountOrder">Orders</Link>
                  <Link className="dropdown-item" to="/MyAccountSetting">Settings</Link>
                  <Link className="dropdown-item" to="/MyAccountAddress">Address</Link>
                  <Link className="dropdown-item" to="/MyAccountAdminLogin">Admin Panel</Link>
                  <Link className="dropdown-item" to="/MyAcconutPaymentMethod">Payment Method</Link>
                  <Link className="dropdown-item" to="/MyAcconutNotification">Notification</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* =============== USER MODAL =============== */}
      <div className="modal fade" id="userModal" tabIndex={-1} aria-labelledby="userModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4">
            <div className="modal-header border-0">
              <h5 className="modal-title fs-3 fw-bold" id="userModalLabel">Sign Up</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Name</label>
                  <input type="text" className="form-control" id="fullName" placeholder="Enter Your Name" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="email" placeholder="Enter Email address" required />
                </div>
                <div className="mb-5">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Enter Password" required />
                  <small className="form-text">By Signup, you agree to our <Link to="/MyAcconutSignUp">Terms of Service</Link> &amp; <Link to="#!">Privacy Policy</Link></small>
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
              </form>
            </div>
            <div className="modal-footer border-0 justify-content-center">
              Already have an account? <Link to="/MyAccountSignIn">Sign in</Link>
            </div>
          </div>
        </div>
      </div>

      {/* =============== OFFCANVAS CART =============== */}
      <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header border-bottom">
          <div className="text-start">
            <h5 id="offcanvasRightLabel" className="mb-0 fs-4">Shop Cart</h5>
            <small>Location in 382480</small>
          </div>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>

        <div className="offcanvas-body">
          <div className="alert alert-danger" role="alert">You’ve got FREE delivery. Start checkout now!</div>

          <div className="py-3">
            {cartItems.length === 0 ? (
              <div className="alert alert-warning text-center">No products added.</div>
            ) : (
              <ul className="list-group list-group-flush">
                {cartItems.map((item) => (
                  <li key={item.productId || item._id} className="list-group-item py-3 px-0 border-top">
                    <div className="row align-items-center">
                      <div className="col-2">
                        <img src={item.image || productimage1} alt={item.name} className="img-fluid" />
                      </div>

                      <div className="col-5">
                        <h6 className="mb-0">{item.name}</h6>
                        <span><small className="text-muted">{item.qty} pcs</small></span>
                        <div className="mt-2 small">
                          <Link to="#!" className="text-decoration-none"
                            onClick={() => removeCartItem(item.productId || item._id)}

                          >
                            <span className="me-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </span>
                            Remove
                          </Link>
                        </div>
                      </div>

                      <div className="col-3">
                        <div className="input-group flex-nowrap justify-content-center">
                          {/* quantity controls could be wired later */}
                          <input type="button" defaultValue="-" className="button-minus form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0" data-field="quantity" />
                          <input type="number" step={1} max={10} defaultValue={item.qty || 1} name="quantity" className="quantity-field form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0" readOnly />
                          <input type="button" defaultValue="+" className="button-plus form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0" data-field="quantity" />
                        </div>
                      </div>

                      <div className="col-2 text-end">
                        <span className="fw-bold">₹{Number(item.price || 0) * Number(item.qty || 1)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="d-grid">
              <button className="btn btn-primary btn-lg d-flex justify-content-between align-items-center" onClick={handleCheckout}>
                Go to Checkout <span className="fw-bold">₹{calculateTotal()}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
