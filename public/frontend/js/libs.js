

const listNotify = () => {
  return {
    SEND_SUCCESS: "Đã gửi thông tin thành công.",
    SEND_UNSUCCESS: "Đã có lỗi, vui lòng thử lại!",
    SEND_RESGISTER_SUCCESS: "Bạn đã đăng ký thành công.",
    SEND_RESGISTER_UNSUCCESS: "Đã có lỗi, vui lòng thử lại!",
    ADD_LOVE_SUCCESS:"Đã Thêm Sản Phẩm Vào Yêu Thích.",
    REMOVE_LOVE_SUCCESS:"Đã Xóa Sản Phẩm Khỏi Yêu Thích.",
    REMOVE_CART_SUCCESS: "Đã Xóa Sản Phẩm Vào Giỏ Hàng.",
    ADD_CART_SUCCESS: "Đã Thêm Sản Phẩm Vào Giỏ Hàng.",
    SEND_UPDATE_INFOR_SUCCESS: "Bạn đã cập nhật thành công.",
    TRACKING_ERROR: "Mã Đơn Hàng Không Tồn Tại",
  }
}

const spinnerCenter = () =>{
  return `
  <div class="d-flex justify-content-center">
  <div class="spinner-border text-success" role="status">
    <span class="sr-only">Loading...</span>
  </div>
 </div>
  `
}

formatTime = (time) => {
  var now     = new Date(time); 
  var year    = now.getFullYear();
  var month   = now.getMonth()+1; 
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds(); 
  if(month.toString().length == 1) {
      month = '0'+month;
  }
  if(day.toString().length == 1) {
      day = '0'+day;
  }   
  if(hour.toString().length == 1) {
      hour = '0'+hour;
  }
  if(minute.toString().length == 1) {
      minute = '0'+minute;
  }
  if(second.toString().length == 1) {
      second = '0'+second;
  }   
  var dateTime = day+'/'+month+'/'+year;   
  return dateTime;
}


