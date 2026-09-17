// Joy Golden Fit Coaching — comportements partagés

document.addEventListener('DOMContentLoaded', function () {
  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Formulaire de contact (coaching présentiel)
  var form = document.querySelector('.coaching-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');

      // ⚠️ À CONFIGURER : remplacez l'action du <form> dans contact.html par votre
      // véritable endpoint (ex. Formspree, Netlify Forms) pour recevoir réellement
      // les demandes. Sans cela, ce formulaire n'envoie nulle part.
      var endpoint = form.getAttribute('action');
      var isConfigured = endpoint && endpoint.indexOf('VOTRE_ID_FORMULAIRE') === -1;

      if (isConfigured) {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        }).then(function (res) {
          showStatus(status, res.ok);
          if (res.ok) form.reset();
        }).catch(function () { showStatus(status, false); });
      } else {
        // Mode démonstration : simule l'envoi tant que l'endpoint n'est pas configuré.
        console.warn('Formulaire non connecté : configurez "action" dans contact.html.');
        showStatus(status, true, true);
        form.reset();
      }
    });
  }

  function showStatus(el, success, demo) {
    if (!el) return;
    el.classList.add('visible');
    if (success) {
      el.textContent = demo
        ? 'Message enregistré (mode démonstration — connectez un vrai formulaire pour recevoir les demandes).'
        : 'Merci ! Votre demande a bien été envoyée, Joy vous répond sous 48h.';
    } else {
      el.textContent = "Une erreur est survenue. Vous pouvez aussi écrire directement à contact@joygoldenfit.fr";
    }
  }
});
