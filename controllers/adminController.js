const { deleteImage } = require("../middlewares/multer");
const brandModel = require("../models/brandModel");
const categoryModel = require("../models/categoryModel");
const moment = require("moment-timezone");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const bannerModel = require("../models/bannerModel");
const blogModel = require("../models/blogModel");
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const branchModel = require("../models/branchesModel");
const youtubeModel = require("../models/youtubeModel");
const admin = {
  email:'neo@admin.com',
  password:'neo@admin'
}

module.exports = {
  getHome: (req, res) => {
    try {
      res.render("admin/home", { admin: true });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBrands: async (req, res) => {
    try {
      const brands = await brandModel.find({}).lean();
      res.render("admin/brands", { admin: true, brands: brands });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await categoryModel.find({}).lean();
      res.render("admin/categories", { admin: true, categories: categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getProducts: async (req, res) => {
    try {
      const products = await productModel.find({}).lean();
      res.render("admin/products", { admin: true, products });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getAddProducts: async (req, res) => {
    try {
      const categories = await categoryModel.find({}).lean();
      const brands = await brandModel.find({}).lean();
      res.render("admin/add-product", { admin: true, categories, brands });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addBrand: async (req, res) => {
    try {
      const { brand } = req.body;
      const image = req.files[0].filename;
      const newBrand = new brandModel({ brand, image });
      await newBrand.save();
      res.redirect("/admin/brands");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addCategory: async (req, res) => {
    try {
      const { category } = req.body;
      const image = req.files[0].filename;
      const newCategory = new categoryModel({ category, image });
      await newCategory.save();
      res.redirect("/admin/categories");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addProduct: async (req, res) => {
    try {
      const images = req.files.map((elem) => elem.filename);
      const newProduct = new productModel({ ...req.body, images });
      await newProduct.save();
      res.redirect("/admin/products");
      console.log(req.files[0].filename);
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteCategory: async (req, res) => {
    const categoryId = req.params.id;
    try {
      categoryModel.findByIdAndDelete(categoryId).then((response) => {
        if (response.image) {
          deleteImage(response.image);
        }
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteBrand: async (req, res) => {
    const brandId = req.params.id;
    try {
      brandModel.findByIdAndDelete(brandId).then((response) => {
        if (response.image) {
          deleteImage(response.image);
        }
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteProduct: async (req, res) => {
    const productId = req.params.id;
    try {
      productModel.findByIdAndDelete(productId).then((response) => {
        if (response.images.length > 0) {
          response.images.forEach((image) => {
            deleteImage(image);
          });
        }
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  geteditProduct: async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await productModel.findById(productId).lean();
      const categories = await categoryModel.find({}).lean();
      const brands = await brandModel.find({}).lean();
      res.render("admin/edit-product", {
        admin: true,
        product,
        categories,
        brands,
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  editProduct: async (req, res) => {
    const productId = req.params.id;
    const { name, category, brand, description, price,shortDesc,stock,weight } = req.body;
    try {
      const product = await productModel.findById(productId);
      if (req.files.length > 0) {
        product.images = req.files.map((elem) => elem.filename);
      }
      product.name = name;
      product.category = category;
      product.shortDesc = shortDesc;
      product.brand = brand;
      product.description = description;
      product.price = price;
      product.stock = stock;
      product.weight = weight
      await product.save();
      res.redirect("/admin/products");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getOrders: async (req, res) => {
    try {
      const orders = await orderModel
        .find({ done: { $ne: true },paymentStatus:'Success' })
        .sort({ createdAt: -1 })
        .lean();
      const updatedOrders = orders.map((order) => {
        const indianTime = moment(order.createdAt).tz("Asia/Kolkata");
        return {
          ...order,
          date: indianTime.format("DD-MM-YYYY"),
          time: indianTime.format("hh:mm:ss A"),
        };
      });
      res.render("admin/orders", { admin: true, updatedOrders });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await orderModel.findById(orderId);
      order.done = true;
      await order.save();
      res.json({});
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getDoneOrders: async (req, res) => {
    try {
      const order = await orderModel
        .find({ done: true ,paymentStatus:'Success'})
        .sort({ createdAt: -1 })
        .lean();
      const orders = order.map((order) => {
        const indianTime = moment(order.createdAt).tz("Asia/Kolkata");
        return {
          ...order,
          date: indianTime.format("DD-MM-YYYY"),
          time: indianTime.format("hh:mm:ss A"),
        };
      });
      console.log(orders);
      res.render("admin/done-order", { admin: true, orders });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getOfferBanner: async (req, res) => {
    try {
      const banners = await bannerModel.find({}).lean()
      res.render("admin/OfferBanner", { admin: true,banners });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addOfferBanner: async (req, res) => {
    try {
      const { bannerName } = req.body;
      const images = req.files.map((elem) => elem.filename);
      const data = {
        bannerName,
        images,
      };
      const newBanner = new bannerModel(data);
      await newBanner.save();
      res.redirect("/admin/offer-banner");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteOfferBanner:(req,res)=>{
    try{
      const offerId = req.params.id
      bannerModel.findByIdAndDelete(offerId).then(() => {
        res.json({});
      });
     }catch(err){
      res.render("error",{message:err})
    }
  },
  getAddBlog: async (req, res) => {
    try {
      const blogs = await blogModel.find({}).lean();
      res.render("admin/blogs", { admin: true, blogs });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addBlog: async(req, res) => {
    try{
      console.log(req.body)
      const {title,content} = req.body
      const delta = JSON.parse(content)
      const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
      const html = converter.convert();
      const images = req.files.map((elem) => elem.filename);
      console.log(images)
      const blogData = {
        title,
        content:html,
        images
      }
      const newBlog = new blogModel(blogData)
      await newBlog.save()
      res.redirect("/admin/add-blog")
    }catch(err){
      res.render("error", { message: err });
    }
  },
  getAddBranch:async(req,res)=>{
    try{
      const branches = await branchModel.find({}).lean()
      console.log(branches)
      res.render("admin/branches", { admin: true,branches });
    }catch(err){
      res.render("error", { message: err });
    }
  },
  addBranch:async(req,res)=>{
    try{
      const data = req.body
      console.log(data)
      const newBranch = new branchModel(data)
      await newBranch.save()
      res.redirect("/admin/add-branch")
    }catch(err){
      res.render("error", { message: err });
    }
  },
  deleteBranch: async (req, res) => {
    const branchId = req.params.id;
    try {
      branchModel.findByIdAndDelete(branchId).then((response) => {
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteBlog: async (req, res) => {
    const blogId= req.params.id;
    try {
      blogModel.findByIdAndDelete(blogId).then((response) => {
        if (response.image) {  
          deleteImage(response.image);
        }
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getLogin:(req,res)=>{
    try{
      res.render("admin/login",{login:true})
    }catch(err){
      res.render("error", { message: err });
    }
  },
  postLogin:(req,res)=>{
    try{
      console.log(req.body)
      const {email,password} = req.body
      if(email !== admin.email ){
        req.session.msg = 'Invalid email'
        return res.redirect('/admin/login')
      } 
      if(password !== admin.password){
        req.session.msg = 'Invalid password'
        return res.redirect('/admin/login')
      }
      req.session.login = true
      res.redirect('/admin')
    }catch(err){
      res.render("error", { message: err });
    }
  },
  adminLogout:(req,res)=>{
    try{
      req.session.login = false
      req.session.msg = false
      res.redirect('/admin/login')
    }catch(err){
      res.render("error", { message: err });
    }
  },
  getEditCategory:async(req,res)=>{
    try{
      const categoryId = req.params.id
      const category = await categoryModel.findById(categoryId).lean()
            console.log(category)
      res.render('admin/editCategory',{admin:true,category})
    }catch(err){
      res.render("error", { message: err });
    }
  },
  EditCategory:async(req,res)=>{
    try{
      const categoryId = req.params.id
      const { category } = req.body;
      let image 
      if( req.files[0]){
        image =  req.files[0].filename;
      }
      const editedCategory = await categoryModel.findById(categoryId)
      editedCategory.category = category
      if(image){
        editedCategory.image = image
      }
      await editedCategory.save()
      res.redirect('/admin/categories')
    }catch(err){
      res.render("error", { message: err });
    } 
  },
  getYoutubeAdd:async(req,res)=>{
    try{
      const youtube = await youtubeModel.find({}).lean();
      res.render("admin/youtubeLink", { admin: true, youtube });
    }catch(err){
      res.render("error", { message: err });
    }
   },
   addYoutube: async (req, res) => {
    try {
      console.log(req.body)
      const { link } = req.body;
      const image = req.files[0].filename;
      const newYoutube = new youtubeModel({ link, image });
      await newYoutube.save();
      res.redirect("/admin/add-youtube");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteYoutube:(req,res)=>{
    try{
      const id = req.params.id
      youtubeModel.findByIdAndDelete(id).then((response) => {
        res.json({});
      });
    }catch(err){
      res.render("error", { message: err });
    }
  }
};
