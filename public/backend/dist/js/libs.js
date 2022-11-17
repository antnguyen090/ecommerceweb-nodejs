

listNotify = () => {
  return {
    CHANGE_CATEGORY_SUCCESS: 'Change Category Successfully',
    CHANGE_CATEGORY_ERROR: 'Change Category Unsuccessfully',
    CHANGE_OPTION_SUCCESS: 'Change Option Successfully',
    CHANGE_OPTION_ERROR: 'Change Option Unsuccessfully',
    CHANGE_MENUTYPE_SUCCESS: 'Change Menu Parent Successfully',
    CHANGE_MENUTYPE_ERROR: 'Change Menu Parent Unsuccessfully',
    CHANGE_MULTI_STATUS_SUCCESS: 'Change Multi Status SuccessfulLy',
    CHANGE_MULTI_STATUS_ERROR: 'Change Multi Status UnsuccessfulLy',
    DELETE_MULTI_SUCCESS:'Delete Multi SuccessfulLy',
    DELETE_MULTI_ERROR:'Delete Multi UnsuccessfulLy',
    DELETE_SUCCESS:'Delete SuccessfulLy',
    DELETE_ERROR:'Delete UnsuccessfulLy',
    CHANGE_ORDERING_SUCCESS: 'Change Ordering SuccessfulLy',
    CHANGE_ORDERING_ERROR: 'Change Ordering UnsuccessfulLy',
    CHANGE_SORTABLE_SUCCESS: 'Change SORTABLE SuccessfulLy',
    CHANGE_SORTABLE_ERROR: 'Change SORTABLE UnsuccessfulLy',
    CHANGE_DELETE_PHOTO_SUCCESS: 'Change DELETE SuccessfulLy',
    CHANGE_DELETE_PHOTO_ERROR: 'Change DELETE UnsuccessfulLy',
    CHANGE_STATUS_SUCCESS: 'Change Status SuccessfulLy',
    CHANGE_STATUS_ERROR: 'Change Status UnsuccessfulLy',
    CHANGE_LINK_ERROR: 'Change Link UnsuccessfulLy',
    CHANGE_LINK_SUCCESS: 'Change Link SuccessfulLy',
    ERROR_EMAIL: 'Please Enter a valid email address',
    ERROR_EMAIL_DUPLICATED: 'Email is duplicated',
    CHANGE_ORDER_STATUS_SUCCESS: 'Change Status SuccessfulLy'
  }
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
  var dateTime = hour+':'+minute+':'+second+' '+ day+'/'+month+'/'+year;   
  return dateTime;
}


