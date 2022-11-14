var express = require('express');
var router = express.Router();

const mainName = "viewproduct"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');


router.get('/', async function(req, res, next) {
    try {
        let data = req.query.id
        let product = await FrontEndHelpers.getProductById(data)
        res.render(`${folderView}viewproduct`, {
          layout: false,
          product
       });   
    } catch (error) {
        console.log(error)
    }
});



module.exports = router;


