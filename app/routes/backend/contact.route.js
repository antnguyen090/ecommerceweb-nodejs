var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
var util = require('util')

const mainName = "contact"
const pageTitle = `Contact Management`
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const serviceContact = require(__path_services_backend + `${mainName}.service`);
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
    pagination.totalItems = await serviceContact.countItem(objWhere);

			let data = await serviceContact.listItems(objWhere, 
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
router.get('/form/(:id)?', async function (req, res, next) {
	try {
		let inform = req.flash()
		let main = {pageTitle: pageTitle,
		inform: inform
		}
	if (req.params.id != undefined) {
		let item = await serviceContact.getItemByID(req.params.id)
			res.render(`${folderView}form`, {
				main: main,
				item: item,
				layout,
			});
    } else {
        res.render(`${folderView}form`, {
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
		.isLength({min: 2, max: 100})
		.withMessage(util.format(notify.ERROR_NAME,2,100)),
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage(util.format(notify.ERROR_ORDERING,0,99)),
	body('status').not().isIn(['novalue']).withMessage(notify.ERROR_STATUS),
	body('subject')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SUBJECT),
	body('email')
		.isEmail()
		.withMessage(notify.ERROR_EMAIL),
		body('message')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_MESSAGE),
	async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
			let item = req.body;
			let itemData = [{}]
			if(req.params.id != undefined){
				itemData = await serviceContact.getItemByID(req.params.id)
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
							layout
						})
				} else {
					res.render(`${folderView}form`, {
						main: main,
						item: req.body,
						layout,
					})
				}
				return
			}

			try {
				if (req.params.id !== undefined) {
					let data = await serviceContact.editItem(req.params.id, item)
					req.flash('success', notify.EDIT_SUCCESS);
					res.redirect(linkIndex);
				} else {
					let data = await serviceContact.saveItems(item);
					req.flash('success', notify.ADD_SUCCESS);
					res.redirect(linkIndex);
				}
			} catch (error) {
				console.log(error)
			}
});



// Delete
// router.post('/delete/(:status)?', async (req, res, next) => {
//     if (req.params.status === 'multi') {
//         let arrId = req.body.id.split(",")
//         let data = await serviceContact.deleteItemsMulti(arrId);
//         res.send({success: true})
//     } else {
//         let id = req.body.id
//         let data = await serviceContact.deleteItem(id);
//         res.send({success: true})
//     }
// });

router.post('/change-status/(:status)?', async (req, res, next) => {
    if (req.params.status === 'multi') {
        let arrId = req.body.id.split(",")
        let status = req.body.status
        let data = await serviceContact.changeStatusItemsMulti(arrId, status);
        res.send({success: true})
    } else {
        let {status, id} = req.body
        status = (status == 'active') ? 'inactive' : 'active'
        let changeStatus = await serviceContact.changeStatus(id, status)
        res.send({success: true})
    }
});

router.post('/change-ordering', 
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage(util.format(notify.ERROR_ORDERING,0,99)), 
	async (req, res, next) => {
		const errors = validationResult(req);
		if (! errors.isEmpty()) {
			res.send({success: false, errors: errors})
			return
		}
		let {ordering, id} = req.body
		let changeStatus = await serviceContact.changeOrdering(id, ordering)
		res.send({success: true})
});


module.exports = router;
