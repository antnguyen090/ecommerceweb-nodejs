const mainName = "blogcategory"
const modelBlogCategory 	= require(__path_models_backend + `${mainName}.model`);

module.exports = {
    saveItems: async (params) =>{
            let data = await modelBlogCategory(params).save()
            return
        },
    listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelBlogCategory.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
},
    deleteItem: async (id) =>{
        let data = await modelBlogCategory.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelBlogCategory.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelBlogCategory.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelBlogCategory.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelBlogCategory.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelBlogCategory.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelBlogCategory.updateOne({_id: id}, item)
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelBlogCategory.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelBlogCategory.count(objWhere)
        return data
    },
    getCategoryList: async (val) =>{
        let data = await modelBlogCategory.find(val)
        return data
    },
    getCategoryById: async (val) =>{
        let data = await modelBlogCategory.findOne({_id: val, status:'active'})
        return data
    },
    getForDashboard: async (obj) =>{
        let data = await modelBlogCategory.find({})
        return data
    }
}


