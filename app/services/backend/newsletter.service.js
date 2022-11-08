const mainName = "newsletter"
const modelNewsLetter 	= require(__path_models_backend + `${mainName}.model`);
const serviceSetting = require(__path_services_backend + `setting.service`);

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

module.exports = {
    saveItems: async (params) =>{
            let data = await modelNewsLetter(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await modelNewsLetter.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
    },

    changeStatus: async (id, status) =>{
        let data = await modelNewsLetter.findOneAndUpdate({_id: id}, {status: status})
        return data
      },
    changeOrdering: async (id, ordering) =>{
            let data = await modelNewsLetter.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await modelNewsLetter.findOne({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await modelNewsLetter.updateOne({_id: id}, item)
        return
    },
    checkDuplicated: async (val) =>{
      let data = await modelNewsLetter.findOne(val)
      return data
    },
    countItem: async (objWhere) =>{
        let data = await modelNewsLetter.count(objWhere)
        return data
    },
    sendMailLetter: async function (params) {
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
          to: `${params.email}`, // list of receivers
          subject: settingObj.subject_email_newsletter, // Subject line
          // text: settingObj.content_email_newsletter, // plain text body
          html: settingObj.content_email_newsletter, // html body
        });

        // let infoForMember = await transporter.sendMail({
        //   from: `"${params.name}" <${params.email}>`, // sender address
        //   to: `${listReceiversObj}`, // list of receivers
        //   subject: `${params.subject} - ${params.phonenumber}`, // Subject line
        //   text: `
        //   ${params.message}
        //   `, // plain text body
        //   html: "<b>Hello world?</b>", // html body
        // });
        console.log("Message sent: %s", infoForClient.messageId);
        // console.log("Message sent: %s", infoForMember.messageId);
      }
}


