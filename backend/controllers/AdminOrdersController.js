import Order from '../models/Order.js';


export const getAllOrdersAdmin = async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
};