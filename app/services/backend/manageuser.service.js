const mainName = "manageuser"
const modelManageUser 	= require(__path_models_backend + `${mainName}.model`);
const modelManageGroup  = require(__path_models_backend + `managegroup.model`);


module.exports = {
    saveItems: async (params) =>{
        let data = await modelManageUser(params).save(async function(err,room) {
            let userArr = await modelManageGroup.findById({_id: room.group})
            userArr.manageuser.push(room)
            await modelManageGroup(userArr).save()
         })
        return 
        },
    listItems: async (objWhere,
                    currentPage,
                    totalItemsPerPage,
                    updatedAt
                    ) => {
                        let data = await modelManageUser.find(objWhere)
                                                    .skip((currentPage-1) * totalItemsPerPage)
                                                    .limit(totalItemsPerPage)
                                                    .sort(updatedAt)
                        return data;
    },
    deleteItem: async (id) =>{
        let data = await modelManageUser.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelManageUser.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelManageUser.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelManageUser.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await modelManageUser.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelManageUser.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelManageUser.updateOne({_id: id}, item)
        return
    },
    changeOption: async (id, field, isCheck) =>{
        let data = await modelManageUser.updateOne({_id: id}, {[field]: isCheck})
        return
    },
    changeCategory: async (id, newCategory) =>{
        let data = await modelManageUser.updateOne({_id: id}, {categoryId: newCategory, category: newCategory})
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelManageUser.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelManageUser.count(objWhere)
        return data
    },
}


