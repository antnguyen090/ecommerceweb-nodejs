
const FileHelpers = require(__path_helpers + 'file');

let deletePhoto = async (id, data, mainName) => {
	const serviceProduct = require(__path_services_backend + `${mainName}.service`);
	let thumbArray = await serviceProduct.getItemByID(id)
	let dataThum = data.split(",")
	dataThum.shift()
	let filteredArray = thumbArray.thumb.filter(val => !dataThum.includes(val))
	await Promise.all(dataThum.map(async (item,index) => {
		await FileHelpers.remove(`public/uploads/${mainName}/`, item);
  }))
  .catch((error) => {
    console.error(error.message)
    return error
  });
	return filteredArray
}

module.exports = {
	deletePhoto
}