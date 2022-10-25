var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
const notify = require(__path_configs + 'notify');
const fs = require('fs');
var util = require('util')

const mainName = "setting"
const pageTitle = `Setting Management`
const folderView = __path_views_backend + `/pages/${mainName}/`;
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const serviceSetting = require(__path_services_backend + `${mainName}.service`);
const layout = __path_views_backend + 'backend';

const FileHelpers = require(__path_helpers + 'file');
const ValidationHelpers = require(__path_helpers + 'validation');
const uploadThumb = FileHelpers.uploadFileSetting([
  {
    name: 'logoLarge'
  }, {
    name: 'logoSmall'
  }, {
    name: 'logoTitle'
  },
	{
    name: 'logoBanner'
  },
	{
    name: 'photoContent'
  },
	{
    name: 'photoMission'
  }
], `${mainName}`);


// List items

// access FORM
router.get('/', async function (req, res, next) {
	try {
				let inform = req.flash()
				let settingObj = await serviceSetting.getOne()
				let main = {
					pageTitle: pageTitle,
				}
				if (settingObj === null) { // document exists });
						res.render(`${folderView}form`, {
						main:main,
						item: [],
						layout,
						inform
					})
					} else {
						res.render(`${folderView}form`, {
							main: main,
							item: JSON.parse(settingObj.setting),
							layout,
							inform
						});
					}
	} catch (error) {
		console.log(error)
	}
});


