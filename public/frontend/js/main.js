$(document).ready(function() {
  const localLOVE = "LIST_LOVE"
  const localCART = "LIST_CART"

  let loadStorage = (local) => {
      return JSON.parse(localStorage.getItem(local)) ;
  }

  let saveStorage = (local, items) => {
      localStorage.setItem(local, JSON.stringify(items));
  }
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
    let itemNew = id;
    let items = listItems(local);
    items.push(itemNew);
    // Lưu item vào storgare
    saveStorage(local,items);
    return items
  }

  let deleteItem = (id, local) => {
    let items = listItems(local);
    items = items.filter(item => item !== id);
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
  
  let   showSaleText = (data, unit) =>{
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
    console.log(data)
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

  $("form").submit((e)=>{
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
                toastr["success"]("Đã gửi thông tin thành công.")
                $("#sendMail input").val("")
                $("#sendMail textarea").val("")
            } else {
                toastr["error"]("Đã có lỗi, vui lòng thử lại!")
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
                toastr["success"]("Bạn đã đăng ký thành công.")
                $("#newsletterForm input").val("")
            } else {
                toastr["error"]("Đã có lỗi, vui lòng thử lại!")
            }
            $('.submitButton').html(`
            <button type="submit" class="btn btnTheme btnShop fwEbold text-white py-3 px-4">Enter <i class="fas fa-arrow-right ml-2"></i></button>
            `)
        }
    });
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

  $(document).on('click', 'div[data-product*="product-"] a.icon-heart.d-block', function(e) {
    let data = $(e.target).attr('data-product').split('-')
    let id   = data[1]
    let items
    if($(e.target).hasClass('active')){
      items = deleteItem(id, localLOVE)
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
    } else{
      items = addItem(id, localLOVE)
      $(e.target).addClass("active")
      $("header#header a.icon-heart span.num").text(items.length)
    }
    });

  let loadListLove = () =>{
    let items = listItems(localLOVE)
    let number = items.length
    $("header#header a.icon-heart span.num").text(number)
    items.forEach(item=>{
      $(`div[data-product*="product-${item}"] a.icon-heart.d-block`).addClass("active")
    })
  }

  loadListLove()

  if(arrayPath=='yeu-thich'){
    let items = listItems(localLOVE)
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
              loadListLove()
            }
          } 
      }
  });
  }

})

