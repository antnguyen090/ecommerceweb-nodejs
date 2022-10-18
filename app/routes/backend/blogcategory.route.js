var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
var util = require('util')

const mainName = "blogcategory"
const pageTitle = `Blog Category Management`
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const serviceBlogCategory = require(__path_services_backend + `${mainName}.service`);
const notify = require(__path_configs + 'notify');
const layout = __path_views_backend + 'backend';

const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const folderView = __path_views_backend + `/pages/${mainName}/`;

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
		pagination.totalItems = await serviceBlogCategory.countItem(objWhere);
			let data = await serviceBlogCategory.listItems(objWhere, 
				pagination.currentPage,
				pagination.totalItemsPerPage,
				{updatedAt: 'desc'},
				)

			res.render(`${folderView}list`, {
				pageTitle: pageTitle,
				countItemsActive: data.filter(item => item.status === 'active'),
				items: data,
				statusFilter,
				pagination,
				currentStatus,
				keyword,
				inform: inform,
				layout,
			})
	} catch (error) {
		console.log(error)
	}
})

// access FORM
router.get('/form/(:id)?',  async function (req, res, next) {
	try {
		let inform = req.flash()
		let main = {pageTitle: pageTitle,
			inform: inform
		}
		if (req.params.id != undefined) {
			let item = await serviceBlogCategory.getItemByID(req.params.id)
			res.render(`${folderView}form`, {
				main: main,
				item: item,
				layout,
			});s
			} else {
					res.render(`${folderView}form`, {
				main: main,
				item: [],
				layout
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
			let data		= await serviceBlogCategory.checkDuplicated({name: val})
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
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage(util.format(notify.ERROR_ORDERING,0,99)),
	body('status').not().isIn(['novalue']).withMessage(notify.ERROR_STATUS),
	async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
			try {
				let item = req.body;
			let itemData
			if(req.params.id != undefined){
				itemData = await serviceBlogCategory.getItemByID(req.params.id)
			}
			let errors = await validationResult(req)
			if(!errors.isEmpty()) {
				let main = {pageTitle: pageTitle,
							showError: errors.errors,
							}
				if (req.params.id !== undefined){
						res.render(`${folderView}form`, {
							main: main,
							item: itemData,
							id: req.params.id,
							layout,
						})
				} else {
					res.render(`${folderView}form`, {
						main: main,
						item: req.body,
						layout
					})
				}
				return
			}

				if (req.params.id !== undefined) {
					let data = await serviceBlogCategory.editItem(req.params.id, item)
					req.flash('success', notify.EDIT_SUCCESS);
					res.redirect(linkIndex);
				} else {
					let data = await serviceBlogCategory.saveItems(item);
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
			let data = await serviceBlogCategory.deleteItemsMulti(arrId);
			res.send({success: true})
	} else {
			let id = req.body.id
			let data = await serviceBlogCategory.deleteItem(id);
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
        console.log(status)
        let data = await serviceBlogCategory.changeStatusItemsMulti(arrId, status);
        res.send({success: true})
    } else {
        let {status, id} = req.body
        status = (status == 'active') ? 'inactive' : 'active'
        let changeStatus = await serviceBlogCategory.changeStatus(id, status)
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
			let changeStatus = await serviceBlogCategory.changeOrdering(id, ordering)
			res.send({success: true})
		} catch (error) {
			console.log(error)
		}
});

module.exports = router;