router.post('/save/(:id)?', 
	uploadThumb, 
	body('title')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SETTING_TITLEPAGE),
	body('titleAboutUS')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SETTING_TITLE_ABOUTUS),
	body('title_say_client')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SETTING_TITLE_CLIENT), 
	body('list_say_client')
		.custom(async (value, {req}) => {
			try {
				function NotImplementedError(message = "") {
						this.name = "NotImplementedError";
						this.message = message;
				}
				NotImplementedError.prototype = Error.prototype;
				let arr = JSON.parse(value)
				arr.map(item=>{
					if(item.name == "" || item.content == "" || item.career == ""){
						throw new NotImplementedError("")
					}
				})
			} catch (error) {
				if (error.name == "NotImplementedError") return Promise.reject(notify.ERROR_SETTING_LIST_CLIENT)
				return Promise.reject(notify.ERROR_SETTING_LIST_CLIENT_VALUE)
			}
		})
		,
		body('list_mission')
		.custom(async (value, {req}) => {
			try {
				function NotImplementedError(message = "") {
						this.name = "NotImplementedError";
						this.message = message;
				}
				NotImplementedError.prototype = Error.prototype;
				let arr = JSON.parse(value)
				arr.map(item=>{
					if(item.name == "" || item.content == ""){
						throw new NotImplementedError("")
					}
				})
			} catch (error) {
				if (error.name == "NotImplementedError") return Promise.reject(notify.ERROR_SETTING_LIST_MISSION)
				return Promise.reject(notify.ERROR_SETTING_LIST_MISSION)
			}
		})
		,
	body('contentAboutUS')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SETTING_CONTENT_ABOUTUS),
	body('coppyright')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SETTING_COPPYRIGHT),
	body('address')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SETTING_ADDRESS), 
	body('phonenumber')
		.isMobilePhone()
		.withMessage(notify.ERROR_SETTING_PHONENUMBER), 
	body('email')
		.isEmail()
		.normalizeEmail()
		.withMessage(notify.ERROR_SETTING_EMAIL),
	body('main_email')
		.isEmail()
		.normalizeEmail()
		.withMessage(notify.ERROR_SETTING_EMAIL),
	body('sub_email')
		.custom(async (value, {req}) => {
			let emails = req.body.sub_email
			if(!emails) return
			let arrEmail = emails.split(',')
			arrEmail.pop()
			arrEmail.forEach(email=>{
				if(ValidationHelpers.isEmail(email) === false){
					throw new Error(notify.ERROR_SETTING_EMAIL)
				}
			})
			return
	}),
	body('dataAboutUS')
	.custom(async (value, {req}) => {
		let data = req.body.dataAboutUS
		data.forEach(number=>{
			if(isNaN(number) === true || number==''){
				throw new Error(notify.ERROR_SETTING_DATA_ABOUTUS)
			}
		})
		return
	}),
	body('subject_email')
		.isLength({min: 5})
		.withMessage(util.format(notify.ERROR_SETTING_SUBJECT_EMAIL,5)),
	body('subject_email_newsletter')
		.isLength({min: 5})
		.withMessage(util.format(notify.ERROR_SETTING_SUBJECT_EMAIL,5)),
	body('content_email')
		.isLength({min: 20})
		.withMessage(util.format(notify.ERROR_SETTING_CONTENT_EMAIL,20)),
	body('content_email_newsletter')
		.isLength({min: 20})
		.withMessage(util.format(notify.ERROR_SETTING_CONTENT_EMAIL,20)), 
	body('linkfacebook')
		.isURL()
		.withMessage(notify.ERROR_SETTING_URLFACEBOOK), 
	body('linkTwitter')
		.isURL().withMessage(notify.ERROR_SETTING_URLTWITTER), 
	body('linkInstagram')
		.isURL()
		.withMessage(notify.ERROR_SETTING_URLINSTAGRAM), 
	body('linkYoutube')
		.isURL()
		.withMessage(notify.ERROR_SETTING_URLYOUTUBE), 
	body('linkLinkedIn')
		.isURL()
		.withMessage(notify.ERROR_SETTING_URLLINKEDIN), 
	body('logoSmall').custom((value, {req}) => {
			const {image_uploaded_small, image_old_small} = req.body;
			if (!image_uploaded_small && !image_old_small) {
				return Promise.reject(notify.ERROR_FILE_EMPTY);
			}
			if (!req.files.logoSmall && image_uploaded_small) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
			}
			return true;
	}), 
	body('logoLarge').custom((value, {req}) => {
			const {image_uploaded_large, image_old_large} = req.body;
			if (!image_uploaded_large && !image_old_large) {
				return Promise.reject(notify.ERROR_FILE_EMPTY);
			}
			if (!req.files.logoLarge && image_uploaded_large) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
			}
			return true;
	}), 
	body('logoTitle').custom((value, {req}) => {
			const {image_uploaded_title, image_old_title} = req.body;
			if (!image_uploaded_title && !image_old_title) {
				return Promise.reject(notify.ERROR_FILE_EMPTY);
			}
			if (!req.files.logoTitle && image_uploaded_title) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
			}
			return true;
	}),
	body('logoBanner').custom((value, {req}) => {
		const {image_uploaded_banner, image_old_banner} = req.body;
		if (!image_uploaded_banner && !image_old_banner) {
			return Promise.reject(notify.ERROR_FILE_EMPTY);
		}
		if (!req.files.logoBanner && image_uploaded_banner) {
			return Promise.reject(notify.ERROR_FILE_EXTENSION);
		}
		return true;
	})
	, async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
  try {
		console.log(req.body)
		console.log(req.files)
		let settingObj = await serviceSetting.getOne()
    let item = req.body;
		let settingData
		if(settingObj != null){
			settingData = JSON.parse(settingObj.setting)
			item.logosmall = (settingData.logosmall!=undefined) ? settingData.logosmall : undefined
			item.logolarge = (settingData.logolarge!=undefined) ? settingData.logolarge : undefined
			item.logotitle = (settingData.logotitle!=undefined) ? settingData.logotitle : undefined
			item.logobanner = (settingData.logobanner!=undefined) ? settingData.logobanner : undefined
			item.photocontent = (settingData.photocontent!=undefined) ? settingData.photocontent : undefined
			item.photomission = (settingData.photomission!=undefined) ? settingData.photomission : undefined
		}

    let errors = validationResult(req)
    if (! errors.isEmpty()) {
      let main = {
        pageTitle: pageTitle,
        showError: errors.errors,
      }
      if (req.files) {
        for (const [key, value] of Object.entries(req.files)) {
          FileHelpers.remove(`public/uploads/${mainName}/`, value[0].filename)
        }
      }
      res.render(`${folderView}form`, {
				inform: {success: undefined},
        main: main,
        item: req.body,
				layout
      })
    } else {
					if(settingObj === null){
						for (const [key, value] of Object.entries(req.files)) {
							let key = value[0].filename
							item[key.split(".")[0]] = "uploaded" + key;
							fs.renameSync(`public/uploads/${mainName}/${key}`, `public/uploads/${mainName}/uploaded${
								value[0].filename
							}`);
						}
						item = JSON.stringify(item)
						let saveData = await serviceSetting.saveItems({setting: item})
						req.flash('success', notify.SUCCESS_SETTING_SAVE);
						res.redirect(linkIndex);
					} else{
						for (const [key, value] of Object.entries(req.files)) {
							let key = value[0].filename.split(".")[0]
							FileHelpers.remove(`public/uploads/${mainName}/`, `${settingData[key]}`)
						}
						for (const [key, value] of Object.entries(req.files)) {
							let key = value[0].filename
							item[key.split(".")[0]] = "uploaded" + key;
							fs.renameSync(`public/uploads/${mainName}/${key}`, `public/uploads/${mainName}/uploaded${
								value[0].filename
							}`);
						}
						item = JSON.stringify(item)
						let editData = await serviceSetting.editItem(settingObj.id, {setting: item})
						req.flash('success', notify.SUCCESS_SETTING_SAVE);
						res.redirect(linkIndex);
					}
      }
  } catch (error) {
    console.log(error)
  }
});


module.exports = router;


