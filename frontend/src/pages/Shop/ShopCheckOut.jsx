import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ScrollToTop from "../ScrollToTop";
import { MagnifyingGlass } from "react-loader-spinner";

// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";

const ShopCheckOut = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "USER123";

  // ------------------------
  // STATES
  // ------------------------
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [addresses, setAddresses] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [deliveryInstruction, setDeliveryInstruction] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [orderLoading, setOrderLoading] = useState(false);

  // ------------------------------------------------------
  // 🔵 FETCH ADDRESSES
  // ------------------------------------------------------
  const fetchAddresses = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/checkout/address/${userId}`
      );
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, [userId]);

  // ------------------------------------------------------
  // 🔵 useEffect
  // ------------------------------------------------------
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1200);

    fetchAddresses();
  }, [fetchAddresses]);

  // ------------------------------------------------------
  // 🔵 SAVE ADDRESS
  // ------------------------------------------------------
  const handleSaveAddress = async () => {
    if (!firstName || !lastName || !addressLine1 || !city || !stateValue || !zipcode) {
      alert("Please fill all required fields.");
      return;
    }

    const address = {
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state: stateValue,
      zipcode,
      isDefault,
      type: "Home",
    };

    try {
      const res = await axios.post("/api/checkout/address/save", {
        userId,
        address,
      });

      if (res.data.success) {
        alert("Address saved successfully!");
        fetchAddresses();

        // Reset form
        setFirstName("");
        setLastName("");
        setAddressLine1("");
        setAddressLine2("");
        setCity("");
        setStateValue("");
        setZipcode("");
        setIsDefault(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ------------------------------------------------------
  // 🔵 SAVE DELIVERY INSTRUCTION
  // ------------------------------------------------------
  const handleSaveInstruction = async () => {
    try {
      await axios.post("/api/checkout/instruction/save", {
        userId,
        instruction: deliveryInstruction,
      });
      alert("Delivery instruction saved");
    } catch (err) {
      console.log(err);
    }
  };

  // ------------------------------------------------------
  // 🔵 PLACE ORDER (FINAL FIXED)
  // ------------------------------------------------------
  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setOrderLoading(true);

    // Correct payload structure matching backend
    const orderPayload = {
      userId,
      items: [
        { name: "Haldiram's Sev Bhujia", qty: 1, price: 50 },
        { name: "NutriChoice Digestive", qty: 1, price: 20 },
        { name: "5 Star Chocolate", qty: 1, price: 15 },
      ],
      paymentInfo: { method: paymentMethod },
      address: addresses[0] || null,
      instruction: deliveryInstruction,
      totalAmount: 73
    };

    try {
      const res = await axios.post("/api/checkout/place-order", orderPayload);

      setOrderLoading(false);

      if (res.data.success) {
        navigate("/order-confirmation");
      } else {
        alert("Order failed!");
      }
    } catch (err) {
      console.log(err);
      setOrderLoading(false);
    }
  };

  // ------------------------------------------------------
  // 🔵 RENDER
  // ------------------------------------------------------
  return (
    <div>
      {loaderStatus ? (
        <div className="loader-container text-center my-5">
          <MagnifyingGlass visible={true} height="100" width="100" />
        </div>
      ) : (
        <>
          <ScrollToTop />

          <div className="container my-5">

            <h3>Saved Addresses</h3>

            {addresses.length === 0 ? (
              <p>No saved addresses found.</p>
            ) : (
              addresses.map((addr, index) => (
                <div key={index} className="p-3 border rounded mb-2">
                  <strong>{addr.firstName} {addr.lastName}</strong>
                  <br />
                  {addr.addressLine1}, {addr.city}, {addr.state}
                  <br />
                  {addr.zipcode}
                </div>
              ))
            )}

            <h3 className="mt-4">Add New Address</h3>

            <div className="row">
              <div className="col-md-6 mb-2">
                <input type="text" className="form-control" placeholder="First Name"
                  value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>

              <div className="col-md-6 mb-2">
                <input type="text" className="form-control" placeholder="Last Name"
                  value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>

              <div className="col-md-12 mb-2">
                <input type="text" className="form-control" placeholder="Address Line 1"
                  value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
              </div>

              <div className="col-md-12 mb-2">
                <input type="text" className="form-control" placeholder="Address Line 2"
                  value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
              </div>

              <div className="col-md-6 mb-2">
                <input type="text" className="form-control" placeholder="City"
                  value={city} onChange={(e) => setCity(e.target.value)} />
              </div>

              <div className="col-md-6 mb-2">
                <input type="text" className="form-control" placeholder="State"
                  value={stateValue} onChange={(e) => setStateValue(e.target.value)} />
              </div>

              <div className="col-md-6 mb-2">
                <input type="text" className="form-control" placeholder="Zip Code"
                  value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
              </div>

              <div className="col-md-6 mb-2">
                <div className="form-check mt-2">
                  <input type="checkbox" className="form-check-input"
                    checked={isDefault} onChange={() => setIsDefault(!isDefault)} />
                  <label className="form-check-label">Set as default</label>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <button className="btn btn-success" onClick={handleSaveAddress}>
                  Save Address
                </button>
              </div>
            </div>

            <h3 className="mt-4">Delivery Instructions</h3>

            <textarea
              className="form-control"
              placeholder="Any delivery instructions?"
              value={deliveryInstruction}
              onChange={(e) => setDeliveryInstruction(e.target.value)}
            ></textarea>

            <button className="btn btn-secondary mt-2" onClick={handleSaveInstruction}>
              Save Instruction
            </button>

            <h3 className="mt-4">Payment Method</h3>

            <select
              className="form-select w-50"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment</option>
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
            </select>

            <div className="mt-4 d-flex justify-content-end">
              <button className="btn btn-primary" onClick={handlePlaceOrder}>
                {orderLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default ShopCheckOut;
