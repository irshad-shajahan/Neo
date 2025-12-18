const mongoose = require("mongoose");

const youtubeSchema = new mongoose.Schema({
  link:String,
  image:String
},
{
  timestamps:true
});

const youtubeModel = mongoose.model("youtube", youtubeSchema);
module.exports = youtubeModel;
 