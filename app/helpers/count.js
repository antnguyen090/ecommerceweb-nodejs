let countItem =  async (collection) => {
	  let ItemsService = require(__path_services_backend + collection + '.service');
    let data       = await ItemsService.countItem({})
    return data
}

module.exports ={
  countItem
}