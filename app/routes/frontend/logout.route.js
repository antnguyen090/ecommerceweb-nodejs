var express = require('express');
var router = express.Router();

const StringHelpers 	= require(__path_helpers + 'string');
const linkIndex		= StringHelpers.formatLink('/');

router.get('/', (req, res, next)=>{
  if(req.isAuthenticated()) {
     req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect(linkIndex);
      });
      return
  } else{
    res.redirect(linkIndex);
    return
  }
})

 module.exports = router