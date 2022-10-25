const mainName = "category"
const modelCategory 	= require(__path_models_backend + `${mainName}.model`);

module.exports = {
    saveItems: async (params) =>{
            let data = await modelCategory(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelCategory.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
},
    deleteItem: async (id) =>{
        let data = await modelCategory.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelCategory.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelCategory.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelCategory.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelCategory.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelCategory.find({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelCategory.updateOne({_id: id}, item)
        return
    },
    countItem: async (objWhere) =>{
        let data = await modelCategory.count(objWhere)
        return data
    },
    checkDuplicatedName: async (val) =>{
        let data = await modelCategory.find({name: val})
        return data
    },
    checkDuplicatedSlug: async (val) =>{
        let data = await modelCategory.find({slug: val})
        return data
    },
    getCategoryList: async (status, sort = 'asc') =>{
        let data = await modelCategory.find({status: status}).sort({ordering: sort })
        return data
    },
    getCategoryById: async (val) =>{
        let data = await modelCategory.findOne({_id: val, status:'active'})
        return data
    },
}