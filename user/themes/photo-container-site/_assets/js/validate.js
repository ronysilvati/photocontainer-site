$(document).ready(function(){
  $(".form-validate.form-signin").validate({
    rules: {
			input_email: {
				required: true
			},
			input_password: {
				required: true
			}
		}
  });

  $(".form-validate.form-signup-photographer").validate({
    rules: {
			input_plan: {
				required: true
			},
			input_name: {
				required: true
			},
			input_email: {
				required: true
			},
			input_remail: {
				required: true,
        equalTo: "#input_email"
			},
			input_terms: {
				required: true
			},
			input_password: {
				required: false
			}
		},
    submitHandler: function() {
      Signup.photographer("qualquer valor");
      alert("Liberou cadastro");
    }
  });

  $(".form-validate.form-signup-publisher").validate({
    rules: {
			input_plan: {
				required: true
			},
  		input_blog: {
  			required: true
  		},
  		input_name: {
  			required: true
  		},
  		input_email: {
  			required: true
  		},
  		input_remail: {
  			required: true,
        equalTo: "#input_email"
  		},
  		input_terms: {
  			required: true
  		},
  		input_password: {
  			required: false
  		}
  	},
    submitHandler: function() {
      Signup.publisher("qualquer valor");
      alert("Liberou cadastro");
    }
  });

  $(".form-validate.form-profile").validate({
    rules: {
			input_name: {
				required: true
			}
  	},
    submitHandler: function() {
      Signup.publisher("qualquer valor");
      alert("Liberou cadastro");
    }
  });
});
