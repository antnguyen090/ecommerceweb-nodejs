const FrontEndHelpers = require(__path_helpers + 'frontend');


module.exports = async(req, res, next) => {
    await FrontEndHelpers.getMenuBar().then(items=>{
        res.locals.listmenu = items; 
    })
    next();
}

