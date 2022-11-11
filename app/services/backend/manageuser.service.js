const mainName = "manageuser"
const modelManageUser 	= require(__path_models_backend + `${mainName}.model`);
const modelManageGroup  = require(__path_models_backend + `managegroup.model`);
const serviceSetting = require(__path_services_backend + `setting.service`);
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const notify = require(__path_configs + 'notify');
const OTPHelpers = require(__path_helpers + 'generateotp');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    saveItems: async (params) =>{
        let data = await modelManageUser(params).save(async function(err,room) {
            if(!room.group) return
            let userArr = await modelManageGroup.findById({_id: room.group})
            await userArr.usersList.push(room)
            await modelManageGroup(userArr).save()
            return room
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
        let removeObject = await modelManageUser.findOne({_id: id}).then( async (obj)=>{
            if(obj.group){
            let productArr = await modelManageGroup.findById({_id: obj.group})
            productArr.usersList.remove(id)
            await modelManageGroup(productArr).save()
            }
            let data = await modelManageUser.deleteOne({_id: id})
        })
        return
    },
    deleteItemsMulti: async (arrId) =>{
        await Promise.all(arrId.map(async (id,index) => {
            let removeObject = await modelManageUser.findOne({_id: id}).then( async (obj)=>{
            if(obj.group){
                let productArr = await modelManageGroup.findById({_id: obj.group})
                productArr.usersList.remove(id)
                await modelManageGroup(productArr).save()
            }
            let data = await modelManageUser.deleteOne({_id: id})
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
    changeCategory: async (id, newGroup) =>{
        let updateOldCategory = modelManageUser.findOne({_id: id}).then(async item=>{
            await modelManageGroup.findOne({_id: item.group}).then( async (error, oldItem)=>{
                if(!oldItem) return
                oldItem.usersList.remove(id)
                await modelManageGroup(oldItem).save()
            })
            await modelManageGroup.findOne({_id: newGroup}).then( async newItem=>{
                if(!newItem) return
                newItem.usersList.push(id)
                await modelManageGroup(newItem).save()
            })
        })
        let data = await modelManageUser.updateOne({_id: id}, {group: newGroup})
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
    getUserByEmail: async (email) =>{
        let data = await modelManageUser.findOne({email:email})
        return data
    },
    getUserById: async (id) =>{
        let data = await modelManageUser.findOne({_id: id}).select('-password').populate('address',['province'],'group',['group_acp', 'status'])
        return data
    },
    saveUser: async (obj) =>{
        let data = await modelManageUser(obj).save()
        return data
    },
    updatePasswordUser: async (obj) =>{
        let email = obj.email
        let newPassword = obj.password
        let user  = await modelManageUser.findOne({email: email})
        let oldPassword = user.password
        let CheckPassNew = await bcrypt.compare(newPassword,oldPassword);
        if(CheckPassNew){
            return {success: false, errors: [{msg: notify.ERROR_PASS_CHANGE}]}
        } else{
            let salt = await bcrypt.genSalt(saltRounds);
            let hashPassword = await bcrypt.hash(newPassword, salt);
            let data = await modelManageUser.updateOne({email: email}, {password: hashPassword})
            return {success: true}
        }
    },
    sendMailRegisterSuccess: async (email)=>{
                // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let setting = await serviceSetting.getOne()
        let settingObj = JSON.parse(setting.setting)
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: "gmail" ,
        //   host: "smtp.gmail.com",
        //   port: 587,
        //   secure: false, // true for 465, false for other ports
          auth: {
            user: `${process.env.EMAIL_SMTP}`, // generated ethereal user
            pass: `${process.env.PASSWORD_SMTP}`, // generated ethereal password
          },
        });
        // send mail with defined transport object
        let infoForClient = await transporter.sendMail({
          from: `"${settingObj.title}" <${settingObj.main_email}>`, // sender address
          to: `${email}`, // list of receivers
          subject: 'ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG', // Subject line
          // text: settingObj.content_email_newsletter, // plain text body
          html: `Bạn đã đăng ký thành công tại ${settingObj.title}.
                Đăng nhập tại đây: https://antnguyen-ecommercenodejs.herokuapp.com/dang-nhap
          `, // html body
        });
    },
    updateInfoUser: async (obj)=>{
        let result = await modelManageUser.updateOne({email: obj.email}, {
            name: obj.name, 
            address: {info: obj.addressInfo, 
                      province: obj.province},
            phonenumber: obj.phonenumber})
        return result
      }
    ,
    checkExitEmail: async(email) =>{
        let checkExit = await module.exports.getUserByEmail(email).then(async user=>{
                if(!user){
                    return {error: notify.ERROR_LOGIN_CHECKUSER}
                } else {
                    let otpCode =  await OTPHelpers.generateOTP(4)
                    let nowTime = Date.now()
                    user.otp.code = otpCode
                    user.otp.time_get = nowTime
                    await modelManageUser.updateOne({email: email}, user).then(async obj=>{
                        let setting = await serviceSetting.getOne()
                        let settingObj = JSON.parse(setting.setting)
                        let transporter = nodemailer.createTransport({
                          service: "gmail" ,
                          auth: {
                            user: `${process.env.EMAIL_SMTP}`, // generated ethereal user
                            pass: `${process.env.PASSWORD_SMTP}`, // generated ethereal password
                          },
                        });
                    let infoForClient = await transporter.sendMail({
                          from: `"${settingObj.title}" <${settingObj.main_email}>`, // sender address
                          to: `${user.email}`, // list of receivers
                          subject: `${settingObj.title} - MÃ OTP`, // Subject line
                          text: `Mã OTP của bạn là: ${user.otp.code}. Thời gian sử dụng trong vòng 5 phút.`, // plain text body
                        });
                    })
                      return {success: true, user: user }
                }
            })
            return checkExit
    },
    finalResetPassword: async(email, otp, password)=>{
        let result = await module.exports.getUserByEmail(email).then(async user=>{
            if(!user){
                return {error: notify.ERROR_LOGIN_CHECKUSER}
            } else{
                let nowTime = new Date(Date.now())
                let otpTime = new Date(user.otp.time_get)
                if((nowTime-otpTime) > 300000){
                    return {error: notify.ERROR_OTP_OUTTIME}
                } else{
                    let otpCode = user.otp.code
                    if(otpCode === otp ){
                        let salt = await bcrypt.genSalt(saltRounds);
                        user.password = await bcrypt.hash(password, salt);
                        await modelManageUser.updateOne({email: email},user).then(async obj=>{
                            let setting = await serviceSetting.getOne()
                            let settingObj = JSON.parse(setting.setting)
                            let transporter = nodemailer.createTransport({
                              service: "gmail" ,
                              auth: {
                                user: `${process.env.EMAIL_SMTP}`, // generated ethereal user
                                pass: `${process.env.PASSWORD_SMTP}`, // generated ethereal password
                              },
                            });
                        let infoForClient = await transporter.sendMail({
                              from: `"${settingObj.title}" <${settingObj.main_email}>`, // sender address
                              to: `${user.email}`, // list of receivers
                              subject: `${settingObj.title} - ĐỔI MẬT KHẨU`, // Subject line
                              text: `Bạn đã đổi mật khẩu thành công`, // plain text body
                            });
                        })

                        return {success: notify.SUCCESS_PASSWORD_CHANGE}
                    } else{
                        return {error: notify. ERROR_OTP_WRONG}
                    }
                }
            }
        })
        return result
    }
}


