const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  brand:String,
  image:String
},
{
  timestamps:true
});

const brandModel = mongoose.model("brands", brandSchema);
module.exports = brandModel;
 