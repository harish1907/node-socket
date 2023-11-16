const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  place: {
    type: String,
    require: false,
  },
});

module.exports = model("productSchema", productSchema, "testProducts");
