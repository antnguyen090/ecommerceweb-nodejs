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
                    let removeObject = await modelBlogArticle.findOne({_id: id}).exec( async (error, obj)=>{
                    let update  = await modelBlogCategory.updateOne({_id: obj.category},
                                                                    {$pull: {articleList: id}})
                    let data = await modelBlogArticle.deleteOne({_id: id})
                })
        return 
    },
    deleteItemsMulti: async (arrId) =>{
            await Promise.all(arrId.map(async (id,index) => {
                    let data = await module.exports.deleteItem(id)
                    return data
              }))
              .catch((error) => {
                console.log(error)
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
        return data
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
    changeCategory: async (id, newCategory) =>{
        let updateOldCategory = await modelBlogArticle.findOne({_id: id}).then(async item=>{
            await modelBlogCategory.findOne({_id: item.category}).then( async oldItem=>{
                await oldItem.articleList.remove(id)
                await modelBlogCategory(oldItem).save()
            })
            await modelBlogCategory.findOne({_id: newCategory}).then( async newItem=>{
                await newItem.articleList.push(id)
                await modelBlogCategory(newItem).save()
            })
        })
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
    checkExits: async (obj) =>{
        let data = await modelBlogArticle.exists(obj)
        return data
    },
    getAllArticle: async (obj, currentPage, totalItemsPerPage)=>{
        let data = await modelBlogArticle.find(obj)
                                        .populate('category')
                                        .sort({createdAt: 'desc'})     
                                        .skip((currentPage-1) * totalItemsPerPage)
                                        .limit(totalItemsPerPage)
        return data
    },
    getLastestArticle: async (obj,limit)=>{
        let data = await modelBlogArticle.find(obj)
                                            .populate('category')
                                            .sort({createdAt: 'desc'})     
                                            .limit(limit)
        return data
    },
    getOneArticle : async (obj) =>{
        let data = await modelBlogArticle.findOne(obj)
        return data
    },
}


