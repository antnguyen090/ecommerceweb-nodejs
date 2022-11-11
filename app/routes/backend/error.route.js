var express = require('express');
var router = express.Router();
var util = require('util')
const mainName = "error"
const pageTitle = `Error`
const folderView = __path_views_backend + `/pages/${mainName}/`;
const layout = __path_views_backend + 'backend';
const systemConfig = require(__path_configs + 'system');


router.get('/', async function(req, res, next) {
    console.log("errôrrr")
    let indexLink = systemConfig.prefixAdmin
    res.render(`${folderView}error`, {
      pageTitle,
      layout,
      indexLink
    });

});

module.exports = router;
