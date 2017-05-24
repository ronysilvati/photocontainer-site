<?php
namespace Grav\Plugin;

use Grav\Common\GPM\Response;
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

        $image_cdn = $this->grav['config']->get('plugins.photo-container.image_cdn');
        $this->config->set('plugins.photocontainer.image_cdn', $image_cdn);

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

            $flatArray = ["/event_search", "/publisher_gallery_photos", "/publisher_gallery_historic", "/thumbs"];
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

        if (in_array($route, ["/signup-photographer", "/signup-publisher"])) {
            $this->verifySignupSlots();
            exit;
        }

        if (in_array($route, ["/event_search", "/publisher_gallery_photos", "/publisher_gallery_historic"])) {
            $this->enable([
                'onTwigInitialized' => ['onTwigInitialized', 0]
            ]);
        }
    }

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
                    'sigla'  => $data->profile->profile_id == 2 ? 'ph' : 'pu',
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
        exit();
    }

    public function onTwigInitialized()
    {
        header('Access-Control-Allow-Origin: *');

        if ($this->grav['session']->user->id == null) {
            $this->forceLogout();
            exit;
        }

        $route = $this->grav['uri']->route();

        if ($route == "/event_search" && !empty($_POST)) {
            $this->searchGallery();
        }

        if ($route == "/publisher_gallery_photos") {
            $this->searchGalleryPhotos();
        }

        if ($route == "/publisher_gallery_historic") {
            $this->publisherHistoricGallery();
        }

        exit;
    }

    private function verifySignupSlots() {
        $client = new \GuzzleHttp\Client();
        $res = $client->request(
            'GET',
            $this->grav['config']->get('plugins.photo-container.api_endpoint')."users/satisfyPreConditions"
        );

        if ($res->getStatusCode() == 300) {
            $this->grav->redirect("/signup-contact");
        }

        return true;
    }

    private function searchGalleryPhotos()
    {
        $response = Response::get($this->grav['config']->get('plugins.photo-container.api_endpoint')."search/events/".$_REQUEST['id']."/photos/user/".$this->grav['session']->user->id);
        $found = json_decode($response, true);

        echo $this->grav['twig']->processTemplate(
            "partials/components/render_gallery_photos.html.twig",
            [
                'event' => $found,
                'logged_user_id' => $this->grav['session']->user->id,
                'api_endpoint' => $this->grav['config']->get('plugins.photo-container.api_endpoint'),
                'image_cdn' => $this->grav['config']->get('plugins.photo-container.image_cdn'),
                'profile' => 'publisher',
                'sigla' => 'pu',
            ]
        );
        exit;
    }

    private function searchGallery()
    {
        if ($this->grav['session']->user->profile != $_GET['profileType'] ||
            $this->grav['session']->user->id != $_GET['user_id']) {
            $this->forceLogout();
            exit;
        }

        $qs = http_build_query([
            'keyword' => isset($_POST['keyword']) ? $_POST['keyword'] : '',
            'tags' => isset($_POST['tags']) ? $_POST['tags'] : '',
            'photographer' => $_GET['profileType'] === '2' ? $this->grav['session']->user->id : '',
            'publisher' => $_GET['profileType'] === '3' ? $this->grav['session']->user->id : '',
            'page' => $_GET['page']
        ]);

        $response = Response::get($this->grav['config']->get('plugins.photo-container.api_endpoint')."search/events?".$qs);
        $found = json_decode($response, true);

        echo $this->grav['twig']->processTemplate(
            "partials/components/render_gallery.twig",
            [
                'found' => $found,
                'logged_user_id' => $this->grav['session']->user->id,
                'profile' => $_GET['profileType'] === '2' ? 'photographer' : 'publisher',
                'sigla' => $_GET['profileType'] === '2' ? 'ph' : 'pu',
                'image_cdn' => $this->grav['config']->get('plugins.photo-container.image_cdn'),
            ]
        );
        exit;
    }

    private function publisherHistoricGallery()
    {
        $qs = http_build_query([
            'keyword' => isset($_POST['keyword']) ? $_POST['keyword'] : '',
            'tags' => isset($_POST['tags']) ? $_POST['tags'] : '',
        ]);

        $endpoint = $this->grav['config']->get('plugins.photo-container.api_endpoint');
        $response = Response::get(
            $endpoint."search/photo/user/".$_REQUEST['publisher_id']."/".$_REQUEST['type']."?".$qs
        );

        $found = json_decode($response, true);

        echo $this->grav['twig']->processTemplate(
            "partials/components/render_gallery_historic.html.twig",
            [
                'event' => $found,
                'logged_user_id' => $this->grav['session']->user->id,
                'api_endpoint' => $this->grav['config']->get('plugins.photo-container.api_endpoint'),
                'image_cdn' => $this->grav['config']->get('plugins.photo-container.image_cdn'),
                'profile' => 'publisher',
                'sigla' => 'pu',
            ]
        );
        exit;

    }

    public function forceLogout()
    {
        session_destroy();

        header('HTTP/1.0 403 Forbidden');
        header('Content-Type: application/json');

        echo json_encode(['session_cancel' => true]);
    }
}
