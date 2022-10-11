var express = require('express');
var router = express.Router();
var util = require('util')
const mainName = "dashboard"
const pageTitle = `Dashboard Management`
const folderView = __path_views_backend + `/pages/${mainName}/`;
const layout = __path_views_backend + 'backend';


router.get('/(:status)?', async function(req, res, next) {
  res.render(`${folderView}index`, {
    pageTitle,
    layout,
  });
});

module.exports = router;
