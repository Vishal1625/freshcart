import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import axios from "axios";
import Swal from "sweetalert2";

const USER_ID = "12345"; // Replace after login system
// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";

const ShopCart = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);

  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
  });

  // -------------------------------------------
  // Load Cart
  // -------------------------------------------
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${USER_ID}`);
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

  // -------------------------------------------
  // Remove Item
  // -------------------------------------------
  const removeItem = async (productId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/cart/remove", {
        userId: USER_ID,
        productId,
      });

      setCart(res.data);

      Swal.fire({
        icon: "success",
        title: "Removed from Cart",
        timer: 1000,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------------------------
  // Update Quantity
  // -------------------------------------------
  const updateQuantity = async (productId, qty) => {
    if (qty < 1 || qty > 10) return;

    try {
      const res = await axios.post("http://localhost:5000/api/cart/update", {
        userId: USER_ID,
        productId,
        qty,
      });

      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------------------------
  // Add to Wishlist
  // -------------------------------------------
  const handleAddToWishlist = async (item) => {
    try {
      await axios.post("http://localhost:5000/api/wishlist/add", {
        userId: USER_ID,
        productId: item.productId._id,
        name: item.productId.name,
        category: item.productId.category,
        price: item.productId.price,
        image: item.productId.image,
      });

      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        timer: 1500,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // LOADING
  if (loaderStatus) {
    return (
      <div className="loader-container">
        <MagnifyingGlass height="100" width="100" color="#0aad0a" />
      </div>
    );
  }

  return (
    <div>
      <ScrollToTop />

      <section className="mb-lg-14 mb-8 mt-8">
        <div className="container">

          {/* Heading */}
          <div className="row">
            <div className="col-12">
              <h1 className="fw-bold">Shop Cart</h1>
              <p className="mb-0">Shopping in 382480</p>
            </div>
          </div>

          <div className="row">
            {/* CART ITEMS */}
            <div className="col-lg-8 col-md-7">
              <div className="py-3">
                <ul className="list-group list-group-flush">
                  {(cart.items || []).map((item) => (
                    <li key={item.productId._id} className="list-group-item py-3 px-0 border-top">
                      <div className="row align-items-center">

                        {/* IMAGE */}
                        <div className="col-3 col-md-2">
                          <img src={item.productId.image} alt={item.productId.name} className="img-fluid" />
                        </div>

                        {/* DETAILS */}
                        <div className="col-4 col-md-6">
                          <h6 className="mb-0">{item.productId.name}</h6>
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

                        {/* QUANTITY */}
                        <div className="col-3 col-md-3 col-lg-2">
                          <div className="input-group justify-content-center">

                            <button
                              className="btn btn-light"
                              onClick={() =>
                                updateQuantity(item.productId._id, item.qty - 1)
                              }
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
                              onClick={() =>
                                updateQuantity(item.productId._id, item.qty + 1)
                              }
                            >
                              +
                            </button>

                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="col-2 text-end">
                          <span className="fw-bold">₹{item.price}</span>
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
                  <button className="btn btn-dark">Update Cart</button>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="col-lg-4 col-md-5">
              <div className="card p-4">
                <h2 className="h5 mb-4">Summary</h2>

                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Item Subtotal</span>
                    <span>₹{cart.totalAmount}</span>
                  </li>

                  <li className="list-group-item d-flex justify-content-between">
                    <span className="fw-bold">Subtotal</span>
                    <span className="fw-bold">₹{cart.totalAmount}</span>
                  </li>
                </ul>

                <div className="d-grid">
                  <Link to="/shopcheckout" className="btn btn-primary btn-lg">
                    Go to Checkout ₹{cart.totalAmount}
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
