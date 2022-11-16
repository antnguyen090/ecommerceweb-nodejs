$(document).ready(function() {
  const localLove = "LIST_LOVE"
  const localCart = "LIST_CART"
  const notify    = listNotify() 
  let loadStorage = (local) => {
      return JSON.parse(localStorage.getItem(local)) ;
  }

  let saveStorage = (local, items) => {
      localStorage.setItem(local, JSON.stringify(items));
  }

  $('.simple-ajax-popup-align-top').magnificPopup({
		type: 'ajax',
		alignTop: true,
		overflowY: 'scroll' // as we know that popup content is tall we set scroll overflow by default to avoid jump
	});

  var arrayPath = window.location.pathname.split("/")[1]
  $(`li > a[href="/${arrayPath}"]`).parent().addClass("active")

  $( ".mapHolder iframe" ).load(function() {
    // Handler for .load() called.
      $( ".mapHolder").css("display","block")
  });
  $('[data-toggle="tooltip"]').tooltip()

  //storage love

  let listItems = (name) => {
    let items = loadStorage(name) ;
    if(items === null) items = [];  // 
    return items;
  }

  let addItem = (id, local) => {
    let items = listItems(local);
    let itemNew
    if (localLove == local){
      let checkExitLove = items.filter(item=> item === id)
      if(checkExitLove.length>0){
        return items
      } else{
        itemNew = id;
        items.push(itemNew);
      }
    } else if(localCart == local){
      let checkExitCart = items.filter(item=> item.id===id)
      if(checkExitCart.length>0){
        return items
      } else{
        itemNew = {id: id, quantity: 1}
        items.push(itemNew);
      }
    }
    // Lưu item vào storgare
    saveStorage(local,items);
    return items
  }

  let deleteItem = (id, local) => {
    let items = listItems(local);
    if (localLove == local){
      items = items.filter(item => item !== id);
    } else if(localCart == local){
      items = items.filter(item => item.id !== id);
    }
    saveStorage(local, items);
    return items;
  }

  let editItem = (id, local, quantity) => {
    let items = listItems(local);
    let itemEditedIndex
    if(localCart == local){
      itemEditedIndex = items.findIndex((obj => obj.id == id));
    }
    items[itemEditedIndex].quantity = quantity
    saveStorage(local, items);
    return items;
  }

  formatPrice = (price, unit, discount) =>{
    if(!price || !unit) return
    if(!discount){
      return price.toLocaleString() + ' ' + unit
    } else {
      if(discount.discountValue.unit == 'money'){
        let newPriceMoney = price - discount.discountValue.value
        return `<del>${formatPrice(price, unit)}</del> ${formatPrice(newPriceMoney, unit)}`
      } else{
        let newPricePercent = price - discount.discountValue.value*price/100
        newPricePercent = parseInt(newPricePercent/1000)*1000
        return `<del>${formatPrice(price, unit)}</del> ${formatPrice(newPricePercent, unit)}`
      }
    }
  }

  let totalPrice = (id, price, unit, discount, quantity) =>{
    let total
    let quantityObjById = quantity.find(item=> item.id == id)
    let quantityValueById = quantityObjById.quantity
    if(!price || !unit) return
    if(!discount){
      return formatPrice(quantityValueById*price, unit)
    } else {
      if(discount.discountValue.unit == 'money'){
        let newPriceMoney = price - discount.discountValue.value
        money= newPriceMoney
      } else{
        let newPricePercent = price - discount.discountValue.value*price/100
        money = parseInt(newPricePercent/1000)*1000
      }
    }
    total= quantityValueById*money
    return formatPrice(total, unit)
  }
  
  let showSaleText = (data, unit) =>{
    if(!data) return
    let html = '<span class="hotOfferGreen fwEbold text-uppercase text-white position-absolute d-block ml-8">Sale -'
    if(data.discountValue.unit == 'money'){
      html+= formatPrice(data.discountValue.value, unit)
    } else{
      html+= data.discountValue.value + " %"
    }
    html += '</span>' 
    return html
  }
  
  let  checkTimeInRange = (data) =>{
    if (!data) return
    let time = data.split('-')
    let timeStart = Date.parse(time[0])
    let timeEnd = Date.parse(time[1])
    let timeNow = Date.now()
    let isRight = false
    if (timeNow < timeStart){
      isRight = false
    } else if(timeNow < timeEnd){
      isRight = true
    } 
    return isRight
  }
  
  let  showSaleIcon = (dataShow, money) =>{
    if(!dataShow) return
    let activeData = dataShow.filter(item => item.status === 'active' && checkTimeInRange(item.time)==true)
    let listMoney = activeData.filter(item => item.discountValue.unit == 'money')
    let listPercent = activeData.filter(item => item.discountValue.unit == 'percent')
    let maxMoney, maxPercent
    if(listMoney.length>0) maxMoney      = listMoney.reduce((max, item)=> max.value > item.value ? max : item)
    if(listPercent.length>0) maxPercent  = listPercent.reduce((max, item)=> max.value > item.value ? max : item)
    if(maxMoney && maxPercent){
      if(maxMoney.discountValue.value > (maxPercent.discountValue.value*money/100)){
        return maxMoney
      }else {
        return maxPercent
      }
    } else if(maxMoney && !maxPercent){
        return maxMoney
    } else if(!maxMoney && maxPercent){
        return maxPercent
    }
  }
  
  let showListLove = (data, link, unit ) =>{
    let html=''
    data.forEach((item,index)=>{
      let dataSale = showSaleIcon(item.discountProduct, item.price)
      let sale     = (dataSale) ? showSaleText(dataSale,unit) : ''
      let position = (dataSale || item.fearturedproduct == true) ? "position-relative " : ""
      let hotShow  = ''
      if(item.fearturedproduct == true){
        hotShow = '<span class="hotOffer fwEbold text-uppercase text-white position-absolute d-block">HOT</span>'
      }
      html+= `
      <!-- featureCol -->
      <div data-product="product-${item._id}" class="position-relative col-12 col-sm-6 col-lg-4 featureCol mb-7">
        <div class="border">
            <div data-product="product-${item._id}" class="imgHolder position-relative w-100 overflow-hidden">
                <img src="${link}${item.thumb[0]}" alt="image description" class="img-fluid w-100">
                <ul class="list-unstyled postHoverLinskList d-flex justify-content-center m-0">
                    <li class="mr-2 overflow-hidden"><a href="javascript:void(0);"
                            class="icon-heart d-block" data-product="product-${item._id}"></a></li>
                    <li class="mr-2 overflow-hidden" data-product="product-${item._id}"><a href="javascript:void(0);"
                            class="icon-cart d-block" data-product="product-${item._id}"></a></li>
                    <li class="overflow-hidden" data-product="product-${item._id}"><a href="javascript:void(0);"
                            class="icon-eye d-block"></a></li>
                </ul>
            </div>
            <div class="text-center py-5 px-4">
                <span class="title d-block mb-2"><a href="/${item.slug}">${item.name}</a></span>
                <span class="price d-block fwEbold">${formatPrice(item.price, unit, dataSale)}</span>
               ${hotShow}
               ${sale}
            </div>
        </div>
    </div>
      `
  })
    return html
  }

  let showListCart = (data, link, unit, quantity ) =>{
    let getValueQuanity = (quantitybyid) =>{
      if(quantitybyid == undefined) return 
      let data = quantity.find(obj=>{
        return obj.id === quantitybyid
      })
      return data.quantity
    }
    let html=`
    <table class="table cartTable">
    <thead>
        <tr>
            <th scope="col" class="text-uppercase fwEbold border-top-0">Tên Sản Phẩm</th>
            <th scope="col" class="text-uppercase fwEbold border-top-0">Giá</th>
            <th scope="col" class="text-uppercase fwEbold border-top-0">Số Lượng</th>
            <th scope="col" class="text-uppercase fwEbold border-top-0">Tổng</th>
        </tr>
    </thead>
    <tbody id="listProductCart">
    `    
    data.forEach((item,index)=>{
      let dataSale = showSaleIcon(item.discountProduct, item.price)
      let sale     = (dataSale) ? showSaleText(dataSale,unit) : ''
      let position = (dataSale || item.fearturedproduct == true) ? "position-relative " : ""
      let hotShow  = ''
      if(item.fearturedproduct == true){
        hotShow = '<span class="hotOffer fwEbold text-uppercase text-white position-absolute d-block">HOT</span>'
      }
      html +=`
      <tr class="align-items-center" data-product="product-${item._id}">
          <td class="d-flex align-items-center border-top-0 border-bottom px-0 py-6">
              <div class="imgHolder">
                  <img src="${link}${item.thumb[0]}" alt="image description" class="img-fluid">
              </div>
              <span class="title pl-2"><a href="/${item.slug}">${item.name}</a></span>
          </td>
          <td class="fwEbold border-top-0 border-bottom px-0 py-6" data-product="priceProduct-${item._id}">${formatPrice(item.price, unit, dataSale)}</td>
          <td class="border-top-0 border-bottom px-0 py-6"><input type="number" data-product="product-${item._id}" value='${getValueQuanity(item._id)}' placeholder="1"></td>
          <td class="fwEbold border-top-0 border-bottom px-0 py-6" data-product="priceProductTotal-${item._id}">${totalPrice(item._id, item.price, unit, dataSale, quantity)} <a href="javascript:void(0);" class="fas fa-times float-right"data-product="product-${item._id}" ></a></td>
      </tr>
      `
  })
    html+= `</tbody>
    </table>` 
    return html
  }

  $("form#sendMail").submit((e)=>{
    $( "form button[type='submit']" ).addClass('disabled').attr('disabled','')
  })
  
  $("form#newsletterForm").submit((e)=>{
    $( "form button[type='submit']" ).addClass('disabled').attr('disabled','')
  })

  $(function(){
    $("input[name='otpCode']").keypress(function (e) {
      if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
       return false;
     }
    });
 });

  $("#sendMail").submit(function(e) {
    $('.submitButton').html(`
    <div class="spinner-border text-success" role="status">
        <span class="sr-only">Loading...</span>
    </div> Đang gửi vui lòng chờ trong giây lát...
    `)
    let urlPath = window.location.pathname.split("/")[1]
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var form = $("#sendMail").serialize();
    $.ajax({
        type: "POST",
        url: `/${urlPath}/`,
        data: form, // serializes the form's elements.
        success: function (response) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              }
            if(response.success == true){
                toastr["success"](notify.SEND_SUCCESS)
                $("#sendMail input").val("")
                $("#sendMail textarea").val("")
            } else {
                toastr["error"](notify.SEND_UNSUCCESS)
            }
            $('.submitButton').html('<button type="submit" class="btn btnTheme btnShop md-round fwEbold text-white py-3 px-4 py-md-3 px-md-4">Gửi</button>')
        }
    });
});

