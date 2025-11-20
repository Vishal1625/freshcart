import Slider from "../models/Slider.js";

export const getSliders = async (req, res) => {
    try {
        const sliders = await Slider.find();
        res.json(sliders);
    } catch (error) {
        res.status(500).json({ message: "Slider Error" });
    }
};
