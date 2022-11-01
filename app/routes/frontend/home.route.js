var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "home"
const pageTitle = "Trang Chủ"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const folderViewProduct = __path_views_frontend + `pages/product/`;

const FrontEndHelpers = require(__path_helpers + 'frontend');
/* GET home page. */
router.get('/(:product)?', async function(req, res, next) {
    try {
    if(req.params.product == 'admin') next()
    let listmenu = await FrontEndHelpers.getMenuBar()
    let listCategory = await FrontEndHelpers.getListCategory()
    let settingPage = await FrontEndHelpers.getInforSetting()
    if(req.params.product){
        let product = await FrontEndHelpers.getOneProduct({status: 'active',slug: req.params.product})
        let categoryObj = listCategory.find(item => item.id == product.category);
        let productRelated = await FrontEndHelpers.getProductByCategory(categoryObj.slug)
    res.render(`${folderViewProduct}product`, {
        pageTitle,
        layout,
        listmenu,
        listCategory,
        settingPage,
        product,
        categoryObj,
        productRelated,
     });   
    } else{
        let slider = await FrontEndHelpers.getSlider()
        let listProductOption = await FrontEndHelpers.getListProductOption()
        res.render(`${folderView}home`, {
            pageTitle,
            layout,
            slider,
            listmenu,
            listCategory,
            settingPage,
            listProductOption,
         });   
    }     
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
    
});

module.exports = router;


