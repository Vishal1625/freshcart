import mongoose from "mongoose";

/* ===========================
   ORDER ITEM SCHEMA
=========================== */
const OrderItemSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },

  userId: { type: String, required: true },
  customerName: String,
  mobile: String,

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
    userId: { type: String, required: true },
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
      lat: Number,  // for heatmap
      lng: Number,
    },

    /* ORDER ITEMS */
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        qty: Number,
        price: Number,
      }
    ],

    /* PRICE */
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    discount: { type: Number, default: 0 },
    appliedOfferCode: String,
    /* PAYMENT */
    paymentMethod: {
      type: String, //cod/upi/card},
      paymentStatus: { type: String, default: "Pending" },
      transactionId: String,
      /* STATUS */
      status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
      },
      address: {
        firstName: String,
        lastName: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        zipcode: String,
      },

      instruction: { type: String, default: "" },

      status: {
        type: String,
        default: "Pending", // Pending → Processing → Shipped → Delivered
      },
      deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryAgent" },

      createdAt: { type: Date, default: Date.now },
      deliveredDate: Date
    },
    appliedOfferCode: String,
    orderDate: { type: Date, default: Date.now },
    deliveredDate: Date,
    instruction: String,

    /* TIMELINE */
    timeline: [{
      status: String,
      note: String,
      createdAt: { type: Date, default: Date.now },
    },],

    /* DELIVERY INFO */
    delivery: DeliverySchema,
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
