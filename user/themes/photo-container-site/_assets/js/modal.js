$( document ).ready(function() {
})

function show_modal_alert(type, url, text) {
  $('#modal-alert .modal-body').html(text);

  $('#modal-alert #modal-alert-header').removeClass();
  $('#modal-alert #modal-alert-header').addClass('modal-header alert alert-'+type);

  $('#modal-alert #modal-alert-confirm').removeClass();
  $('#modal-alert #modal-alert-confirm').addClass('btn btn-'+type);
  $('#modal-alert #modal-alert-confirm').attr('href', url);
  
  $('#modal-alert').modal('show')
}
