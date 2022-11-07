const FrontEndHelpers = require(__path_helpers + 'frontend');


module.exports = async(req, res, next) => {
    await FrontEndHelpers.getListProductOption().then(items=>{
        res.locals.listProductOption = items; 
    })
    next();
}