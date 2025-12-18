const { default: mongoose } = require("mongoose");
// const blogs = require("../constants");
const brandModel = require("../models/brandModel");
const categoryModel = require("../models/categoryModel");
const nodemailer = require("nodemailer");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const bannerModel = require("../models/bannerModel");
const blogModel = require("../models/blogModel");
const { default: axios } = require("axios");
const { search } = require("fast-fuzzy");
const moment = require("moment-timezone");
const branchModel = require("../models/branchesModel");
const youtubeModel = require("../models/youtubeModel");
const { Juspay, APIError } = require("expresscheckout-nodejs");
const juspay = require("../helper/paymentHelper");
const { createShipRocketOrder } = require("../helper/shipRocket");

function sendTelegramAlert(order) {
  const message = `<b>A bew order has been placed! 🎉</b>

  <b>Order Details:</b>
  - <b>Order ID:</b> NEO${order._id}
  - <b>Order Time:</b> ${order.time}
  - <b>Date:</b> ${order.date}
  - <b>Customer Phone:</b> ${order.phone}
  - <b>Total Amount:</b> ₹${order.total} /-
  - <b>Items Number:</b> ${order.lineItems.length}
  
  Please remember ⚠️ to check the <b>admin dashboard</b> for more details.`;
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.telegram.org/bot6846417459:AAHoijJVqugNcfECQ9gPdNQ3bmaeM48CWXI/sendMessage?chat_id=-4268736732&text=${encodeURIComponent(
          message
        )}&parse_mode=HTML`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        resolve(response);
      });
  });
}
module.exports = {
  getHome: async (req, res) => {
    try {
      const latestBanner = await bannerModel
        .findOne()
        .sort({ createdAt: -1 })
        .lean();
      const banners = latestBanner?.images;
      const brands = await brandModel.find({}).lean();
      const categories = await categoryModel.find({}).lean();
      const blogs = await blogModel.find({}).lean();
      const popularProducts = await productModel
        .aggregate([{ $sample: { size: 10 } }])
        .exec();
      const bestSellerProducts = await productModel
        .aggregate([{ $sample: { size: 6 } }])
        .exec();
      res.render("user/home", {
        brands,
        categories,
        popularProducts,
        bestSellerProducts,
        banners,
        blogs,
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getAbout: (req, res) => {
    try {
      res.render("user/about");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getShop: async (req, res) => {
    try {
      const categories = await categoryModel.find({}).lean();
      const popularProducts = await productModel
        .aggregate([{ $sample: { size: 4 } }])
        .exec();
      const products = await productModel.find({ stock: { $gt: 0 } }).lean();
      res.render("user/shop", { products, popularProducts, categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getContact: async (req, res) => {
    try {
      const branches = await branchModel.find({}).lean();
      res.render("user/contact", { branches });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBlog: async (req, res) => {
    try {
      const allBlogs = await blogModel.find({}).sort({ createdAt: 1 }).lean();
      const firstBlog = allBlogs.length > 0 ? allBlogs[0] : null;
      const restOfBlogs = allBlogs.slice(1).sort((a, b) => b.createdAt - a.createdAt);
  
      const processBlogs = (blogs) => blogs.map((blog) => {
        const indianTime = moment(blog.createdAt).tz("Asia/Kolkata");
        return {
          ...blog,
          date: indianTime.format("DD-MM-YYYY"),
          time: indianTime.format("hh:mm:ss A"),
        };
      });
  
      const processedFirstBlog = firstBlog ? processBlogs([firstBlog])[0] : null;
      const processedBlogs = processBlogs(restOfBlogs);
  
      res.render("user/blogs", { 
        firstBlog: processedFirstBlog, 
        blogs: processedBlogs 
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await categoryModel.find({}).lean();
      res.render("user/categories", { categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getProductDetails: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await productModel.findById(productId).lean();
      const outOfStock = product.stock === 0;
      const err = req.session.cartError;
      res.render("user/product-details", { product, outOfStock, err });
      req.session.cartError = "";
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCategoryProducts: async (req, res) => {
    const categoryId = req.params.id;
    try {
      const category = await categoryModel.findById(categoryId);
      const categories = await categoryModel.find().lean();
      const popularProducts = await productModel
        .aggregate([{ $sample: { size: 4 } }])
        .exec();
      const products = await productModel
        .find({ category: category.category })
        .lean();
      res.render("user/shop", { products, popularProducts, categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBrandProducts: async (req, res) => {
    const brandId = req.params.id;
    try {
      const brand = await brandModel.findById(brandId);
      const categories = await categoryModel.find().lean();
      const popularProducts = await productModel
        .aggregate([{ $sample: { size: 4 } }])
        .exec();
      const products = await productModel.find({ brand: brand.brand }).lean();
      res.render("user/shop", { products, popularProducts, categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCart: async (req, res) => {
    try {
      const cart = await req.session.cart;
      const productIds = cart.map(
        (item) => new mongoose.Types.ObjectId(item.productId)
      );
      const products = await productModel.find({ _id: { $in: productIds } });
      const cartProducts = products.map((product) => {
        const cartItem = cart.find((item) => {
          return item.productId.toString() === product._id.toString();
        });
        return {
          ...product.toObject(),
          quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0,
          subTotal: product.price * parseInt(cartItem.quantity, 10),
        };
      });
      let Total = 0;
      cartProducts.forEach((elem) => (Total += elem.price * elem.quantity));
      console.log(cartProducts);
      res.render("user/cart", { cartProducts, Total });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addToCart: async (req, res) => {
    try {
      const { quantity, productId } = req.body;

      // Find the product in the database to check the stock
      const product = await productModel.findById(productId);
      if (!product) {
        return res.render("error", { message: "Product not found" });
      }

      const existingProductIndex = req.session.cart.findIndex(
        (item) => item.productId === productId
      );

      let totalQuantity = Number(quantity);
      if (existingProductIndex >= 0) {
        totalQuantity += Number(
          req.session.cart[existingProductIndex].quantity
        );
      }
      // Check if the total quantity exceeds the stock
      if (product.stock == 0) {
        return res.redirect("/user/product-details");
      }
      if (totalQuantity > product.stock) {
        req.session.cartError = "Selected stock not available";
        return res.redirect(`/product/${productId}`);
      }

      if (existingProductIndex >= 0) {
        req.session.cart[existingProductIndex].quantity = totalQuantity;
      } else {
        req.session.cart.push({ productId, quantity });
      }

      // Save the session before redirecting
      req.session.save((err) => {
        if (err) {
          return res.render("error", { message: err });
        }
        res.redirect("/cart");
      });
    } catch (err) {
      res.render("error", { message: err.message });
    }
  },
  removeFromCart: async (req, res) => {
    try {
      const productId = req.params.id;
      const cart = (await req.session.cart) || [];
      const productIndex = cart.findIndex(
        (item) => item.productId === productId
      );
      if (productIndex >= 0) {
        cart.splice(productIndex, 1);
        req.session.cart = cart;
        return res.json({ status: true });
      } else {
        return res.json({ status: false });
      }
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  // changeQuantity: async (req, res) => {
  //   const itemId = req.body.itemId;
  //   const newQuantity = parseInt(req.body.newQuantity);
  //   try {
  //     if (!req.session.cart) {
  //       req.session.cart = [];
  //       res.redirect("/cart");
  //     }
  //     req.session.cart = (await req.session.cart) || [];
  //     const existingProductIndex = req.session.cart.findIndex(
  //       (item) => item.productId === itemId
  //     );
  //     if (existingProductIndex >= 0) {
  //       if (newQuantity > 0) {
  //         req.session.cart[existingProductIndex].quantity = newQuantity;
  //       } else {
  //         req.session.cart.splice(existingProductIndex, 1);
  //         return res.json({ remove: true });
  //       }
  //     } else {
  //       console.warn(
  //         `Item with ID ${itemId} not found in cart, ignoring change.`
  //       );
  //     }
  //     const cart = req.session.cart;
  //     const productIds = cart.map(
  //       (item) => new mongoose.Types.ObjectId(item.productId)
  //     );
  //     const products = await productModel.find({ _id: { $in: productIds } });
  //     const cartProducts = products.map((product) => {
  //       const cartItem = cart.find((item) => {
  //         return item.productId.toString() === product._id.toString();
  //       });
  //       return {
  //         ...product.toObject(),
  //         quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0,
  //         subTotal: product.price * parseInt(cartItem.quantity, 10),
  //       };
  //     });
  //     const product = cartProducts.find((item) => {
  //       return item._id.toString() === itemId;
  //     });
  //     let updatedPrice = product.subTotal;
  //     let Total = 0;
  //     cartProducts.forEach((elem) => (Total += elem.price * elem.quantity));

  //     res.json({ status: true, Total, cartProducts, updatedPrice });
  //   } catch (err) {
  //     res.render("error", { message: err });
  //   }
  // },
  changeQuantity: async (req, res) => {
    const itemId = req.body.itemId;
    const newQuantity = parseInt(req.body.newQuantity);

    try {
      if (!req.session.cart) {
        req.session.cart = [];
        return res.redirect("/cart");
      }

      req.session.cart = (await req.session.cart) || [];
      const existingProductIndex = req.session.cart.findIndex(
        (item) => item.productId === itemId
      );

      if (existingProductIndex >= 0) {
        // Fetch the product to check the stock
        const product = await productModel.findById(itemId);
        if (!product) {
          return res.render("error", { message: "Product not found" });
        }

        // Check if the new quantity exceeds the stock
        if (newQuantity > product.stock) {
          return res.json({ status: false, message: "Insufficient stock" });
        }

        if (newQuantity > 0) {
          req.session.cart[existingProductIndex].quantity = newQuantity;
        } else {
          req.session.cart.splice(existingProductIndex, 1);
          return res.json({ remove: true });
        }
      } else {
        console.warn(
          `Item with ID ${itemId} not found in cart, ignoring change.`
        );
      }

      const cart = req.session.cart;
      const productIds = cart.map(
        (item) => new mongoose.Types.ObjectId(item.productId)
      );
      const products = await productModel.find({ _id: { $in: productIds } });
      const cartProducts = products.map((product) => {
        const cartItem = cart.find((item) => {
          return item.productId.toString() === product._id.toString();
        });
        return {
          ...product.toObject(),
          quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0,
          subTotal: product.price * parseInt(cartItem.quantity, 10),
        };
      });

      const productInCart = cartProducts.find((item) => {
        return item._id.toString() === itemId;
      });

      let updatedPrice = productInCart.subTotal;
      let total = 0;
      cartProducts.forEach((elem) => (total += elem.price * elem.quantity));

      res.json({ status: true, total, cartProducts, updatedPrice });
    } catch (err) {
      res.render("error", { message: err.message });
    }
  },
  getCheckout: async (req, res) => {
    try {
      const cart = await req.session.cart;
      const KeralaBase = 80
      const OutsideBase = 130
      const keralaAdditional = 30 
      const outsideAdditional = 40
      let shippingCostKerala = 0
      let shippingCostOutside = 0
      const productIds = cart.map(
        (item) => new mongoose.Types.ObjectId(item.productId)
      );
      const products = await productModel.find({ _id: { $in: productIds } });
      const cartProducts = products.map((product) => {
        const cartItem = cart.find((item) => {
          return item.productId.toString() === product._id.toString();
        });
        return {
          ...product.toObject(),
          quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0,
          subTotal: product.price * parseInt(cartItem.quantity, 10),
        };
      });
      let subTotal = 0;
      cartProducts.forEach((elem) => (subTotal += elem.price * elem.quantity));
      let totalWeight = 0
      cartProducts.forEach((elem) => (totalWeight += elem.weight * elem.quantity));
      //  totalWeight = 1100
      if (totalWeight <= 500) {
        shippingCostKerala = KeralaBase
        shippingCostOutside = OutsideBase
      } else {
        const additionalWeight = Math.ceil((totalWeight - 500) / 500)
        shippingCostKerala = KeralaBase + (additionalWeight * keralaAdditional)
        shippingCostOutside = OutsideBase + (additionalWeight * outsideAdditional)
      }
      
      console.log("Shipping Cost for Kerala:", shippingCostKerala)
      console.log("Shipping Cost for Outside Kerala:", shippingCostOutside)
      console.log('total: ',totalWeight)
      const orderData = {
        // ...data,
        lineItems: cartProducts,
        subTotal,
        total:subTotal,
        totalWeight,
        shippingCostOutside,
        shippingCostKerala
      };
      const newOrder = new orderModel(orderData);
      await newOrder.save();
      req.session.order = newOrder;
      res.render("user/checkout", { products: cartProducts, total:subTotal,shippingCostOutside,shippingCostKerala });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  // postCheckout: async (req, res) => {
  //   try {
  //     const data = req.body;
  //     const cart = await req.session.cart;
  //     const productIds = cart.map(
  //       (item) => new mongoose.Types.ObjectId(item.productId)
  //     );
  //     const products = await productModel.find({ _id: { $in: productIds } });
  //     const cartProducts = products.map((product) => {
  //       const cartItem = cart.find((item) => {
  //         return item.productId.toString() === product._id.toString();
  //       });
  //       return {
  //         ...product.toObject(),
  //         quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0,
  //         subTotal: product.price * parseInt(cartItem.quantity, 10),
  //       };
  //     });
  //     let total = 0;
  //     cartProducts.forEach((elem) => (total += elem.price * elem.quantity));
  //     let totalWeight = 0;
  //     cartProducts.forEach((elem) => (totalWeight += elem.weight * elem.quantity));
  //     console.log('total: ',totalWeight)
  //     const orderData = {
  //       ...data,
  //       lineItems: cartProducts,
  //       totalWeight,
  //       total,
  //     };
  //     const newOrder = new orderModel(orderData);
  //     await newOrder.save();
  //     const order = newOrder;
  //     const indianTime = moment(order.createdAt).tz("Asia/Kolkata");

  //     (order.date = indianTime.format("DD-MM-YYYY")),
  //       (order.time = indianTime.format("hh:mm:ss A")),
  //       sendTelegramAlert(newOrder).then(() => {
  //         res.redirect("/order-success");
  //       });
  //   } catch (err) {
  //     res.render("error", { message: err });
  //   }
  // },
  getOrderSuccess: async (req, res) => {
    try {
      res.render("user/order-success");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getFranchise: async (req, res) => {
    try {
      const youtube = await youtubeModel.find().sort({ createdAt: -1 }).lean();
      console.log(youtube);
      res.render("user/franchise", { youtube: youtube[0] });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  submitContactForm: (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      console.log(req.body);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "neoproducts1@gmail.com",
          pass: "tdhyjwbrtqgpreop",
        },
      });
      const mailOptions = {
        from: email,
        to: "irshadshajahan020@gmail.com",
        subject,
        text: `Hi
        my name is ${name},My contact is ${phone}. I want to enquire about ${subject}. 
        Message: ${message}`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email send: " + info.response);
        }
        res.redirect("/contact");
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  searchFunction: async (req, res) => {
    try {
      const query = req.body.search;
      const products = await productModel.find({}).lean();
      const searchableFields = ["name", "brand", "category"];

      const filteredProducts = search(query, products, {
        keySelector: (product) =>
          searchableFields.map((field) => product[field]).join(" "),
        // threshold: -10000, // Adjust this value to control the fuzziness level
      });
      console.log(filteredProducts);
      const categories = await categoryModel.find({}).lean();
      const popularProducts = await productModel
        .aggregate([{ $sample: { size: 4 } }])
        .exec();
      res.render("user/shop", {
        products: filteredProducts,
        popularProducts,
        categories,
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  frequestQuestions: (req, res) => {
    try {
      res.render("user/frequentQuestions");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  privacyPolicy: (req, res) => {
    try {
      res.render("user/privacyPolicy");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  refundPolicy: (req, res) => {
    try {
      res.render("user/refundPolicy");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  shippingPolicy: (req, res) => {
    try {
      res.render("user/shippingPolicy");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  termsOfService: (req, res) => {
    try {
      res.render("user/termsOfService");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  checkOutPayment: async (req, res) => {
    const order = req.session.order;
    const state = 'KERALA'
    const address = req.body;
    const returnUrl = process.env.DEV?'http://localhost:3000/handleJuspayResponse':'https://neoindia.in/handleJuspayResponse';
    try {
      let orderMain = await orderModel.findById(order._id);
      let total = 0
      if(address?.state.toUpperCase()===state){
        total = order?.subTotal + order?.shippingCostKerala
      }else{
        total = order?.subTotal + order?.shippingCostOutside
      }
      Object.assign(orderMain, address);
      orderMain.total = total;
      await orderMain.save();
      const sessionResponse = await juspay.orderSession.create({
        order_id: "order_" + order.orderId,
        // amount: 1,
        amount: total,
        payment_page_client_id: "hdfcmaster", // [required] shared with you, in config.json
        customer_id: "hdfc-testing-customer-one", // [optional] your customer id here
        action: "paymentPage", // [optional] default is paymentPage
        return_url: returnUrl, // [optional] default is value given from dashboard
        currency: "INR", // [optional] default is INR
      });
      return res.json(makeJuspayResponse(sessionResponse));
    } catch (error) {
      if (error instanceof APIError) {
        // handle errors comming from juspay's api
        return res.json(makeError(error.message));
      }
      return res.json(makeError());
    }
  },
  JustPayResponse: async (req, res) => {
    if(req.body.status_id=='10'){
      return res.redirect("/order-failed");
    }
    console.log(req.body)
    const orderId = req.body.order_id || req.body.orderId;
    const order = await orderModel.findOne({orderId:orderId.split("order_")[1]});
    if (orderId == undefined) {
      return res.json(makeError("order_id not present or cannot be empty"));
    }

    try {
      const statusResponse = await juspay.order.status(orderId);
      const orderStatus = statusResponse.status;
      let message;
      
      if (orderStatus == 'CHARGED') {
        message = "order payment done successfully";
        order.paymentStatus = "Success";  
        await order.save();
        const indianTime = moment(order.createdAt).tz("Asia/Kolkata");
        order.date = indianTime.format("DD-MM-YYYY");
        order.time = indianTime.format("hh:mm:ss A");
        sendTelegramAlert(order).then(() => {
          createShipRocketOrder(order).then((res)=>{  
          })
          req.session.cart = []
          res.render("user/order-success",{orderId,amount:order.total});
        });
      } else if (orderStatus == "PENDING" || orderStatus == "PENDING_VBV") {
        message = "order payment pending";
        order.paymentStatus = "Pending";
        await order.save();
        res.redirect("/order-failed");
      } else if (orderStatus == "AUTHORIZATION_FAILED") {
        message = "order payment authorization failed";
        order.paymentStatus = "Pending";
        await order.save();
        res.redirect("/order-failed");
      } else if (orderStatus == "AUTHENTICATION_FAILED") {
        message = "order payment authentication failed";
        order.paymentStatus = "Failed";
        await order.save();
        res.redirect("/order-failed");
      } else {
        message = "order status " + orderStatus;
      }

      // removes http field from response, typically you won't send entire structure as response
      // return res.send(makeJuspayResponse(statusResponse))
    } catch (error) {
      console.log(error)
      if (error instanceof APIError) {
        // handle errors comming from juspay's api,
        return res.json(makeError(error.message));
      }
      // return res.json(makeError())
    }
  },
  getOrderFailed: (req, res) => {
    try {
      res.render("user/order-failed");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
};

function makeError(message) {
  return {
    message: message || "Something went wrong",
  };
}

function makeJuspayResponse(successRspFromJuspay) {
  if (successRspFromJuspay == undefined) return successRspFromJuspay;
  if (successRspFromJuspay.http != undefined) delete successRspFromJuspay.http;
  console.log(successRspFromJuspay)
  return successRspFromJuspay;
}
