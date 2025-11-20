import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    // Email Notifications
    weeklyNotification: { type: Boolean, default: false },
    accountSummary: { type: Boolean, default: false },

    // Order Updates
    textMessages: { type: Boolean, default: false },
    callBeforeCheckout: { type: Boolean, default: false },

    // Website Notifications
    newFollower: { type: Boolean, default: false },
    postLike: { type: Boolean, default: false },
    someonePosted: { type: Boolean, default: false },
    postAddedToCollection: { type: Boolean, default: false },
    orderDelivery: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
