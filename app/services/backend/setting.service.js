const mainName = "setting"
const modelSetting 	= require(__path_models_backend + `${mainName}.model`);

module.exports = {
    saveItems: async (params) =>{
            let data = await modelSetting(params).save()
            return
        },
    listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelSetting.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
        },
    deleteItem: async (id) =>{
        let data = await modelSetting.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelSetting.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelSetting.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelSetting.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelSetting.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelSetting.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelSetting.updateOne({_id: id}, item)
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelSetting.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelSetting.count(objWhere)
        return data
    },
    getOne: async () =>{
        let data = await modelSetting.findOne()
        return data
    },
}


