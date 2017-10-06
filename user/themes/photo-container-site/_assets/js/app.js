$( document ).ready(function() {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
	$('#modal-filters-ok').click(function() {
    Event.search("http://" + location.host + "/");
    // alert();
  });
  $( ".stopPropagation" ).click(function( e ) {
    e.stopPropagation();
    e.preventDefault()
  });

})
