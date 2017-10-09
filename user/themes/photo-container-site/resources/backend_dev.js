var Utils = (function(){
  var invokeAPI = function(method, action, doneCallback, failCallback) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": localStorage.endpoint+action,
      "method": method
    }

    return $.ajax(settings)
      .done(function (response) {
          if (doneCallback == undefined) {
            return false;
          }

          console.log(response.message);
          console.log(response);
          doneCallback(response);
        }
      )
      .fail(function (response) {
          if (failCallback == undefined) {
            return false;
          }

          console.log(response.message);
          console.log(response);
          failCallback(response);
        }
      )
  }

  var notifications = function(){
    Utils.invokeAPI("GET", 'search/notifications/user/'+localStorage.user, function(response){
      if (response.all > 0) {
        $(".approvals").append('<span class="badge badge-danger">'+response.all+'</span>')
      } else {
        $(".approvals > .badge").remove()
      }
    });
  }

  var show_modal_alert = function(style, url, text) {
    $('#modal-alert .modal-body').html(text);
    if(url === "") {
      $('#modal-alert .modal-footer').hide();
    }else {
      $('#modal-alert .modal-footer').show();
    }

    $('#modal-alert #modal-alert-header').removeClass();
    $('#modal-alert #modal-alert-header').addClass('modal-header alert alert-'+style);

    $('#modal-alert #modal-alert-confirm').removeClass();
    $('#modal-alert #modal-alert-confirm').addClass('btn btn-'+style);
    $('#modal-alert #modal-alert-confirm').attr('href', url);

    $('#modal-alert').modal('show');
  }

  var show_modal_remove = function(text, callback, paramsObj) {
    $('#modal-alert .modal-body').html(text);
    $('#modal-alert .modal-footer').show();

    $('#modal-alert #modal-alert-header').removeClass();
    $('#modal-alert #modal-alert-header').addClass('modal-header alert alert-danger');

    $('#modal-alert #modal-alert-confirm').removeClass();
    $('#modal-alert #modal-alert-confirm').addClass('btn btn-danger');
    $('#modal-alert #modal-alert-confirm').attr('href', "#");

    $('#modal-alert #modal-alert-confirm').on('click', function (e) {
      e.preventDefault();

      callback(paramsObj)
      $('#modal-alert').modal('hide')
      $('#modal-alert #modal-alert-confirm').off("click");
    })

    $('#modal-alert').modal('show');
  }

  var axiosInit = function () {
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.patch['Content-Type'] = 'application/json';
    axios.defaults.headers.patch['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.get['Content-Type'] = 'application/json';
  }

  return {
    notifications: notifications,
    invokeAPI: invokeAPI,
    show_modal_remove: show_modal_remove,
    show_modal_alert: show_modal_alert,
    axiosInit: axiosInit
  };
})();

var Signup = (function () {
  var payment = false

  var autologin = function() {
    var form = new FormData();
    form.append("input_email", $("#input_email").val());
    form.append("input_password", $("#input_password").val());

    sessionStorage.setItem('first_time', true);

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

  var verifyPreConditions = function () {
    axios.get(localStorage.endpoint+"users/satisfyPreConditions")
      .catch(function (err) {
        location.href = "/signup-contact"
      })
  }

  var photographer = function(api) {
    data = {
      name: $("#input_name").val(),
      email: $("#input_email").val(),
      password: $("#input_password").val(),
      profile: "2"
    }

    var fnAfterPayment = function(transactionCode) {
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
          Utils.show_modal_alert('danger', '', "Erro: "+object.message)
        });
    }

    if (payment) {
      PagSeguroLightbox({
        code: '6A6DA626BDBD990CC4811FA55E8005DE'
      }, {
        success : fnAfterPayment,
        abort : function() {
          alert("abort");
        }
      })
    } else {
      fnAfterPayment();
    }
  }

  var publisher = function(api) {
    data = {
      name: $("#input_name").val(),
      email: $("#input_email").val(),
      password: $("#input_password").val(),
      details: {blog: $("#input_blog").val()},
      profile: "3"
    }

    var fnAfterPayment = function(transactionCode) {
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
          Utils.show_modal_alert('danger', '', "Erro: "+object.message)
        });
    }

    if (payment) {
      PagSeguroLightbox({
        code: '6A6DA626BDBD990CC4811FA55E8005DE'
      }, {
        success : fnAfterPayment,
        abort : function() {
          alert("abort");
        }
      })
    } else {
      fnAfterPayment();
    }
  }

    return {
        publisher: publisher,
        photographer: photographer,
        verifyPreConditions: verifyPreConditions
    };
})();

