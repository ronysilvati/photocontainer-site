<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;
use RocketTheme\Toolbox\Event\Event;
use Grav\Common\User\User;

/**
 * Class FotoContainerPlugin
 * @package Grav\Plugin
 */
class FotoContainerPlugin extends Plugin
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

        $uri = $this->grav['uri'];

        $this->grav['messages']->clear();
        if (!empty($_POST) && $uri->route() == $this->grav['config']->get('plugins.foto-container.login_route')) {
            $this->onLoginByApi();
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
            $username = $_POST['email'];
            $user = User::load($username);

            if (!$user->exists()) {
                $client = new \GuzzleHttp\Client();

                $res = $client->request(
                    'POST',
                    $this->grav['config']->get('plugins.foto-container.api_endpoint') . "login_check",
                    [
                    'form_params' => [
                        'email' => $_POST['email'],
                        'password' => $_POST['passwd']
                    ]
                ]);
                $credentials = json_decode($res->getBody()->getContents());

                $res = $client->request(
                    'GET',
                    $this->grav['config']->get('plugins.foto-container.api_endpoint')."users.json?email=".$_POST['email'],
                    ['headers' => ['Authorization' => 'Bearer '.$credentials->token]]
                );

                $data = json_decode($res->getBody()->getContents());
                $data = is_array($data) && !empty($data) ? $data[0] : null;

                $userData = [
                    'id'       => $data->id,
                    'fullname' => $data->name,
                    'username' => $data->email,
                    'email'    => $data->email,
                    'lang'     => 'en',
                ];

                $userData['groups'] = $this->grav['config']->get('plugins.login.user_registration.groups');
                $userData['access']['site'] = $this->grav['config']->get('plugins.login.user_registration.access.site', []);

                $user = new User($userData);
            }

            $user->authenticated = true;
            $this->grav['session']->user = $user;

            unset($this->grav['user']);
            $this->grav['user'] = $user;

            if ($data->profile[0]->id == 1) {
                $this->grav->redirect('/fotografo');
            }

            if ($data->profile[0]->id == 2) {
                $this->grav->redirect('/blogueiro');
            }
        } catch (\Exception $e) {
            $messages = $this->grav['messages'];
            $messages->add($e->getMessage(), 'error');
        }

        return true;
    }
}
