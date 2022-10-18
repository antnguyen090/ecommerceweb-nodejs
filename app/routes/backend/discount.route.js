var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
var util = require('util')

const mainName = "discount"
const pageTitle = `Discount Management`
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const serviceDiscount = require(__path_services_backend + `${mainName}.service`);
const serviceProduct = require(__path_services_backend + 'product.service');

const notify = require(__path_configs + 'notify');
const layout = __path_views_backend + 'backend';

const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const DeletePhotosHelpers = require(__path_helpers + 'deletephoto');
const folderView = __path_views_backend + `/pages/${mainName}/`;
const {param} = require('express-validator');

// List items
router.get('(/status/:status)?', async (req, res, next) => {
	try {
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
		pagination.totalItems = await serviceDiscount.countItem(objWhere);
		let data = await serviceDiscount.listItems(objWhere, 
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
				keyword,
				inform: inform
			})
	} catch (error) {
		console.log(error)
	}
})

router.post('(/option)', async (req, res, next) => {
	try {
		console.log( req.body)
		let {id, field, isCheck} = req.body
		let data = await serviceDiscount.changeOption(id, field, isCheck)
		res.send({success: true})
	} catch (error) {
		res.send({success: false})
	}
})

// access FORM
router.get('/form/(:id)?', async function (req, res, next) {
	try {
		let productList = await serviceProduct.listItems({status: 'active'})
		let inform = req.flash()
		let main = {pageTitle: pageTitle,
								inform: inform
								}
		if (req.params.id != undefined) {
			let item = await serviceDiscount.getItemByID(req.params.id)
			res.render(`${folderView}form`, {
				main: main,
				item: item,
				layout,
				productList
			});
			} else {
					res.render(`${folderView}form`, {
						main: main,
						item: [],
						layout,
						productList,
					});
			}
	} catch (error) {
		console.log(error)
	}
});


router.post('/save/(:id)?',
	body('name')
			.isLength({min: 5, max: 100})
			.withMessage(util.format(notify.ERROR_NAME,5,100))
			.custom(async (val, {req}) => {
				let paramId = await(req.params.id != undefined) ? req.params.id : 0
				let data		= await serviceDiscount.checkDuplicated({name: val})
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
	body('description')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_DESCRIPTION),
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage(util.format(notify.ERROR_ORDERING,0,99)),
	body('status')
		.not()
		.isIn(['novalue'])
		.withMessage(notify.ERROR_STATUS),
	body('discount')
		.isIn(['money','percent'])
		.withMessage(notify.ERROR_DISCOUNT_UNIT)
		.custom(async (val, {req}) => {
				let {money_input, percent_input} = req.body
				if(!val) return
				if(val == 'money'){
					let number = money_input.replace(/[^0-9]/g, '');
					if (number < 500){
						return Promise.reject(util.format(notify.ERROR_DISCOUNT_MONEY,500))
					} 
					return
				} else{
					let number = percent_input.replace(/[^0-9]/g, '');
					if (number <= 0 || number > 100 ){
						return Promise.reject(util.format(notify.ERROR_DISCOUNT_PERCENT,0,100))
					} 
					return
				}
		}),
	body('productList')
		.custom(async (val, {req}) => {
		if (!val) {
			return Promise.reject(util.format(notify.ERROR_DISCOUNT_LISTPRODUCT))
		} else {
			if (typeof val == 'string'){
				try {
					const doesIdExits = await serviceProduct.checkExit(val)
				} catch (error) {
						return Promise.reject(util.format(notify.ERROR_DISCOUNT_LISTPRODUCT_INVALID))
				}
			} else{
				try {
					const doesIdExits = await serviceProduct.checkExit(val)
				} catch (error) {
						return Promise.reject(util.format(notify.ERROR_DISCOUNT_LISTPRODUCT_INVALID))
				}
			}
		}
	}),
	async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
		try {
			console.log(req.body)
			let item = req.body;
			let itemData
			if(req.params.id != undefined){
				itemData = await serviceDiscount.getItemByID(req.params.id)
			}
			let {discount, money_input, percent_input} = req.body
				if(discount == 'money'){
					item.discountValue = { unit: discount, value: money_input.replace(/[^0-9]/g, '')}
				} else if(discount == 'percent') {
						item.discountValue = { unit: discount, value: percent_input.replace(/[^0-9]/g, '')}
				}
				if (typeof item.productList == 'string'){
					 item.productList = [item.productList]
				}
			let errors = validationResult(req)
			if(!errors.isEmpty()) {
				let productList = await serviceProduct.listItems({status: 'active'})
				let main = {pageTitle: pageTitle,
							showError: errors.errors,
						}
				if (req.params.id !== undefined){
						res.render(`${folderView}form`, {
							main: main,
							item: itemData,
							id: req.params.id,
							layout,
							productList
						})
				} else {
					res.render(`${folderView}form`, {
						main: main,
						item: req.body,
						layout,
						productList,
					})
				}
				return
			}
				if (req.params.id !== undefined) {
					await serviceDiscount.editItem(req.params.id, item)
					req.flash('success', notify.EDIT_SUCCESS);
					res.redirect(linkIndex);
				} else {
					let data = await serviceDiscount.saveItems(item)
					req.flash('success', notify.ADD_SUCCESS);
					res.redirect(linkIndex);
				}
			} catch (error) {
				console.log(error)
				res.redirect(linkIndex);
			}
});



