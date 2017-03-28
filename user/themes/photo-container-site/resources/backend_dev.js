var Signup = (function () {

  var autologin = function() {
    var form = new FormData();
    form.append("input_email", $("#input_email").val());
    form.append("input_password", $("#input_password").val());

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": localStorage.domain+"do-signin",
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      location.href = "/gallery"
    })
  }

  var photographer = function(api) {
    data = {
      name: $("#input_name").val(),
      email: $("#input_email").val(),
      password: $("#input_password").val(),
      profile: "2"
    }

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": localStorage.endpoint+"users",
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
      autologin()
    })
    .fail(function (response) {
      var object = JSON.parse(response.responseText)
      alert("Erro: "+object.message)
    });
  }

  var publisher = function(api) {
    data = {
      name: $("#input_name").val(),
      email: $("#input_email").val(),
      password: $("#input_password").val(),
      details: {blog: $("#input_blog").val()},
      profile: "3"
    }

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": localStorage.endpoint+"users",
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
        autologin()
      })
      .fail(function (response) {
        var object = JSON.parse(response.responseText)
        alert("Erro: "+object.message)
      });
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
        $("#input-genre").val(response.details.gender).change()

        if (response.details.birth != "") {
          birthParts = response.details.birth.split('-')
          $("#input-year").val(birthParts[0]).change()
          $("#input-month").val(birthParts[1]).change()
          $("#input-day").val(parseInt(birthParts[2])).change()
        }
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
        phone: $("#input-phone").val(),
        gender: $("#input-genre :selected").val(),
        birth: ''
      }
    }

    if ($("#input-year").val() != null && $("#input-month").val() != null && $("#input-day").val() != null){
      var day = $("#input-day").val() < 10 ? '0'+$("#input-day").val() : $("#input-day").val()
      data.details.birth = $("#input-year").val()+'-'+$("#input-month").val()+'-'+day
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
        user_id: localStorage.user,
        bride: $("#input-bride").val(),
        groom: $("#input-groom").val(),
        eventDate: $('#select-year').val()+'-'+$('#select-month').val()+'-'+$('#select-day').val(),
        title: $("#input-title").val(),
        description: $("#input-description").val(),
        approval_general: $("#input-approval-general").is(":checked"),
        approval_photographer: $("#input-approval-photographer").is(":checked"),
        approval_bride: $("#input-approval-bride").is(":checked"),
        terms: $("#input-terms").is(":checked"),
        categories: [$('input[name="categories[]"]:checked').val()],
        tags: []
      }

      $('input[name="tags[]"]:checked').each(function (key, item) {
        data.tags.push($(item).val())
      })

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

  var loadCategories = function (api) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api+"search/categories",
      "method": "GET",
    }

    $.ajax(settings).done(function (response) {
      response.forEach(function(item) {
        $("#categories-button-group").append('<label class="btn btn-secondary btn-check btn-lg text-uppercase px-5">\
          <input name="categories[]" type="checkbox" autocomplete="off" value="'+item.id+'">'+item.description+'\
        </label> ')
      });
    });
  }

  var loadTags = function (api) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api+"search/tags",
      "method": "GET",
    }

    $.ajax(settings).done(function (response) {
      response.forEach(function(tagGroup) {

        if (tagGroup.id != 12) {
          var list = '\
          <div class="col-md-3">\
            <h6 class="title mt-3 text-center text-uppercase"><small>' + tagGroup.description + '</small></h6>\
            <hr class="mt-0">\
            <div data-toggle="buttons">';

          tagGroup.tags.forEach(function (tag) {
            list += '<label class="btn btn-secondary btn-check btn-block">\
              <input name="tags[]" type="checkbox" autocomplete="off" value="' + tag.id + '">' + tag.description + '\
            </label>'
          })

          list += '\
            </div>\
          </div>';

          $("#tag-list").append(list);
        }
      });
    });
  }

  var search = function(api) {
    var form = new FormData();
    form.append("keyword", $("#keyword-search").val());

    $('input[name="tags[]"]:checked').each(function (i, item){
      form.append('tags[]', $(item).val())
    })

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api + "event_search?profileType="+localStorage.profile,
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      $(".search-result-thumb").remove()
      $("#gallery").append(response)
    });
  }

  return {
    createHandler: createHandler,
    search: search,
    loadCategories: loadCategories,
    loadTags: loadTags
  };
})();

