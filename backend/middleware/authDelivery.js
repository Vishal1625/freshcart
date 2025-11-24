import jwt from "jsonwebtoken";
import DeliveryBoy from "../models/DeliveryBoy.js";


const authDelivery = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.delivery = await DeliveryBoy.findById(decoded.id).select("-password");

        if (!req.delivery) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authDelivery;
