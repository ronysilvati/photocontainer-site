$( document ).ready(function(){

	$("a.spy").on('click', function(e) {

		e.preventDefault();

		var hash = this.hash;

		$('html, body').animate({
			scrollTop: ($(hash).offset().top - parseFloat($("body .app").css("margin-top")))
		}, 600, function(){
			window.location.hash = hash;
		});

	});
});
