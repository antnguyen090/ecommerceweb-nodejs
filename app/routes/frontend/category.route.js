var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "category"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const folderViewProduct = __path_views_frontend + `pages/product/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');

/* GET home page. */
router.get('/(:slug)?', async function(req, res, next) {
    try {
    if(!req.params.slug) res.redirect("/index")
    let listmenu = await FrontEndHelpers.getMenuBar()
    let listCategory = await FrontEndHelpers.getListCategory()
    let settingPage = await FrontEndHelpers.getInforSetting()
    let listProductByCategory = await FrontEndHelpers.getProductByCategory(req.params.slug)
    let listProductOption = await FrontEndHelpers.getListProductOption()
    res.render(`${folderView}category`, {
        layout,
        listmenu,
        listCategory,
        settingPage,
        listProductByCategory,
        listProductOption,
     });        
    } catch (error) {
        console.log(error)
        res.redirect("/error")
    }
    
});

module.exports = router;


