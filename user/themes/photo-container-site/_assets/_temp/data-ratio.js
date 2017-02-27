
	$( document ).ready(function() {
		// alert();
dataRatio();
	});
	$( window ).resize(function() {
dataRatio();
	});

	function dataRatio() {
		var e = $('[data-ratio]');
		if(e.width() > e.height()){
			e.each(function() {
				$(this).attr('data-ratio', 'w');
			});
		}else {
			e.each(function() {
				$(this).attr('data-ratio', 'h');
			});
		}
	}
