const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  awbNumber: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Delivery", deliverySchema);
