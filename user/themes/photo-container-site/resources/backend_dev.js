var Signup = (function () {
    var photographer = function(api) {
        //Resultado OK da API, retorna um objeto parecido com este\
        var result = {
            "@context": "/app_dev.php/contexts/User",
            "@id": "/app_dev.php/users/64",
            "@type": "User",
            "id": 64,
            "name": "Luiz Nunes",
            "email": "luiz@teste.com",
            "created": null,
            "updated": null,
            "userDetail": null,
            "profile": [
                {
                    "@id": "/app_dev.php/profiles/1",
                    "@type": "Profile",
                    "id": 1,
                    "name": "teste"
                }
            ]
        }

        //Se der erro no cadastro poderia deixar alguma mensagem de erro pronta para ser exibida na tela

        return result
    }

    var publisher = function(api) {
        //Resultado OK da API, retorna um objeto parecido com este
        var result = {
            "@context": "/app_dev.php/contexts/User",
            "@id": "/app_dev.php/users/64",
            "@type": "User",
            "id": 64,
            "name": "Luiz Nunes",
            "email": "luiz@teste.com",
            "created": null,
            "updated": null,
            "userDetail": null,
            "profile": [
                {
                    "@id": "/app_dev.php/profiles/1",
                    "@type": "Profile",
                    "id": 1,
                    "name": "teste"
                }
            ]
        }

        //Se der erro no cadastro poderia deixar alguma mensagem de erro pronta para ser exibida na tela

        return result
    }

    return {
        publisher: publisher,
        photographer: photographer
    };
})();

var Profile = (function () {
    var load = function(api) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": localStorage.getItem('endpoint')+"users?id="+localStorage.getItem('user'),
            "method": "GET",
            "headers": {
              "content-type": "application/json",
              "accept": "application/json",
            }
        }

        $.ajax(settings)
        .done(function (response) {
            $("#input-email").val(response.email)
            $("#input-name").val(response.name)

            if (response.details) {
              $("#input-facebook").val(response.details.facebook)
              $("#input-instagram").val(response.details.instagram)
              $("#input-linkedin").val(response.details.linkedin)
              $("#input-site").val(response.details.site)
              $("#input-blog").val(response.details.blog)
              $("#input-phone").val(response.details.phone)
            }
        });
    }

    var update = function(api) {
        data = {
          email: $("#input-email").val(),
          name: $("#input-name").val(),
          details: {
            facebook: $("#input-facebook").val(),
            instagram: $("#input-instagram").val(),
            linkedin: $("#input-linkedin").val(),
            site: $("#input-site").val(),
            blog: $("#input-blog").val(),
            phone: $("#input-phone").val()
          }
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": localStorage.getItem('endpoint')+"users/"+localStorage.getItem('user'),
            "method": "PATCH",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        $.ajax(settings)
        .done(function (response) {
          alert('Salvo com sucesso.')
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          var object = JSON.parse(jqXHR.responseText)
          alert(object.message)
        })
    }

    return {
        load: load,
        update: update
    };
})();

var Logout = (function () {
  var attachEvent = function() {
    $(".photocontainer-logout").on('click', function (e) {
      e.preventDefault();
      localStorage.clear()
      location.href = $(this).attr('href');
    })
  }

  return {
    attachEvent: attachEvent
  };
})();

var Event = (function () {
  var createHandler = function(api, user) {
    $(".end-add-gallery-tab").on('click', function () {
      data = {
        user_id: user,
        bride: $("#input-bride").val(),
        groom: $("#input-groom").val(),
        eventDate: $('#select-year').val()+'-'+$('#select-month').val()+'-'+$('#select-day').val(),
        title: $("#input-title").val(),
        description: $("#input-description").val(),
        approval_general: $("#input-approval-general").is(":checked"),
        approval_photographer: $("#input-approval-photographer").is(":checked"),
        approval_bride: $("#input-approval-bride").is(":checked"),
        terms: $("#input-terms").is(":checked")
      }

      var settings = {
        "async": true,
        "url": localStorage.getItem('endpoint')+"events",
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json",
        },
        "processData": false,
        "data": JSON.stringify(data)
      }

      $.ajax(settings)
        .done(function (response) {
          alert('Salvo com sucesso.')
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          var object = JSON.parse(jqXHR.responseText)
          alert(object.message)
        })
    })
  }

  var search = function(api) {
    var form = new FormData();
    form.append("keyword", $("#keyword-search").val());

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api + "event_search?page=1",
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      $(".event-thumb-search").remove()
      $("#gallery").append(response)
    });
  }

  return {
    createHandler: createHandler,
    search: search
  };
})();

