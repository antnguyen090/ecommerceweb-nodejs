
const serviceSlider = require(__path_services_backend + `slider.service`);
const serviceMenuBar = require(__path_services_backend + `menubar.service`);
const serviceCategory = require(__path_services_backend + `category.service`);
const serviceSetting = require(__path_services_backend + `setting.service`);
const serviceProduct = require(__path_services_backend + `product.service`);
const serviceContact  = require(__path_services_backend + `contact.service`);



let getSlider = async () => {
    let data = await serviceSlider.getListByStatus('active')
    return data
}

let getMenuBar = async () => {
  let data = await serviceMenuBar.getMenuBar('active','asc')
  return data
}

let getListCategory = async () => {
  let data = await serviceCategory.getCategoryList('active','asc')
  return data
}

let getInforSetting = async ()=>{
  let data = await serviceSetting.getOne()
  data = await JSON.parse(data.setting)
  return data
}

let getListProductOption = async () =>{
  let data = await serviceProduct.getListProductOption()
  return data
}

let getOneProduct = async (obj) =>{
  let data = await serviceProduct.getOneProduct(obj)
  return data
}

let getProductByCategory = async (slug) =>{
  let data = await serviceCategory.getProductByCategory(slug)
  return data
}

let sendMailContact = async (item) =>{
  let data = await serviceContact.sendMailContact(item)
  return data
}

let saveContact     = async (item) =>{
  let data = await serviceContact.saveItems(item)
  return data
}


module.exports = {
  getSlider,
  getMenuBar,
  getListCategory,
  getInforSetting,
  getListProductOption,
  getOneProduct,
  getProductByCategory,
  sendMailContact,
  saveContact,
}