/*





	by KOHL
	kohl.com.br





*/

//////////////////////////////////////////

/*

###################
### DATA FIXED ###
###################

# Usage exemple:


*/


(function() {
	var DATA =
	{
		'name'			: 'data-fixed',
		'target' 		: '.app',
		"class_suffix"	:"-fixed",
		"attr_suffix"	:"-y",
	};

	$( document ).ready(function(){
		setTimeout(function(){
			$('['+DATA.name+']').each(function() {
				$(this).attr(DATA.name+DATA.attr_suffix, $(this).offset().top);
			});
		}, 300);

		// alert();
	});

	$( window ).scroll(function(){
		$('['+DATA.name+']').each(function() {

			this.$y = $(this).attr(DATA.name+DATA.attr_suffix);
			this.$class = $(this).attr('class').split(' ')[0];

			if($(window).scrollTop() > this.$y) {
				$(DATA.target).addClass(this.$class+DATA.class_suffix);
			}else {
				$(DATA.target).removeClass(this.$class+DATA.class_suffix);
			}
		})
	});
})();