$("#newsletterForm").submit(function(e) {
    $('.submitButton').html(`
    <button type="submit" class="btn btnTheme btnShop fwEbold text-white py-2 disabled" disabled>
      <div class="spinner-border text-success" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </button>
    `)
    let urlPath = window.location.pathname.split("/")[1]
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var form = $("#newsletterForm").serialize();
    $.ajax({
        type: "POST",
        url: `/lien-he/dang-ky-mail`,
        data: form, // serializes the form's elements.
        success: function (response) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              }
            if(response.success == true){
                toastr["success"](notify.SEND_RESGISTER_SUCCESS)
                $("#newsletterForm input").val("")
            } else {
                toastr["error"](notify.SEND_RESGISTER_UNSUCCESS)
            }
            $('.submitButton').html(`
            <button type="submit" class="btn btnTheme btnShop fwEbold text-white py-3 px-4">Enter <i class="fas fa-arrow-right ml-2"></i></button>
            `)
        }
    });
});

$("#formProfile").submit(function(e) {
  e.preventDefault(); // avoid to execute the actual submit of the form.
  $(e.target).children('.d-flex.justify-content-center.spinner').html(spinnerCenter)
  let urlPath = window.location.pathname.split("/")[1]
  e.preventDefault(); // avoid to execute the actual submit of the form.
  var form = $("#formProfile").serialize();
  $.ajax({
      type: "POST",
      url: `/${urlPath}/cap-nhat-thong-tin`,
      data: form, // serializes the form's elements.
      success: function (response) {
          toastr.options = {
              "closeButton": false,
              "debug": false,
              "newestOnTop": false,
              "progressBar": false,
              "positionClass": "toast-top-center",
              "preventDuplicates": false,
              "onclick": null,
              "showDuration": "300",
              "hideDuration": "1000",
              "timeOut": "5000",
              "extendedTimeOut": "1000",
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
            }
          if(response.success == true){
              toastr["success"](notify.SEND_UPDATE_INFOR_SUCCESS)
          } else {
              try {
                response.errors.forEach((item)=>{
                  toastr["error"](item.msg)
                  })
              } catch (error) {
                toastr["error"]("Có lỗi xảy ra vui lòng F5 trang")
              }
          }
          $(e.target).children('.d-flex.justify-content-center.spinner').html(`
          <button type="submit" class="btn btn-success btn-block btn-lg gradient-custom-4 submitButton">Thay Đổi Thông Tin</button>
          `)
      }
  });
});

