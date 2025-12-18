const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token:String
},
{   
  timestamps:true
});

const tokenModel = mongoose.model("token", tokenSchema);
module.exports = tokenModel;
  