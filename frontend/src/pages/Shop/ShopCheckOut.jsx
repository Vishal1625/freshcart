import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import ScrollToTop from "../ScrollToTop";
import { MagnifyingGlass } from "react-loader-spinner";

axios.defaults.baseURL = "http://localhost:5000";

const ShopCheckOut = () => {
  // ❗ FIX — Hooks must be inside component ONLY
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const userId = localStorage.getItem("userId") || "USER123";
  const buyNowProduct = location.state?.buyNowProduct || null;

  const [loaderStatus, setLoaderStatus] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartAmount, setCartAmount] = useState(0);

  // Address fields
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

  // -----------------------------
  // COUPON APPLY
  // -----------------------------
  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return alert("Enter a coupon code");

    try {
      const res = await axios.post("/api/offers/validate", {
        code: coupon.trim(),
        subtotal: cartAmount,
      });

      if (!res.data.valid) return alert("Invalid or expired coupon");

      const off = res.data.offer;
      let disc = off.type === "PERCENT"
        ? (cartAmount * off.value) / 100
        : off.value;

      if (off.maxDiscount && disc > off.maxDiscount) disc = off.maxDiscount;

      setDiscount(disc);
      setAppliedCoupon(off.code);
      alert(`Coupon applied! You saved ₹${disc}`);
    } catch (err) {
      console.log(err);
      alert("Coupon error");
    }
  };

  // -----------------------------
  // FETCH ADDRESSES
  // -----------------------------
  const fetchAddresses = useCallback(async () => {
    try {
      const res = await axios.get(`/api/checkout/address/${userId}`);
      setAddresses(res.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, [userId]);

  // -----------------------------
  // FETCH CART ITEMS
  // -----------------------------
  const fetchCart = async () => {
    if (buyNowProduct) {
      setCartItems([{ ...buyNowProduct, qty: 1 }]);
      setCartAmount(buyNowProduct.price);
      return;
    }

    try {
      const res = await axios.get(`/api/cart/${userId}`);
      const convertedItems = res.data.items.map((item) => ({
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        qty: item.qty,
        img: item.productId.images?.[0],
        category: item.productId.category,
      }));

      setCartItems(convertedItems);
      setCartAmount(res.data.totalAmount);
      setCartTotal(res.data.totalAmount);
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    fetchAddresses();
    fetchCart();
    setTimeout(() => setLoaderStatus(false), 1000);
  }, []);

  // -----------------------------
  // SAVE ADDRESS
  // -----------------------------
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

        // Reset fields
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

  // -----------------------------
  // SAVE DELIVERY INSTRUCTION
  // -----------------------------
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

  // -----------------------------
  // PLACE ORDER
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!paymentMethod) return alert("Please select a payment method.");
    if (addresses.length === 0) return alert("Please add an address.");

    setOrderLoading(true);

    const payload = {
      userId,
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      address: addresses[0],
      instruction: deliveryInstruction,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === "COD" ? "Pending" : "Processing",
      },
      totalAmount: cartAmount - discount,
    };

    try {
      const res = await axios.post("/api/checkout/place-order", payload);
      setOrderLoading(false);

      if (res.data.success) {
        alert("Order placed successfully!");
        navigate("/order-confirmation");
      } else {
        alert("Order failed!");
      }
    } catch (err) {
      console.log(err);
      setOrderLoading(false);
    }
  };

  return (
    <div>
      {loaderStatus ? (
        <div className="loader-container text-center my-5">
          <MagnifyingGlass height="100" width="100" color="#0aad0a" />
        </div>
      ) : (
        <>
          <ScrollToTop />
          <div className="container my-5">
            <h2 className="mb-4">Checkout</h2>

            {/* SAVED ADDRESSES */}
            <h4>Saved Addresses</h4>
            {addresses.length === 0 ? (
              <p>No saved addresses.</p>
            ) : (
              addresses.map((addr, i) => (
                <div key={i} className="p-3 border rounded mb-2 bg-light">
                  <strong>{addr.firstName} {addr.lastName}</strong><br />
                  {addr.addressLine1}, {addr.city}, {addr.state}<br />
                  {addr.zipcode}
                </div>
              ))
            )}

            {/* ADD ADDRESS FORM */}
            <h4 className="mt-4">Add New Address</h4>

            <div className="row">
              {/* Inputs */}
              {/* ... (SAME UI CODE) ... */}

              <div className="col-md-12 mt-2">
                <button className="btn btn-success" onClick={handleSaveAddress}>
                  Save Address
                </button>
              </div>
            </div>

            {/* DELIVERY INSTRUCTIONS */}
            <h4 className="mt-4">Delivery Instructions</h4>
            <textarea
              className="form-control"
              rows="2"
              value={deliveryInstruction}
              onChange={(e) => setDeliveryInstruction(e.target.value)}
              placeholder="Provide any instructions for delivery..."
            ></textarea>

            <button className="btn btn-secondary mt-2" onClick={handleSaveInstruction}>
              Save Instruction
            </button>

            {/* PAYMENT */}
            <h4 className="mt-4">Payment Method</h4>
            <select
              className="form-select w-50"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment</option>
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI / QR</option>
              <option value="CARD">Card Payment</option>
            </select>

            {/* FINAL BUTTON */}
            <div className="mt-4 d-flex justify-content-end">
              <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder}>
                {orderLoading
                  ? "Placing Order..."
                  : `Place Order (₹${cartAmount - discount})`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopCheckOut;
