import mongoose from "mongoose";

/* ===========================
   ORDER ITEM SCHEMA
=========================== */
const OrderItemSchema = new mongoose.Schema({
  productId: String,
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  image: String
});

/* ===========================
   TIMELINE SCHEMA
=========================== */
const TimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String, default: "" },
  time: { type: Date, default: Date.now },
});

/* ===========================
   DELIVERY SUB-SCHEMA
=========================== */
const DeliverySchema = new mongoose.Schema({
  assignedTo: String,
  driverPhone: String,
  currentLocation: {
    lat: Number,
    lng: Number,
  },
  etaMinutes: Number,
});

/* ===========================
   MAIN ORDER SCHEMA
=========================== */
const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },

    /* CUSTOMER DETAILS */
    customerName: String,
    email: String,
    mobile: String,

    address: {
      firstName: String,
      lastName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipcode: String,
    },

    /* ORDER ITEMS */
    items: [OrderItemSchema],

    /* PRICE */
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,

    /* PAYMENT */
    paymentMethod: { type: String, default: "COD" },
    paymentStatus: { type: String, default: "Pending" },

    /* STATUS */
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    orderDate: { type: Date, default: Date.now },
    deliveredDate: Date,

    /* TIMELINE */
    timeline: [TimelineSchema],

    /* DELIVERY INFO */
    delivery: DeliverySchema,
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
