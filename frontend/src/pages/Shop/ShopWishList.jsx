import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import productimage18 from "../../images/product-img-18.jpg";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";
const ShopWishList = () => {
  const userId = localStorage.getItem("userId");

  const [loaderStatus, setLoaderStatus] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  // ADD TO CART API

  // ADD TO CART + REMOVE FROM WISHLIST
  const handleAddToCart = async (product) => {
    const { _id: productId, name: productName, price, image } = product;

    try {
      // 1️⃣ Add to Cart
      await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        productId,
        name: productName,
        price,
        image,
      });

      // 2️⃣ Remove from Wishlist
      await axios.delete(
        `http://localhost:5000/api/wishlist/remove/${userId}/${productId}`
      );

      // 3️⃣ Alert
      alert("Added to cart & removed from wishlist!");

      // If you use dynamic wishlist, refresh data here:
      // fetchWishlist();

    } catch (err) {
      alert("Failed to add to cart");
    }
  };

  // REMOVE FROM WISHLIST
  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/wishlist/remove/${userId}/${productId}`
      );

      alert("Removed from wishlist!");

      // refresh UI if needed:
      // fetchWishlist();
    } catch (err) {
      alert("Failed to remove");
    }
  };


  return (
    <div>
      <div>
        {loaderStatus ? (
          <div className="loader-container">
            <MagnifyingGlass
              visible={true}
              height="100"
              width="100"
              ariaLabel="magnifying-glass-loading"
              glassColor="#c0efff"
              color="#0aad0a"
            />
          </div>
        ) : (
          <>
            <ScrollToTop />

            <section className="my-14">
              <div className="container">
                <div className="row">
                  <div className="offset-lg-1 col-lg-10">
                    <div className="mb-8">
                      <h1 className="mb-1">My Wishlist</h1>
                      <p>There are 5 products in this wishlist.</p>
                    </div>

                    <div className="table-responsive">
                      <table className="table text-nowrap">
                        <thead className="table-light">
                          <tr>
                            <th></th>
                            <th></th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th>Remove</th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* STATIC PRODUCT ROW (You can make dynamic later) */}
                          <tr>
                            <td className="align-middle">
                              <input type="checkbox" className="form-check-input" />
                            </td>

                            <td className="align-middle">
                              <Link to="#">
                                <img
                                  src={productimage18}
                                  className="img-fluid icon-shape icon-xxl"
                                  alt="product"
                                />
                              </Link>
                            </td>

                            <td className="align-middle">
                              <h5 className="fs-6 mb-0">
                                <Link to="#" className="text-inherit">
                                  Organic Banana
                                </Link>
                              </h5>
                              <small>₹98 / lb</small>
                            </td>

                            <td className="align-middle">₹35.00</td>

                            <td className="align-middle">
                              <span className="badge bg-success">In Stock</span>
                            </td>

                            <td className="align-middle">

                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  handleAddToCart({
                                    _id: "123",
                                    name: "Organic Banana",
                                    price: 35,
                                    image: productimage18,
                                  })
                                }
                              >
                                Add to Cart
                              </button>
                            </td>


                            <td className="align-middle text-center">
                              <button
                                className="btn btn-link text-muted"
                                onClick={() => handleRemoveFromWishlist("123")}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>

                          {/* Add more static rows if needed */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopWishList;
