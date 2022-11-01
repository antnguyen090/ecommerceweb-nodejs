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
        let removeObject = await modelProduct.findOne({_id: id}).then( async (obj)=>{
            let productArr = await modelCategory.findById({_id: obj.category})
            productArr.productList.remove(id)
            await modelCategory(productArr).save()
            let data = await modelProduct.deleteOne({_id: id})
        })
        return
    },
    deleteItemsMulti: async (arrId) =>{
        await Promise.all(arrId.map(async (id,index) => {
            let removeObject = await modelProduct.findOne({_id: id}).then( async (obj)=>{
            let productArr = await modelCategory.findById({_id: obj.category})
            productArr.productList.remove(id)
            await modelCategory(productArr).save()
            let data = await modelProduct.deleteOne({_id: id})
            })
             }))
            .catch((error) => {
                console.error(error.message)
                return Promise.reject()
            });
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
        let updateOldCategory = modelProduct.findOne({_id: id}).then(async item=>{
            await modelCategory.findOne({_id: item.category}).then( async oldItem=>{
                console.log("oldItem")
                console.log(oldItem)
                oldItem.productList.remove(id)
                await modelCategory(oldItem).save()
            })
            await modelCategory.findOne({_id: newCategory}).then( async newItem=>{
                console.log("newItem")
                console.log(newItem)
                newItem.productList.push(id)
                await modelCategory(newItem).save()
            })
        })
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
    checkExit: async (val) =>{
        if ( typeof val == 'string'){
            let data = await modelProduct.exists({ _id: val })
            return data
        } else{
            await Promise.all(val.map(async (id,index) => {
                    let data = await modelProduct.exists({ _id: id })
                    return data
                 }))
                .catch((error) => {
                    return Promise.reject()
        });
        }
    },
    updateSortable: async (id, thumb) =>{
        let data = await modelProduct.updateOne({_id: id}, {thumb: thumb})
        return data
    },
    getListProductOption: async (id, thumb) =>{
        let data = await modelProduct.find({$or: [{ dailydeals: true }, { fearturedproduct: true }]}).populate("discountProduct")
        return data
    },
    getOneProduct : async (obj) =>{
        let data = await modelProduct.findOne(obj)
        return data
    },
    findall: async () =>{
        await modelProduct.find({}).then(async function (data, err) {
            let arr = []
                if (!err) {
                    await Promise.all(data.map(async item=>{
                        if(item.category == '6357a9634386e9ab343e6574'){
                            arr.push(item.id)
                        }
                    }))
                    console.log(arr)
                    let update = await modelCategory.updateMany({_id: '6357a9634386e9ab343e6574'}, {"productList": arr})
                } else {
                    throw err;
                }
            })
     },
    clearall: async () =>{
        let data = await modelCategory.updateMany({"$set":{"productList": []}})
        return
    }
}


