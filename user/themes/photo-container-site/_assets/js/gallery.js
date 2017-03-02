// $('#myTab li:eq(2) a').tab('show');
var add_gallery_tab_index = 0;
var add_gallery_tab_total_tabs = 4;
$( document ).ready(function() {
	$('.thumb-gallery a').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	$('.next-add-gallery-tab').click(function() {
    // alert(add_gallery_tab_index);
    ++add_gallery_tab_index;
    $('.nav-steps li:eq('+(add_gallery_tab_index)+') a').tab('show');
  });
  $('.prev-add-gallery-tab').click(function() {
    --add_gallery_tab_index;
    $('.nav-steps li:eq('+(add_gallery_tab_index)+') a').tab('show');
    // alert(add_gallery_tab_index-1);
  });

	$('.page-add-gallery a[data-toggle="tab"]').on('show.bs.tab', function (e) { // e.target // newly activated tab, e.relatedTarget // previous active tab
	  var index = Number($(e.target).attr('data-index'));
	  updateAddGalleryNavTabs(index);
	});
});

function updateAddGalleryNavTabs(index) {
  console.log(index);
  add_gallery_tab_index = index-1;
  if (index == add_gallery_tab_total_tabs) {
    $('.page-add-gallery .next-add-gallery-tab').hide();
    $('.page-add-gallery .end-add-gallery-tab').show();
  }else {
    $('.page-add-gallery .next-add-gallery-tab').show();
    $('.page-add-gallery .end-add-gallery-tab').hide();
  }
  if (index == 1) {
     $('.prev-add-gallery-tab').attr('disabled','');
  }else {
     $('.prev-add-gallery-tab').removeAttr('disabled');
  }
}
