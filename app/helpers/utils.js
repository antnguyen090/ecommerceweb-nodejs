
let createFilterStatus =  async (currentStatus, collection) => {
	let ItemsModel = require(__path_models_backend +  collection);
    let statusFilter = [
		{name: 'All', value: 'all', count: 0, class: 'default'},
		{name: 'Active', value: 'active',  count: 0, class: 'default'},
		{name: 'InActive', value: 'inactive',  count: 0, class: 'default'}
	];

	for(let index = 0; index < statusFilter.length; index++) {
		let item = statusFilter[index];
		let condition = (item.value !== "all") ? {status: item.value} : {};
		statusFilter[index].class = 'primary';
		if(item.value === "active") {
			statusFilter[index].class = 'success';
		} else if(item.value === "inactive") {
			statusFilter[index].class = 'danger';
		}
		await ItemsModel.count(condition).then( (data) => {
			statusFilter[index].count = data;
		});
	}

    return statusFilter;
}


let createFilterStatusOrder =  async (currentStatus, collection) => {
	let ItemsModel = require(__path_models_backend +  collection);
    let statusFilter = [
		{name: 'All', value: 'all', count: 0, class: 'default'},
		{name: 'Order Comfirmed', value: 0,  count: 0, class: 'default'},
		{name: 'Picked By Courier', value:1 ,  count: 0, class: 'default'},
		{name: 'On The Way', value: 2,  count: 0, class: 'default'},
		{name: 'Delivered', value: 3 ,  count: 0, class: 'default'},
		{name: 'Cancel', value: 4 ,  count: 0, class: 'default'},
		{name: 'Return', value: 5 ,  count: 0, class: 'default'},
	];

	for(let index = 0; index < statusFilter.length; index++) {
		let item = statusFilter[index];
		let condition = (item.value !== "all") ? {status: item.value} : {};
		statusFilter[index].class = 'primary';
		if(item.value == 0) {
			statusFilter[index].class = 'default';
		} else if(item.value == 1) {
			statusFilter[index].class = 'secondary';
		} else if(item.value == 2) {
			statusFilter[index].class = 'warning';
		} else if(item.value == 3) {
			statusFilter[index].class = 'success';
		} else if(item.value == 4) {
			statusFilter[index].class = 'danger';
		} else if(item.value == 5) {
			statusFilter[index].class = 'dark';
		}
		await ItemsModel.count(condition).then( (data) => {
			statusFilter[index].count = data;
		});
	}

    return statusFilter;
}

module.exports = {
    createFilterStatus: createFilterStatus,
		createFilterStatusOrder: createFilterStatusOrder,
}