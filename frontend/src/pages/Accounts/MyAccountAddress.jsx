import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import axios from "axios";

// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";

const MyAccountAddress = () => {
  // Loader state
  const [loaderStatus, setLoaderStatus] = useState(true);

  // Address form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Gujarat");
  const [country, setCountry] = useState("India");
  const [zipCode, setZipCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Show loader for 1.5s
  useEffect(() => {
    setTimeout(() => setLoaderStatus(false), 1500);
  }, []);

  // ============================================================
  // ✅ Save Address (POST to backend)
  // ============================================================
  const handleSaveAddress = async () => {
    const addressData = {
      userId: "12345", // TODO: Replace with actual logged-in userId
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      zipCode,
      isDefault,
    };

    try {
      const response = await axios.post("/api/address/add", addressData);

      if (response.data.success) {
        alert("✅ Address Added Successfully!");

        // Clear fields
        setFirstName("");
        setLastName("");
        setAddressLine1("");
        setAddressLine2("");
        setCity("");
        setZipCode("");
        setIsDefault(false);

        // Close modal safely
        const modal = document.getElementById("addAddressModal");
        const backdrop = document.querySelector(".modal-backdrop");
        if (modal) modal.classList.remove("show");
        if (backdrop) backdrop.remove();
        document.body.classList.remove("modal-open");
      } else {
        alert("❌ Failed to Add Address");
      }
    } catch (err) {
      console.error("Server Error:", err);
      alert("❌ Server Error");
    }
  };

  return (
    <div>
      <ScrollToTop />

      <section>
        <div className="container">
          <div className="row">

            {/* Sidebar */}
            <div className="col-lg-3 col-md-4 d-none d-md-block border-end">
              <div className="pt-10 pe-lg-10">
                <ul className="nav flex-column nav-pills nav-pills-dark">
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountOrder">
                      <i className="fas fa-shopping-bag me-2" /> Your Orders
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountSetting">
                      <i className="fas fa-cog me-2" /> Settings
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link active" to="/MyAccountAddress">
                      <i className="fas fa-map-marker-alt me-2" /> Address
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAcconutPaymentMethod">
                      <i className="fas fa-credit-card me-2" /> Payment Method
                    </Link>
                  </li>

                  <li className="nav-item">
                    <hr />
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/Grocery-react/">
                      <i className="fas fa-sign-out-alt me-2" /> Log out
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8 col-12">
              {loaderStatus ? (
                <div className="text-center p-5">
                  <MagnifyingGlass
                    visible={true}
                    height="100"
                    width="100"
                    glassColor="#c0efff"
                    color="#0aad0a"
                  />
                </div>
              ) : (
                <div className="p-6 p-lg-10">
                  <div className="d-flex justify-content-between mb-6">
                    <h2>Address</h2>

                    <button
                      className="btn btn-outline-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#addAddressModal"
                    >
                      Add a new address
                    </button>
                  </div>

                  {/* Saved Address Example */}
                  <div className="row">
                    <div className="col-lg-5 col-xxl-4 col-12 mb-4">
                      <div className="border p-4 rounded-3">
                        <div className="form-check mb-4">
                          <input
                            className="form-check-input"
                            type="radio"
                            defaultChecked
                          />
                          <label className="form-check-label fw-semibold">
                            Home
                          </label>
                        </div>

                        <p className="mb-3">
                          Jitu Chauhan <br />
                          4450 North Avenue, Oakland <br />
                          Gujarat, India <br />
                          402-776-1106
                        </p>

                        <button className="btn btn-info btn-sm">
                          Default address
                        </button>

                        <div className="mt-4">
                          <Link to="#" className="text-inherit me-3">
                            Edit
                          </Link>

                          <Link
                            to="#"
                            className="text-danger"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                          >
                            Delete
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================
          ADD ADDRESS MODAL
      ====================================================== */}
      <div
        className="modal fade"
        id="addAddressModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-body p-6">
              <div className="d-flex justify-content-between mb-4">
                <h5>New Shipping Address</h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              {/* Address Form */}
              <div className="row g-3">

                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address Line 1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address Line 2"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <select
                    className="form-select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option>India</option>
                    <option>UK</option>
                    <option>USA</option>
                    <option>UAE</option>
                  </select>
                </div>

                <div className="col-12">
                  <select
                    className="form-select"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option>Gujarat</option>
                    <option>Maharashtra</option>
                    <option>Uttar Pradesh</option>
                    <option>Tamil Nadu</option>
                    <option>Delhi</option>
                    <option>Karnataka</option>
                    <option>Punjab</option>
                  </select>
                </div>

                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                    />
                    <label className="form-check-label">Set as Default</label>
                  </div>
                </div>

                <div className="col-12 text-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-primary ms-2"
                    onClick={handleSaveAddress}
                  >
                    Save Address
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default MyAccountAddress;
