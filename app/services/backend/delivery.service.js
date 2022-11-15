const mainName = "delivery"
const modelDelivery 	= require(__path_models_backend + `${mainName}.model`);

module.exports = {
    saveItems: async (params) =>{
            let data = await modelDelivery(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelDelivery.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
},
    deleteItem: async (id) =>{
        let data = await modelDelivery.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelDelivery.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelDelivery.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelDelivery.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelDelivery.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelDelivery.find({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelDelivery.updateOne({_id: id}, item)
        return
    },
    countItem: async (objWhere) =>{
        let data = await modelDelivery.count(objWhere)
        return data
    },
    checkDuplicatedName: async (val) =>{
        let data = await modelDelivery.find({province: val})
        return data
    },
    getCategoryList: async (status, sort = 'asc') =>{
        let data = await modelDelivery.find({status: status}).sort({ordering: sort })
        return data
    },
    getOneByID: async (id) =>{
        let data = await modelDelivery.findOne({_id: id})
        return data
    },
}