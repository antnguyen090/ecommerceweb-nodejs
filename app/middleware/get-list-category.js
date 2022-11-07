const FrontEndHelpers = require(__path_helpers + 'frontend');


module.exports = async(req, res, next) => {
    await FrontEndHelpers.getListCategory().then(items=>{
        res.locals.listCategory = items; 
    })
    next();
}

