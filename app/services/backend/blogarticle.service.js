const mainName = "blogarticle"
const modelBlogArticle 	= require(__path_models_backend + `${mainName}.model`);
const modelBlogCategory  = require(__path_models_backend + `blogcategory.model`);


module.exports = {
    saveItems: async (params) =>{
        let data = await modelBlogArticle(params).save(async function(err,room) {
            let userArr = await modelBlogCategory.findById({_id: room.category})
            userArr.articleList.push(room)
            await modelBlogCategory(userArr).save()
         })
        return 
        },
    listItems: async (objWhere,
                    currentPage,
                    totalItemsPerPage,
                    updatedAt
                    ) => {
                        let data = await modelBlogArticle.find(objWhere)
                                                    .skip((currentPage-1) * totalItemsPerPage)
                                                    .limit(totalItemsPerPage)
                                                    .sort(updatedAt)
                        return data;
    },
    deleteItem: async (id) =>{
                let removeObject = await modelBlogArticle.findOne({_id: id}).then( async (obj)=>{
                let userArr = await modelBlogCategory.findById({_id: obj.category})
                userArr.articleList.remove(id)
                await modelBlogCategory(userArr).save()
                let data = await modelBlogArticle.deleteOne({_id: id})
                })
        return
    },
    deleteItemsMulti: async (arrId) =>{
            await Promise.all(arrId.map(async (id,index) => {
                    let removeObject = await modelBlogArticle.findOne({_id: id}).then( async (obj)=>{
                    let userArr = await modelBlogCategory.findById({_id: obj.category})
                    userArr.articleList.remove(id)
                    await modelBlogCategory(userArr).save()
                    let data = await modelBlogArticle.deleteOne({_id: id})
                    })
              }))
              .catch((error) => {
                return Promise.reject()
              });
            return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelBlogArticle.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelBlogArticle.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelBlogArticle.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelBlogArticle.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelBlogArticle.updateOne({_id: id}, item)
        return
    },
    changeOption: async (id, field, isCheck) =>{
        let data = await modelBlogArticle.updateOne({_id: id}, {[field]: isCheck})
        return
    },
    changeCategory: async (id, newCategory) =>{
        let data = await modelBlogArticle.updateOne({_id: id}, {category: newCategory})
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelBlogArticle.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelBlogArticle.count(objWhere)
        return data
    },
}


