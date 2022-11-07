var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
var util = require('util')

const mainName = "manageuser"
const pageTitle = `User Management`
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const serviceManageUser = require(__path_services_backend + `${mainName}.service`);
const serviceManageGroup = require(__path_services_backend + `managegroup.service`);

const notify = require(__path_configs + 'notify');
const layout = __path_views_backend + 'backend';

const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const folderView = __path_views_backend + `/pages/${mainName}/`;
const {param} = require('express-validator');
const FileHelpers = require(__path_helpers + 'file');
const uploadThumb	 = FileHelpers.upload('thumb', `${mainName}`);

// List items
router.get('(/status/:status)?', async (req, res, next) => {
	try {
		let category = await serviceManageGroup.getGroupList({status: 'active'})
    let inform = req.flash()
    let objWhere = {};
    let keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
    let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
    let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus, `${mainName}.model`);
    let pagination = {
        totalItems: 1,
        totalItemsPerPage: 10,
        currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
        pageRanges: 3
    };
    if (currentStatus !== 'all') objWhere.status = currentStatus;
    if (keyword !== '') objWhere.name = new RegExp(keyword, 'i');
		pagination.totalItems = await serviceManageUser.countItem(objWhere);
		let data = await serviceManageUser.listItems(objWhere, 
											pagination.currentPage,
											pagination.totalItemsPerPage,
											{updatedAt: 'desc'},
											)
	res.render(`${folderView}list`, {
				layout,
				pageTitle: pageTitle,
				countItemsActive: data.filter(item => item.status === 'active'),
				items: data,
				statusFilter,
				pagination,
				currentStatus,
				category: category,
				keyword,
				inform: inform
			})
	} catch (error) {
		console.log(error)
	}
})

router.post('(/option)', async (req, res, next) => {
	try {
		let {id, field, isCheck} = req.body
		let data = await serviceManageUser.changeOption(id, field, isCheck)
		res.send({success: true})
	} catch (error) {
		console.log(error)
	}
})

// access FORM
router.get('/form/(:id)?', async function (req, res, next) {
	try {
		let inform = req.flash()
		let category = await serviceManageGroup.getGroupList({status: 'active'})
		let main = {pageTitle: pageTitle,
								categoryList: category,
								inform: inform
								}
		if (req.params.id != undefined) {
			let item = await serviceManageUser.getItemByID(req.params.id)
			res.render(`${folderView}form`, {
				pageTitle: pageTitle,
				main: main,
				item: item,
				layout,
			});
			} else {
					res.render(`${folderView}form`, {
						pageTitle: pageTitle,
						main: main,
						item: [],
						layout,
					});
			}
	} catch (error) {
		console.log(error)
	}
});


