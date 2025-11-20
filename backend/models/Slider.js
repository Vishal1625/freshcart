import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
    title: String,
    desc: String,
    image: String,
    buttonText: String,
    link: String
});

export default mongoose.model("Slider", sliderSchema);
