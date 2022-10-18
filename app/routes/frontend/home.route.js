var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "home"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
    let slider = await FrontEndHelpers.getSlider()
    let listmenu = await FrontEndHelpers.getMenuBar()
    res.render(`${folderView}home`, {
        layout,
        slider,
        listmenu
     });        
    } catch (error) {
        console.log(error)
        res.redirect("/error")
    }
    
});

module.exports = router;


