const FrontEndHelpers = require(__path_helpers + 'frontend');


module.exports = async(req, res, next) => {
    await FrontEndHelpers.getListBlogCategory().then(items=>{
        res.locals.listBlogCategory = items; 
    })
    next();
}

