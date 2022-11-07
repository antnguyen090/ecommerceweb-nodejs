const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig       = require(__path_configs + 'system');

const linkLogin		= StringHelpers.formatLink('/dang-nhap'); 

module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
        if(req.user.username === "thinhnguyenxy04@gmail.com") {
            next();
        }else {
            res.redirect('/');
        }
    }else {
        next();
    }
    
}