$(function () {
  $( ".mapHolder iframe" ).load(function() {
    // Handler for .load() called.
      $( ".mapHolder").css("display","block")
  });
  $('[data-toggle="tooltip"]').tooltip()
  $("form").submit((e)=>{
    $( "form button[type='submit']" ).addClass('disabled').attr('disabled','')
  })

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

})
