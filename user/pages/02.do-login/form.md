---
title: Login
slug: do-login
process:
    markdown: true
    twig: true
cache_enable: false
---

<form method="post" action="/do-login">
    <input name="email" placeholder="nome de usuário" type="text" maxlength="50" tabindex="1">
    <input name="passwd" placeholder="senha" type="password" tabindex="1">
    <button type="submit" tabindex="1">login</button>
</form>

{% for message in grav.messages.fetch %}
<div class="{{ message.scope|e }} alert">{{ message.message|raw }}</div>
{% endfor %}
