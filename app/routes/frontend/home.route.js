var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "home"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const folderViewProduct = __path_views_frontend + `pages/product/`;
const folderViewCategory = __path_views_frontend + `pages/category/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
const ParamsHelpers = require(__path_helpers + 'params');

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
        let category = await FrontEndHelpers.checkCategoryExits({status: 'active', slug: req.params.slug})
        if(category){
            let minPrice = isNaN(req.query.minPrice) ? undefined : req.query.minPrice
            let maxPrice = isNaN(req.query.maxPrice) ? undefined : req.query.maxPrice
            let sort     = decodeURIComponent(req.query.sort).split(',')   
            let valueSort     = (sort[1]=='asc'||sort[1]=='desc') ? sort[1] : undefined
            let keySort      = (sort[0]=='price' && valueSort) ? sort[0] : undefined
            let sortObj = {}
            sortObj[`${keySort}`]  = valueSort
            let objRangePrice = {minPrice: minPrice, maxPrice: maxPrice}
            let pagination = {
                totalItems: 1,
                totalItemsPerPage: 9,
                currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
                pageRanges: 3
            };
            let result = await FrontEndHelpers.getProductByCategory(
                                                    req.params.slug,
                                                    pagination.currentPage,
                                                    pagination.totalItemsPerPage,
                                                    objRangePrice,
                                                    sortObj
                                                )
            let listProductByCategory = result.data
            pagination.totalItems     = result.countData
            res.render(`${folderViewCategory}category`, {
                pageTitle: listProductByCategory.name,
                layout,
                listProductByCategory,
                objRangePrice,
                pagination,
                sortObj,
            });   
            return
        } else{
            let checkProduct =  await FrontEndHelpers.checkProductExits({status: 'active', slug: req.params.slug})
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


