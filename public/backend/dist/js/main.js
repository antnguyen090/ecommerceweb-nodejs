$( document ).ready( async function() {
    const linkAdmin = "admin/"
    const currency =    'VND';

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "200",
        "hideDuration": "200",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    let notify = listNotify()
    var arrayPath = window.location.pathname.split("/")
    var adminUrl = arrayPath[1]
    var pathname = arrayPath[2]
    if (pathname == '') pathname = "dashboard"
    $(`li > a[href="/${adminUrl}/${pathname}"]`).addClass("active")
    $( "li.nav-item" ).each(function( index ) {
        if($( this).find('a').hasClass('active')){
            $(this).children('a').addClass('active')
        }
      })
    showPreview = (FileList,value) => {
        if (typeof (FileReader) != "undefined") {
            var dvPreview = $(`#divImageMediaPreview${value}`);
            dvPreview.html("");            
            $(FileList).each(function () {
                var file = $(this);                
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = $("<img />");
                        img.attr("style", "width: 58%;");
                        img.attr("src", e.target.result);
                        dvPreview.append(img);
                    }
                    reader.readAsDataURL(file[0]);                
            });
        } else {
            alert("This browser does not support HTML5 FileReader.");
        }
    }

    $("#ImageMediasLarge").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });

    $("#ImageMediasSmall").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });

    $("#ImageMediasTitle").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });
    
    $("#ImageMediasArticle").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });
    $("#ImageMediasBanner").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });

    //preview multi img

    var imagesPreview = function(input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;

            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = function(event) {
                    $($.parseHTML('<img class="imgPreviewMulti">')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                }

                reader.readAsDataURL(input.files[i]);
            }
        }

    };

    $('#ImageMediasProduct').on('change', function() {
        $('div#imageMediaPreviewProduct').html('')
        imagesPreview(this, 'div#imageMediaPreviewProduct');
    });

    function ChangeToSlug(text)
        {
            //Đổi chữ hoa thành chữ thường
            let slug = text.toLowerCase();
        
            //Đổi ký tự có dấu thành không dấu
            slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
            slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
            slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
            slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
            slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
            slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
            slug = slug.replace(/đ/gi, 'd');
            //Xóa các ký tự đặt biệt
            slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
            //Đổi khoảng trắng thành ký tự gạch ngang
            slug = slug.replace(/ /gi, "-");
            //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
            //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
            slug = slug.replace(/\-\-\-\-\-/gi, '-');
            slug = slug.replace(/\-\-\-\-/gi, '-');
            slug = slug.replace(/\-\-\-/gi, '-');
            slug = slug.replace(/\-\-/gi, '-');
            //Xóa các ký tự gạch ngang ở đầu và cuối
            slug = '@' + slug + '@';
            slug = slug.replace(/\@\-|\-\@|\@/gi, '');
            return slug
    }

    changeStatus = (status, id, link) =>{
        let elmnumberActive = $("#count-items-active span")
        let elmnumberInactive = $("#count-items-inactive span")
        let numberActive = parseInt(elmnumberActive.text())
        let numberInactive = parseInt(elmnumberInactive.text())
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `status=${status}&id=${id}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    let currentClass =  (status == 'active') ? "btn-success" : "btn-danger"
                    let classNew =  (status == 'active') ? "btn-danger" : "btn-success" 
                    let currentIcon = (status == 'active') ? "fa-check" : "fa-ban"
                    let newIcon = (status == 'active') ? "fa-ban" : "fa-check"
                    status = (status == 'active') ? "inactive" : "active"
                    $(`#change-status-${id}`).removeClass(currentClass).addClass(classNew).attr('onClick', `changeStatus('${status}','${id}', '${link}')`)
                    $(`#change-status-${id} i`).removeClass(currentIcon).addClass(newIcon)
                    $(`#${id}`).attr("data-status",status)
                    if (status.toLowerCase() == 'inactive'){
                        elmnumberActive.text((numberActive-1)) 
                        elmnumberInactive.text((numberInactive+1))
                    } else {
                        elmnumberActive.text((numberActive+1))
                        elmnumberInactive.text((numberInactive-1))
                    }
                    toastr["success"](notify.CHANGE_STATUS_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_STATUS_ERROR)
                }
            }
        });
    }

    changeOrdering = (id, value, link ) => {
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `ordering=${value}&id=${id}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_ORDERING_SUCCESS)
                } else {
                    let msg = response.errors.errors[0].msg
                    toastr["error"](notify.CHANGE_ORDERING_ERROR + '\n'+ msg )
                }
            }
        });
    }

    deleteItem = (id, name, link, thumb) => {
        $('#modal-danger .modal-title').text('You want to delete this Item?')
        $('#modal-danger .modal-body p').text(`Name: ${name} - ID: ${id}`)
        $('#modal-danger button[data-type="confirm"]').attr("onClick",`deleteItemConfirm('${id}','${link}','${thumb}')`)
    }

    deleteItemConfirm = (id,link,thumb)=>{
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `id=${id}&thumb=${thumb}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    $('button[data-dismiss="modal"]').click()
                    let elmnumberActive = $("#count-items-active span")
                    let elmnumberInactive = $("#count-items-inactive span")
                    let elmnumberAll = $("#count-items-all span")
                    let numberActive = parseInt(elmnumberActive.text())
                    let numberInactive = parseInt(elmnumberInactive.text())
                    let numberAll = parseInt(elmnumberAll.text())
                    let dataStatus = $(`#${id}`).attr("data-status")
                    $(`#area-${id}`).remove()
                    if (dataStatus == 'active'){
                        elmnumberActive.text(numberActive-1)
                    } else if(dataStatus == 'inactive'){
                        elmnumberInactive.text(numberInactive-1)
                    }
                    elmnumberAll.text(numberAll-1)
                    toastr["success"](notify.DELETE_SUCCESS)
                } else {
                    toastr["error"](notify.DELETE_ERROR)
                }
            }
        });
    }

    deleteMultiItemsConfirm = (items,img, link) => {
        let arrItems = items.split(",")
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `id=${items}&img=${img}`,
            dataType: "json",
            success: async function (response) {
                if(response.success == true){
                    $('button[data-dismiss="modal"]').click()
                    $.each(arrItems, (index, id)=>{
                            let elmnumberAll = $("#count-items-all span")
                            let elmnumberActive = $("#count-items-active span")
                            let elmnumberInactive = $("#count-items-inactive span")
                            let numberActive = parseInt(elmnumberActive.text())
                            let numberInactive = parseInt(elmnumberInactive.text())
                            let numberAll = parseInt(elmnumberAll.text())
                            let dataStatus = $(`#${id}`).attr("data-status")
                            if (dataStatus == 'active'){
                                elmnumberActive.text(numberActive-1)
                                elmnumberAll.text(numberAll-1)
                            } else if(dataStatus == 'inactive'){
                                elmnumberInactive.text(numberInactive-1)
                                elmnumberAll.text(numberAll-1)
                            }
                            $(`#area-${id}`).remove()
                    })
                    toastr["success"](notify.DELETE_MULTI_SUCCESS)
                } else {
                    toastr["error"](notify.DELETE_MULTI_ERROR)
                }
            }
        });
    }

    const orderingInput = document.querySelectorAll('input[name="items-ordering"]');
    orderingInput.forEach(item => {
        item.addEventListener('change', event => {
            let id = event.target.getAttribute('data-id')
            let value = event.target.value
            let link = event.target.getAttribute('data-router')
            changeOrdering(id, value, link )
        })
    })


    changePrice = (id, value, link ) => {
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `price=${value}&id=${id}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    $(`#change-price-${id}`).notify("Successful", {className: "success", autoHideDelay: 1500, elementPosition:"bottom"});
                } else {
                    let msg = response.errors.errors[0].msg
                    $(`#change-price-${id}`).notify(msg, {className: "error", autoHideDelay: 1500, });
                }
            }
        });
    }

    const priceInput = document.querySelectorAll('input[name="items-price"]');
    priceInput.forEach(item => {
        item.addEventListener('change', event => {
            let id = event.target.getAttribute('data-id')
            let value = event.target.value
            let link = event.target.getAttribute('data-router')
            changePrice(id, value, link )
        })
    })

    $("#check-all").click(function(){
        $("input[name='cid']").prop('checked', $(this).prop('checked'));
    });

    deleteMultiItems = async (link) =>{
        let itemsDelete = [];
        let imgDelete   = []
        let listItems =''
        let compare = new Boolean(false);
        $( "input[type='checkbox']" ).prop( "checked", function( i, val ) {
            if(val == true) 
            {
                compare = val
            } 
        });
        if (compare == false){
            $('#modal-danger .modal-title').text('Warning!')
            $('#modal-danger .modal-body p').text('Please choose items to delete')
            $('#modal-danger button[data-type="confirm"]').css('display', 'none')
        } else {
            let boxChecked = $("input[name='cid']:checkbox:checked")
            
            await boxChecked.each((index, value)=>{
                let id = $(value).val()
                let thumb = $(value).attr("data-img")
                itemsDelete.push(id)
                imgDelete.push(thumb)
                listItems += `
                    <p> Name: ${$(`#name-item-${id}`).text()} - ID: ${id} </p>
                `
            })
            $('#modal-danger .modal-title').text('You want to delete these Items?')
            $('#modal-danger .modal-body p').html(listItems)
            $('#modal-danger button[data-type="confirm"]').css('display', 'block').attr("onClick",`deleteMultiItemsConfirm('${itemsDelete}','${imgDelete}','${link}')`)
        }

    }

    changeStatusMultiItemsConfirm = (items, status, link) =>{
        let elmnumberActive = $("#count-items-active span")
        let elmnumberInactive = $("#count-items-inactive span")
        let numberActive = parseInt(elmnumberActive.text())
        let numberInactive = parseInt(elmnumberInactive.text())
        let arrItems = items.split(",")
        let updateStatus = (status=='inactive') ? 'inactive' : 'active'
        let updateBtn = (status=='inactive') ? 'btn-danger' : 'btn-success'
        let updateIcon =(status=='inactive') ? "fa-ban" : "fa-check"
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `id=${items}&status=${status}`,
            dataType: "json",
            success: async function (response) {
                if(response.success == true){
                    $('button[data-dismiss="modal"]').click()
                    $.each(arrItems, async (index, id)=>{
                            let html = await `
                                <a href="javascript:" onclick="changeStatus('${updateStatus}','${id}', '/${linkAdmin}items/change-status/')" id="change-status-${id}" class="rounded-circle btn btn-sm ${updateBtn}">
                                <i class="fas ${updateIcon}"></i></a>
                                `
                            $(`#status-item-${id}`).html(html)
                            $(`#${id}`).attr("data-status",status)
                    })
                    if (status.toLowerCase() == 'inactive'){
                        elmnumberActive.text((numberActive-arrItems.length)) 
                        elmnumberInactive.text((numberInactive+arrItems.length))
                    } else {
                        elmnumberActive.text((numberActive+arrItems.length))
                        elmnumberInactive.text((numberInactive-arrItems.length))
                    }
                    toastr["success"](notify.CHANGE_MULTI_STATUS_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_MULTI_STATUS_ERROR)
                }
            }
        });
    }
    changeMultiStatus = async (status, link) =>{
        let modalClass = (status == 'active') ? "modal-success" : "modal-danger"
        let itemsChangeStatus = [];
        let listItems =''
        let compare = new Boolean(false);
        $( "input[name='cid']" ).prop( "checked", function( i, val ) {
            if(val == true) 
            {
                compare = val
            } 
        });
        if (compare == false){
            $(`#${modalClass} .modal-title`).text('Warning!')
            $(`#${modalClass} .modal-body p`).text('Please choose items to change status')
            $(`#${modalClass} button[data-type="confirm"]`).css('display', 'none')
        } else {
            let boxChecked = $("input[name='cid']:checkbox:checked")
            await boxChecked.each((index, value)=>{
                if ($(value).attr("data-status") == status) return
                let id = $(value).val()
                itemsChangeStatus.push(id)
                listItems += `
                    <p> Name: ${$(`#name-item-${id}`).text()} - ID: ${id} </p>
                `
            })
            if (itemsChangeStatus.length == 0) {
                $(`#${modalClass} .modal-title`).text('Warning!')
                $(`#${modalClass} .modal-body p`).text('Please choose items to change status')
                $(`#${modalClass} button[data-type="confirm"]`).css('display', 'none')
                return false
            }
            $(`#${modalClass} .modal-title`).text(`You want to change these Items to ${status}?`)
            $(`#${modalClass} .modal-body p`).html(listItems)
            $(`#${modalClass} button[data-type="confirm"]`).css('display', 'block').attr("onClick",`changeStatusMultiItemsConfirm('${itemsChangeStatus}','${status}','${link}')`)
        }
    }


    const inputNameForm = $("input#name-input-form")
    const inputSlugForm = $("input#slug-input-form")
        inputNameForm.on("change paste keyup", function() {
            inputSlugForm.val(ChangeToSlug($(this).val())); 
        });

    // price format
        // Jquery Dependency

$("input[data-type='currency']").on({
    keyup: function() {
      formatCurrency($(this));
    },
    blur: function() { 
      formatCurrency($(this), "blur");
    }
});


function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.
  
  // get input value
  var input_val = input.val();
  
  // don't validate empty input
  if (input_val === "") { return; }
  
  // original length
  var original_len = input_val.length;

  // initial caret position 
  var caret_pos = input.prop("selectionStart");
    
  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);
    
    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }
    
    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = currency + ' ' + left_side + "." + right_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = currency + ' ' + input_val;
    
    // final formatting
    // if (blur === "blur") {
    //   input_val += ".00";
    // }
  }
  
  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}

    // end price format
    $( "select[name='parentMenu']" ).change(function (value) {
        let id = value.target.getAttribute('data-id')
        let newParent = $(this).find(":selected").val()
        $.ajax({
            type: "post",
            url: `menubar/changeparentmenu`,
            data: `id=${id}&newParent=${newParent}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_MENUTYPE_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_MENUTYPE_ERROR)
                }
            }
        });
    })

    $( "select[name='category']" ).change(function (value) {
        let id = value.target.getAttribute('data-id')
        let name = value.target.getAttribute('data-name')
        let newCategory = $(this).find(":selected").val()
        if (newCategory =='') return 
        $.ajax({
            type: "post",
            url: `/${linkAdmin}${name}/changecategory/`,
            data: `id=${id}&newCategory=${newCategory}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_CATEGORY_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_CATEGORY_ERROR)
                }
            }
        });
    })

    changeOption = (data, isCheck, link) => {
        let dataArr = data.split("-")
        let id = dataArr[1]
        let fieldOption = dataArr[0]
        console.log(fieldOption)
        console.log(id)
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `id=${id}&field=${fieldOption}&isCheck=${isCheck}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_OPTION_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_OPTION_ERROR)
                }
            }
        });
    }

    $("div.option input:checkbox").change(function(value) {
        let data = value.target.getAttribute('id')
        let link = `/${linkAdmin}product/option/`
        if(this.checked) {
            changeOption(data, true, link)
        } else{
            changeOption(data, false, link)
        }
    }); 

    //change link input
    changeLink = (id, value, link ) => {
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `link=${value}&id=${id}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_LINK_SUCCESS)
                } else {
                    let msg = response.errors.errors[0].msg
                    toastr["error"](notify.CHANGE_LINK_ERROR + '\n'+ msg )
                }
            }
        });
    }
    
    const linkInput = document.querySelectorAll('td > input[name="link"]');
    linkInput.forEach(item => {
        item.addEventListener('change', event => {
            let id = event.target.getAttribute('data-id')
            let value = event.target.value
            let link = event.target.getAttribute('data-router')
            changeLink(id, value, link )
        })
    })

    //show date range

    $('#reservationtime').daterangepicker({
        timePicker: true,
        timePickerIncrement: 30,
        locale: {
          format: 'MM/DD/YYYY hh:mm A'
        }
    })

    $('input[id^="reservationtime-"]').daterangepicker({
        timePicker: true,
        timePickerIncrement: 30,
        locale: {
          format: 'MM/DD/YYYY hh:mm A'
        }
    })

    // dual list
    var duallistDiscout = $('select[name="productList"]').bootstrapDualListbox()

    // radio discount

    $('input:radio[name=discount]').change(function() {
        if (this.value == 'money') {
            $(`input#${this.value}_input`).prop("disabled", false)
            $(`input#percent_input`).prop("disabled", true)
        }
        else if (this.value == 'percent') {
            $(`input#${this.value}_input`).prop("disabled", false)
            $(`input#money_input`).prop("disabled", true)
        }
    });

    // change time discount
    let showDiscountStatus = (data) =>{
        if (!data) return
        let time = data.split('-')
        let timeStart = Date.parse(time[0])
        let timeEnd = Date.parse(time[1])
        let timeNow = Date.now()
        let text = "Finished"
        let button = "btn-danger"
        if (timeNow < timeStart){
             text = "Unstarted"
             button = "btn-warning"
        } else if(timeNow < timeEnd){
             text = "In Process"
             button = "btn-success"
        } 
        return `<button type="button" class="btn btn-block ${button}" style="pointer-events: none;">${text}</button>`
     }

    let changeTimeDiscount = (id, value, link) =>{
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `time=${value}&id=${id}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_ORDERING_SUCCESS)
                    let xhtml = showDiscountStatus(value)
                    $(`td#discountstatus-item-${id}`).html(xhtml)
                } else {
                    let msg = response.errors.errors[0].msg
                    toastr["error"](notify.CHANGE_ORDERING_ERROR + '\n'+ msg )
                }
            }
        });
    }
    $('input[id^="reservationtime-"]').datepicker({
        onSelect: function(dateText) {
          console.log("Selected date: " + dateText + ", Current Selected Value= " + this.value);
          $(this).change();
        }
      }).on("change", function() {
            let id = this.getAttribute('id').split('-')[1]
            let value = this.value
            let link = this.getAttribute('data-router')
            changeTimeDiscount(id, value, link )
      });
    
});

