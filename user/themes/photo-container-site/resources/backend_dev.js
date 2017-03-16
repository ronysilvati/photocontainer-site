var config = {api:"http://192.168.99.100:8081/app_dev.php"};

var Signup = (function () {
    var photographer = function(api)
    {
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

    var publisher = function(api)
    {
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

        return result    }

    return {
        publisher: publisher,
        photographer: photographer
    };
})();