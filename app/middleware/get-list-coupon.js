const FrontEndHelpers = require(__path_helpers + 'frontend');


module.exports = async(req, res, next) => {
    await FrontEndHelpers.getListCoupon().then(items=>{
        res.locals.couponData = items; 
    })
    next();
}

