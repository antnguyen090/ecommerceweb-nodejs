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
    if(req.params.slug === 'admin') {
        next()
        return
    } else if(req.params.slug === 'lien-he'){
        next()
        return
    } else if(req.params.slug === 'yeu-thich'){
        next()
        return
    } else if(req.params.slug === 'lay-lai-mat-khau'){
        next()
        return
    } else if(req.params.slug === 'index'){
        next()
        return
    } else if(req.params.slug === 'tin-tuc'){
        next()
        return
    } else if(req.params.slug === 've-chung-toi'){
        next()
        return
    } else if(req.params.slug === 'dang-ky'){
        next()
        return
    } else if(req.params.slug === 'dang-nhap'){
        next()
        return
    } else if(req.params.slug === 'trang-ca-nhan'){
        next()
        return
    } else if(req.params.slug === 'trang-chu'){
        next()
        return
    } else if(req.params.slug === 'dang-xuat'){
        if(req.isAuthenticated()) {
            req.logout(function(err) {
                if (err) { return next(err); }
                res.redirect('/');
              });
        } else{
            res.redirect('/');
        }
        return
    }
    let listCategory = await res.locals.listCategory
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
        res.redirect("/error")
    }
    
});

module.exports = router;


