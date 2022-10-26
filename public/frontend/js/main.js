$(function () {
  $('[data-toggle="tooltip"]').tooltip()

  $("#sendMail").submit(function(e) {
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
                toastr["success"]("Đã gửi thông tin thành công")
                $("#sendMail input").val("")
                $("#sendMail textarea").val("")
            } else {
                toastr["error"]("Đã có lỗi, vui lòng thử lại!")
            }
        }
    });
    
});
})
