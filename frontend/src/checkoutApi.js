import axios from "axios";
// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";

const API = "http://localhost:5000/api/checkout"; // your backend url

export const saveAddress = (data) => axios.post(`${API}/address/save`, data);

export const getAddresses = (userId) =>
  axios.get(`${API}/address/${userId}`);

export const deleteAddress = (data) =>
  axios.post(`${API}/address/delete`, data);

export const saveInstruction = (data) =>
  axios.post(`${API}/instruction/save`, data);

export const savePaymentMethod = (data) =>
  axios.post(`${API}/payment/save`, data);

export const placeOrder = (data) =>
  axios.post(`${API}/place-order`, data);
