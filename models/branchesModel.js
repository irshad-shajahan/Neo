const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name:String,
  phone:String,
  link:String,
  address:String,
},
{
  timestamps:true
});

const branchModel = mongoose.model("branches", branchSchema);
module.exports = branchModel;
 