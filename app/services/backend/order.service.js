const mainName = "order"
const modelOrder 	= require(__path_models_backend + `${mainName}.model`);
const serviceSetting = require(__path_services_backend + `setting.service`);
const serviceProduct = require(__path_services_backend + `product.service`);
const serviceCoupon = require(__path_services_backend + `coupon.service`);
const serviceDelivery = require(__path_services_backend + `delivery.service`);

const notify = require(__path_configs + 'notify');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const CodeHelpers = require(__path_helpers + 'generateotp');
const CalculatorHelpers = require(__path_helpers + 'calculatorproduct');
const CheckTimeInRangeHelper = require(__path_helpers + 'checktimeinrange');

module.exports = {
    saveItems: async (params) =>{
            let data = await modelOrder(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelOrder.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
    },

    changeStatus: async (id, status) =>{
        let data = await modelOrder.findOneAndUpdate({_id: id}, {status: status})
        return data
      },
    changeOrdering: async (id, ordering) =>{
            let data = await modelOrder.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelOrder.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelOrder.updateOne({_id: id}, item)
        return
    },
    checkDuplicated: async (val) =>{
      let data = await modelOrder.find(val)
      return data
    },
    countItem: async (objWhere) =>{
        let data = await modelOrder.count(objWhere)
        return data
    },
    getOrderByTrackingCode: async (code) =>{
      let result = await modelOrder.findOne({trackingCode: code})
      return result
    }
    ,
    addOrder: async (obj) =>{
      let trackingCode = CodeHelpers.generateAZ(3) + CodeHelpers.generateOTP(6)
      let errorObj = {success: false,errors:[{
        msg: notify.PRESS_F5
      }]}
      let saveOrder = {}
                    saveOrder.name    = obj.name
                    saveOrder.userId  = obj.userId
                    saveOrder.address = {
                      info: obj.infoAddress,
                      province: obj.province,
                    }
                    saveOrder.phoneNumber = obj.phoneNumber
                    saveOrder.notes = obj.notes
                    saveOrder.trackingCode = trackingCode
      let costShip = await serviceDelivery.getOneByID(obj.province)
      if(costShip.cost == obj.costShip){
        saveOrder.costShip = JSON.stringify(costShip)
      }else{
        return Promise.reject(errorObj)
      }
      let listProduct  =  JSON.parse(obj.productOrder)
      let listProductNews = []
      let priceProduct = 0
      let data = await Promise.all(listProduct.map(async (item,index) => {
                let product = await serviceProduct.getProductById(item.id)
                let findDiscount = await CalculatorHelpers.findDiscount(product.discountProduct, product.price)
                let price        = await CalculatorHelpers.productPrice(product.price, findDiscount)
                priceProduct     += await price*item.quantity
                product.quantity = item.quantity
                listProductNews.push(product)
         }))
        .catch((error) => {
            return Promise.reject(errorObj)
        });
      if(priceProduct != obj.priceProduct) {
        return errorObj
      } else{
        saveOrder.priceProduct = priceProduct
      }
      if(obj.couponCode){
        let findCode = await serviceCoupon.getCodeCoupon({status:"active", couponcode: obj.couponCode})
        if(findCode) 
        {
            let minTotal = findCode.couponValue.minTotal
            if(!obj.priceProduct >= minTotal && !CheckTimeInRangeHelper.checkTimeInRange(findCode.time)){
                return errorObj
            } else{
              saveOrder.couponCode = JSON.stringify(findCode)
              let couponMoney = 0
              if(findCode.couponValue.unit == "money"){
                couponMoney = findCode.couponValue.value 
              } else{
                let couponMoneyPercent = findCode.couponValue.value*priceProduct/100
                couponMoney = (couponMoneyPercent >= findCode.couponValue.maxDown) ? findCode.couponValue.maxDown : couponMoneyPercent
              }
              let priceAfterCoupon = priceProduct - couponMoney + costShip.cost
              if(priceAfterCoupon == obj.totalMoney){
                saveOrder.totalMoney  = obj.totalMoney
              } else{
                return errorObj
              }
            }
        } 
      } else{
        let price = priceProduct + costShip.cost
        if(price == obj.totalMoney){
          saveOrder.productList  = obj.totalMoney
        } else{
          return errorObj
        }
      }
      saveOrder.productList = JSON.stringify(listProductNews)
      await module.exports.saveItems(saveOrder)
      await module.exports.sendMailOrderSuccess(obj, trackingCode)
      return {success: true,trackingCode: trackingCode }
    },
    sendMailOrderSuccess: async function (params, trackingCode) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();
        let setting = await serviceSetting.getOne()
        let settingObj = JSON.parse(setting.setting)
        let listReceiversObj = settingObj.main_email + ',' + settingObj.sub_email
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: "gmail" ,
        //   host: "smtp.gmail.com",
        //   port: 587,
        //   secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_SMTP, // generated ethereal user
            pass: process.env.PASSWORD_SMTP, // generated ethereal password
          },
        });
        // send mail with defined transport object
        let infoForClient = await transporter.sendMail({
          from: `"${settingObj.title}" <${settingObj.main_email}>`, // sender address
          to: `${params.email}`, // list of receivers
          subject: notify.EMAIL_ORDER_SUCCESS_SUBJECT, // Subject line
          // text: settingObj.content_email, // plain text body
          html: notify.EMAIL_ORDER_SUCCESS_CONTENT + trackingCode, // html body
        });

        let infoForMember = await transporter.sendMail({
          from: `"${params.name}" <${params.email}>`, // sender address
          to: `${listReceiversObj}`, // list of receivers
          subject: notify.EMAIL_INFORM_ORDER_SUCCESS_SUBJECT, // Subject line
          html: notify.EMAIL_INFORM_ORDER_SUCCESS_CONTENT + trackingCode, // html body
        });
      }
}