$("#formChangePassword").submit(function(e) {
  e.preventDefault(); // avoid to execute the actual submit of the form.
  $(e.target).children('.d-flex.justify-content-center.spinner').html(spinnerCenter)
  let urlPath = window.location.pathname.split("/")[1]
  e.preventDefault(); // avoid to execute the actual submit of the form.
  var form = $("#formChangePassword").serialize();
  $.ajax({
      type: "POST",
      url: `/${urlPath}/doi-mat-khau`,
      data: form, // serializes the form's elements.
      success: function (response) {
          toastr.options = {
              "closeButton": false,
              "debug": false,
              "newestOnTop": false,
              "progressBar": false,
              "positionClass": "toast-top-center",
              "preventDuplicates": false,
              "onclick": null,
              "showDuration": "300",
              "hideDuration": "1000",
              "timeOut": "5000",
              "extendedTimeOut": "1000",
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
            }
          if(response.success == true){
              toastr["success"](notify.SEND_UPDATE_INFOR_SUCCESS)
          } else {
            toastr["error"](response.errors[0].msg)
          }
          $(e.target).children('.d-flex.justify-content-center.spinner').html(`
          <button type="submit" class="btn btn-success btn-block btn-lg gradient-custom-4 submitButton">Đổi</button>
          `)
      }
  });
});

