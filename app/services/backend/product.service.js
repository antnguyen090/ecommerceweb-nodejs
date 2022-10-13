const mainName = "product"
const modelProduct 	= require(__path_models_backend + `${mainName}.model`);
const modelCategory = require(__path_models_backend + "category.model");

module.exports = {
    saveItems: async (params) =>{
        let data = await modelProduct(params).save(async function(err,room) {
            let productArr = await modelCategory.findById({_id: room.category})
            productArr.productList.push(room)
            await modelCategory(productArr).save()
         })
        return 
        },
    listItems: async (objWhere,
                    currentPage,
                    totalItemsPerPage,
                    updatedAt
                    ) => {
                        let data = await modelProduct.find(objWhere)
                                                    .skip((currentPage-1) * totalItemsPerPage)
                                                    .limit(totalItemsPerPage)
                                                    .sort(updatedAt)
                        return data;
    },
    deleteItem: async (id) =>{
        let data = await modelProduct.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelProduct.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelProduct.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelProduct.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
        let data = await modelProduct.updateOne({_id: id}, {ordering: ordering})
        return
    },
    getItemByID: async (id) =>{
        let data = await modelProduct.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelProduct.updateOne({_id: id}, item)
        return
    },
    changeOption: async (id, field, isCheck) =>{
        let data = await modelProduct.updateOne({_id: id}, {[field]: isCheck})
        return
    },
    changeCategory: async (id, newCategory) =>{
        let data = await modelProduct.updateOne({_id: id}, {category: newCategory})
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelProduct.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelProduct.count(objWhere)
        return data
    },
}


