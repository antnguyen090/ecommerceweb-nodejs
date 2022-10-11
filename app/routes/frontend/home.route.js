var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "home"
const folderView = __path_views_frontend + `pages/${mainName}/`;

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
       
    res.render(`${folderView}home`, {
        layout,
     });        
    } catch (error) {
        console.log(error)
        res.redirect("/error")
    }
    
});

module.exports = router;
