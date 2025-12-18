const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  bannerName:String,
  images:Array
},
{
  timestamps:true
});

const bannerModel = mongoose.model("banners", bannerSchema);
module.exports = bannerModel;
 