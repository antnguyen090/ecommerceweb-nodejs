$(document).ready(async function () {
  const linkAdmin = "/admin/"
  const currency = 'VND';

      $('.simple-ajax-popup').magnificPopup({
        type: 'ajax',
        callbacks: {
          parseAjax: function(mfpResponse) {
            // mfpResponse.data is a "data" object from ajax "success" callback
            // for simple HTML file, it will be just String
            // You may modify it to change contents of the popup
            // For example, to show just #some-element:
            if($(mfpResponse.data).find('.registerSec').length > 0) mfpResponse.data = $(mfpResponse.data).find('.registerSec')
          },
          ajaxContentAdded: function() {
            // Ajax content is loaded and appended to DOM
            console.log(this.content);
          }
        }
      });

      // save storeage

    $( "ul#custom-tabs-one-tab >li" ).click(function(value) {
      value.preventDefault();
      localStorage.setItem("tabSetting", $(value.target).attr('id'));
    });
    if (localStorage.getItem("tabSetting")){
      $(`a[id="${localStorage.getItem("tabSetting")}"]`).click()
    } else{
      $(`a[id="custom-tabs-one-home-tab"]`).click()
    }

    $( "ul#sub-custom-tabs-one-tab >li" ).click(function(value) {
      value.preventDefault();
      localStorage.setItem("subTabSetting", $(value.target).attr('id'));
    });
    if (localStorage.getItem("subTabSetting")){
      $(`a[id="${localStorage.getItem("subTabSetting")}"]`).click()
    }else{
      $(`a[id="sub-custom-tabs-one-home-tab"]`).click()
    }

  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "1000",
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
  if (pathname == '') 
    pathname = "dashboard"
  
  $(`li > a[href="/${adminUrl}/${pathname}"]`).addClass("active")
  $("li.nav-item").each(function (index) {
    if ($(this).find('a').hasClass('active')) {
      $(this).children('a').addClass('active')
    }
  })

    $(".nav .nav-treeview").each((index,item)=>{
      if($(item).find('a').hasClass("active") == true){
        $(item).css("display","block");
        $(item).parent('.nav-item').addClass('menu-is-opening menu-open')
        console.log($(item).parent('.nav-item'))
      }
    })
  showPreview = (FileList, value) => {
    if (typeof(FileReader) != "undefined") {
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
    showPreview($(this)[0].files, value);
  });

  $("#ImageMediasSmall").change(function (e) {
    let value = e.target.getAttribute('value')
    showPreview($(this)[0].files, value);
  });

  $("#ImageMediasTitle").change(function (e) {
    let value = e.target.getAttribute('value')
    showPreview($(this)[0].files, value);
  });

  $("#ImageMediasArticle").change(function (e) {
    let value = e.target.getAttribute('value')
    showPreview($(this)[0].files, value);
  });
  $("#ImageMediasBanner").change(function (e) {
    let value = e.target.getAttribute('value')
    showPreview($(this)[0].files, value);
  });
  $("#photoContent").change(function (e) {
    let value = e.target.getAttribute('value')
    showPreview($(this)[0].files, value);
  });
  $("#photoMission").change(function (e) {
    let value = e.target.getAttribute('value')
    showPreview($(this)[0].files, value);
  });

  $("#photoChoose").change(function (e) {
    let value = e.target.getAttribute('value')
    showPreview($(this)[0].files, value);
  });

  $("#photoAdsone").change(function (e) {
    let value = e.target.getAttribute('value')
    showPreview($(this)[0].files, value);
  });

  $("#photoAdstwo").change(function (e) {
    let value = e.target.getAttribute('value')
    showPreview($(this)[0].files, value);
  });

  // preview multi img
  //<div class="hide"><a href="javascript:deletePhotoDiv('${nameImage}')"><i class="fa-solid fa-trash text-danger"></i></a></div>
  let removeFileFromFileList = (name) => {
    const dt = new DataTransfer()
    const input = document.getElementById('ImageMediasProduct')
    const { files } = input
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.name != name) dt.items.add(file) // here you exclude the file. thus removing it.
    }
    input.files = dt.files // Assign the updates list
  }

  var imagesPreview = function (input, placeToInsertImagePreview) {
    let html= ""
    var filesAmount = input.files.length;
    if (input.files) {
      for (i = 0; i < filesAmount; i ++) {
        var reader = new FileReader();
        let nameImage = input.files[i].name
        reader.onload = function (event) {
          let xhtml = $($.parseHTML(`<img class="imgPreviewMulti" data-name="${nameImage}">`)).attr('src', event.target.result).prop('outerHTML')
          html = ` <div class="col-4 mx-4 my-4 position-relative" data-name="${nameImage}">
                       ${xhtml}
                       <div class="hide"><a href="javascript:deletePhotoDiv('${nameImage}')"><i class="fa-solid fa-trash text-danger"></i></a></div>
                      </div>
                    `
         html = $.parseHTML(html)
         $(html).appendTo(placeToInsertImagePreview)
        }
        reader.readAsDataURL(input.files[i]);
      }
    }

    return html
  };

  deletePhotoDiv = (name, id) =>{
    if (confirm("Are you sure completed?") == true) {
      let valueArr =""
      $.when($(`div[data-name="${name}"`).remove()).then( 
        $(`#imageMediaPreviewProductUploaded img`).each((index,value)=>{
          valueArr += $(value).attr("data-name") + ","
        })
      )
      removeFileFromFileList(name)
      if(id){
        $.ajax({
          type: "post",
          url: `${linkAdmin}product/deletephoto/`,
          data: `thumb=${valueArr}&id=${id}&delete=${name}`,
          dataType: "json",
          success: function (response) {
            if (response.success == true) {
              toastr["success"](notify.CHANGE_DELETE_PHOTO_SUCCESS)
            } else {
              let msg = response.errors.errors[0].msg
              toastr["error"](notify.CHANGE_DELETE_PHOTO_ERROR + '\n' + msg)
            }
          }
        });
      }
    } else {
      return false;
    }
  }
  $('#ImageMediasProduct').on('change', function () {
     $('#imageMediaPreviewProduct').html("")
     imagesPreview(this, 'div#imageMediaPreviewProduct')
  });


  function ChangeToSlug(text) { // Đổi chữ hoa thành chữ thường
    let slug = text.toLowerCase();

    // Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    // Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    // Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug
  }

  changeStatus = (status, id, link) => {
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
        if (response.success == true) {
          let currentClass = (status == 'active') ? "btn-success" : "btn-danger"
          let classNew = (status == 'active') ? "btn-danger" : "btn-success"
          let currentIcon = (status == 'active') ? "fa-check" : "fa-ban"
          let newIcon = (status == 'active') ? "fa-ban" : "fa-check"
          status = (status == 'active') ? "inactive" : "active"
          $(`#change-status-${id}`).removeClass(currentClass).addClass(classNew).attr('onClick', `changeStatus('${status}','${id}', '${link}')`)
          $(`#change-status-${id} i`).removeClass(currentIcon).addClass(newIcon)
          $(`#${id}`).attr("data-status", status)
          if (status.toLowerCase() == 'inactive') {
            elmnumberActive.text((numberActive - 1))
            elmnumberInactive.text((numberInactive + 1))
          } else {
            elmnumberActive.text((numberActive + 1))
            elmnumberInactive.text((numberInactive - 1))
            $(`#update-${id}`).html(`
            <button type="button" class="btn btn-block btn-success" style="pointer-events: none;">${formatTime(response.update)}</button>
            `)
          }
          toastr["success"](notify.CHANGE_STATUS_SUCCESS)
        } else {
          toastr["error"](notify.CHANGE_STATUS_ERROR)
        }
      }
    });
  }

  changeProcess = (status, id, link) =>{
    if(pathname == 'contact'){
      if (confirm("Are you sure completed?") == true) {
        changeStatus(status, id, link)
      } else {
        return false;
      }
    }
  }
  changeOrdering = (id, value, link) => {
    $.ajax({
      type: "post",
      url: `${link}`,
      data: `ordering=${value}&id=${id}`,
      dataType: "json",
      success: function (response) {
        if (response.success == true) {
          toastr["success"](notify.CHANGE_ORDERING_SUCCESS)
        } else {
          let msg = response.errors.errors[0].msg
          toastr["error"](notify.CHANGE_ORDERING_ERROR + '\n' + msg)
        }
      }
    });
  }

  deleteItem = (id, name, link, thumb) => {
    $('#modal-danger .modal-title').text('You want to delete this Item?')
    $('#modal-danger .modal-body p').text(`Name: ${name} - ID: ${id}`)
    $('#modal-danger button[data-type="confirm"]').attr("onClick", `deleteItemConfirm('${id}','${link}','${thumb}')`)
  }

  deleteItemConfirm = (id, link, thumb) => {
    $.ajax({
      type: "post",
      url: `${link}`,
      data: `id=${id}&thumb=${thumb}`,
      dataType: "json",
      success: function (response) {
        if (response.success == true) {
          $('button[data-dismiss="modal"]').click()
          let elmnumberActive = $("#count-items-active span")
          let elmnumberInactive = $("#count-items-inactive span")
          let elmnumberAll = $("#count-items-all span")
          let numberActive = parseInt(elmnumberActive.text())
          let numberInactive = parseInt(elmnumberInactive.text())
          let numberAll = parseInt(elmnumberAll.text())
          let dataStatus = $(`#${id}`).attr("data-status")
          $(`#area-${id}`).remove()
          if (dataStatus == 'active') {
            elmnumberActive.text(numberActive - 1)
          } else if (dataStatus == 'inactive') {
            elmnumberInactive.text(numberInactive - 1)
          }
          elmnumberAll.text(numberAll - 1)
          toastr["success"](notify.DELETE_SUCCESS)
        } else {
          toastr["error"](notify.DELETE_ERROR)
        }
      }
    });
  }

  deleteMultiItemsConfirm = (items, img, link) => {
    let arrItems = items.split(",")
    $.ajax({
      type: "post",
      url: `${link}`,
      data: `id=${items}&img=${img}`,
      dataType: "json",
      success: async function (response) {
        if (response.success == true) {
          $('button[data-dismiss="modal"]').click()
          $.each(arrItems, (index, id) => {
            let elmnumberAll = $("#count-items-all span")
            let elmnumberActive = $("#count-items-active span")
            let elmnumberInactive = $("#count-items-inactive span")
            let numberActive = parseInt(elmnumberActive.text())
            let numberInactive = parseInt(elmnumberInactive.text())
            let numberAll = parseInt(elmnumberAll.text())
            let dataStatus = $(`#${id}`).attr("data-status")
            if (dataStatus == 'active') {
              elmnumberActive.text(numberActive - 1)
              elmnumberAll.text(numberAll - 1)
            } else if (dataStatus == 'inactive') {
              elmnumberInactive.text(numberInactive - 1)
              elmnumberAll.text(numberAll - 1)
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
      changeOrdering(id, value, link)
    })
  })


  changePrice = (id, value, link) => {
    $.ajax({
      type: "post",
      url: `${link}`,
      data: `price=${value}&id=${id}`,
      dataType: "json",
      success: function (response) {
        if (response.success == true) {
          $(`#change-price-${id}`).notify("Successful", {
            className: "success",
            autoHideDelay: 1500,
            elementPosition: "bottom"
          });
        } else {
          let msg = response.errors.errors[0].msg
          $(`#change-price-${id}`).notify(msg, {
            className: "error",
            autoHideDelay: 1500
          });
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
      changePrice(id, value, link)
    })
  })

  $("#check-all").click(function () {
    $("input[name='cid']").prop('checked', $(this).prop('checked'));
  });

  deleteMultiItems = async (link) => {
    let itemsDelete = [];
    let imgDelete = []
    let listItems = ''
    let compare = new Boolean(false);
    $("input[type='checkbox']").prop("checked", function (i, val) {
      if (val == true) {
        compare = val
      }
    });
    if (compare == false) {
      $('#modal-danger .modal-title').text('Warning!')
      $('#modal-danger .modal-body p').text('Please choose items to delete')
      $('#modal-danger button[data-type="confirm"]').css('display', 'none')
    } else {
      let boxChecked = $("input[name='cid']:checkbox:checked")

      await boxChecked.each((index, value) => {
        let id = $(value).val()
        let thumb = $(value).attr("data-img")
        itemsDelete.push(id)
        imgDelete.push(thumb)
        listItems += `
                    <p> Name: ${
          $(`#name-item-${id}`).text()
        } - ID: ${id} </p>
                `
      })
      $('#modal-danger .modal-title').text('You want to delete these Items?')
      $('#modal-danger .modal-body p').html(listItems)
      $('#modal-danger button[data-type="confirm"]').css('display', 'block').attr("onClick", `deleteMultiItemsConfirm('${itemsDelete}','${imgDelete}','${link}')`)
    }

  }

  changeStatusMultiItemsConfirm = (items, status, link) => {
    let elmnumberActive = $("#count-items-active span")
    let elmnumberInactive = $("#count-items-inactive span")
    let numberActive = parseInt(elmnumberActive.text())
    let numberInactive = parseInt(elmnumberInactive.text())
    let arrItems = items.split(",")
    let updateStatus = (status == 'inactive') ? 'inactive' : 'active'
    let updateBtn = (status == 'inactive') ? 'btn-danger' : 'btn-success'
    let updateIcon = (status == 'inactive') ? "fa-ban" : "fa-check"
    $.ajax({
      type: "post",
      url: `${link}`,
      data: `id=${items}&status=${status}`,
      dataType: "json",
      success: async function (response) {
        if (response.success == true) {
          $('button[data-dismiss="modal"]').click()
          $.each(arrItems, async (index, id) => {
            let html = await `
                                <a href="javascript:" onclick="changeStatus('${updateStatus}','${id}', '${linkAdmin}items/change-status/')" id="change-status-${id}" class="rounded-circle btn btn-sm ${updateBtn}">
                                <i class="fas ${updateIcon}"></i></a>
                                `
            $(`#status-item-${id}`).html(html)
            $(`#${id}`).attr("data-status", status)
          })
          if (status.toLowerCase() == 'inactive') {
            elmnumberActive.text((numberActive - arrItems.length))
            elmnumberInactive.text((numberInactive + arrItems.length))
          } else {
            elmnumberActive.text((numberActive + arrItems.length))
            elmnumberInactive.text((numberInactive - arrItems.length))
          }
          toastr["success"](notify.CHANGE_MULTI_STATUS_SUCCESS)
        } else {
          toastr["error"](notify.CHANGE_MULTI_STATUS_ERROR)
        }
      }
    });
  }
  changeMultiStatus = async (status, link) => {
    let modalClass = (status == 'active') ? "modal-success" : "modal-danger"
    let itemsChangeStatus = [];
    let listItems = ''
    let compare = new Boolean(false);
    $("input[name='cid']").prop("checked", function (i, val) {
      if (val == true) {
        compare = val
      }
    });
    if (compare == false) {
      $(`#${modalClass} .modal-title`).text('Warning!')
      $(`#${modalClass} .modal-body p`).text('Please choose items to change status')
      $(`#${modalClass} button[data-type="confirm"]`).css('display', 'none')
    } else {
      let boxChecked = $("input[name='cid']:checkbox:checked")
      await boxChecked.each((index, value) => {
        if ($(value).attr("data-status") == status) 
          return
        
        let id = $(value).val()
        itemsChangeStatus.push(id)
        listItems += `
                    <p> Name: ${
          $(`#name-item-${id}`).text()
        } - ID: ${id} </p>
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
      $(`#${modalClass} button[data-type="confirm"]`).css('display', 'block').attr("onClick", `changeStatusMultiItemsConfirm('${itemsChangeStatus}','${status}','${link}')`)
    }
  }


  const inputNameForm = $("input#name-input-form")
  const inputSlugForm = $("input#slug-input-form")
  inputNameForm.on("change paste keyup", function () {
    inputSlugForm.val(ChangeToSlug($(this).val()));
  });

  const inputCodeCoupon = $("input#couponcode-input-form")
  inputCodeCoupon.on("change paste keyup", function () {
    inputCodeCoupon.val($(this).val().toUpperCase());
  });

  // price format
  // Jquery Dependency

  $("input[data-type='currency']").on({
    keyup: function () {
      formatCurrency($(this));
    },
    blur: function () {
      formatCurrency($(this), "blur");
    }
  });


  function formatNumber(n) { // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }


  function formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    var input_val = input.val();

    // don't validate empty input
    if (input_val === "") {
      return;
    }

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
      // input_val += ".00";
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
  $("select[name='parentMenu']").change(function (value) {
    let id = value.target.getAttribute('data-id')
    let newParent = $(this).find(":selected").val()
    $.ajax({
      type: "post",
      url: `${linkAdmin}menubar/changeparentmenu`,
      data: `id=${id}&newParent=${newParent}`,
      dataType: "json",
      success: function (response) {
        if (response.success == true) {
          toastr["success"](notify.CHANGE_MENUTYPE_SUCCESS)
        } else {
          toastr["error"](notify.CHANGE_MENUTYPE_ERROR)
        }
      }
    });
  })

  $("select[name='category']").change(function (value) {
    let id = value.target.getAttribute('data-id')
    let name = value.target.getAttribute('data-name')
    let newCategory = $(this).find(":selected").val()
    if (newCategory == '') 
      return
    
    $.ajax({
      type: "post",
      url: `${linkAdmin}${name}/changecategory/`,
      data: `id=${id}&newCategory=${newCategory}`,
      dataType: "json",
      success: function (response) {
        if (response.success == true) {
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
    $.ajax({
      type: "post",
      url: `${link}`,
      data: `id=${id}&field=${fieldOption}&isCheck=${isCheck}`,
      dataType: "json",
      success: function (response) {
        if (response.success == true) {
          toastr["success"](notify.CHANGE_OPTION_SUCCESS)
        } else {
          toastr["error"](notify.CHANGE_OPTION_ERROR)
        }
      }
    });
  }

  $("div.option input:checkbox").change(function (value) {
    let data = value.target.getAttribute('id')
    let link = `${linkAdmin}product/option/`
    if (this.checked) {
      changeOption(data, true, link)
    } else {
      changeOption(data, false, link)
    }
  });

  // change link input
  changeLink = (id, value, link) => {
    $.ajax({
      type: "post",
      url: `${link}`,
      data: `link=${value}&id=${id}`,
      dataType: "json",
      success: function (response) {
        if (response.success == true) {
          toastr["success"](notify.CHANGE_LINK_SUCCESS)
        } else {
          let msg = response.errors.errors[0].msg
          toastr["error"](notify.CHANGE_LINK_ERROR + '\n' + msg)
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
      changeLink(id, value, link)
    })
  })

  // show date range

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

  $('input:radio[name=discount]').change(function () {
    if (this.value == 'money') {
      $(`input#${
        this.value
      }_input`).prop("disabled", false)
      $(`input#percent_input`).prop("disabled", true)
    } else if (this.value == 'percent') {
      $(`input#${
        this.value
      }_input`).prop("disabled", false)
      $(`input#money_input`).prop("disabled", true)
    }
  });

  $('input:radio[name=coupon]').change(function () {
    if (this.value == 'money') {
      $(`input#${
        this.value
      }_input`).prop("disabled", false)
      $(`input#percent_input`).prop("disabled", true)
      $(`input#maxdown_input`).prop("disabled", true)

    } else if (this.value == 'percent') {
      $(`input#${
        this.value
      }_input`).prop("disabled", false)
      $(`input#money_input`).prop("disabled", true)
      $(`input#maxdown_input`).prop("disabled", false)
    }
  });

  // change time discount
  let showDiscountStatus = (data) => {
    if (!data) 
      return
    
    let time = data.split('-')
    let timeStart = Date.parse(time[0])
    let timeEnd = Date.parse(time[1])
    let timeNow = Date.now()
    let text = "Finished"
    let button = "btn-danger"
    if (timeNow < timeStart) {
      text = "Unstarted"
      button = "btn-warning"
    } else if (timeNow < timeEnd) {
      text = "In Process"
      button = "btn-success"
    }
    return `<button type="button" class="btn btn-block ${button}" style="pointer-events: none;">${text}</button>`
  }

  let changeTimeDiscount = (id, value, link) => {
    $.ajax({
      type: "post",
      url: `${link}`,
      data: `time=${value}&id=${id}`,
      dataType: "json",
      success: function (response) {
        if (response.success == true) {
          toastr["success"](notify.CHANGE_ORDERING_SUCCESS)
          let xhtml = showDiscountStatus(value)
          $(`td#discountstatus-item-${id}`).html(xhtml)
        } else {
          let msg = response.errors.errors[0].msg
          toastr["error"](notify.CHANGE_ORDERING_ERROR + '\n' + msg)
        }
      }
    });
  }
  $('input[id^="reservationtime-"]').datepicker({
    onSelect: function (dateText) {
      $(this).change();
    }
  }).on("change", function () {
    let id = this.getAttribute('id').split('-')[1]
    let value = this.value
    let link = this.getAttribute('data-router')
    changeTimeDiscount(id, value, link)
  });

  // input drag
  let checkDuplicatedEmail = (name) =>{
    let check = true
    $( "li.tags" ).each(function( index ) {
        if($( this ).text() == name){
            check = false
        }
      });
    return check
  }
  var backSpace;
  var close = '<a class="close"></a>';
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  $('.tagarea').after('<ul class="tag-box"></ul>');

  $('.tag-box').append('<li class="new-tag"><input placeholder="Type email and Enter" class="input-tag" type="text"></li>');

  // Taging
  $('.input-tag').bind("keydown", function (kp) {
    var tag = $('.input-tag').val().trim();
    if (tag.match(validRegex)) {
        $(".tags").removeClass("danger");
        if (tag.length > 0) {
          backSpace = 0;
          if (kp.keyCode == 13) {
                if(checkDuplicatedEmail(tag)){
                    $(".new-tag").before('<li class="tags">' + tag + close + '</li>');
                    $(this).val('');
                    refreshSubEmail()
                }else{
                    toastr["error"](notify.ERROR_EMAIL_DUPLICATED)
                }
          }
        } else {
          if (kp.keyCode == 8) {
            $(".new-tag").prev().addClass("danger");
            backSpace++;
            if (backSpace == 2) {
              $(".new-tag").prev().remove();
              backSpace = 0;
            }
          }
        }
      } else {
        if (kp.keyCode == 13) {
            toastr["error"](notify.ERROR_EMAIL)
          }
      }
  });
  // Delete tag
  $(".tag-box").on("click", ".close", function () {
    $(this).parent().remove();
    refreshSubEmail()
  });
  $(".tag-box").click(function () {
    $('.input-tag').focus();
  });
  // Edit
  $('.tag-box').on("dblclick", ".tags", function (cl) {
    var tags = $(this);
    var tag = tags.text().trim();
    $('.tags').removeClass('edit');
    tags.addClass('edit');
    tags.html('<input class="input-tag" value="' + tag + '" type="text">')
    $(".new-tag").hide();
    tags.find('.input-tag').focus();

    tag = $(this).find('.input-tag').val();
    $('.tags').dblclick(function () {
      tags.html(tag + close);
      $('.tags').removeClass('edit');
      $(".new-tag").show();
    });

    tags.find('.input-tag').bind("keydown", function (edit) {
      tag = $(this).val();
      if (edit.keyCode == 13) {
        $(".new-tag").show();
        $('.input-tag').focus();
        $('.tags').removeClass('edit');
        if (tag.length > 0) {
          tags.html(tag + close);
          refreshSubEmail()
        } else {
          tags.remove();
        }
      }
    });
  });
  // sorting
  $(function () {
    $(".tag-box").sortable({items: "li:not(.new-tag)", containment: "parent", scrollSpeed: 100});
    $(".tag-box").disableSelection();
  });

  $('form input').on('keypress', function(e) {
    if($(e.target).attr('name') == 'keyword'){
      $(e.target).submit()
    } else{
      return e.which !== 13;
    }
  });
  
    let showSubEmail = (value) =>{
        let arrEmail = value.split(",")
        let xhtml =''
        arrEmail.pop()
        $.each(arrEmail, (index, value) =>{
            xhtml+= `
            <li class="tags">${value}<a class="close"></a></li>
            `
        })
        $(".new-tag").before(xhtml)
    }
    if(pathname == "setting") showSubEmail($('input[name="sub_email"]').val())
    let refreshSubEmail = () =>{
        let tags=""
        $("li.tags").each((index, value)=>{
            tags += $(value).text() + ','
        })
        $('input[name="sub_email"]').val(tags)
    }

    // add column
  var buttonAddSay = $("#say-add-button");
  var buttonRemoveSay = $("#say-remove-button");
  var classNameSay = ".say-dynamic-field";
  var countSay = 0;
  var fieldSay = "";
  var maxFieldsSay = 5;

  function totalFieldsSay() {
    return $(classNameSay).length;
  }

  function addNewFieldSay() {
    countSay = totalFieldsSay() + 1;
    fieldSay = $("#say-dynamic-field-1").clone();
    fieldSay.attr("id", "say-dynamic-field-" + countSay);
    fieldSay.children("label").text("Person " + countSay);
    fieldSay.find("input").val("");
    $(classNameSay + ":last").after($(fieldSay));
  }

  function removeLastFieldSay() {
    if (totalFieldsSay() > 1) {
      $(classNameSay + ":last").remove();
      let arr = JSON.parse($("input[name='list_say_client']").val())
      arr.pop()
      $("input[name='list_say_client']").val(JSON.stringify(arr))
    }
  }

  function enableButtonRemoveSay() {
    if (totalFieldsSay() === 2) {
      buttonRemoveSay.removeAttr("disabled");
      buttonRemoveSay.addClass("shadow-sm");
    }
  }

  function disableButtonRemoveSay() {
    if (totalFieldsSay() === 1) {
      buttonRemoveSay.attr("disabled", "disabled");
      buttonRemoveSay.removeClass("shadow-sm");
    }
  }

  function disableButtonAddSay() {
    if (totalFieldsSay() === maxFieldsSay) {
      buttonAddSay.attr("disabled", "disabled");
      buttonAddSay.removeClass("shadow-sm");
    }
  }

  function enableButtonAddSay() {
    if (totalFieldsSay() === (maxFieldsSay - 1)) {
      buttonAddSay.removeAttr("disabled");
      buttonAddSay.addClass("shadow-sm");
    }
  }

  buttonAddSay.click(function() {
    addNewFieldSay();
    enableButtonRemoveSay();
    disableButtonAddSay();
  });

  buttonRemoveSay.click(function() {
    removeLastFieldSay();
    disableButtonRemoveSay();
    enableButtonAddSay();
  });
  
  $(document).on("keyup", "div[id*='say-dynamic-field']" , function(e) {
      let arrValue = []
      $("div[id*='say-dynamic-field']").each((index,item)=>{
        let obj = {}
        obj["name"] = $(item).find('input[name="name_client_1[]"').val()
        obj["content"] = $(item).find('input[name="content_client_1[]"').val()
        obj["career"] = $(item).find('input[name="career_client_1[]"').val()
        arrValue.push(obj)
      })
      $("input[name='list_say_client']").val(JSON.stringify(arrValue))
  });

  /////

  
  var buttonAddMission = $("#mission-add-button");
  var buttonRemoveMission = $("#mission-remove-button");
  var classNameMission = ".mission-dynamic-field";
  var countMission = 0;
  var fieldMission = "";
  var maxFieldsMission = 5;

  function totalFieldsMission() {
    return $(classNameMission).length;
  }

  function addNewFieldMission() {
    countMission = totalFieldsMission() + 1;
    fieldMission = $("#mission-dynamic-field-1").clone();
    fieldMission.attr("id", "mission-dynamic-field-" + countMission);
    fieldMission.children("label").text("Mission " + countMission);
    fieldMission.find("input").val("");
    $(classNameMission + ":last").after($(fieldMission));
  }

  function removeLastFieldMission() {
    if (totalFieldsMission() > 1) {
      $(classNameMission + ":last").remove();
      let arr = JSON.parse($("input[name='list_mission']").val())
      arr.pop()
      $("input[name='list_mission']").val(JSON.stringify(arr))
    }
  }

  function enableButtonRemoveMission() {
    if (totalFieldsMission() === 2) {
      buttonRemoveMission.removeAttr("disabled");
      buttonRemoveMission.addClass("shadow-sm");
    }
  }

  function disableButtonRemoveMission() {
    if (totalFieldsMission() === 1) {
      buttonRemoveMission.attr("disabled", "disabled");
      buttonRemoveMission.removeClass("shadow-sm");
    }
  }

  function disableButtonAddMission() {
    if (totalFieldsMission() === maxFieldsMission) {
      buttonAddMission.attr("disabled", "disabled");
      buttonAddMission.removeClass("shadow-sm");
    }
  }

  function enableButtonAddMission() {
    if (totalFieldsMission() === (maxFieldsMission - 1)) {
      buttonAddMission.removeAttr("disabled");
      buttonAddMission.addClass("shadow-sm");
    }
  }

  buttonAddMission.click(function() {
    addNewFieldMission();
    enableButtonRemoveMission();
    disableButtonAddMission();
  });

  buttonRemoveMission.click(function() {
    removeLastFieldMission();
    disableButtonRemoveMission();
    enableButtonAddMission();
  });
  $(document).on("keyup", "div[id*='mission-dynamic-field-']" , function(e) {
    let arrValue = []
    $("div[id*='mission-dynamic-field-']").each((index,item)=>{
      let obj = {}
      obj["name"] = $(item).find('input[name="name_mission_1[]"').val()
      obj["content"] = $(item).find('input[name="content_mission_1[]"').val()
      arrValue.push(obj)
    })
    $("input[name='list_mission']").val(JSON.stringify(arrValue))
  });
//

    // add column
    var buttonAddChoose = $("#choose-add-button");
    var buttonRemoveChoose = $("#choose-remove-button");
    var classNameChoose = ".choose-dynamic-field";
    var countChoose = 0;
    var fieldChoose = "";
    var maxFieldsChoose = 5;
  
    function totalFieldsChoose() {
      return $(classNameChoose).length;
    }
  
    function addNewFieldChoose() {
      countChoose = totalFieldsChoose() + 1;
      fieldChoose = $("#choose-dynamic-field-1").clone();
      fieldChoose.attr("id", "choose-dynamic-field-" + countChoose);
      fieldChoose.children("label").text("Item " + countChoose);
      fieldChoose.find("input").val("");
      $(classNameChoose + ":last").after($(fieldChoose));
    }
  
    function removeLastFieldChoose() {
      if (totalFieldsChoose() > 1) {
        $(classNameChoose + ":last").remove();
        let arr = JSON.parse($("input[name='list_choose']").val())
        arr.pop()
        $("input[name='list_choose']").val(JSON.stringify(arr))
      }
    }
  
    function enableButtonRemoveChoose() {
      if (totalFieldsChoose() === 2) {
        buttonRemoveChoose.removeAttr("disabled");
        buttonRemoveChoose.addClass("shadow-sm");
      }
    }
  
    function disableButtonRemoveChoose() {
      if (totalFieldsChoose() === 1) {
        buttonRemoveChoose.attr("disabled", "disabled");
        buttonRemoveChoose.removeClass("shadow-sm");
      }
    }
  
    function disableButtonAddChoose() {
      if (totalFieldsChoose() === maxFieldsChoose) {
        buttonAddChoose.attr("disabled", "disabled");
        buttonAddChoose.removeClass("shadow-sm");
      }
    }
  
    function enableButtonAddChoose() {
      if (totalFieldsChoose() === (maxFieldsChoose - 1)) {
        buttonAddChoose.removeAttr("disabled");
        buttonAddChoose.addClass("shadow-sm");
      }
    }
  
    buttonAddChoose.click(function() {
      addNewFieldChoose();
      enableButtonRemoveChoose();
      disableButtonAddChoose();
    });
  
    buttonRemoveChoose.click(function() {
      removeLastFieldChoose();
      disableButtonRemoveChoose();
      enableButtonAddChoose();
    });
    
    $(document).on("keyup", "div[id*='choose-dynamic-field']" , function(e) {
        let arrValue = []
        $("div[id*='choose-dynamic-field']").each((index,item)=>{
          let obj = {}
          obj["title"] = $(item).find('input[name="title_choose_1[]"').val()
          obj["description"] = $(item).find('input[name="description_choose_1[]"').val()
          obj["icon"] = $(item).find('input[name="icon_choose_1[]"').val()
          arrValue.push(obj)
        })
        $("input[name='list_choose']").val(JSON.stringify(arrValue))
    });

  // shipping
  var buttonAddShipping = $("#shipping-add-button");
  var buttonRemoveShipping = $("#shipping-remove-button");
  var classNameShipping = ".shipping-dynamic-field";
  var countShipping = 0;
  var fieldShipping = "";
  var maxFieldsShipping = 5;

  function totalFieldsShipping() {
    return $(classNameShipping).length;
  }

  function addNewFieldShipping() {
    countShipping = totalFieldsShipping() + 1;
    fieldShipping = $("#shipping-dynamic-field-1").clone();
    fieldShipping.attr("id", "shipping-dynamic-field-" + countShipping);
    fieldShipping.children("label").text("Step " + countShipping);
    fieldShipping.find("input").val("");
    $(classNameShipping + ":last").after($(fieldShipping));
  }

  function removeLastFieldShipping() {
    if (totalFieldsShipping() > 1) {
      $(classNameShipping + ":last").remove();
      let arr = JSON.parse($("input[name='list_shipping']").val())
      arr.pop()
      $("input[name='list_shipping']").val(JSON.stringify(arr))
    }
  }

  function enableButtonRemoveShipping() {
    if (totalFieldsShipping() === 2) {
      buttonRemoveShipping.removeAttr("disabled");
      buttonRemoveShipping.addClass("shadow-sm");
    }
  }

  function disableButtonRemoveShipping() {
    if (totalFieldsShipping() === 1) {
      buttonRemoveShipping.attr("disabled", "disabled");
      buttonRemoveShipping.removeClass("shadow-sm");
    }
  }

  function disableButtonAddShipping() {
    if (totalFieldsShipping() === maxFieldsShipping) {
      buttonAddShipping.attr("disabled", "disabled");
      buttonAddShipping.removeClass("shadow-sm");
    }
  }

  function enableButtonAddShipping() {
    if (totalFieldsShipping() === (maxFieldsShipping - 1)) {
      buttonAddShipping.removeAttr("disabled");
      buttonAddShipping.addClass("shadow-sm");
    }
  }

  buttonAddShipping.click(function() {
    addNewFieldShipping();
    enableButtonRemoveShipping();
    disableButtonAddShipping();
  });

  buttonRemoveShipping.click(function() {
    removeLastFieldShipping();
    disableButtonRemoveShipping();
    enableButtonAddShipping();
  });
  
  $(document).on("keyup", "div[id*='shipping-dynamic-field']" , function(e) {
      let arrValue = []
      $("div[id*='shipping-dynamic-field']").each((index,item)=>{
        let obj = {}
        obj["title"] = $(item).find('input[name="title_shipping_1[]"').val()
        obj["description"] = $(item).find('input[name="description_shipping_1[]"').val()
        arrValue.push(obj)
      })
      $("input[name='list_shipping']").val(JSON.stringify(arrValue))
  });
  /// end shipping

  //policy
      // add column
      var buttonAddPolicy = $("#policy-add-button");
      var buttonRemovePolicy = $("#policy-remove-button");
      var classNamePolicy = ".policy-dynamic-field";
      var countPolicy = 0;
      var fieldPolicy = "";
      var maxFieldsPolicy = 5;
    
      function totalFieldsPolicy() {
        return $(classNamePolicy).length;
      }
    
      function addNewFieldPolicy() {
        countPolicy = totalFieldsPolicy() + 1;
        fieldPolicy = $("#policy-dynamic-field-1").clone();
        fieldPolicy.attr("id", "policy-dynamic-field-" + countPolicy);
        fieldPolicy.children("label").text("Policy " + countPolicy);
        fieldPolicy.find("input").val("");
        $(classNamePolicy + ":last").after($(fieldPolicy));
      }
    
      function removeLastFieldPolicy() {
        if (totalFieldsPolicy() > 1) {
          $(classNamePolicy + ":last").remove();
          let arr = JSON.parse($("input[name='list_policy']").val())
          arr.pop()
          $("input[name='list_policy']").val(JSON.stringify(arr))
        }
      }
    
      function enableButtonRemovePolicy() {
        if (totalFieldsPolicy() === 2) {
          buttonRemovePolicy.removeAttr("disabled");
          buttonRemovePolicy.addClass("shadow-sm");
        }
      }
    
      function disableButtonRemovePolicy() {
        if (totalFieldsPolicy() === 1) {
          buttonRemovePolicy.attr("disabled", "disabled");
          buttonRemovePolicy.removeClass("shadow-sm");
        }
      }
    
      function disableButtonAddPolicy() {
        if (totalFieldsPolicy() === maxFieldsPolicy) {
          buttonAddPolicy.attr("disabled", "disabled");
          buttonAddPolicy.removeClass("shadow-sm");
        }
      }
    
      function enableButtonAddPolicy() {
        if (totalFieldsPolicy() === (maxFieldsPolicy - 1)) {
          buttonAddPolicy.removeAttr("disabled");
          buttonAddPolicy.addClass("shadow-sm");
        }
      }
    
      buttonAddPolicy.click(function() {
        addNewFieldPolicy();
        enableButtonRemovePolicy();
        disableButtonAddPolicy();
      });
    
      buttonRemovePolicy.click(function() {
        removeLastFieldPolicy();
        disableButtonRemovePolicy();
        enableButtonAddPolicy();
      });
      
      $(document).on("keyup", "div[id*='policy-dynamic-field']" , function(e) {
          let arrValue = []
          $("div[id*='policy-dynamic-field']").each((index,item)=>{
            let obj = {}
            obj["title"] = $(item).find('input[name="title_policy_1[]"').val()
            obj["description"] = $(item).find('input[name="description_policy_1[]"').val()
            obj["icon"] = $(item).find('input[name="icon_policy_1[]"').val()
            arrValue.push(obj)
          })
          $("input[name='list_policy']").val(JSON.stringify(arrValue))
      });
  
  //end policy

  getArrPhoto = (id) =>{
      let valueArr =""
      $(`#${id} img`).each((index,value)=>{
        valueArr += $(value).attr("data-name") + ","
      })
      let idd =  $("input[name='id']").val()
      $.ajax({
        type: "post",
        url: `${linkAdmin}product/sortable/`,
        data: `thumb=${valueArr}&id=${idd}`,
        dataType: "json",
        success: function (response) {
          if (response.success == true) {
            toastr["success"](notify.CHANGE_SORTABLE_SUCCESS)
          } else {
            let msg = response.errors.errors[0].msg
            toastr["error"](notify.CHANGE_SORTABLE_ERROR + '\n' + msg)
          }
        }
      });
  }

  $( ".sortable" ).sortable({
    update: function(event, ui) {
      getArrPhoto('imageMediaPreviewProductUploaded')
   }
  })

  var previousOrderSelect
  // change status order
$(document)
  .on('focus',"select[data-id*='orders-']",function (e) {
    // Store the current value on focus and on change
    let oldStatus = $(e.target).find(":selected").val()
    previousOrderSelect = oldStatus
    console.log(previousOrderSelect)
  })
  .on('change',"select[data-id*='orders-']",(e)=>{
    let elmNumberPrevious = $(`#count-items-${previousOrderSelect} span`)
    let numberPrevious = parseInt(elmNumberPrevious.text()) - 1

    let newStatus = $(e.target).find(":selected").val()
    let id        = $(e.target).attr('data-id').split('-')[1]
    if(newStatus > 2){
        if (confirm("Are you sure change? Note: Status 'Deliveried, Cancel, Return' can't be changed") == false) {
          $(`select[data-id='orders-${id}'] option[value='${previousOrderSelect}']`).prop('selected', true)
          return
        } 
    }
    $.ajax({
      type: "post",
      url: `${linkAdmin}order/change-status/`,
      data: `status=${newStatus}&id=${id}`,
      dataType: "json",
      success: function (response) {
        if (response.success == true) {
          let data = response.data
          toastr["success"](notify.CHANGE_ORDER_STATUS_SUCCESS)
          if(data.status > 2){
            $(e.target).prop('disabled', true)
          }
          let elmNumberNew = $(`#count-items-${data.status} span`)
          let numberNew = parseInt(elmNumberNew.text()) + 1
          elmNumberNew.text(numberNew)
          elmNumberPrevious.text(numberPrevious)
        } else {
          let msg = response.errors[0].msg
          toastr["error"](msg)
          $(`select[data-id='orders-${id}'] option[value='${previousOrderSelect}']`).prop('selected', true)
        }
      }
    })
    .fail(function() {
      alert( "Have error, Please press F5." );
      $(`select[data-id='orders-${id}'] option[value='${previousOrderSelect}']`).prop('selected', true)
    })
  })
});

