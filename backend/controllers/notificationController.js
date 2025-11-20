import Notification from "../models/Notification.js";

// ✅ Save or Update Notification Preferences
export const saveNotification = async (req, res) => {
  try {
    const { userId, settings } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedSettings = await Notification.findOneAndUpdate(
      { userId },
      { $set: settings },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "✅ Notification preferences updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    console.error("Error saving notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Notification Preferences
export const getNotification = async (req, res) => {
  try {
    const { userId } = req.params;

    const settings = await Notification.findOne({ userId });
    if (!settings) {
      return res.status(404).json({ message: "No settings found" });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error getting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};
