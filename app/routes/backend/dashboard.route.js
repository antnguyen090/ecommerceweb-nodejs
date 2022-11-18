var express = require('express');
var router = express.Router();
var util = require('util')
const mainName = "dashboard"
const pageTitle = `Dashboard Management`
const folderView = __path_views_backend + `/pages/${mainName}/`;
const layout = __path_views_backend + 'backend';
const serviceCategory = require(__path_services_backend + `category.service`);
const serviceManageUser = require(__path_services_backend + `manageuser.service`);
const serviceBlogCategory = require(__path_services_backend + `blogcategory.service`);

const serviceOrder = require(__path_services_backend + `order.service`);
const Libs = require(__path_configs + 'libs');
const CountItemHelpers = require(__path_helpers + 'count');
var moment = require('moment'); // require


router.get('/', async function(req, res, next) {
  let categoryProduct     = await serviceCategory.getForDashboard()
  let categoryBlog        = await serviceBlogCategory.getForDashboard()

  let dataUser            = await serviceManageUser.lastestUsers(8)
  let dataOrder           = await serviceOrder.lastestOrder(6)
  let countUser           = await CountItemHelpers.countItem('manageuser')
  let contactCount        = await CountItemHelpers.countItem('contact')
  let couponCount         = await CountItemHelpers.countItem('coupon')
  let newsletterCount     = await CountItemHelpers.countItem('newsletter')

  let categoryProductCount = categoryProduct.length
  let categoryBlogCount = categoryBlog.length

  let countItemInList = (data, name) =>{
    return data
    .map((item)=>{
        return item[name].length
        })
    .reduce(
         (previousValue, currentValue) => previousValue + currentValue,
        );
  }
  let productCount  = countItemInList(categoryProduct, 'productList')
  let articleCount  = countItemInList(categoryBlog, 'articleList')


  listBox = [
  {
    name: "Product Category",
    count: categoryProductCount,
    slug: "category",
    icon: "ion ion-ios-copy",
  },
  {
    name: "Product",
    count: productCount,
    slug: "product",
    icon: "ion ion-bag",
  },
  {
    name: "Blog Category",
    count: categoryBlogCount,
    slug: "blogcategory",
    icon: "ion ion-ios-copy",
  },
  {
    name: "Blog Article",
    count: articleCount,
    slug: "blogarticle",
    icon: "ion ion-document-text",
  },
  {
    name: "Users",
    count: countUser,
    slug: "manageuser",
    icon: "ion ion-person-add",
  },
  {
    name: "Contact",
    count: contactCount,
    slug: "contact",
    icon: "ion ion-email",
  },
  {
    name: "Newsletter",
    count: newsletterCount,
    slug: "newsletter",
    icon: "ion-ios-paper",
  },
  {
    name: "Coupon",
    count: couponCount,
    slug: "newsletter",
    icon: "fa-solid fa-percent",
  },
]
  res.render(`${folderView}dashboard`, {
    pageTitle,
    layout,
    listBox,
    dataUser,
    moment,
    dataOrder,
    statusOrder: Libs.statusOrder,
  });
});

module.exports = router;
