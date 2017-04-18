$(document).ready(function(){
  $('.page-add-gallery .form-colors [data-toggle="buttons"] .btn-color').click(function(){
    if($(this).hasClass('active')) {
      // alert('active');
    }else {
      if($('.page-add-gallery .form-colors [data-toggle="buttons"] .active').length >= 3) {
        event.stopPropagation();
      }
      // alert('NOT active');
    }
  });

});