$("#formFindOrder").submit(function(e) {
  e.preventDefault(); // avoid to execute the actual submit of the form.
  $(e.target).children('.d-flex.justify-content-center.spinner').html(spinnerCenter)
  let code = $("input[name='codeOrder']").val()
  window.location.replace(`/don-hang/${code}`);
});

$(".search-btn").click(function(){
    $(".wrapper").addClass("active");
    $(this).css("display", "none");
    $(".search-data").fadeIn(500);
    $(".close-btn").fadeIn(500);
    $(".search-data .line").addClass("active");
    setTimeout(function(){
      $(".search-data input").focus();
      $(".search-data label").fadeIn(500);
      $(".search-data span").fadeIn(500);
    }, 800);
   });
  
  $(".close-btn").click(function(){
    $(".wrapper").removeClass("active");
    $(".search-btn").fadeIn(800);
    $(".search-data").fadeOut(500);
    $(".close-btn").fadeOut(500);
    $(".search-data .line").removeClass("active");
    $("input").val("");
    $(".search-data label").fadeOut(500);
    $(".search-data span").fadeOut(500);
  });

  $('a[data-fancybox="gallery"]').css('display','initial')

  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  $(document).on('click', 'div[data-product*="product-"] a.icon-heart.d-block', function(e) {
    let data = $(e.target).attr('data-product').split('-')
    let id   = data[1]
    let items
    if($(e.target).hasClass('active')){
      items = deleteItem(id, localLove)
      $(e.target).removeClass("active")
      $("header#header a.icon-heart span.num").text(items.length)
      if(arrayPath=='yeu-thich'){
        $(`.row > div[data-product="product-${id}"]`).remove()
        if(items.length == 0){
          let html = `
              <div class="position-absolute text-center font-weight-bold" style="
              color: #5ba515;
              width: 100%; 
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);" role="status">
                  Danh Sách Yêu Thích Trống...
                </div>
              `
              $('article#content > div.row').html(html)
        }
      }
      toastr["error"](notify.REMOVE_LOVE_SUCCESS)
    } else{
      items = addItem(id, localLove)
      $(e.target).addClass("active")
      $("header#header a.icon-heart span.num").text(items.length)
      toastr["success"](notify.ADD_LOVE_SUCCESS)
    }
    });

  let loadListLove = () =>{
    let items = listItems(localLove)
    let number = items.length
    $("header#header a.icon-heart span.num").text(number)
    items.forEach(item=>{
      $(`div[data-product*="product-${item}"] a.icon-heart.d-block`).addClass("active")
    })
  }

  loadListLove()

  if(arrayPath=='yeu-thich'){
    let items = listItems(localLove)
    $.ajax({
      type: "POST",
      url: `/${arrayPath}`,
      data: `data=${JSON.stringify(items)}`, // serializes the form's elements.
      success: async function (response) {
          if(response.success == true){
            let html =''
            if(response.data.length == 0){
              html = `
              <div class="position-absolute text-center font-weight-bold" style="
              color: #5ba515;
              width: 100%; 
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);" role="status">
                  Danh Sách Yêu Thích Trống...
                </div>
              `
              $('article#content > div.row').html(html)
            } else{
              html = await showListLove(response.data, "/uploads/product/", "VND")
              $('article#content > div.row').html(html)
            }
            loadListLove()
            loadListCart()
          } 
      }
  });
  }
  $("#filterForm").submit( (e)=>{
     $(e.target).children('.get-results-wrap').removeClass('d-flex align-items-center justify-content-between').html(spinnerCenter)
  })

  $("form.formAuth").submit( (e)=>{
    $(e.target).children('.d-flex.justify-content-center.spinner').html(spinnerCenter)
  })


 // cart local

 $(document).on('click', 'div[data-product*="product-"] a.icon-cart.d-block', function(e) {
  let data = $(e.target).attr('data-product').split('-')
  let id   = data[1]
  let items
  if($(e.target).hasClass('active')){
    items = deleteItem(id, localCart)
    $(e.target).removeClass("active")
    $("header#header a.icon-cart span.num").text(items.length)
    if(arrayPath=='gio-hang'){
      // $(`.row > div[data-product="product-${id}"]`).remove()
      if(items.length == 0){
        html = `
        <div class="position-absolute text-center font-weight-bold" style="
        color: #5ba515;
        width: 100%; 
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);" role="status">
            Danh Sách Giỏ Hàng Trống...
          </div>
        `
        $('div.cartHolder .tableListProduct > .col-12').html(html)
      }
    }
    toastr["error"](notify.REMOVE_CART_SUCCESS)
  } else{
    items = addItem(id, localCart)
    $(e.target).addClass("active")
    $("header#header a.icon-cart span.num").text(items.length)
    toastr["success"](notify.ADD_CART_SUCCESS)
  }
  });

  let showSumPrice = () =>{
    let price = 0
    let total = 0
    $(`td[data-product*=priceProductTotal-]`).each((index, item)=>{
      let number = $(item).text().replace(/[^0-9]/g, "")
      price += parseInt(number)
    })
    let costShip = parseInt($("select[name='province'] option:selected").attr('data-cost'))
    $("div.sumPrice div.totalPrice strong.price").text(price.toLocaleString() +" VND")
    $("div.sumPrice div.costShip strong.price").text("+ "+costShip.toLocaleString() +" VND")
    let couponValue = ($("div.sumPrice div.priceCoupon strong.price").length > 0) ? parseInt($("div.sumPrice div.priceCoupon strong.price").text().replace(/[^0-9]/g, "")) : 0
    if(couponValue > 0) {
      total = price + costShip - couponValue
    } else {
      total = price + costShip
    }
    $("div.sumPrice div.totalPriceCoupon strong.price").text(total.toLocaleString() +" VND")
  }

  let disabledBtnOrder = () =>{
    let btn = $("div.sumPrice > a")
    btn.addClass("disabled")
  }

  let enabledBtnOrder = () =>{
    let btn = $("div.sumPrice > a")
    btn.removeClass("disabled")
  }

  let removeCoupon = () =>{
    $("input[name='codeCouponSuccess']").remove()
    $("fieldset > div.mt-holder div.alert").remove()
    $("div.sumPrice div.priceCoupon").remove()
  }
