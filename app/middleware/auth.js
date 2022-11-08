const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig       = require(__path_configs + 'system');

const linkLogin		= StringHelpers.formatLink('/dang-nhap'); 

module.exports = (req, res, next) => {
    console.log(req.user)
    if(req.isAuthenticated()){
            next();
    }else {
        res.redirect(linkLogin)
    }
    
}