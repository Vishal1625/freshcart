import React from "react";
import "./animated-check.css";
// optional lottie: import Lottie from "lottie-react";
// import successJson from "../lottie/success.json";

const AnimatedCheck = () => {
  return (
    <div className="check-wrapper">
      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
        <path className="checkmark__check" fill="none" d="M14 27 l7 7 17-17"/>
      </svg>
    </div>
  );
};

export default AnimatedCheck;