$(document).on('click', 'a.productAddToCart', function(e) {
  let data = $(e.target).attr('data-product').split('-')
  let id   = data[1]
  let items
  items = addItem(id, localCart)
  $("header#header a.icon-cart span.num").text(items.length)
  let removeCart =`
  <a data-product="product-${id}" href="javascript:void(0);" class="btn btnTheme btnShop fwEbold text-white md-round py-3 px-4 py-md-3 px-md-4 productRemoveToCart">Xóa Sản Phẩm Khỏi Giỏ Hàng</a>
  `
  $(`div.includeButtonCart`).html(removeCart)
  toastr["success"](notify.ADD_CART_SUCCESS)
})

$(document).on('click', 'a.productRemoveToCart', function(e) {
  let data = $(e.target).attr('data-product').split('-')
  let id   = data[1]
  let items
  items = deleteItem(id, localCart)
  $("header#header a.icon-cart span.num").text(items.length)
  let addCart =`
  <a data-product="product-${id}" href="javascript:void(0);" class="btn btnTheme btnShop fwEbold text-white md-round py-3 px-4 py-md-3 px-md-4 productAddToCart">Thêm Vào Giỏ Hàng <i class="fas fa-arrow-right ml-2"></i></a>  `
  $(`div.includeButtonCart`).html(addCart)
  toastr["error"](notify.REMOVE_CART_SUCCESS)
})

