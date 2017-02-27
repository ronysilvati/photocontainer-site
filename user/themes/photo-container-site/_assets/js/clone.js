(function() {

	$( document ).ready(function() {

		$('[data-toggle="clone"]').click(function() {

			this.target = $(this).attr('data-target');

			this.html = $(this.target)
										.clone()
										.removeAttr('id')
										.wrap('<div>')
										.parent()
										.html();

			$(this.target).after(this.html);

		});// click

	});

})();

(function() {

	$( document ).ready(function() {

		$('body').delegate('[data-toggle="remove"]','click',function() {

			this.target = $(this).attr('data-target');

			if(this.target == '_parent') {
				$(this).parent().remove();
			}


		});// click

	});

})();

//////////////////////////////////////////

/* Code is Poetry */
