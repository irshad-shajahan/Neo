var express = require('express');
const { getHome, getBrands, addBrand, addCategory, getCategories, getAddProducts, addProduct, getProducts, deleteCategory, deleteBrand, geteditProduct, editProduct, deleteProduct, getOrders, getDoneOrders, updateOrder, getOfferBanner, addOfferBanner, getAddBlog, addBlog, getAddBranch, addBranch, deleteBranch, deleteBlog, getLogin, postLogin, adminLogout, deleteOfferBanner, getEditCategory, EditCategory, getYoutubeAdd, addYoutube, deleteYoutube } = require('../controllers/adminController');
const {upload} = require('../middlewares/multer');
const { verifyAdminLoggedOut, verifyAdminLoggedIn } = require('../middlewares/Sessionhandle');
var router = express.Router();

/* GET home page. */
router.get('/',verifyAdminLoggedOut,getHome);
router.route('/login').get(verifyAdminLoggedIn,getLogin).post(postLogin)
router.get('/logout',verifyAdminLoggedOut,adminLogout)
router.post('/add-brand',verifyAdminLoggedOut,upload.any('image'),addBrand)
router.get('/brands',verifyAdminLoggedOut,getBrands)
router.delete('/delete-brand/:id',verifyAdminLoggedOut,deleteBrand)

router.post('/add-category',verifyAdminLoggedOut,upload.any('image'),addCategory)
router.get('/categories',verifyAdminLoggedOut,getCategories)
router.delete('/delete-category/:id',verifyAdminLoggedOut,deleteCategory)
router.route('/edit-category/:id').get(getEditCategory).post(upload.any('image'),EditCategory)

router.get('/products',verifyAdminLoggedOut,getProducts)
router.route('/add-product').get(verifyAdminLoggedOut,getAddProducts).post(verifyAdminLoggedOut,upload.any('image'),addProduct)
router.route('/edit-product/:id').get(verifyAdminLoggedOut,geteditProduct).post(verifyAdminLoggedOut,upload.any('image'),editProduct)
router.delete('/delete-product/:id',verifyAdminLoggedOut,deleteProduct)

router.route('/add-youtube').get(verifyAdminLoggedOut,getYoutubeAdd).post(verifyAdminLoggedOut,upload.any('image'),addYoutube)
router.delete('/delete-link/:id',deleteYoutube)

router.get('/orders',verifyAdminLoggedOut,getOrders)
router.get('/done-orders',verifyAdminLoggedOut,getDoneOrders)
router.put('/update-order/:id',verifyAdminLoggedOut,updateOrder)

router.route('/offer-banner').get(verifyAdminLoggedOut,getOfferBanner).post(verifyAdminLoggedOut,upload.any('image'),addOfferBanner)
router.delete('/offer-delete/:id',verifyAdminLoggedOut,deleteOfferBanner)


router.route('/add-blog').get(verifyAdminLoggedOut,getAddBlog).post(verifyAdminLoggedOut,upload.any('image'),addBlog)
router.route('/add-branch').get(verifyAdminLoggedOut,getAddBranch).post(verifyAdminLoggedOut,addBranch)
router.delete('/delete-branch/:id',verifyAdminLoggedOut,deleteBranch)
router.delete('/delete-blog/:id',verifyAdminLoggedOut,deleteBlog)

router.post('/upload-image', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ imageUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});
module.exports = router;
