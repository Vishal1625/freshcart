import Payment from "../models/Payment.js";

// ✅ Add new card
export const addPayment = async (req, res) => {
  try {
    const { userId, cardType, cardNumber, nameOnCard, expiryMonth, expiryYear, cvv } = req.body;

    if (!userId || !cardType || !cardNumber || !nameOnCard || !expiryMonth || !expiryYear || !cvv) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPayment = new Payment({
      userId,
      cardType,
      cardNumber,
      nameOnCard,
      expiryMonth,
      expiryYear,
      cvv,
    });

    await newPayment.save();

    res.status(201).json({ message: "✅ Card added successfully", data: newPayment });
  } catch (error) {
    console.error("Error adding card:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all cards for a user
export const getPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ userId });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete a specific card
export const deletePayment = async (req, res) => {
  try {
    const { cardId } = req.params;

    await Payment.findByIdAndDelete(cardId);
    res.status(200).json({ message: "🗑️ Card removed successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ message: "Server error" });
  }
};
