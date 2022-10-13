const mainName = "wheather"
const modelWheather 	= require(__path_models_backend + `${mainName}.model`);

module.exports = {
    saveItems: async (params) =>{
            let data = await modelWheather(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelWheather.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
},
    deleteItem: async (id) =>{
        let data = await modelWheather.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelWheather.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelWheather.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelWheather.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelWheather.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelWheather.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelWheather.updateOne({_id: id}, item)
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelWheather.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelWheather.count(objWhere)
        return data
    },
}


