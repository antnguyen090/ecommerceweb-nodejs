var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
var util = require('util')

const mainName = "order"
const pageTitle = `Order Management`
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const serviceOrder = require(__path_services_backend + `${mainName}.service`);
const notify = require(__path_configs + 'notify');
const Libs = require(__path_configs + 'libs');
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
    let currentStatus = ParamsHelpers.getParamOrder(req.params, 'status', 'all');
		console.log(currentStatus)
    let statusFilter = await UtilsHelpers.createFilterStatusOrder(currentStatus, `${mainName}.model`);
    let pagination = {
        totalItems: 1,
        totalItemsPerPage: 10,
        currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
        pageRanges: 3
    };

    if (currentStatus !== 'all') objWhere.status = currentStatus;
    if (keyword !== '') objWhere.phoneNumber = new RegExp(keyword, 'i');
    pagination.totalItems = await serviceOrder.countItem(objWhere);
			let data = await serviceOrder.listItems(objWhere, 
				pagination.currentPage,
				pagination.totalItemsPerPage,
				{updatedAt: 'desc'},
			)
			res.render(`${folderView}list`, {
				pageTitle: pageTitle,
				items: data,
				statusFilter,
				pagination,
				currentStatus,
				keyword,
				inform: inform,
				layout,
				statusOrder: Libs.statusOrder,
			})
	} catch (error) {
		console.log(error)
	}
})



router.post('/change-status/',
	body('status')
		.isInt({min: 0, max: 5})
		.withMessage(notify.ERROR_ORDER_STATUS),
	async (req, res, next) => {
	try {
			let errors = await validationResult(req)
			if(!errors.isEmpty()) {
				res.send({success: false, errors: errors.errors})
				return
			}
			let {status, id} = req.body
			let changeStatus = await serviceOrder.changeStatus(id, status)
			console.log(changeStatus)
			if(changeStatus){
				res.send({success: true, data: changeStatus, status: Libs.statusOrder[status]})
			} else{
				res.send({success: false, errors:[{msg: notify.ERROR_ORDER_STATUS_CHANGE}]})
			}
	} catch (error) {
			console.log(error)
			res.send({success: false, errors:[{msg: notify.PRESS_F5_BE}]})
	}

});


router.get('/view-order', 
	async (req, res, next) => {
		let orderData
		try {
			if(req.query.id){
				orderData = await serviceOrder.getOrderById(req.query.id)
			}
			res.render(`${folderView}detailorder`, {
					layout: false,
					orderData: orderData,
					statusOrder: Libs.statusOrder,
					pageTitle
			})
		} catch (error) {
			console.log(error)
			res.render(`${folderView}detailorder`, {
				layout: false,
				orderData: orderData,
				statusOrder: Libs.statusOrder,
				pageTitle
		})
		}
});


module.exports = router;
