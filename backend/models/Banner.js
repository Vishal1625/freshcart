import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    image: String,
    link: String
});

export default mongoose.model("Banner", bannerSchema);
