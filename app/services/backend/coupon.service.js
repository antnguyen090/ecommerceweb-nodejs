const mainName      = "coupon"
const modelCoupon = require(__path_models_backend + `${mainName}.model`);

module.exports = {
    saveItems: async (params) =>{
        let data = await modelCoupon(params).save()
        return 
        },
    listItems: async (objWhere,
                    currentPage,
                    totalItemsPerPage,
                    updatedAt
                    ) => {
                        let data = await modelCoupon.find(objWhere)
                                                    .skip((currentPage-1) * totalItemsPerPage)
                                                    .limit(totalItemsPerPage)
                                                    .sort(updatedAt)
                        return data;
    },
    deleteItem: async (id) =>{
        let data = await modelCoupon.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelCoupon.deleteMany({_id: {$in: arrId}})
        return
    },
    changeStatus: async (id, status) =>{
        let data = await modelCoupon.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelCoupon.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
        let data = await modelCoupon.updateOne({_id: id}, {ordering: ordering})
        return
    },
    getItemByID: async (id) =>{
        let data = await modelCoupon.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelCoupon.updateOne({_id: id}, item)
        return
    },
    changeOption: async (id, field, isCheck) =>{
        let data = await modelCoupon.updateOne({_id: id}, {[field]: isCheck})
        return
    },
    changeCategory: async (id, newCategory) =>{
        let data = await modelCoupon.updateOne({_id: id}, {category: newCategory})
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelCoupon.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelCoupon.count(objWhere)
        return data
    },
    changeTime: async (id, time) =>{
        let data = await modelCoupon.updateOne({_id: id}, {time: time})
        return
    },
    getListCoupon: async () =>{
        let data = await modelCoupon.find({status: 'active'}).sort({ updatedAt : 'desc'})
        return data
    }
}


