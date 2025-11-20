
import PDFDocument from "pdfkit";

export function generateInvoicePdf(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text("WoofIT - Invoice", { align: "left" });
      doc.moveDown();

      doc.fontSize(12).text(`Order ID: ${order.orderId}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
      doc.text(`Customer: ${order.user.name}`);
      doc.text(`Email: ${order.user.email}`);
      doc.text(`Phone: ${order.user.phone}`);
      doc.moveDown();

      // Address
      doc.fontSize(12).text("Delivery Address:");
      doc.text(order.user.address);
      doc.moveDown();

      // Table header
      doc.fontSize(12).text("Items:");
      doc.moveDown(0.5);

      const tableTop = doc.y;
      doc.fontSize(10);
      doc.text("Item", 40, tableTop);
      doc.text("Qty", 320, tableTop);
      doc.text("Price", 370, tableTop);
      doc.text("Total", 430, tableTop);
      doc.moveDown();

      order.items.forEach((it, i) => {
        const y = doc.y;
        doc.text(it.name, 40, y);
        doc.text(it.qty.toString(), 320, y);
        doc.text(`₹${it.price}`, 370, y);
        doc.text(`₹${(it.qty * it.price).toFixed(2)}`, 430, y);
        doc.moveDown();
      });

      doc.moveDown();
      doc.text(`Subtotal: ₹${order.subtotal}`, { align: "right" });
      doc.text(`Shipping: ₹${order.shipping}`, { align: "right" });
      doc.text(`Tax: ₹${order.tax}`, { align: "right" });
      doc.moveDown();
      doc.fontSize(14).text(`Grand Total: ₹${order.total}`, { align: "right" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
