const mainName = "contact"
const modelContact 	= require(__path_models_backend + `${mainName}.model`);
const serviceSetting = require(__path_services_backend + `setting.service`);

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

module.exports = {
    saveItems: async (params) =>{
            let data = await modelContact(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelContact.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
    },

    changeStatus: async (id, status) =>{
        let data = await modelContact.findOneAndUpdate({_id: id}, {status: status})
        return data
      },
    changeOrdering: async (id, ordering) =>{
            let data = await modelContact.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelContact.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelContact.updateOne({_id: id}, item)
        return
    },
    checkDuplicated: async (val) =>{
      let data = await modelContact.find(val)
      return data
    },
    countItem: async (objWhere) =>{
        let data = await modelContact.count(objWhere)
        return data
    },
    sendMailContact: async function (params) {
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
          subject: `${settingObj.subject_email}`, // Subject line
          // text: settingObj.content_email, // plain text body
          html: settingObj.content_email, // html body
        });

        let infoForMember = await transporter.sendMail({
          from: `"${params.name}" <${params.email}>`, // sender address
          to: `${listReceiversObj}`, // list of receivers
          subject: `${params.subject} - ${params.phonenumber}`, // Subject line
          text: `
          ${params.message}
          `, // plain text body
        //   html: "<b>Hello world?</b>", // html body
        });
      }
}


