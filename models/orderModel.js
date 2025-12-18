const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  town: String,
  state: String,
  pincode: String,
  email: String,
  phone: String,
  lineItems: Array,
  totalWeight:Number,
  shippingCostKerala:Number,
  shippingCostOutside:Number,
  orderId: {
    type: String,
    unique: true
  },
  done: {
    type: Boolean,
    default: false
  },
  subTotal:Number,
  total: Number,
  paymentStatus: String
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { 'orderId': -1 } });
    let nextOrderId = '00001';
    if (lastOrder && lastOrder.orderId) {
      const lastOrderIdNumber = parseInt(lastOrder.orderId);
      nextOrderId = (lastOrderIdNumber + 1).toString().padStart(5, '0');
    }
    this.orderId = nextOrderId;
  }
  next();
});

const orderModel = mongoose.model("Orders", orderSchema);

module.exports = orderModel;