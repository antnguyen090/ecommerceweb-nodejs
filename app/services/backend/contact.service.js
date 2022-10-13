const mainName = "contact"
const modelContact 	= require(__path_models_backend + `${mainName}.model`);
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
    deleteItem: async (id) =>{
        let data = await modelContact.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await modelContact.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await modelContact.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await modelContact.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
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
    mainMail: async function (params) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();
      
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
        let info = await transporter.sendMail({
          from: `"${params.name}" <${params.email}>`, // sender address
          to: "thinhnguyenxy04@gmail.com", // list of receivers
          subject: `${params.subject}`, // Subject line
          text: `${params.message}`, // plain text body
        //   html: "<b>Hello world?</b>", // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }
}


