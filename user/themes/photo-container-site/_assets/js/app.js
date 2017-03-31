$( document ).ready(function() {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
	$('#modal-filters-ok').click(function() {
    Event.search("http://" + location.host + "/");
    // alert();
  });
})
