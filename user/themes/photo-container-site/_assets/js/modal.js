$( document ).ready(function() {
})

function show_modal_alert(style, url, text) {
  $('#modal-alert .modal-body').html(text);
  if(url === "") {
    $('#modal-alert .modal-footer').hide();
  }else {
    $('#modal-alert .modal-footer').show();
  }

  $('#modal-alert #modal-alert-header').removeClass();
  $('#modal-alert #modal-alert-header').addClass('modal-header alert alert-'+style);

  $('#modal-alert #modal-alert-confirm').removeClass();
  $('#modal-alert #modal-alert-confirm').addClass('btn btn-'+style);
  $('#modal-alert #modal-alert-confirm').attr('href', url);

  $('#modal-alert').modal('show');
}
