const mainName      = "discount"
const modelDiscount = require(__path_models_backend + `${mainName}.model`);
const modelProduct  = require(__path_models_backend + "product.model");

module.exports = {
    saveItems: async (params) =>{
        let data = await modelDiscount(params).save(async function(err,room) {
                    let productListSelect = params.productList
                    await Promise.all(productListSelect.map(async (id,index) => {
                        let findObject = await modelProduct.findOne({_id: id}).then( async (obj)=>{
                            obj.discountProduct.push(room.id)
                            await modelProduct(obj).save()
                    })
                 }))
                .catch((error) => {
                    console.error(error.message)
                    return Promise.reject()
                });
            return
         })
        return 
        },
    listItems: async (objWhere,
                    currentPage,
                    totalItemsPerPage,
                    updatedAt
                    ) => {
                        let data = await modelDiscount.find(objWhere)
                                                    .skip((currentPage-1) * totalItemsPerPage)
                                                    .limit(totalItemsPerPage)
                                                    .sort(updatedAt)
                        return data;
    },
    deleteItem: async (id) =>{
        let removeObject = await modelDiscount.findOne({_id: id}).then( async (objDiscount)=>{
            let productList = await objDiscount.productList
            let delele = await Promise.all(productList.map(async (idProduct,index) => {
                    modelProduct.countDocuments({_id: idProduct}, async function (err, count){ 
                            if(count>0){
                                let findObject = await modelProduct.findOne({_id: idProduct}).then( async (objProduct)=>{
                                    await objProduct.discountProduct.remove(id)
                                    await modelProduct(objProduct).save()
                                })
                            }
                            return
                    }); 
                    return
            }))
            .then(async ()=>{
                let data = await modelDiscount.deleteOne({_id: id})
            })
            .catch((error) => {
                console.error(error.message)
                return Promise.reject(error)
            });
        })
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let dataDelete = await Promise.all(arrId.map(async (idDiscount,index) => {
                await module.exports.deleteItem(idDiscount)
                return
        }))
        .then(async ()=>{
            return
        })
        .catch((error) => {
            console.error(error.message)
            return Promise.reject(error)
        })
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelDiscount.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelDiscount.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
        let data = await modelDiscount.updateOne({_id: id}, {ordering: ordering})
        return
    },
    getItemByID: async (id) =>{
        let data = await modelDiscount.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelDiscount.findOne({_id: id}).then(async old=>{
            let newItem = item.productList
            let oldItem = old.productList
            let addNew = newItem.filter(obj => !oldItem.includes(obj.toString()))
            let exceptItem = oldItem.filter(obj => !newItem.includes(obj.toString()))
            console.log(exceptItem)
            console.log(addNew)
            await Promise.all(addNew.map(async (idd,index) => {
                let findObject = await modelProduct.findOne({_id: idd.toString()}).then( async (obj)=>{
                    obj.discountProduct.push(id)
                    await modelProduct(obj).save()
                })
            }))
            .catch((error) => {
                console.error(error.message)
                return Promise.reject()
            });
            await Promise.all(exceptItem.map(async (idd,index) => {
                let findObject = await modelProduct.findOne({_id: idd}).then( async (obj)=>{
                    obj.discountProduct.remove(id)
                    await modelProduct(obj).save()
                })
            }))
            .catch((error) => {
                console.error(error.message)
                return Promise.reject()
            });
            await modelDiscount.updateOne({_id: id}, item)
        })
        return
    },
    changeOption: async (id, field, isCheck) =>{
        let data = await modelDiscount.updateOne({_id: id}, {[field]: isCheck})
        return
    },
    changeCategory: async (id, newCategory) =>{
        let data = await modelDiscount.updateOne({_id: id}, {category: newCategory})
        return
    },
    checkDuplicated: async (val) =>{
        let data = await modelDiscount.find(val)
        return data
    },
    countItem: async (objWhere) =>{
        let data = await modelDiscount.count(objWhere)
        return data
    },
    changeTime: async (id, time) =>{
        let data = await modelDiscount.updateOne({_id: id}, {time: time})
        return
    },
}