// Delete
router.post('/delete/(:status)?', async (req, res, next) => {
	try {
		if (req.params.status === 'multi') {
			let arrId = req.body.id.split(",")
			let data = await serviceDiscount.deleteItemsMulti(arrId);
			res.send({success: true})
	} else {
			let id = req.body.id
			let data = await serviceDiscount.deleteItem(id);
			res.send({success: true})
	}
	} catch (error) {
		res.send({success: false})
		console.log(error)
	}
});

router.post('/change-status/(:status)?', async (req, res, next) => {
	try {
				if (req.params.status === 'multi') {
						let arrId = req.body.id.split(",")
						let status = req.body.status
						let data = await serviceDiscount.changeStatusItemsMulti(arrId, status);
						res.send({success: true})
				} else {
						let {status, id} = req.body
						status = (status == 'active') ? 'inactive' : 'active'
						let changeStatus = await serviceDiscount.changeStatus(id, status)
						res.send({success: true})
				}
	} catch (error) {
		res.send({success: false})
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
		let changeStatus = await serviceDiscount.changeOrdering(id, ordering)
		res.send({success: true})
		} catch (error) {
			res.send({success: false})
			console.log(error)
		}
});

router.post('/changecategory',
		body('id')
				.custom(async (val, {req}) => {
					try {
						let item = await serviceDiscount.getItemByID(req.body.id)
						if (item.length == 0) {
							return Promise.reject(notify.ERROR_NOT_EXITS)
						}
					} catch (error) {
							return Promise.reject(notify.ERROR_NOT_EXITS)
					}
		}),
		body('newCategory')
				.custom(async (val, {req}) => {
					if ( val == undefined) {
						return Promise.reject(notify.ERROR_CATEGORY)
					} else {
						try {
							let data = await serviceProduct.getCategoryById(val)
							return data;
						} catch (error) {
							return Promise.reject(notify.ERROR_CATEGORY_INVALID)
						}
					}
			}),
	async (req, res, next) => {
		try {
			let {id, newCategory} = req.body
			let errors = validationResult(req)
			if(!errors.isEmpty()) {
				res.send({success: false})
			}else{
				let updateCategory = await serviceDiscount.changeCategory(id, newCategory)
				res.send({success: true})
			}
	} catch (error) {
		res.send({success: false})
		console.log(error)
	}
});

router.post('/change-time', 
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
		if (! errors.isEmpty()) {
			res.send({success: false, errors: errors})
			return
		}
		let {time, id} = req.body
		let changeTime = await serviceDiscount.changeTime(id, time)
		res.send({success: true})
		} catch (error) {
			res.send({success: false})
			console.log(error)
		}
});

module.exports = router;