var Profile = (function () {
  var load = function(api) {
    return axios.get(localStorage.endpoint+"users?id="+localStorage.user)
      .then(function (response) {
        var user = response.data

        var imageUrl = user.profile_image !== ""
          ? localStorage.image_cdn + user.profile_image
          : localStorage.domain + '/user/themes/photo-container-site/_temp/signin-bg.png'

        $('.profile-image-upload').css("background-image", "url("+imageUrl+")");

        $("#input-email").val(user.email)
        $("#input-name").val(user.name)

        if (user.details) {
          $("#input-facebook").val(user.details.facebook)
          $("#input-instagram").val(user.details.instagram)
          $("#input-linkedin").val(user.details.linkedin)
          $("#input-site").val(user.details.site)
          $("#input-blog").val(user.details.blog)
          $("#input-phone").val(user.details.phone)
          $("#input-pinterest").val(user.details.pinterest).change()

          if (user.details.name_type != null) {
            if (user.details.name_type == "name") {
              $("#input-name-type-name").click();
            }

            if (user.details.name_type == "studio") {
              $("#input-name-type-studio").click();
            }
          }

          if (user.details.studio != null) {
            $("#input-studio").val(user.details.studio);
          }

          if (user.details.bio != null) {
            $("#input-bio").val(user.details.bio);
          }

          if (user.details.birth != null) {
            var birthParts = user.details.birth.split('-')
            $("#input-year").val(birthParts[0]).change()
            $("#input-month").val(birthParts[1]).change()
            $("#input-day").val(parseInt(birthParts[2])).change()
          }
        }

        if (user.address) {
          $("#input-cep").val(user.address.zipcode)
          $("#input-country").val(1)
          $("#input-state").val(user.address.state)

          Cep.loadCities(localStorage.endpoint)
            .then(function () {
              $("#input-city").val(user.address.city)
            })

          $("#input-neighborhood").val(user.address.neighborhood)
          $("#input-street").val(user.address.street)
          $("#input-complement").val(user.address.complement)
        }
      })
  }

  var updateAccessData = function (api) {
    data = {
      email: $("#input-email").val(),
      password: $("#input-password").val()
    }

    var url = localStorage.getItem('endpoint')+"users/"+localStorage.getItem('user')
    axios.patch(url, JSON.stringify(data))
      .then(function (response) {
        Utils.show_modal_alert('success', '', 'Salvo com sucesso.');
      })
      .catch(function (error) {
        Utils.show_modal_alert('default', '', error.response.data.message)
      });
  }

  var update = function(api) {
    data = {
      name: $("#input-name").val(),
      profile_id: localStorage.profile,
      details: {
        bio: $("#input-bio").length > 0 ? $("#input-bio").val() : '',
        studio: $("#input-studio").length > 0 ? $("#input-studio").val() : '',
        name_type: $("#input-name-type-name").is(":checked") ? 'name' : 'studio',
        facebook: $("#input-facebook").val(),
        instagram: $("#input-instagram").val(),
        linkedin: $("#input-linkedin").val(),
        site: $("#input-site").val(),
        blog: $("#input-blog").val(),
        phone: $("#input-phone").val(),
        pinterest: $("#input-pinterest").val(),
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

    var url = localStorage.getItem('endpoint')+"users/"+localStorage.getItem('user')
    axios.patch(url, JSON.stringify(data))
      .then(function (response) {
        Utils.show_modal_alert('success', '', 'Salvo com sucesso.');
      })
      .catch(function (error) {
        Utils.show_modal_alert('default', '', error.response.data.message)
      });
  }

  var updateProfileImageHandler = function () {
    new Dropzone(".profile-image-upload", {
      paramName: "profile_image",
      previewTemplate: '<div class="dz-preview dz-file-preview"></div>',
      uploadMultiple: false,
      acceptedFiles: ".png, .jpg, .jpeg, .gif",
      maxFilesize: 2,
      url: localStorage.endpoint+'users/'+localStorage.getItem('user')+'/profileImage',
      createImageThumbnails: false,
      clickable: '.btn-upload',
      previewsContainer: null,
      dictFileTooBig: 'O arquivo é muito grande ({{filesize}}MiB). Máximo esperado: {{maxFilesize}}MiB.',
      dictInvalidFileType: 'Você não pode enviar arquivos deste tipo.',
      dictResponseError: 'Envio de arquivo negado.',
      init: function() {
        this.on("success", function(file, responseText) {
          if (responseText.length === 0) {
            return;
          }

          var imageUrl = localStorage.image_cdn + responseText.profile_image
          $('.profile-image-upload')
            .css("background-image", "url("+imageUrl+")")

          console.log(responseText);
          console.log(file);
          console.info("success");
        });
        this.on("error", function(file, message) {
          this.removeFile(file);

          if (typeof message === 'object') {
            Utils.show_modal_alert('default', '', message.message)
            return
          }

          Utils.show_modal_alert('default', '', message)
        });
      },
      method: "POST",
      withCredentials: false,
      headers: {
        "Access-Control-Allow-Origin": '*',
      }
    });
  }

  return {
    load: load,
    update: update,
    updateAccessData: updateAccessData,
    updateProfileImageHandler: updateProfileImageHandler
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
  var maxFilesLimit = 30;

  var createHandler = function (api, user) {
    if (Event.id === undefined) {
      $("#input-country").on('change', function (e) {
        Cep.loadStates(localStorage.endpoint)
      })

      $("#input-state").on('change', function (e) {
        Cep.loadCities(localStorage.endpoint)
      })
    }

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
          terms: 1,
          categories: [$('input[name="categories[]"]:checked').val()],
          country: $("#input-country").val(),
          state: $("#input-state").val(),
          city: $("#input-city").val(),
          tags: []
        }

        settings.url = localStorage.getItem('endpoint')+"events"
        settings.url += Event.id > 0 ? "/"+Event.id : ''

        settings.method = Event.id > 0 ? 'PUT' : 'POST'

        settings.data = JSON.stringify(data)
        $.ajax(settings)
        .done(function (response) {
          if (response.id != undefined) {
            Event.id = response.id
            $("#event_id").val(Event.id);
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          var object = JSON.parse(jqXHR.responseText)
          Utils.show_modal_alert('default', '', object.message)
        })
      }

      if ($("#caracteristicas").is(':visible')) {
        var data = {
          tags: []
        }

        $('input[name^="tags"]:checked').each(function (key, item) {
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
            Utils.show_modal_alert('default', '', object.message)
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
            Utils.show_modal_alert('default', '', object.message)
          })
      }
    })
  }

  var loadCategories = function (api) {
    return Utils.invokeAPI("GET", "search/categories", function (response) {
      response.forEach(function(item) {
        $("#categories-button-group").append('<label class="btn btn-'+((localStorage.profile==2)?'ph':'pu')+' btn-secondary btn-check btn-lg text-uppercase px-5">\
          <input name="categories[]" type="radio" autocomplete="off" value="'+item.id+'" required>'+item.description+'\
        </label> ')
      });
    })
  }

  var loadTags = function (api, type) {
    return Utils.invokeAPI("GET", "search/tags", function (response) {
      response.forEach(function(tagGroup) {

        if (tagGroup.id != 12) {
          var name = 'tags['+tagGroup.id+'][]'
          var list = '\
            <h5 class="title">' + tagGroup.description + '</h5>\
            <select data-category="'+tagGroup.id+'" class="select2-filter" name="state" multiple="multiple" style="width: 100%">';
            list += '<label class="error msg-error" for="'+name+'" style="display: none;"></label>';

          tagGroup.tags.forEach(function (tag) {
            list += '<option value="'+tag.id+'">' + tag.description + '</option>'
          })

          list += '\
            </select>';

          $("#tag-list").append(list);
        }
      });

      // !!LUIZ
      $('.select2-filter').select2({
         //placeholder: "---"
      });

      $('.select2-filter, input[name^="tags"]').on('change', function () {
        Event.search(localStorage.domain);
      })
    })
  }

  var search = function(api) {
    var form = new FormData();
    form.append("keyword", '');

    $('.select2-filter :selected, input[name^="tags"]:checked').each(function (i, item){
      var name = 'tags['+$(item).data().category+'][]'
      form.append(name, $(item).val())
    })

    var page = $("#add-page").length == 0 ? '&page=1' : '&page='+$("#add-page").data().page

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api + "event_search?profileType="+localStorage.profile+page+"&user_id="+localStorage.user,
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings)
    .done(function (response) {
      if (response) {
        if ($("#add-page").data().page > 1) {
          $("#gallery").append(response)
        } else {
          $(".search-result-thumb").remove()
          $("#gallery").append(response)
        }
        $("#add-page").prop('disabled', false)
      } else {
        $("#add-page").prop('disabled', true)
      }
    })
    .fail(function (response) {
      if (response.status == 403) {
        localStorage.clear()
        $(".icon-logout").click()
      }
    });
  }

  var loadPublisherHistoricGallery = function (api, type) {
    var form = new FormData();
    form.append("keyword", $("#keyword-search").val());

    $('input[name^="tags"]:checked').each(function (i, item){
      form.append('tags[]', $(item).val())
    })

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": api+"publisher_gallery_historic?publisher_id="+localStorage.user+"&type="+type,
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings)
    .done(function (response) {
      if (response) {
        $("#thumb-data-download").append(response)

        Event.likePhoto(localStorage.endpoint)
        Event.dislikePhoto(localStorage.endpoint)
      }
    })
    .fail(function (response) {
      if (response.status == 403) {
        localStorage.clear()
        $(".icon-logout").click()
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

    $.ajax(settings)
    .done(function (response) {
      $(".publisher-gallery-photos").html(response)
    })
    .fail(function (response) {
      if (response.status == 403) {
        localStorage.clear()
        $(".icon-logout").click()
      }
    });
  }

  var viewEvent = function (api) {
    var id = location.search.split("=")[1]

    if (id === undefined) {
      return true
    }

    Event.id = id

    return axios.get(api + "events?id="+id)
    .then(function (response) {
      var data = response.data

      Event.loadPhotos()
        .then(function () {
          $('#previews').lightGallery({
            subHtmlSelectorRelative: true,
            selector: '.preview-thumb'
          });
        })

      Cep.loadCountries(localStorage.endpoint)

      axios.get(api+"search/categories")
        .then(function (response) {
          response.data.forEach(function(item) {
            $("#select-categories").append(
              '<option name="categories" value="'+item.id+'">'+item.description+'</option>'
            )
          });
        })

      $("#input-bride").val(data.bride)
      $("#input-groom").val(data.groom)
      $("#input-title").val(data.title)
      $("#input-description").val(data.description)

      $("#input-approval-general").attr('checked', data.approval);
      $("#input-approval-bride").attr('checked', data.approval_bride);
      $("#input-approval-photographer").attr('checked', data.approval_photographer);
      $("#input-terms").attr('checked', data.terms);

      var date = data.eventdate.split(' ')[0].split('-')
      $("#input-eventdate").val(date.reverse().join('/'))

      $("#input-country").val(data.country).select2()
      $("#select-categories").val(data.categories[0]).select2()
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

    return axios.get(api + "events?id="+id)
    .then(function (response) {
      var data = response.data

      $("#input-bride").val(data.bride)
      $("#input-groom").val(data.groom)
      $("#input-title").val(data.title)
      $("#input-description").val(data.description)

      $("#input-approval-general").attr('checked', data.approval);
      $("#input-approval-bride").attr('checked', data.approval_bride);
      $("#input-approval-photographer").attr('checked', data.approval_photographer);
      $("#input-terms").attr('checked', data.terms);

      var date = data.eventdate.split(" ")[0].split("-")
      $("#select-day").val(parseInt(date[2])).change();
      $("#select-month").val(date[1]).change();
      $("#select-year").val(date[0]).change();

      data.tags.forEach(function(key, item) {
        var checkbox = $("[name^='tags']").filter("[value="+key+"]")
        $(checkbox).click()
        $(checkbox).prop("checked", true)
      });

      Event.loadSuppliers(JSON.parse(data.suppliers))

      $("#input-country").val(data.country).change()
      $.when(Cep.loadStates(api)).then(function(){
        if (data.state === null) {
          return
        }

        $("#input-state").val(data.state).change()
        return Cep.loadCities(api)
      }).then(function(){
        $("#input-city").val(data.city).change()

        $("#input-country").on('change', function (e) {
          Cep.loadStates(localStorage.endpoint)
        })

        $("#input-state").on('change', function (e) {
          Cep.loadCities(localStorage.endpoint)
        })
      })

      data.categories.forEach(function(key, item) {
        $("[name^='categories']").filter(":radio[value="+key+"]").attr("checked", true)
        $("[name^='categories']").filter(":radio[value="+key+"]").click()
      });
    });
  }

  var removeEvent = function (api) {
    $(".event-remove").on('click', function(e){
      e.preventDefault();

      var event_id = $(this).data().event

      Utils.show_modal_remove(
        "Deseja remover o evento?",
        function (params) {
          var settings = {
            "async": true,
            "method": "DELETE",
            "headers": {
              "content-type": "application/json",
              "accept": "application/json",
            },
            "processData": false,
            "url": params.url
          }

          return $.ajax(settings)
            .done(function (response) {
              $("#event-thumb-"+response.id).remove()
            })
        },
        {url: api+"events/"+event_id}
      )
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

  var likePhoto = function (api) {
    $(".photo-like").on('click', function(e){
      e.preventDefault();

      var settings = {
        "async": true,
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json",
        },
        "processData": false,
        "url": api+"photo/"+$(this).data().likephoto+"/like/publisher/"+localStorage.user
      }

      $.ajax(settings)
        .done(function (response) {
          var $favoriteLink = $("[data-likephoto="+response.photo_id+"]")

          $favoriteLink.hide()
          $("[data-dislikephoto="+response.photo_id+"]").show()
          $favoriteLink.parents('ul').siblings('.fav-count').text(response.totalLikes+" Like")
        })
    })
  }

  var dislikePhoto = function (api) {
    $(".photo-dislike").on('click', function(e){
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
        "url": api+"photo/"+$(this).data().dislikephoto+"/dislike/publisher/"+localStorage.user
      }

      $.ajax(settings)
        .done(function (response) {
          var $favoriteLink = $("[data-dislikephoto="+response.photo_id+"]")

          if ($('#btn-favorites .btn-pu').length > 0){
            $favoriteLink.parents('div').filter('.search-result-thumb').fadeOut('slow').remove()
            return
          }

          $favoriteLink.hide()
          $("[data-likephoto="+response.photo_id+"]").show()
          $favoriteLink.parents('ul').siblings('.fav-count').text(response.totalLikes+" Like")
        })
    })
  }

  var requestDownload = function (api) {
    $(".no-auth").on('click', function(e){
      e.preventDefault();

      var url = $('a', this).prop('href') !== undefined ? $('a', this).prop('href') : $(this).prop('href')

      axios.post(url)
        .then(function (response) {
          Utils.show_modal_alert('default', '', 'Pedido enviado para o fotógrafo.')
        })
        .catch(function (error) {
          Utils.show_modal_alert('default', '', error.response.data.message)
        });
    })
  }

  var loadPhotos = function() {
      return axios.get(localStorage.endpoint+"search/events/"+Event.id+"/photos")
        .then(function (response) {
          $(".dz-image-preview").remove();
          response.data.photos.forEach(function(photo) {
            Photo.addThumb(photo);
          });
          Photo.photoCoverHandler();
          Photo.deleteHandler();
          Event.updateFeedback();

          $('[data-toggle="tooltip"]').tooltip();
      });
  }

  var updateFeedback = function() {
    var total = $(".dz-image-preview").length;
    if (total >= Event.maxFilesLimit) {
        $('.drop-area').hide();
        $('.drop-feedback').show();
    }
    if (total < Event.maxFilesLimit) {
      $('.drop-area').show();
      $('.drop-feedback').hide();
    }
    $('.dropzone-feedback').html("Você já enviou "+total+" foto de "+Event.maxFilesLimit+" permitida.");
  }

  var createSupplier = function () {
    $(".supplier-add").click(function () {
      var type = $(this).data('type')

      var total = $(".suppliers-fields-fotos .form-control-fields").length

      var template =
        '<div class="form-control-fields">\n' +
        '  <div id="campo-'+type+'"  class="form-control-close">\n' +
        '    <input name="supplier['+type+']['+total+'][name]" type="text" class="form-control" placeholder="Nome">\n' +
        '    <input name="supplier['+type+']['+total+'][url]"  type="text" class="form-control" placeholder="URL">\n' +
        '    <button type="button" style="display: block" class="close" data-toggle="remove" data-target="_parent">\n' +
        '      <span aria-hidden="true">×</span>\n' +
        '    </button>\n' +
        '  </div>\n' +
        '  <label class="error msg-error" for="supplier['+type+'][]" style="display: none;"></label>\n' +
        '</div>'

      $('.suppliers-fields-'+type+' > div').append(template)
    })
  }

  var loadSuppliers = function (data) {
    var suppliers = data.supplier

    for (type in suppliers) {
      var i = 0
      for (prop in suppliers[type]) {
        var template =
          '<div class="form-control-fields">\n' +
          '  <div id="campo-'+type+'"  class="form-control-close">\n' +
          '    <input name="supplier['+type+']['+i+'][name]" value="'+suppliers[type][prop].name+'" type="text" class="form-control" placeholder="Nome">\n' +
          '    <input name="supplier['+type+']['+i+'][url]" value="'+suppliers[type][prop].url+'" type="text" class="form-control" placeholder="URL">\n' +
          '    <button type="button" style="display: block" class="close" data-toggle="remove" data-target="_parent">\n' +
          '      <span aria-hidden="true">×</span>\n' +
          '    </button>\n' +
          '  </div>\n' +
          '  <label class="error msg-error" for="supplier['+type+'][]" style="display: none;"></label>\n' +
          '</div>'

        $('.suppliers-fields-'+type+' > div').append(template)

        i++
      }
    }
  }

  var editHandler = function (api, user) {
    data = {
      user_id: localStorage.user,
      bride: $("#input-bride").val(),
      groom: $("#input-groom").val(),
      eventDate: $("#input-eventdate").val().split('/').reverse().join('-'),
      title: $("#input-title").val(),
      description: $("#input-description").val(),
      approval_general: $("#input-approval-general").is(":checked"),
      approval_photographer: $("#input-approval-photographer").is(":checked"),
      approval_bride: $("#input-approval-bride").is(":checked"),
      categories: [$("#select-categories").val()],
      terms: 1,
      country: $("#input-country").val()
    }

    axios.put(localStorage.getItem('endpoint')+"events/"+Event.id, data)
      .then(function (response) {
        if (response.id != undefined) {
          Event.id = response.id
          $("#event_id").val(Event.id);
        }
      })
      .catch(function (response) {
        Utils.show_modal_alert('default', '', response.message)
      })
  }

  var broadcastPublishers = function(api) {
    var id = location.search.split("=")[1]
    axios.post(api+"events/"+id+"/broadcastPublishers")
  }

  var publisherViewAlbum = function (api) {
    var id = location.search.split("=")[1]

    if (id === undefined) {
      return true
    }

    Event.id = id

    return axios.get(api + "events?id="+id)
      .then(function (response) {
        var data = response.data

        $("#input-bride").text(data.bride)
        $("#input-groom").text(data.groom)
        $("#input-title").text(data.title)
        $("#input-description").text(data.description)

        var date = data.eventdate.split(' ')[0].split('-')
        $("#input-eventdate").text(date.reverse().join('/'))

        axios.get(localStorage.domain+'publisher_gallery_photos?id='+id)
          .then(function (response) {
            $("#previews").html(response.data)
          })

        axios.get(api+"search/categories")
          .then(function (response) {
            response.data.forEach(function(item) {
              if (data.categories[0] === item.id) {
                $("#input-category").text(item.description)
              }
            });
          })

        axios.get(api+"/location/countries")
          .then(function (response) {
            response.data.forEach(function(item) {
              if (data.country == item.id) {
                $("#input-country").text(item.name)
              }
            })
        })
      });
  }

  var publisherPublish = function (api, config) {
    var data = {
      'publisher_id': localStorage.user,
      'event_id': Event.id,
      'text': $('#text').val().replace(/(?:\r\n|\r|\n)/g, '<br />'),
      'ask_for_changes': config.ask_for_changes,
      'approved': config.approved
    }

    axios.post(api+"events/publisherPublish", JSON.stringify(data))
      .then(function () {
        var message = ''

        if (config.approved) {
          message = 'Obrigado! Notificaremos o fotógrafo sobre sua escolha!'
        }

        if (config.ask_for_changes) {
          message = 'Obrigado! Notificaremos o fotógrafo sobre as mudanças necessárias!'
        }

        Utils.show_modal_alert('success', '', message);
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
    loadPublisherHistoricGallery: loadPublisherHistoricGallery,
    likePhoto: likePhoto,
    dislikePhoto: dislikePhoto,
    requestDownload: requestDownload,
    loadPhotos: loadPhotos,
    updateFeedback: updateFeedback,
    viewEvent: viewEvent,
    createSupplier: createSupplier,
    loadSuppliers: loadSuppliers,
    editHandler: editHandler,
    broadcastPublishers: broadcastPublishers,
    publisherViewAlbum: publisherViewAlbum,
    publisherPublish: publisherPublish,
    id: id,
    maxFilesLimit: maxFilesLimit
  };
})();

var Cep = (function () {
  var loadCountries = function (api) {
    return Utils.invokeAPI("GET", "/location/countries", function (response) {
      for (var prop in response) {
        var obj = response[prop]
        $("#input-country").append("<option data-id='"+obj.id+"' value='"+obj.id+"'>"+obj.name+"</option>")
      }
    })
  }

  var loadStates = function(api) {
    var country = $("#input-country :selected").length > 0 ? $("#input-country :selected").val() : 1

    return Utils.invokeAPI("GET", "/location/country/"+country+"/states", function (response) {
      $("#input-state").append("<option value=\"\">Selecione</option>")

      for (var prop in response) {
        var obj = response[prop]
        $("#input-state").append("<option data-id='"+obj.id+"' value='"+obj.statecode+"'>"+obj.name+"</option>")
      }
    })
  }

  var loadCities = function(api) {
    if ($("#input-state :selected").data('id') == undefined) {
      return false;
    }

    var url = "/location/state/"+$("#input-state :selected").data('id')+"/cities"
    return Utils.invokeAPI("GET", url, function (response) {
      $("#input-city option").remove()
      $("#input-city").append("<option value=\"\" >Selecione</option>")

      for (var prop in response) {
        var obj = response[prop]
        $("#input-city").append("<option value='"+obj.name+"'>"+obj.name+"</option>")
      }
    })
  }

  var loadCep = function(api) {
    var url = "location/zipcode/"+$("#input-cep").val().split('.').join('').split('-').join('')

    return Utils.invokeAPI("GET", url, function (response) {
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
    }, function (response){
      $("#input-country").val()

      $("#input-state").val(0)

      $("#input-city option").remove()
      $("#input-city").append("<option value=\"0\" disabled=\"disabled\">Selecione</option>")

      $("#input-neighborhood").val('')
      $("#input-street").val('')
      $("#input-complement").val('')
    })
  }

  return {
    loadCep: loadCep,
    loadStates: loadStates,
    loadCities: loadCities,
    loadCountries: loadCountries
  };
})()

var Photo = (function() {
  var deleteHandler = function() {
      $(".icon-trash").on("click",function(e){
        e.preventDefault();

        var guid = $(this).closest( ".dz-processing" ).prop("id");
        Utils.show_modal_remove(
          "Remover a foto?",
          function (params) {
            Utils.invokeAPI("DELETE", params.url, function(response){
              $("#"+params.guid).fadeOut("slow", function() {
                $("#"+params.guid).remove();
                Event.updateFeedback();
              });
            });
          },
          {url: "photo/"+guid, guid: guid}
        )
      });
  }

  var photoCoverHandler = function() {
    $('.nav-item .photo-pin').on("click",function(e){
      e.preventDefault();

      var elem = $(this)
      var guid = $(this).closest( ".dz-processing" ).prop("id");
      axios.patch(localStorage.endpoint+"/photo/cover/"+guid)
        .then(function (response) {
          $('.nav-item.active').removeClass('active');
          $(elem).parent().addClass('active');
        })
    });
  }

  var addThumb = function(photo) {
      var cover = photo.cover === 0 ? '' : 'active';
      var photoHtml = '\
        <div id="'+photo.filename.substr(0,36)+'" class="col-lg-6 col-md-4 col-sm-6 col-12 dz-processing dz-image-preview dz-success dz-complete" data-src="">\
          <div class="card thumb-gallery ratio-16by9 thumb-">\
            <div class="card-thumb-image" alt="'+photo.filename+'" style="background-image: url('+localStorage.image_cdn+photo.thumb+');"></div>\
            <div class="card-text">\
              <div class="card-text-inner">\
                <ul class="nav">\
                  <li class="nav-item view-image">\
                    <a class="nav-link preview-thumb" data-src="'+localStorage.image_cdn+photo.thumb+'" data-toggle="tooltip" data-placement="top" title="Visualizar">\
                      <i class="icon-search"></i>\
                    </a>\
                  </li>\
                  <li class="nav-item">\
                    <a title="Remover" data-toggle="tooltip" data-placement="top" class="nav-link" data-dz-remove="" href="#"><i class="icon-trash"></i></a>\
                  </li>\
                  <li class="nav-item '+cover+'">\
                    <a title="Usar Como Capa" data-toggle="tooltip" data-placement="top" class="nav-link photo-pin" href="#">\
                      <i class="icon-pin" style="display:none"></i>\
                      <i class="icon-pin-outline"></i>\
                    </a>\
                  </li>\
                </ul>\
              </div>\
            </div>\
          </div>\
        </div>\
      ';
      $("#previews").append(photoHtml);
  }

  return {
    addThumb: addThumb,
    deleteHandler: deleteHandler,
    photoCoverHandler: photoCoverHandler
  };
})();

var Approval = (function() {
  var approvalDenialAction = function() {
    $(".approval, .deny").on("click", function(e){
      e.preventDefault();
      $(this).parents('li').fadeOut()
      Utils.invokeAPI("PUT", $(this).attr('href'));
    });
  }

  var render = function(api, photographer_id) {
    Utils.invokeAPI("GET", "search/waiting_approval/user/"+photographer_id, function(list){
      var approvalsHtml = "";
      for (var i = 0; i < list.length; i++) {
        var data = list[i]
        var linkApproval = "events/"+data.event_id+"/approval/user/"+data.publisher_id
        var linkDeny = "events/"+data.event_id+"/disapproval/user/"+data.publisher_id
        var galleryLink = localStorage.domain+'gallery/edit?id='+data.event_id

        approvalsHtml += '\
        <li class="list-group-item list-group-item-action justify-content-between">\
          <span>\
            <a href="'+data.blog+'" target="_blank">'+data.publisher_name+'</a>\
            <small class="text-muted">solicitou acesso à galeria</small>\
            <a href="'+galleryLink+'">'+data.name+'</a>\
          </span>\
          <span>\
            <a href='+linkDeny+' class="deny btn btn-secondary">Recusar <i class="icon-cancel"></i></a>\
            <a href='+linkApproval+' class="approval btn btn-secondary">Aprovar <i class="icon-check"></i></a>\
          </span>\
        </li>\
        '
      }

      $(".list-group").html(approvalsHtml)
      Approval.approvalDenialAction()
      Utils.notifications()
    });
  }

  return {
    approvalDenialAction: approvalDenialAction,
    render: render
  };
})();

var Contact = (function() {
  var create = function() {
    var form = new FormData();
    form.append("name", $("#input_name").val());
    form.append("email", $("#input_email").val());
    form.append("phone", $("#input_phone").val());
    form.append("profile", $("input:checked").val());
    form.append("blog", $("#input_blog").val());

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": localStorage.endpoint+"contact",
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings)
      .done(function (response) {
        Utils.show_modal_alert('ph', '','Em breve entraremos em contato para você se tornar um fundador Foto Container.<br><br>');

      $("#input_name").val('')
      $("#input_email").val('')
      $("#input_phone").val('')
      $("#input_blog").val('')
    }).fail(function (response) {
      // $(".btn").remove()
      // show_modal_alert('ph', '','As vagas acabaram.<br><br>');
    })
  }

  var total = function(api, photographer_id) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": localStorage.endpoint+"contact/total",
      "method": "GET",
    }

    $.ajax(settings).fail(function (response) {
      // $(".btn").remove()
      // show_modal_alert('ph', '','As vagas acabaram.<br><br>');
    });
  }

  return {
    create: create,
    total: total
  };
})();

var PasswordRecovery = (function() {
  var requestRecover = function() {
    data = {
      email: $("#input_email").val()
    }

    axios.post(localStorage.endpoint+"users/requestPasswordChange", JSON.stringify(data))
      .then(function (response) {
        Utils.show_modal_alert('success', '', 'Um email com instruções para atualizar a senha foi enviado para <b>'+$('#input_email').val()+'</b>.');
      })
      .catch(function (error) {
        Utils.show_modal_alert('default', '', error.response.data.message)
      });
  }

  var updatePassword = function() {
    data = {
      token: location.search.split('=')[1],
      password: $("#input_password").val()
    }

    axios.post(localStorage.endpoint+"users/updatePassword", JSON.stringify(data))
      .then(function (response) {
        Utils.show_modal_alert('success', '', 'Sua senha foi atualizada com sucesso.');
      })
      .catch(function (error) {
        Utils.show_modal_alert('default', '', error.response.data.message)
      });
  }

  return {
    updatePassword: updatePassword,
    requestRecover: requestRecover
  };
})();

Utils.axiosInit()
