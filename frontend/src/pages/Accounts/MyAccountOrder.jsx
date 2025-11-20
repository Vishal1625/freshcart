import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import productimg1 from "../../images/product-img-1.jpg";
import productimg2 from "../../images/product-img-2.jpg";
import productimg3 from "../../images/product-img-3.jpg";
import productimg4 from "../../images/product-img-4.jpg";
import productimg5 from "../../images/product-img-5.jpg";
import productimg6 from "../../images/product-img-6.jpg";
import { MagnifyingGlass } from "react-loader-spinner";
import axios from "axios";
import ScrollToTop from "../ScrollToTop";

// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";

const MyAccountOrder = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
      <ScrollToTop />

      <section>
        <div className="container">
          <div className="row">

            {/* MOBILE HEADER */}
            <div className="col-12">
              <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                <h3 className="fs-5 mb-0">Account Setting</h3>
                <button
                  className="btn btn-outline-gray-400 text-muted d-md-none"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasAccount"
                  aria-controls="offcanvasAccount"
                >
                  <i className="fas fa-bars"></i>
                </button>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
              <div className="pt-10 pe-lg-10">
                <ul className="nav flex-column nav-pills nav-pills-dark">

                  <li className="nav-item">
                    <Link className="nav-link active" to="/MyAccountOrder">
                      <i className="fas fa-shopping-bag me-2" />
                      Your Orders
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountSetting">
                      <i className="fas fa-cog me-2" />
                      Settings
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountAddress">
                      <i className="fas fa-map-marker-alt me-2" />
                      Address
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAcconutPaymentMethod">
                      <i className="fas fa-credit-card me-2" />
                      Payment Method
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAcconutNotification">
                      <i className="fas fa-bell me-2" />
                      Notification
                    </Link>
                  </li>

                  <li className="nav-item">
                    <hr />
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/Grocery-react/">
                      <i className="fas fa-sign-out-alt me-2" />
                      Log out
                    </Link>
                  </li>

                </ul>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="col-lg-9 col-md-8 col-12">
              {loaderStatus ? (
                <div className="loader-container text-center">
                  <MagnifyingGlass
                    visible={true}
                    height="100"
                    width="100"
                    ariaLabel="magnifying-glass-loading"
                    wrapperClassName="magnifying-glass-wrapper"
                    glassColor="#c0efff"
                    color="#0aad0a"
                  />
                </div>
              ) : (
                <div className="p-6 p-lg-10">
                  <h2 className="mb-6">Your Orders</h2>

                  <div className="table-responsive border-0">
                    <table className="table mb-0 text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th>&nbsp;</th>
                          <th>Product</th>
                          <th>Order</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Status</th>
                          <th>Amount</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        {/* Example Order Rows */}
                        <tr>
                          <td className="align-middle">
                            <Link to="#">
                              <img src={productimg1} alt="product" className="icon-shape icon-xl" />
                            </Link>
                          </td>

                          <td className="align-middle">
                            <Link to="#" className="fw-semi-bold text-inherit">
                              <h6 className="mb-0">Haldiram's Nagpur Aloo Bhujia</h6>
                            </Link>
                            <small className="text-muted">400g</small>
                          </td>

                          <td className="align-middle">
                            <Link to="#" className="text-inherit">#14899</Link>
                          </td>

                          <td className="align-middle">March 5, 2023</td>

                          <td className="align-middle">1</td>

                          <td className="align-middle">
                            <span className="badge bg-warning">Processing</span>
                          </td>

                          <td className="align-middle">$15.00</td>

                          <td className="text-muted align-middle">
                            <Link to="#" className="text-inherit">
                              <i className="feather-icon icon-eye" />
                            </Link>
                          </td>
                        </tr>

                        {/* More static rows unchanged */}
                        {/* ...existing rows remain same... */}

                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* OFFCANVAS MENU MOBILE */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="offcanvasAccount"
        aria-labelledby="offcanvasAccountLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasAccountLabel">
            My Account
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
        </div>

        <div className="offcanvas-body">
          <ul className="nav flex-column nav-pills nav-pills-dark">

            <li className="nav-item">
              <Link className="nav-link active" to="/MyAccountOrder">
                <i className="fas fa-shopping-bag me-2" />
                Your Orders
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/MyAccountSetting">
                <i className="fas fa-cog me-2" />
                Settings
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/MyAccountAddress">
                <i className="fas fa-map-marker-alt me-2" />
                Address
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/MyAcconutPaymentMethod">
                <i className="fas fa-credit-card me-2" />
                Payment Method
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/MyAcconutNotification">
                <i className="fas fa-bell me-2" />
                Notification
              </Link>
            </li>

          </ul>

          <hr />

          <ul className="nav flex-column nav-pills nav-pills-dark">
            <li className="nav-item">
              <Link className="nav-link" to="/Grocery-react/">
                <i className="fas fa-sign-out-alt me-2" />
                Log out
              </Link>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default MyAccountOrder;
