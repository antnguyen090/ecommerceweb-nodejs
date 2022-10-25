var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "home"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const folderViewProduct = __path_views_frontend + `pages/product/`;

const FrontEndHelpers = require(__path_helpers + 'frontend');
/* GET home page. */
router.get('/(:product)?', async function(req, res, next) {
    try {
    let listmenu = await FrontEndHelpers.getMenuBar()
    let listCategory = await FrontEndHelpers.getListCategory()
    let settingPage = await FrontEndHelpers.getInforSetting()
    if(req.params.product){
        let product = await FrontEndHelpers.getOneProduct({slug: req.params.product})
    res.render(`${folderViewProduct}product`, {
        layout,
        listmenu,
        listCategory,
        settingPage,
        product,
     });   
    }
    let slider = await FrontEndHelpers.getSlider()
    let listProductOption = await FrontEndHelpers.getListProductOption()
    res.render(`${folderView}home`, {
        layout,
        slider,
        listmenu,
        listCategory,
        settingPage,
        listProductOption,
     });        
    } catch (error) {
        console.log(error)
        res.redirect("/error")
    }
    
});

module.exports = router;


