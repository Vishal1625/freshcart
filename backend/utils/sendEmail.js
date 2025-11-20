import nodemailer from "nodemailer";

/* ============================================================
   GENERAL EMAIL SENDER (Default Export)
============================================================ */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

  } catch (err) {
    console.log("sendEmail error:", err.message);
  }
};

/* ============================================================
   ORDER CONFIRMATION EMAIL (Named Export)
============================================================ */
export const sendOrderEmail = async (user, order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.OWNER_EMAIL,       // your Gmail
        pass: process.env.OWNER_EMAIL_PASS,  // Gmail app password
      },
    });

    const orderSummary = order.items
      .map(
        (item) =>
          `${item.name} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}`
      )
      .join("<br>");

    const htmlContent = `
      <h2>Order Confirmation - WoofIT</h2>
      <p>Thank you, ${user.name}! Your order has been placed successfully.</p>

      <h3>Order Details:</h3>
      <p><strong>Delivery Slot:</strong> ${order.deliverySlot || "Not selected"}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod || "COD"}</p>
      <p><strong>Total:</strong> ₹${order.totalAmount}</p>

      <h4>Items:</h4>
      <p>${orderSummary}</p>

      <hr>
      <p>We will notify you once your order is out for delivery 🚚</p>
    `;

    await transporter.sendMail({
      from: process.env.OWNER_EMAIL,
      to: [user.email, process.env.OWNER_EMAIL], // customer + owner
      subject: "Your WoofIT Order Confirmation",
      html: htmlContent,
    });

  } catch (error) {
    console.log("sendOrderEmail error:", error.message);
  }
};

/* ============================================================
   DEFAULT EXPORT
============================================================ */
export default sendEmail;
