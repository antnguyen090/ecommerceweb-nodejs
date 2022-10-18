const mainName = "menubar"
const modelMenuBar 	= require(__path_models_backend + `${mainName}.model`);

module.exports = {
    saveItems: async (params) =>{
            let data = await modelMenuBar(params).save()
            return
        },
    listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelMenuBar.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
        },
    deleteItem: async (id) =>{
        let data = await modelMenuBar.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelMenuBar.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelMenuBar.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelMenuBar.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelMenuBar.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelMenuBar.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelMenuBar.updateOne({_id: id}, item)
        return
    },
    changeParent: async (id, newParent) =>{
        let data = await modelMenuBar.updateOne({_id: id}, {parentMenu: newParent})
        return
    },
    getRootList: async (obj) =>{
        let data = await modelMenuBar.find(obj)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelMenuBar.count(objWhere)
        return data
    },
    checkDuplicated: async (val) =>{
        let data = await modelMenuBar.find(val)
        return data
    },
    getMenuBar:  async (status, sort) =>{
        let data = await modelMenuBar.find({status: status}).sort({ordering: sort })
        return data
    },
}


