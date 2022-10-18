
const serviceSlider = require(__path_services_backend + `slider.service`);
const serviceMenuBar = require(__path_services_backend + `menubar.service`);

let getSlider = () => {
    let data = serviceSlider.getListByStatus('active')
    return data
}

let getMenuBar = () => {
  let data = serviceMenuBar.getMenuBar('active','asc')
  return data
}

module.exports = {
  getSlider,
  getMenuBar,
}