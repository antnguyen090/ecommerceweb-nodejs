const FrontEndHelpers = require(__path_helpers + 'frontend');


module.exports = async(req, res, next) => {
    await FrontEndHelpers.getInforSetting().then(items=>{
        res.locals.settingPage = items; 
    })
    next();
}

