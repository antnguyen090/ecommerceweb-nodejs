const mainName = "managegroup"
const modelManageGroup 	= require(__path_models_backend + `${mainName}.model`);

module.exports = {
    saveItems: async (params) =>{
            let data = await modelManageGroup(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelManageGroup.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
},
    deleteItem: async (id) =>{
        let data = await modelManageGroup.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelManageGroup.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelManageGroup.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelManageGroup.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelManageGroup.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelManageGroup.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelManageGroup.updateOne({_id: id}, item)
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelManageGroup.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelManageGroup.count(objWhere)
        return data
    },
    getGroupList: async (val) =>{
        let data = await modelManageGroup.find(val)
        return data
    },
    getGroupById: async (val) =>{
        let data = await modelManageGroup.findOne({_id: val, status:'active'})
        return data
    },
}


