import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import axios from "axios";
import Swal from "sweetalert2";

axios.defaults.baseURL = "http://localhost:5000";

const USER_ID = "12345"; // change after login

const ShopCart = () => {
  const navigate = useNavigate();

  const [loaderStatus, setLoaderStatus] = useState(true);
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
  });

  // -----------------------------
  // FORMAT IMAGE
  // -----------------------------
  const getImage = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `http://localhost:5000${img}`;
  };

  // -----------------------------
  // LOAD CART
  // -----------------------------
  const fetchCart = async () => {
    try {
      const res = await axios.get(`/api/cart/${USER_ID}`);
      setCart(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoaderStatus(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // -----------------------------
  // REMOVE ITEM
  // -----------------------------
  const removeItem = async (pid) => {
    try {
      const res = await axios.post(`/api/cart/remove`, {
        userId: USER_ID,
        productId: pid,
      });

      setCart(res.data);

      Swal.fire({
        icon: "success",
        title: "Item Removed",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // -----------------------------
  // UPDATE QTY
  // -----------------------------
  const updateQuantity = async (pid, qty) => {
    if (qty < 1 || qty > 10) return;

    try {
      const res = await axios.post(`/api/cart/update`, {
        userId: USER_ID,
        productId: pid,
        qty,
      });

      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------------
  // ADD TO WISHLIST
  // -----------------------------
  const handleAddToWishlist = async (item) => {
    try {
      await axios.post(`/api/wishlist/add`, {
        userId: USER_ID,
        productId: item.productId._id,
        name: item.productId.name,
        category: item.productId.category,
        price: item.productId.price,
        image: item.productId.images?.[0], // FIXED
      });

      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loaderStatus) {
    return (
      <div className="loader-container">
        <MagnifyingGlass height="100" width="100" color="#0aad0a" />
      </div>
    );
  }

  // -----------------------------
  // EMPTY CART UI
  // -----------------------------
  if (cart.items.length === 0) {
    return (
      <div className="container text-center py-5">
        <h2>Your Cart is Empty 😕</h2>
        <Link to="/shop" className="btn btn-primary mt-3">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ScrollToTop />

      <section className="mb-lg-14 mb-8 mt-8">
        <div className="container">

          {/* Heading */}
          <h1 className="fw-bold">Shop Cart</h1>
          <p className="mb-4">Shopping in 382480</p>

          <div className="row">

            {/* LEFT — ITEMS */}
            <div className="col-lg-8 col-md-7">
              <ul className="list-group list-group-flush">
                {cart.items.map((item) => (
                  <li key={item.productId._id} className="list-group-item py-3 px-0 border-top">
                    <div className="row align-items-center">

                      {/* IMAGE */}
                      <div className="col-3 col-md-2">
                        <img
                          src={getImage(item.productId.images?.[0])}
                          alt={item.productId.name}
                          className="img-fluid rounded"
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="col-4 col-md-6">
                        <h6>{item.productId.name}</h6>
                        <small className="text-muted">{item.productId.category}</small>

                        <div className="mt-2 small">
                          <button
                            className="btn btn-link text-danger p-0"
                            onClick={() => removeItem(item.productId._id)}
                          >
                            Remove
                          </button>

                          <button
                            className="btn btn-warning btn-sm ms-2"
                            onClick={() => handleAddToWishlist(item)}
                          >
                            Wishlist
                          </button>
                        </div>
                      </div>

                      {/* QTY */}
                      <div className="col-3 col-md-3 col-lg-2">
                        <div className="input-group justify-content-center">
                          <button
                            className="btn btn-light"
                            onClick={() => updateQuantity(item.productId._id, item.qty - 1)}
                          >
                            -
                          </button>

                          <input
                            type="number"
                            value={item.qty}
                            className="form-control text-center"
                            min="1"
                            max="10"
                            onChange={(e) =>
                              updateQuantity(item.productId._id, Number(e.target.value))
                            }
                          />

                          <button
                            className="btn btn-light"
                            onClick={() => updateQuantity(item.productId._id, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="col-2 text-end">
                        <span className="fw-bold">₹{item.productId.price * item.qty}</span>
                      </div>

                    </div>
                  </li>
                ))}
              </ul>

              {/* BUTTONS */}
              <div className="d-flex justify-content-between mt-4">
                <Link to="/shop" className="btn btn-primary">
                  Continue Shopping
                </Link>

                <button className="btn btn-dark" onClick={fetchCart}>
                  Refresh Cart
                </button>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="col-lg-4 col-md-5">
              <div className="card p-4">
                <h2 className="h5 mb-4">Summary</h2>

                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Items Total</span>
                    <span>₹{cart.totalAmount}</span>
                  </li>

                  <li className="list-group-item d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>₹{cart.totalAmount}</span>
                  </li>

                  {discount > 0 && (
                    <li className="list-group-item d-flex justify-content-between text-success">
                      <span>Discount ({appliedCoupon})</span>
                      <span>-₹{discount}</span>
                    </li>
                  )}

                  <li className="list-group-item d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">₹{cart.totalAmount - discount}</span>
                  </li>


                  <li className="list-group-item d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">₹{cart.totalAmount - discount}</span>
                  </li>

                </ul>

                <div className="d-grid">
                  <Link
                    to="/shopcheckout"
                    state={{ appliedCoupon, discount }}
                    className="btn btn-primary btn-lg"
                  >
                    Go to Checkout ₹{cart.totalAmount - discount}
                  </Link>

                </div>

                <p className="mt-2 text-muted small">
                  By placing your order, you agree to our Terms & Privacy Policy.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopCart;
