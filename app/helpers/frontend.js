
const serviceSlider = require(__path_services_backend + `slider.service`);
const serviceMenuBar = require(__path_services_backend + `menubar.service`);
const serviceCategory = require(__path_services_backend + `category.service`);
const serviceSetting = require(__path_services_backend + `setting.service`);
const serviceProduct = require(__path_services_backend + `product.service`);
const serviceContact  = require(__path_services_backend + `contact.service`);
const serviceNewsletter  = require(__path_services_backend + `newsletter.service`);
const serviceCoupon = require(__path_services_backend + `coupon.service`);
const serviceDelivery = require(__path_services_backend + `delivery.service`);
const serviceManageUser = require(__path_services_backend + `manageuser.service`);


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

let getProductByCategory = async (slug, currentPage, totalItemsPerPage,rangePrice, sort) =>{
  let data = await serviceCategory.getProductByCategory(slug,currentPage, totalItemsPerPage, rangePrice, sort)
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

let sendMailLetter  = async (item) =>{
  let data = await serviceNewsletter.sendMailLetter(item)
  return data
}

let saveNewsletter   = async (item) =>{
  let dataDuplicated = await serviceNewsletter.checkDuplicated({email: item.email})
  if (dataDuplicated) return
  let data = await serviceNewsletter.saveItems(item)
  return data
}

let checkCategoryExits   = async (item) =>{
  let data = await serviceCategory.checkExits(item)
  if (!data) return
  return data
}

let getProductRelated   = async (slug) =>{
  let data = await serviceCategory.getProductRelated(slug)
  if (!data) return
  return data
}

let getListCoupon = async () =>{
  let data = await serviceCoupon.getListCoupon()
  if (!data) return
  return data
}

let getProductByIds = async (data)=>{
  let result = await serviceProduct.getProductByIds(data)
  return result
}

let getProductById = async (data)=>{
  let result = await serviceProduct.getProductById(data)
  return result
}

let getDeliveryList = async () =>{
  let result = await serviceDelivery.getCategoryList('active')
  return result
}
let checkProductExits = async (obj) =>{
  let result = await serviceProduct.checkProductExits(obj)
  return result
}

let getCodeCoupon = async (obj)=>{
  let result = await serviceCoupon.getCodeCoupon(obj)
  return result
}

let updateInfoUser = async (obj)=>{
  let result = await serviceManageUser.updateInfoUser(obj)
  return result
}

let updatePasswordUser = async (obj)=>{
  let result = await serviceManageUser.updatePasswordUser(obj)
  return result
}

let getAllProduct = async (objWhere,
  currentPage,
  totalItemsPerPage,
  filter,
  sort
  )=>{
  let result = await serviceProduct.getAllProduct(objWhere,
    currentPage,
    totalItemsPerPage,
    filter,
    sort
    )
  return result
}

let countProduct = async (objWhere)=>{
  let result = await serviceProduct.countItem(objWhere)
  return result
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
  sendMailLetter,
  saveNewsletter,
  checkCategoryExits,
  getProductRelated,
  getListCoupon,
  getProductByIds,
  getDeliveryList,
  checkProductExits,
  getCodeCoupon,
  updateInfoUser,
  updatePasswordUser,
  getAllProduct,
  countProduct,
  getProductById,
}