const mainName = "slider"
const modelSlider 	= require(__path_models_backend + `${mainName}.model`);

module.exports = {
    saveItems: async (params) =>{
        let data = await modelSlider(params).save()
        return 
        },
    listItems: async (objWhere,
                    currentPage,
                    totalItemsPerPage,
                    updatedAt
                    ) => {
                        let data = await modelSlider.find(objWhere)
                                                    .skip((currentPage-1) * totalItemsPerPage)
                                                    .limit(totalItemsPerPage)
                                                    .sort(updatedAt)
                        return data;
    },
    deleteItem: async (id) =>{
            let data = await modelSlider.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
            await Promise.all(arrId.map(async (id,index) => {
                let data = await modelSlider.deleteOne({_id: id})
              }))
              .catch((error) => {
                console.error(error.message)
                return error
              });
            return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelSlider.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelSlider.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelSlider.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelSlider.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelSlider.updateOne({_id: id}, item)
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelSlider.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelSlider.count(objWhere)
        return data
    },
    changeLink: async (id, link) =>{
        let data = await modelSlider.updateOne({_id: id}, {link: link})
        return
    },
    getListByStatus: async (status) =>{
        let data = await modelSlider.find({status: status})
        return data
    }
}


