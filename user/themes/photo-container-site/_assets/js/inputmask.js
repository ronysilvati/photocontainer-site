$(document).ready(function(){
  $(".cep-mask").inputmask({
    mask: "99.999-999",
  });

	$(".phone-mask").inputmask({
		mask: ["(99) 9999-9999", "(99) 99999-9999", ],
		showMaskOnHover: false,
		keepStatic: true
	});

	$(".url-mask").inputmask({
definitions: {
			"i": {
				validator: ".",
				cardinality: 1
			}
		},
		mask: "(\\http://)|(\\http\\s://)|(ftp://)|(ftp\\s://)i{+}",
    showMaskOnHover: false,
    greedy: false,
		keepStatic: true
  });

  $(".email-mask").inputmask({
    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
    showMaskOnHover: false,
    greedy: false,
		keepStatic: true,
    onBeforePaste: function (pastedValue, opts) {
      pastedValue = pastedValue.toLowerCase();
      return pastedValue.replace("mailto:", "");
    },
    definitions: {
      '*': {
        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
        cardinality: 1,
        casing: "lower"
      }
    }
  }); //static mask
});
