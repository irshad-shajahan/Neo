const mongoose = require('mongoose')
const colors = require('colors');
const productModel = require('../models/productModel');
require('dotenv').config()

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{dbName:'neo'})
        console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
        // productModel.updateMany({}, { $set: { stock: 5 } })
        // .then(result => {
        //   console.log("Stock updated for all products:", result);
        //   mongoose.connection.close();
        // })
        // .catch(err => {
        //   console.error("Error updating stock:", err);
        //   mongoose.connection.close();
        // });
    }catch(error){
        console.log(`Mongodb server Issue ${error}`.bgRed.white);
    }
}

module.exports = connectDB;