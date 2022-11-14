var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';

const folderViewCategory = __path_views_frontend + `pages/category/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
const ParamsHelpers = require(__path_helpers + 'params');
const routerName    = "tat-ca-cay"
/* GET home page. */
router.get('/', async function(req, res, next) {
    try {   
            let minPrice = isNaN(req.query.minPrice) ? undefined : req.query.minPrice
            let maxPrice = isNaN(req.query.maxPrice) ? undefined : req.query.maxPrice
            let sort     = decodeURIComponent(req.query.sort).split(',')   
            let valueSort     = (sort[1]=='asc'||sort[1]=='desc') ? sort[1] : undefined
            let keySort      = (sort[0]=='price' && valueSort) ? sort[0] : undefined
            let sortObj = {}
            sortObj[`${keySort}`]  = valueSort
            let objRangePrice = {minPrice: minPrice, maxPrice: maxPrice}

            let objWhere = {};
            let keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
            let pagination = {
                totalItems: 1,
                totalItemsPerPage: 9,
                currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
                pageRanges: 3
            };
            if (keyword !== '') objWhere.name = new RegExp(keyword, 'i');
            objWhere.status = "active"
            if(minPrice && maxPrice){
                objWhere.$and = [
                    {
                        price : { $gte : objRangePrice.minPrice }
                    },
                    {
                        price : { $lte : objRangePrice.maxPrice }
                    }
                ]
            }
            pagination.totalItems = await FrontEndHelpers.countProduct(objWhere);
            let listProductByCategory = await FrontEndHelpers.getAllProduct(
                                                    objWhere,
                                                    pagination.currentPage,
                                                    pagination.totalItemsPerPage,
                                                    sortObj,
                                                )
            res.render(`${folderViewCategory}allproduct`, {
                pageTitle: "Tất Cả Sản Phẩm",
                layout,
                listProductByCategory,
                objRangePrice,
                routerName,
                pagination,
                keyword,
                sortObj,
            });   
    } catch (error) {
        console.log(error)
    }
    
});

module.exports = router;


