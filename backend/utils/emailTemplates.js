// backend/utils/emailTemplates.js
export const generateOrderEmail = (order, forWhom = "customer") => {
  const itemsHtml = order.items.map(
    (it) => `<tr>
      <td style="padding:6px 8px;">${it.title} x ${it.quantity}</td>
      <td style="padding:6px 8px; text-align:right;">₹${(it.price*it.quantity).toFixed(2)}</td>
    </tr>`
  ).join("");

  const paymentInfo = order.paymentMethod === "UPI"
    ? `<p>UPI ID: <b>7856000970@ybl</b></p>`
    : order.paymentMethod === "BANK_TRANSFER"
      ? `<p>Bank Transfer details:<br/>A/C: <b>35062647809</b><br/>IFSC: <b>SBIN0003127</b></p>`
      : `<p>Cash on Delivery selected.</p>`;

  const html = `
    <div style="font-family:Arial, Helvetica, sans-serif; color:#222;">
      <h2>Order ${order._id}</h2>
      <p>Hi ${order.billing.name},</p>
      <p>Thanks for your order. Here are the details:</p>

      <table width="100%" style="border-collapse:collapse;">
        ${itemsHtml}
      </table>

      <p><b>Total:</b> ₹${order.totalAmount.toFixed(2)}</p>
      <p><b>Payment method:</b> ${order.paymentMethod}</p>
      ${paymentInfo}

      <h4>Shipping Address</h4>
      <p>
        ${order.billing.addressLine1 || ""} ${order.billing.addressLine2 || ""}, <br/>
        ${order.billing.city || ""} - ${order.billing.pincode || ""}<br/>
        ${order.billing.state || ""}
      </p>

      <p>Order Date: ${new Date(order.createdAt).toLocaleString()}</p>
      <hr/>
      <p style="font-size:12px;color:#666">This is an automated email.</p>
    </div>
  `;
  return html;
};
