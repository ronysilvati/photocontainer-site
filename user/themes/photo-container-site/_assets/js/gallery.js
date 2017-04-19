// $('#myTab li:eq(2) a').tab('show');
var add_gallery_tab_index = 0;
var add_gallery_tab_total_tabs = 4;
$( document ).ready(function() {
	$('.thumb-gallery a').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	$('.next-add-gallery-tab').click(function() {

		if(
			$(".step1").hasClass("active") && !step1.valid() ||
			$(".step2").hasClass("active") && !step2.valid() ||
			$(".step3").hasClass("active") && !step3.valid()
		) {
			// alert(add_gallery_tab_index);
			event.stopPropagation();
		}else {
			++add_gallery_tab_index;
			$('.nav-steps li:eq('+(add_gallery_tab_index)+') a').tab('show');
		}

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


	var step1 = $(".step1"); step1.validate();
	var step2 = $(".step2"); step2.validate();
	var step3 = $(".step3"); step3.validate();

	$(".link-step2").click(function(event) {
		if(!step1.valid()) {
			event.stopPropagation();
		}
	});
	$(".link-step3").click(function(event) {
		if(!step1.valid() || !step2.valid()) {
			// alert();
			event.stopPropagation();
		}
	});
	$(".link-step4").click(function(event) {
		if(!step1.valid() || !step2.valid() || !step3.valid()) {
			event.stopPropagation();
		}
    });
	// $(".page-add-gallery .next-add-gallery-tab").click(function(event) {
	// 	alert();
	// });

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

  if (index == 4) {
	  Event.loadPhotos();
  }
}