let loadListCart = () =>{
  let items = listItems(localCart)
  let number = items.length
  $("header#header a.icon-cart span.num").text(number)
  items.forEach(item=>{
    $(`a[data-product*="product-${item.id}"].icon-cart.d-block`).addClass("active")
  })
}

loadListCart()

if(arrayPath=='gio-hang'){
  let items = listItems(localCart)
  $.ajax({
    type: "POST",
    url: `/${arrayPath}`,
    data: `data=${JSON.stringify(items)}`, // serializes the form's elements.
    success: async function (response) {
        if(response.success == true){
          let html =''
          if(response.data.length == 0){
            html = `
            <div class="position-absolute text-center font-weight-bold" style="
            color: #5ba515;
            width: 100%; 
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);" role="status">
                Danh Sách Giỏ Hàng Trống...
              </div>
            `
            $('div.cartHolder .tableListProduct > .col-12').html(html)
          } else{
            html = await showListCart(response.data, "/uploads/product/", "VND", items)
            $('div.cartHolder .tableListProduct > .col-12').addClass('table-responsive')
            $('div.cartHolder .tableListProduct > .col-12').html(html)
            initCustomForms();
            // initialize custom form elements
            function initCustomForms() {
                jcf.replaceAll();
            }
            enabledBtnOrder()
            $( "input[name='couponCode']" ).prop("disabled", false)
          }
          loadListCart()
          showSumPrice()
        } 
    }
});
}

  $(document).on('click', 'tr[data-product*="product-"] > td > a.fas.fa-times', function(e) {
      let data = $(e.target).attr('data-product').split('-')
      let id   = data[1]
      items = deleteItem(id, localCart)
      $("header#header a.icon-cart span.num").text(items.length)
      $(`tr[data-product="product-${id}"]`).remove()
      showSumPrice()
      if(arrayPath=='gio-hang'){
        if(items.length == 0){
          let html = `
          <div class="position-absolute text-center font-weight-bold" style="
          color: #5ba515;
          width: 100%; 
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);" role="status">
              Danh Sách Giỏ Hàng Trống...
            </div>
          `
          $('div.cartHolder .tableListProduct > .col-12').removeClass('table-responsive')
          $('div.cartHolder .tableListProduct > .col-12').html(html)
          disabledBtnOrder()
        }
      }
        toastr["error"](notify.REMOVE_CART_SUCCESS)
        removeCoupon()

    });

    let showCartButtonProduct = () =>{
      let items = listItems(localCart)
      let currentData = $(`div.includeButtonCart`).attr('data-product').split('-')
      let currentId = currentData[1]
      let checkExit = items.filter(item=> item.id == currentId)
      let html = (checkExit.length == 0)  ? 
      `
      <a data-product="product-${currentId}" href="javascript:void(0);" class="btn btnTheme btnShop fwEbold text-white md-round py-3 px-4 py-md-3 px-md-4 productAddToCart">Thêm Vào Giỏ Hàng <i class="fas fa-arrow-right ml-2"></i></a>
      `
      :
      `
      <a data-product="product-${currentId}" href="javascript:void(0);" class="btn btnTheme btnShop fwEbold text-white md-round py-3 px-4 py-md-3 px-md-4 productRemoveToCart">Xóa Sản Phẩm Khỏi Giỏ Hàng</a>
      ` 
      $(`div.includeButtonCart`).html(html)
    }
    if( $('div.includeButtonCart').length ) 
    {
      showCartButtonProduct()
    }
    
    $(document).on('change', "input[data-product*='product-']", function(e) {
      let dataCurrent = $(e.target).attr('data-product').split("-")
      let idCurrent = dataCurrent[1]
      let quantityCurrent = $(e.target).val()
      editItem(idCurrent, localCart, quantityCurrent)
      let priceProduct = $(`td[data-product=priceProduct-${idCurrent}]`)
      let priceProductTotal = $(`td[data-product=priceProductTotal-${idCurrent}]`)
      let totalValue
      let priceValue
      if(priceProduct.find('del').length>0){
        priceValue = priceProduct.text().split("VND")[1].replaceAll(",","")
        totalValue = parseInt(priceValue)*quantityCurrent
      } else{
        priceValue = priceProduct.text().replaceAll(",","")
        totalValue = parseInt(priceValue)*quantityCurrent
      }
      priceProductTotal.html(totalValue.toLocaleString() + "VND" + `<a href="javascript:void(0);" class="fas fa-times float-right" data-product="product-${idCurrent}"></a>`)
      showSumPrice()
      removeCoupon()
    })

    $( "input[name='couponCode']" ).keyup(function(e) {
      removeCoupon()
      let datatotalPrice = $("div.sumPrice div.totalPrice strong.price").text().replace(/[^0-9]/g, "")
      let totalPrice     =  parseInt(datatotalPrice)
      let couponCode     = $(e.target).val()
        if(totalPrice > 0 && couponCode.length > 0){
            $("button.submitCodeCoupon").prop("disabled", false)
        }
        $(e.target).val(couponCode.toUpperCase())
    });

    $(document).on('click',"button.submitCodeCoupon",(e)=>{
      let urlPath = window.location.pathname.split("/")[1]
      let dataCode =  $( "input[name='couponCode']" )
      dataCode.prop("disabled", true)
      let spinner = `
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
      `
      $(e.target).html(spinner)
      let code     = dataCode.val().toUpperCase()
      loadListCart()
      let datatotalPrice = $("div.sumPrice div.totalPrice strong.price").text().replace(/[^0-9]/g, "")
      let totalPrice     =  parseInt(datatotalPrice)
      $("fieldset > div.mt-holder div.alert").remove()
      $.ajax({
        type: "POST",
        url: `/${urlPath}/ma-giam-gia`,
        data: `totalPrice=${totalPrice}&couponCode=${code}`, // serializes the form's elements.
        success: function (response) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              }
            if(response.success == true){
              let data = response.data 
              let html=`
              <div class="alert alert-success align-bottom mt-2 mb-2 text-center" role="alert" style="width: 340px;">
                Áp Dụng Thành Công Mã
                 ${data.couponcode}
              </div>
              <input type="hidden" name="codeCouponSuccess" value="${data.couponcode}">
              `
              $("fieldset.couponCode > div.mt-holder").append(html)
              let totalPrice  =  response.totalPrice
              let priceCoupon 
              
              if(data.couponValue.unit == "money"){
                priceCoupon = data.couponValue.value 
              } else{
                let priceCouponPercent = data.couponValue.value*totalPrice/100
                priceCoupon = (priceCouponPercent >= data.couponValue.maxDown) ? data.couponValue.maxDown : priceCouponPercent
              }
              let priceAfterCoupon = totalPrice - priceCoupon
              let xhtml = `
              <div class="d-flex justify-content-between priceCoupon">
                  <strong class="txt fwEbold text-uppercase mb-1">Số Tiền Được Giảm</strong>
                  <strong class="price fwEbold text-uppercase mb-1">-${priceCoupon.toLocaleString() + " VND"}</strong>
              </div>
              `
              $("div.sumPrice div.totalPriceCoupon").before(xhtml)
            } else {
              let html=`
              <div class="alert alert-danger align-bottom mt-2 mb-2 text-center" role="alert" style="width: 340px;">
                Mã Giảm Giá Không Hợp Lệ
              </div>`
              $("fieldset.couponCode > div.mt-holder").append(html)
            }
            dataCode.prop("disabled", false)
            $(e.target).html('Áp Dụng')
            showSumPrice()
        }
    });
      
    })
    //select change 

    $(".cartHolder select[name='province']" ).change(function(e) {
        showSumPrice()
    });

    let getListProductOrder = () =>{
      let list = []
      $("tr.align-items-center").each((index,item)=>{
        let obj  = {}
        obj.id = $(item).attr('data-product').split('-')[1]
        obj.quantity = $(`span.jcf-number > input[data-product="product-${obj.id}"]`).val()
        list.push(obj)
      })
      return list
    }
    $(document).on('click','div.cartHolder a.orderComplete', (e)=>{
      $("div.cartHolder a.orderComplete").html(spinnerCenter).addClass('disabled')
      let name = $('input[name="name"]').val()
      let address = $('input[name="address"]').val()
      let province = $('select[name="province"]').val()
      let phonenumber = $('input[name="phonenumber"]').val()
      let couponCode = $('input[name="codeCouponSuccess"]').val()
      let totalMoney = $('div.totalPriceCoupon').text().replace(/[^0-9]/g, "")
      let priceProduct = $('div.totalPrice').text().replace(/[^0-9]/g, "")
      let costShip = parseInt($("select[name='province'] option:selected").attr('data-cost'))
      let notes    = $('textarea[name="notes"]').text()

      let productOrder = JSON.stringify(getListProductOrder())
      let urlPath = window.location.pathname.split("/")[1]
      let data = {
        name: name,
        infoAddress: address,
        province: province,
        phoneNumber: phonenumber,
        costShip: costShip,
        couponCode: couponCode,
        priceProduct: priceProduct,
        totalMoney: totalMoney,
        productOrder: productOrder,
        notes: notes,
      }
      $.ajax({
        type: "POST",
        url: `/${urlPath}/dat-hang`,
        data: data, // serializes the form's elements.
        success: function (response) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              }
            if(response.success == true){
                window.location.replace(`/don-hang/${response.trackingCode}`);
            } else {
              try {
                response.errors.forEach((item)=>{
                  toastr["error"](item.msg)
                  })
              } catch (error) {
                toastr["error"]("Có lỗi xảy ra vui lòng F5 trang")
              }
              $("div.cartHolder a.orderComplete").html('Mua Hàng').removeClass('disabled')
            }
        }
    });
    })

    let searchProduct = (keyword) =>{
      window.location.replace(`/tat-ca-cay?keyword=${keyword}`);
    }

    $(document).keyup(function (e) {
      if ($("div.search-data > input:focus") && (e.keyCode === 13)) {
        let keyword = $("div.search-data > input").val()
        $("div.search-data").html(spinnerCenter)
        searchProduct(keyword)
      }
   });

   $(document).on('click', '.search-data span', function(e) {
        let keyword = $("div.search-data > input").val()
        $("div.search-data").html(spinnerCenter)
        searchProduct(keyword)
    });

})