router.post('/save/(:id)?',
	uploadThumb,
	body('name')
			.isLength({min: 5, max: 100})
			.withMessage(util.format(notify.ERROR_NAME,5,100))
			.custom(async (val, {req}) => {
				let paramId = await(req.params.id != undefined) ? req.params.id : 0
				let data		= await serviceManageUser.checkDuplicated({name: val})
				let length = data.length
				data.forEach((value, index) => {
					if (value.id == paramId) 
						length = length - 1;
				})
				if (length > 0) {
						return Promise.reject(notify.ERROR_NAME_DUPLICATED)
				}
				return
		}),
	body('content')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_DESCRIPTION),
	body('group')
		.custom(async (val, {req}) => {
			if ( val == undefined) {
				return Promise.reject(notify.ERROR_CATEGORY)
			} else {
				try {
					let data = await serviceManageGroup.getGroupById(val)
					return data;
				} catch (error) {
					return Promise.reject(notify.ERROR_CATEGORY_INVALID)
				}
			}
		}),
	body('status').not().isIn(['novalue']).withMessage(notify.ERROR_STATUS),
	body('thumb').custom((value,{req}) => {
		const {image_uploaded , image_old} = req.body;
		if(!image_uploaded && !image_old) {
			return Promise.reject(notify.ERROR_FILE_EMPTY);
		}
		if(!req.file && image_uploaded) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
		}
		return true;
	}),
	async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
		try {
			let item = req.body;
			let itemData
			if(req.params.id != undefined){
				itemData = await serviceManageUser.getItemByID(req.params.id)
			}
			let errors = validationResult(req)
			if(!errors.isEmpty()) {
				let category = await serviceManageGroup.getGroupList({status: 'active'})
				let main = {pageTitle: pageTitle,
							showError: errors.errors,
							categoryList: category,
						}
				if(req.file != undefined) FileHelpers.remove(`public/uploads/${mainName}/`, req.file.filename); // xóa tấm hình khi form không hợp lệ
				if (req.params.id !== undefined){
						res.render(`${folderView}form`, {
							pageTitle: pageTitle,
							main: main,
							item: itemData,
							id: req.params.id,
							layout,
						})
				} else {
					res.render(`${folderView}form`, {
						pageTitle: pageTitle,
						main: main,
						item: req.body,
						layout,
					})
				}
				return
			} else {
				if(req.file == undefined){ //không có upload lại hình
					item.thumb = itemData.thumb;
				}else {
					item.thumb = req.file.filename;
					if(req.params.id !== undefined){
						FileHelpers.remove(`public/uploads/${mainName}/`, `${itemData.thumb}`);
					} 
				}
			}
				if (req.params.id !== undefined) {
					await serviceManageUser.editItem(req.params.id, item)
					req.flash('success', notify.EDIT_SUCCESS);
					res.redirect(linkIndex);
				} else {
					item.category = req.body.categoryId
					let data = await serviceManageUser.saveItems(item)
					req.flash('success', notify.ADD_SUCCESS);
					res.redirect(linkIndex);
				}
			} catch (error) {
				console.log(error)
			}
});



// Delete
router.post('/delete/(:status)?', async (req, res, next) => {
	try {
		if (req.params.status === 'multi') {
			let arrId = req.body.id.split(",")
			let arrPhoto = req.body.img.split(",")
			let deletePhoto = await arrPhoto.forEach((value)=>{
				FileHelpers.remove(`public/uploads/${mainName}/`, value)
			})
			let data = await serviceManageUser.deleteItemsMulti(arrId);
			res.send({success: true})
	} else {
			let id = req.body.id
			let thumb = req.body.thumb
			let removePhoto = await FileHelpers.remove(`public/uploads/${mainName}/`, thumb)
			let data = await serviceManageUser.deleteItem(id);
			res.send({success: true})
	}
	} catch (error) {
		console.log(error)
	}
});

router.post('/change-status/(:status)?', async (req, res, next) => {
	try {
				if (req.params.status === 'multi') {
						let arrId = req.body.id.split(",")
						let status = req.body.status
						let data = await serviceManageUser.changeStatusItemsMulti(arrId, status);
						res.send({success: true})
				} else {
						let {status, id} = req.body
						status = (status == 'active') ? 'inactive' : 'active'
						let changeStatus = await serviceManageUser.changeStatus(id, status)
						res.send({success: true})
				}
	} catch (error) {
		console.log(error)
	}
});

router.post('/change-ordering', 
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage(util.format(notify.ERROR_ORDERING,0,99)), 
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
		if (! errors.isEmpty()) {
			res.send({success: false, errors: errors})
			return
		}
		let {ordering, id} = req.body
		let changeStatus = await serviceManageUser.changeOrdering(id, ordering)
		res.send({success: true})
		} catch (error) {
			console.log(error)
		}
});

router.post('/changecategory',
		body('id')
				.custom(async (val, {req}) => {
					let user = await serviceManageUser.getItemByID(req.params.id)
					if (!user) {
						return Promise.reject(notify.ERROR_NOT_EXITS)
					}
					return
			}),
		body('newCategory')
				.custom(async (val, {req}) => {
					let category = await serviceManageGroup.getItemByID(req.params.id)
					if (!category) {
						return Promise.reject(notify.ERROR_NOT_EXITS)
					}
					return
			}),
	async (req, res, next) => {
		try {
			let {id, newCategory} = req.body
			let errors = validationResult(req)
			if(!errors.isEmpty()) {
				res.send({success: false})
			}else{
				let updateCategory = await serviceManageUser.changeCategory(id, newCategory)
				res.send({success: true})
			}
	} catch (error) {
		console.log(error)
	}
});

module.exports = router;
