import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const data = await getAllOrders();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  const handleUpdate = async (id, status) => {
    await updateOrderStatus(id, status);
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    setOrders(orders.filter(o => o._id !== id));
  };

  return (
    <div className="orders-page">
      <h2>Orders Management</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.user.name}</td>
              <td>₹{o.total}</td>
              <td>{o.status}</td>
              <td>
                <button onClick={() => handleUpdate(o._id, "Delivered")}>Mark Delivered</button>
                <button onClick={() => handleDelete(o._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
