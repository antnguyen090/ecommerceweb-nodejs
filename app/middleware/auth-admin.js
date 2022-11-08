const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig       = require(__path_configs + 'system');

const linkLogin		= StringHelpers.formatLink('/dang-nhap'); 
const linkPersonal  = StringHelpers.formatLink('/trang-ca-nhan'); 
module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
            if(req.user.group){
                if(req.user.group.group_acp === 'yes' && req.user.group.status === 'active'){
                    next();
                } else{
                    res.redirect(linkPersonal)
                }
            } else{
                res.redirect(linkPersonal)
            }
    }else {
        res.redirect(linkLogin)
    }
    
}