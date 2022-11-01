var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
var util = require('util')

const mainName = "coupon"
const pageTitle = `Coupon Management`
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const serviceCoupon = require(__path_services_backend + `${mainName}.service`);

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
		pagination.totalItems = await serviceCoupon.countItem(objWhere);
		let data = await serviceCoupon.listItems(objWhere, 
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

// access FORM
router.get('/form/(:id)?', async function (req, res, next) {
	try {
		let inform = req.flash()
		let main = {pageTitle: pageTitle,
								inform: inform
								}
		if (req.params.id != undefined) {
			let item = await serviceCoupon.getItemByID(req.params.id)
			res.render(`${folderView}form`, {
				pageTitle,
				main: main,
				item: item,
				layout,
			});
			} else {
					res.render(`${folderView}form`, {
						pageTitle,
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
	body('name')
			.isLength({min: 5, max: 100})
			.withMessage(util.format(notify.ERROR_NAME,5,100))
			.custom(async (val, {req}) => {
				let paramId = await(req.params.id != undefined) ? req.params.id : 0
				let data		= await serviceCoupon.checkDuplicated({name: val})
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
	body('mintotal')
		.custom(async (val, {req}) => {
			if (!val) return Promise.reject(util.format(notify.ERROR_MINTOTAL_MONEY,500))
			let minTotal = val.replace(/[^0-9]/g, '');
			if(val < 500){
				return Promise.reject(util.format(notify.ERROR_MINTOTAL_MONEY,500))
			}
			return
}),
	body('coupon')
		.isIn(['money','percent'])
		.withMessage(notify.ERROR_COUPON_UNIT)
		.custom(async (val, {req}) => {
				let {money_input, percent_input, maxdown } = req.body
				if(val == 'money'){
					if(!money_input) return Promise.reject(util.format(notify.ERROR_DISCOUNT_MONEY,500))
					let number = money_input.replace(/[^0-9]/g, '');
					if (number < 500){
						return Promise.reject(util.format(notify.ERROR_DISCOUNT_MONEY,500))
					} 
					return
				} else{
					if(!percent_input) return Promise.reject(util.format(notify.ERROR_DISCOUNT_PERCENT,0,100))
					let number = percent_input.replace(/[^0-9]/g, '');
					if (number <= 0 || number > 100 ){
						return Promise.reject(util.format(notify.ERROR_DISCOUNT_PERCENT,0,100))
					}
					let maxDownMoney = maxdown.replace(/[^0-9]/g, '');
					if(maxDownMoney < 500){
						return Promise.reject(util.format(notify.ERROR_MAXDOWN_MONEY,500))
					}
					return
				}
		}),
	async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
		try {
			let item = req.body;
			let itemData
			if(req.params.id != undefined){
				itemData = await serviceCoupon.getItemByID(req.params.id)
			}
			let funcNumber = (data) =>{
				let result = data.replace(/[^0-9]/g, '')
				return result
			}
			let {coupon, money_input, percent_input, mintotal, maxdown} = req.body
			console.log(coupon)
				if(coupon == 'money'){
					item.couponValue = { unit: coupon, value: funcNumber(money_input), minTotal: funcNumber(mintotal) , maxDown: 0}
				} else if(coupon == 'percent') {
					item.couponValue = { unit: coupon, value: funcNumber(percent_input), minTotal: funcNumber(mintotal) , maxDown: funcNumber(maxdown)}
				}
			let errors = validationResult(req)
			if(!errors.isEmpty()) {
				console.log(item)
				let main = {pageTitle: pageTitle,
							showError: errors.errors,
						}
				if (req.params.id !== undefined){
						res.render(`${folderView}form`, {
							pageTitle,
							main: main,
							item: itemData,
							id: req.params.id,
							layout,
						})
				} else {
					res.render(`${folderView}form`, {
						pageTitle,
						main: main,
						item: req.body,
						layout,
					})
				}
				return
			}
				item.couponcode = item.couponcode.toUpperCase()
				console.log(item)
				if (req.params.id !== undefined) {
					await serviceCoupon.editItem(req.params.id, item)
					req.flash('success', notify.EDIT_SUCCESS);
					res.redirect(linkIndex);
				} else {
					let data = await serviceCoupon.saveItems(item)
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
			let data = await serviceCoupon.deleteItemsMulti(arrId);
			res.send({success: true})
	} else {
			let id = req.body.id
			let data = await serviceCoupon.deleteItem(id);
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
						let data = await serviceCoupon.changeStatusItemsMulti(arrId, status);
						res.send({success: true})
				} else {
						let {status, id} = req.body
						status = (status == 'active') ? 'inactive' : 'active'
						let changeStatus = await serviceCoupon.changeStatus(id, status)
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
		let changeStatus = await serviceCoupon.changeOrdering(id, ordering)
		res.send({success: true})
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
		let changeTime = await serviceCoupon.changeTime(id, time)
		res.send({success: true})
		} catch (error) {
			res.send({success: false})
			console.log(error)
		}
});

module.exports = router;
