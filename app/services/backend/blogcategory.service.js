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
    getCategoryList: async (status, sort = 'asc') =>{
        let data = await modelBlogCategory.find({status: status}).sort({ordering: sort })
        return data
    },
    getCategoryById: async (val) =>{
        let data = await modelBlogCategory.findOne({_id: val, status:'active'})
        return data
    },
    getForDashboard: async (obj) =>{
        let data = await modelBlogCategory.find({})
        return data
    },
    checkExits: async (obj) =>{
        let data = await modelBlogCategory.exists(obj)
        return data
    },
    getArticleByBlogCategory: async (slug, currentPage, totalItemsPerPage) =>{
        let data = await modelBlogCategory.findOne({slug: slug, status: 'active'}).populate({
                    path: 'articleList',
                    select: '-editordata',
                    populate: {
                        path: 'category'
                    }
                }).exec()
        let totalItem = data.articleList.length
        let name = data.name
        let sliceIndex = (currentPage-1)*totalItemsPerPage
        let arrArticle = data.articleList.slice(sliceIndex, totalItemsPerPage*currentPage)
        return {totalItem, arrArticle, name}
    },
    getArticleRelated: async (slug) =>{
        let data = await modelBlogCategory.findOne({slug: slug, status: 'active'}).populate({ 
            path: 'articleList',
            options: {
                    limit: 3,
                    select: '-editordata'
            },
            populate: {
              path: 'category',
            } 
         })
         return data
    }
}


