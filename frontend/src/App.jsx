import axios from "axios";

import React, { useEffect } from "react";

// css
import "./App.css";
// browserrouter 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Components
import Header from './Component/Header.jsx';
import Footer from "./Component/Footer.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

// pages
import Home from "./pages/Home.jsx";
// About pages
import AboutUs from "./pages/About/AboutUs.jsx";

import Blog from "./pages/About/Blog.jsx";
import BlogCategory from "./pages/About/BlogCategory.jsx";
import Contact from "./pages/About/Contact.jsx";
// Shop pages
import Shop from "./pages/Shop/Shop.jsx";
import ShopGridCol3 from "./pages/Shop/ShopGridCol3.jsx";
import ShopListCol from "./pages/Shop/ShopListCol.jsx";
import ShopCart from "./pages/Shop/ShopCart.jsx";
import ShopCheckOut from "./pages/Shop/ShopCheckOut.jsx";
import ShopWishList from "./pages/Shop/ShopWishList.jsx";
// Store pages
import StoreList from "./pages/store/StoreList.jsx";
import SingleShop from "./pages/store/SingleShop.jsx";
// Account pages
import MyAccountOrder from "./pages/Accounts/MyAccountOrder.jsx";
import MyAccountSetting from "./pages/Accounts/MyAcconutSetting.jsx";
import MyAcconutNotification from "./pages/Accounts/MyAcconutNotification.jsx";
import MyAcconutPaymentMethod from "./pages/Accounts/MyAcconutPaymentMethod.jsx";
import MyAccountAddress from "./pages/Accounts/MyAccountAddress.jsx";
import MyAccountForgetPassword from "./pages/Accounts/MyAccountForgetPassword.jsx";
import MyAccountSignIn from "./pages/Accounts/MyAccountSignIn.jsx";
import MyAccountSignUp from "./pages/Accounts/MyAccountSignUp.jsx";
import AdminHome from "./pages/Accounts/AdminHome.jsx";

import TrackOrder from "./pages/TrackOrder.jsx";
import OrderConfirmation from "./pages/Shop/OrderConfirmation.jsx";

const App = () => {

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:5000");
        console.log(res.data);
      } catch (error) {
        console.log("Server error:", error.message);
      }
    };

    getData();
  }, []);


  return (
    <div>
      <Router>
        <Header />
        <Routes>

          <Route path="/Grocery-react/" element={<Home />} />
          {/* Shop pages */}
          <Route path="/Shop" element={<Shop />} />
          <Route path="/ShopGridCol3" element={<ShopGridCol3 />} />
          <Route path="/ShopListCol" element={<ShopListCol />} />
          <Route path="/ShopWishList" element={<ShopWishList />} />
          <Route path="/ShopCheckOut" element={<ShopCheckOut />} />
          <Route path="/ShopCart" element={<ShopCart />} />
          {/* Store pages */}
          <Route path="/StoreList" element={<StoreList />} />
          <Route path="/SingleShop" element={<SingleShop />} />
          {/* Accounts pages */}
          <Route path="/MyAccountOrder" element={<MyAccountOrder />} />
          <Route path="/MyAccountSetting" element={<MyAccountSetting />} />
          <Route path="/MyAcconutNotification" element={<MyAcconutNotification />} />
          <Route path="/MyAcconutPaymentMethod" element={<MyAcconutPaymentMethod />} />
          <Route path="/MyAccountAddress" element={<MyAccountAddress />} />
          <Route path="/MyAccountForgetPassword" element={<MyAccountForgetPassword />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/MyAccountSignIn" element={<MyAccountSignIn />} />
          <Route path="/MyAccountSignUp" element={<MyAccountSignUp />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* About pages */}
          <Route path="/Blog" element={<Blog />} />
          <Route path="/BlogCategory" element={<BlogCategory />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/shopcheckout" element={<ShopCheckOut />} />

        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
