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

        if (response.details.birth != null) {
          birthParts = response.details.birth.split('-')
          $("#input-year").val(birthParts[0]).change()
          $("#input-month").val(birthParts[1]).change()
          $("#input-day").val(parseInt(birthParts[2])).change()
        }
      }

      if (response.address) {
        $("#input-cep").val(response.address.zipcode)
        $("#input-country").val(1)
        $("#input-state").val(response.address.state)

        Cep.loadCities(localStorage.endpoint)
        .then(function () {
          $("#input-city").val(response.address.city)
        })

        $("#input-neighborhood").val(response.address.neighborhood)
        $("#input-street").val(response.address.street)
        $("#input-complement").val(response.address.complement)
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
      },
      address: {
        zipcode: $("#input-cep").val(),
        country: $("#input-country").val(),
        state: $("#input-state").val(),
        city: $("#input-city").val(),
        neighborhood: $("#input-neighborhood").val(),
        street: $("#input-street").val(),
        complement: $("#input-complement").val()
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
  var id = 0;

  var createHandler = function (api, user) {
    $(".next-add-gallery-tab").on('click', function () {
      var settings = {
        "async": true,
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json",
        },
        "processData": false,
        "data": ''
      }

      if ($("#evento").is(':visible')) {
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

        settings.url = localStorage.getItem('endpoint')+"events"
        settings.url += Event.id > 0 ? "/"+Event.id : ''

        settings.method = Event.id > 0 ? 'PUT' : 'POST'

        settings.data = JSON.stringify(data)
        $.ajax(settings)
        .done(function (response) {
          Event.id = response.id
          $("#event_id").val(Event.id);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          var object = JSON.parse(jqXHR.responseText)
          alert(object.message)
        })
      }

      if ($("#caracteristicas").is(':visible')) {
        var data = {
          tags: []
        }

        $('input[name="tags[]"]:checked').each(function (key, item) {
          data.tags.push($(item).val())
        })

        settings.url = localStorage.getItem('endpoint')+"events/"+Event.id+"/tags"
        settings.data = JSON.stringify(data)
        $.ajax(settings)
          .done(function (response) {
            // Event.id = response.id
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            var object = JSON.parse(jqXHR.responseText)
            alert(object.message)
          })
      }

      if ($("#fornecedores").is(':visible')) {
        var serialized = $("#fornecedores input:text").serialize()

        settings.url = localStorage.getItem('endpoint')+"events/"+Event.id+"/suppliers"
        settings.data = serialized
        settings.headers = {"content-type": "application/x-www-form-urlencoded"}
        $.ajax(settings)
          .done(function (response) {
            // Event.id = response.id
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            var object = JSON.parse(jqXHR.responseText)
            alert(object.message)
          })
      }

    })
  }

  var loadCategories = function (api) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api+"search/categories",
      "method": "GET",
    }

    return $.ajax(settings).done(function (response) {
      response.forEach(function(item) {
        $("#categories-button-group").append('<label class="btn btn-'+((localStorage.profile==2)?'ph':'pu')+' btn-secondary btn-check btn-lg text-uppercase px-5">\
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

    return $.ajax(settings).done(function (response) {
      response.forEach(function(tagGroup) {

        if (tagGroup.id != 12) {
          var list = '\
          <div class="col-md-3">\
            <h6 class="title mt-3 text-center text-uppercase"><small>' + tagGroup.description + '</small></h6>\
            <hr class="mt-0">\
            <div data-toggle="buttons">';

          tagGroup.tags.forEach(function (tag) {
            list += '<label class="btn btn-secondary btn-'+((localStorage.profile==2)?'ph':'pu')+' btn-check btn-block">\
              <input name="tags[]" type="radio" autocomplete="off" value="' + tag.id + '">' + tag.description + '\
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

    var page = $("#add-page").length == 0 ? '&page=1' : '&page='+$("#add-page").data().page

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api + "event_search?profileType="+localStorage.profile+page,
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      if (response) {
        $("#gallery").append(response)
        $("#add-page").prop('disabled', false)
      } else {
        $("#add-page").prop('disabled', true)
      }
    });
  }

  var loadPublisherGallery = function (api) {
    var id = location.search.split("=")[1]

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api+"publisher_gallery_photos?id="+id,
      "method": "POST",
      "processData": false,
      "contentType": false,
    }

    $.ajax(settings).done(function (response) {
      $(".publisher-gallery-photos").html(response)
    });
  }

  var loadEvent = function (api) {
    var id = location.search.split("=")[1]
    Event.id = id

    if (id == undefined) {
      return true
    }

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api + "events?id="+id,
      "method": "GET",
      "processData": false,
      "contentType": false,
    }

    $.ajax(settings).done(function (response) {
      $("#input-bride").val(response.bride)
      $("#input-groom").val(response.groom)
      $("#input-title").val(response.title)
      $("#input-description").val(response.description)

      $("#input-approval-general").attr('checked', response.approval);
      $("#input-approval-bride").attr('checked', response.approval_bride);
      $("#input-approval-photographer").attr('checked', response.approval_photographer);
      $("#input-terms").attr('checked', response.terms);

      response.categories.forEach(function(key, item) {
        $("[name^='categories']").filter(":checkbox[value=3]").attr("checked", true)
        $("[name^='categories']").filter(":checkbox[value="+key+"]").click()
      });

      response.tags.forEach(function(key, item) {
        var checkbox = $("[name^='tags']").filter(":checkbox[value="+key+"]")
        $(checkbox).click()
        $(checkbox).prop("checked", true)
      });

      var suppliers = JSON.parse(response.suppliers)
      if (suppliers != null) {
        for (field in suppliers.supplier) {
          if (suppliers.supplier[field].length > 0) {
            for (var i = 0; i < suppliers.supplier[field].length; i++) {
              if (i > 0) {
                $(".btn-add-field-"+field).click()
              }

              var input = $("[name^='supplier["+field+"]']").filter(":eq("+i+")")
              $(input).val(suppliers.supplier[field][i])
            }
          }
        }
      }
    });
  }

  var removeEvent = function (api) {
    $(".event-remove").on('click', function(e){
      e.preventDefault();

      var settings = {
        "async": true,
        "method": "DELETE",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json",
        },
        "processData": false,
        "data": {},
        "url": api+"events/"+$(this).data().event
      }

      $.ajax(settings)
        .done(function (response) {
          $("#event-thumb-"+response.id).remove()
        })
    })
  }

  var likeEvent = function (api) {
    $(".event-like").on('click', function(e){
      e.preventDefault();

      var settings = {
        "async": true,
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json",
        },
        "processData": false,
        "data": {},
        "url": api+"events/"+$(this).data().likeevent+"/favorite/publisher/"+localStorage.user
      }

      $.ajax(settings)
        .done(function (response) {
          var $favoriteLink = $("li").find("[data-likeevent="+response.event_id+"]")

          $favoriteLink.hide()
          $("li").find("[data-dislikeevent="+response.event_id+"]").show()
          $favoriteLink.parents('ul').siblings('.fav-count').text(response.totalLikes+" Like")
        })
    })
  }

  var dislikeEvent = function (api) {
    $(".event-dislike").on('click', function(e){
      e.preventDefault();

      var settings = {
        "async": true,
        "method": "DELETE",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json",
        },
        "processData": false,
        "data": {},
        "url": api+"events/"+$(this).data().dislikeevent+"/favorite/publisher/"+localStorage.user
      }

      $.ajax(settings)
        .done(function (response) {
          var $favoriteLink = $("li").find("[data-dislikeevent="+response.event_id+"]")

          $favoriteLink.hide()
          $("li").find("[data-likeevent="+response.event_id+"]").show()
          $favoriteLink.parents('ul').siblings('.fav-count').text(response.totalLikes+" Like")
        })
    })
  }

  return {
    createHandler: createHandler,
    search: search,
    loadCategories: loadCategories,
    loadTags: loadTags,
    loadEvent: loadEvent,
    removeEvent: removeEvent,
    likeEvent: likeEvent,
    dislikeEvent: dislikeEvent,
    loadPublisherGallery: loadPublisherGallery,
    id: id
  };
})();

var Cep = (function () {
  var loadStates = function(api) {
    var country = $("#input-country :selected").length > 0 ? $("#input-country :selected").val() : 1

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api+"/location/country/"+country+"/states",
      "method": "GET"
    }

    return $.ajax(settings)
      .done(function (response) {
        for (var prop in response) {
          var obj = response[prop]
          $("#input-state").append("<option data-id='"+obj.id+"' value='"+obj.statecode+"'>"+obj.name+"</option>")
        }
      });
  }

  var loadCities = function(api) {
    if ($("#input-state :selected").data('id') == undefined) {
      return false;
    }

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api+"/location/state/"+$("#input-state :selected").data('id')+"/cities",
      "method": "GET"
    }

    return $.ajax(settings)
      .done(function (response) {
        $("#input-city option").remove()
        $("#input-city").append("<option value=\"0\" disabled=\"disabled\">Selecione</option>")

        for (var prop in response) {
          var obj = response[prop]
          $("#input-city").append("<option value='"+obj.name+"'>"+obj.name+"</option>")
        }
      });
  }

  var loadCep = function(api) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api+"location/zipcode/"+$("#input-cep").val(),
      "method": "GET"
    }

    return $.ajax(settings)
    .done(function (response) {
      $("#input-country").val(1).change()
      $("#input-state").val(response.state)
      $("#input-neighborhood").val(response.neighborhood)
      $("#input-street").val(response.street)
      $("#input-complement").val(response.complement)

      Cep.loadStates(localStorage.endpoint)
      .then(Cep.loadCities(localStorage.endpoint)
        .then(function () {
          $("#input-city").val(response.city).change()
        })
      )
    })
    .fail(function (response){
      console.log('aqui')
      $("#input-country").val()

      $("#input-state").val(0)

      $("#input-city option").remove()
      $("#input-city").append("<option value=\"0\" disabled=\"disabled\">Selecione</option>")

      $("#input-neighborhood").val('')
      $("#input-street").val('')
      $("#input-complement").val('')
    });
  }

  return {
    loadCep: loadCep,
    loadStates: loadStates,
    loadCities: loadCities
  };
})()
