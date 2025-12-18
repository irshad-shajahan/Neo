const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category:String,
  image:String
},
{   
  timestamps:true
});

const categoryModel = mongoose.model("categories", categorySchema);
module.exports = categoryModel;
 