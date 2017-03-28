<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;
use Grav\Common\User\User;
use RocketTheme\Toolbox\Event\Event;

/**
 * Class FotoContainerPlugin
 * @package Grav\Plugin
 */
class PhotoContainerPlugin extends Plugin
{
    /**
     * @return array
     *
     * The getSubscribedEvents() gives the core a list of events
     *     that the plugin wants to listen to. The key of each
     *     array section is the event that the plugin listens to
     *     and the value (in the form of an array) contains the
     *     callable (or function) as well as the priority. The
     *     higher the number the higher the priority.
     */
    public static function getSubscribedEvents()
    {
        return [
            'onPluginsInitialized' => ['onPluginsInitialized', 0],
        ];
    }

    /**
     * Initialize the plugin
     */
    public function onPluginsInitialized()
    {
        // Don't proceed if we are in the admin plugin
        if ($this->isAdmin()) {
            return;
        }

        $endpoint = $this->grav['config']->get('plugins.photo-container.api_endpoint');
        $this->config->set('plugins.photocontainer.endpoint', $endpoint);

        $this->config->set(
            'plugins.photocontainer.domain',
            $this->grav['config']->get('plugins.photo-container.domain')
        );

        $categories = $this->grav['config']->get('plugins.photo-container.categories');
        $this->config->set('plugins.photocontainer.categories', $categories);

        $this->grav['messages']->clear();

        $route = $this->grav['uri']->route();

        if ($this->grav['user']->authenticated == null) {
            $allUnprotected = $this->grav['config']->get('plugins.photo-container.unprotected_routes');

            $flatArray = ["/event_search"];
            foreach ($allUnprotected as $unprotected) {
                $flatArray[] = $unprotected['text'];
            }

            if (!in_array($route, $flatArray)) {
                $this->grav->redirect('/');
                exit(0);
            }
        }

        if ($route == '/logout') {
            $this->onLogout();
        }

        if (!empty($_POST) && $route == $this->grav['config']->get('plugins.photo-container.login_route')) {
            $this->onLoginByApi();
        }

        if ($route == "/event_search") {
            $this->enable([
                'onTwigInitialized' => ['onTwigInitialized', 0]
            ]);
        }
    }

    /**
     * Do some work for this event, full details of events can be found
     * on the learn site: http://learn.getgrav.org/plugins/event-hooks
     *
     * @param Event $e
     */
    public function onLoginByApi()
    {
        try {
            $inputPwd = $this->grav['config']->get('plugins.photo-container.input_pwd');
            $inputUsername = $this->grav['config']->get('plugins.photo-container.input_username');

            $username = $_POST[$inputUsername];
            $user = User::load($username);

            if (!$user->exists()) {
                $client = new \GuzzleHttp\Client();

                $res = $client->request(
                    'POST',
                    $this->grav['config']->get('plugins.photo-container.api_endpoint') . "login",
                    [
                    'form_params' => [
                        'user' => $username,
                        'password' => $_POST[$inputPwd],
                    ]
                ]);

                $credentials = json_decode($res->getBody()->getContents());

                $res = $client->request(
                    'GET',
                    $this->grav['config']->get('plugins.photo-container.api_endpoint')."users?email=".$username,
                    ['headers' => ['Authorization' => 'Bearer '.$credentials->token]]
                );

                $data = json_decode($res->getBody()->getContents());

                $userData = [
                    'id'       => $data->id,
                    'fullname' => $data->name,
                    'username' => $data->email,
                    'email'    => $data->email,
                    'lang'     => 'en',
                    'profile'  => $data->profile->profile_id,
                ];

                $userData['groups'] = $this->grav['config']->get('plugins.login.user_registration.groups');
                $userData['access']['site'] = $this->grav['config']->get('plugins.login.user_registration.access.site', []);

                $user = new User($userData);
            }

            $user->authenticated = true;
            $this->grav['session']->user = $user;

            unset($this->grav['user']);
            $this->grav['user'] = $user;

            $this->grav->redirect('/gallery');
        } catch (\Exception $e) {
            $msg = "?error=Erro no processo de login.";
            if ($e->getCode() == 401) {
                $msg = "?error=Email ou Senha incorretos!";
            }

            $this->grav->redirect("/signin{$msg}");
        }

        return true;
    }

    public function onLogout() {
        session_destroy();
        $this->grav->redirect('/');
    }

    public function onTwigInitialized()
    {
        if (empty($_POST)) {
            return true;
        }

        $qs = http_build_query([
            'keyword' => isset($_POST['keyword']) ? $_POST['keyword'] : '',
            'tags' => isset($_POST['tags']) ? $_POST['tags'] : '',
            'photographer' => $_GET['profileType'] === '2' ? $this->grav['session']->user->id : ''
        ]);

        $client = new \GuzzleHttp\Client();

        $res = $client->request(
            'GET',
            $this->grav['config']->get('plugins.photo-container.api_endpoint')."search/events?".$qs
        );

        $found = json_decode($res->getBody()->getContents());

        header('Access-Control-Allow-Origin: *');
        echo $this->grav['twig']->processTemplate(
            "partials/components/render_gallery.twig",
                ['found' =>$found, 'logged_user_id' => $this->grav['session']->user->id]
        );
        exit;
    }
}
