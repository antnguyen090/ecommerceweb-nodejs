var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "home"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const folderViewProduct = __path_views_frontend + `pages/product/`;
const folderViewCategory = __path_views_frontend + `pages/category/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
let pageTitle = "Trang Chủ"

/* GET home page. */
router.get('/(:slug)?', async function(req, res, next) {
    try {
    let listCategory = await res.locals.listCategory
    if(req.params.slug == 'tat-ca-cay') {
        next()
        return 
    }
    if(req.params.slug){
        let category = await FrontEndHelpers.checkCategoryExits({slug: req.params.slug})
        if(category){
            let minPrice = isNaN(req.query.minPrice) ? undefined : req.query.minPrice
            let maxPrice = isNaN(req.query.maxPrice) ? undefined : req.query.maxPrice
            let sort     = decodeURIComponent(req.query.sort).split(',')   
            let valueSort     = (sort[1]=='asc'||sort[1]=='desc') ? sort[1] : undefined
            let keySort      = (sort[0]=='price' && valueSort) ? sort[0] : undefined
            let limit   = 9
            let sortObj = {}
            sortObj[`${keySort}`]  = valueSort
            let objRangePrice = {minPrice: minPrice, maxPrice: maxPrice}
            let listProductByCategory = await FrontEndHelpers
                                                .getProductByCategory(
                                                    req.params.slug,
                                                    objRangePrice,
                                                    sortObj
                                                )
            res.render(`${folderViewCategory}category`, {
                pageTitle: listProductByCategory.name,
                layout,
                listProductByCategory,
                objRangePrice,
            });   
            return
        } else{
            let checkProduct =  await FrontEndHelpers.checkProductExits({slug: req.params.slug})
            if(checkProduct){
                let product = await FrontEndHelpers.getOneProduct({status: 'active',slug: req.params.slug})
                let categoryObj = await listCategory.find(item => item.id == product.category);
                let productRelated = await FrontEndHelpers.getProductRelated(categoryObj.slug)
                res.render(`${folderViewProduct}product`, {
                    pageTitle: product.name,
                    layout,
                    product,
                    categoryObj,
                    productRelated,
                });
                return   
            } else{
                next()
            }
        }
    } else{
        let slider = await FrontEndHelpers.getSlider()
        res.render(`${folderView}home`, {
            pageTitle,
            layout,
            slider,
         });   
    }     
    } catch (error) {
        console.log(error)
    }
    
});

module.exports = router;


