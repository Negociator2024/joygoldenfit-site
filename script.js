// Joy Golden Fit Coaching — comportements partagés

document.addEventListener('DOMContentLoaded', function () {
  // Pied de page partagé : fichier technique hors du contenu éditable du CMS
  var footerMount = document.querySelector('[data-site-footer]');
  if (footerMount) {
    fetch('templates/footer.html')
      .then(function (res) {
        if (!res.ok) throw new Error('Footer introuvable');
        return res.text();
      })
      .then(function (html) {
        footerMount.outerHTML = html;
      })
      .catch(function (err) {
        console.error('Impossible de charger le pied de page partagé.', err);
      });
  }


  // Pages CMS — contenu éditable
  function loadCmsJson(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error('Contenu CMS introuvable : ' + path);
      return res.json();
    });
  }

  // Accueil — textes, photo principale et galerie
  var homeTitleBefore = document.querySelector('[data-cms-home-title-before]');
  if (homeTitleBefore) {
    loadCmsJson('content/accueil.json').then(function (data) {
      var titleEmphasis = document.querySelector('[data-cms-home-title-emphasis]');
      var titleAfter = document.querySelector('[data-cms-home-title-after]');
      var intro = document.querySelector('[data-cms-home-intro]');
      var photo = document.querySelector('[data-cms-home-photo]');
      var homeGallery = document.querySelector('[data-cms-home-transformations]');

      if (data.hero_title) {
        if (data.hero_title.before) homeTitleBefore.textContent = data.hero_title.before + ' ';
        if (titleEmphasis && data.hero_title.emphasis) titleEmphasis.textContent = data.hero_title.emphasis;
        if (titleAfter && data.hero_title.after) titleAfter.textContent = ' ' + data.hero_title.after;
      }
      if (intro && data.intro) intro.textContent = data.intro;
      if (photo && data.hero_image) photo.src = data.hero_image;

      if (homeGallery && Array.isArray(data.transformations)) {
        homeGallery.innerHTML = '';
        data.transformations.forEach(function (imagePath) {
          var figure = document.createElement('figure');
          figure.className = 'trust-gallery-item';

          var img = document.createElement('img');
          img.src = imagePath || '';
          img.alt = 'Transformation accompagnée par Joy Golden Fit';
          if (/transformation-/i.test(imagePath || '')) {
            img.className = 'trust-gallery-contain';
          }

          figure.appendChild(img);
          homeGallery.appendChild(figure);
        });
      }
    }).catch(function (err) {
      console.error('Impossible de charger le contenu CMS de l’accueil.', err);
    });
  }

  // La coach — textes, citation et photo principale
  var coachTitle = document.querySelector('[data-cms-coach-title]');
  if (coachTitle) {
    loadCmsJson('content/la-coach.json').then(function (data) {
      var setText = function (selector, value) {
        var el = document.querySelector(selector);
        if (el && value) el.textContent = value;
      };

      if (data.title) coachTitle.textContent = data.title;
      setText('[data-cms-coach-intro]', data.intro);

      var photo = document.querySelector('[data-cms-coach-photo]');
      if (photo && data.photo) photo.src = data.photo;

      setText('[data-cms-coach-approach-title]', data.approach_title);
      setText('[data-cms-coach-p1]', data.approach_paragraph_1);
      setText('[data-cms-coach-p2]', data.approach_paragraph_2);
      if (data.quote) setText('[data-cms-coach-quote]', '« ' + data.quote + ' »');
      setText('[data-cms-coach-closing]', data.closing);
      setText('[data-cms-coach-engagement-title]', data.engagement_title);
      setText('[data-cms-coach-engagement-intro]', data.engagement_intro);
      setText('[data-cms-coach-cta-title]', data.cta_title);

      if (Array.isArray(data.engagements)) {
        var engagementCards = document.querySelectorAll('.section-dark .pillars .pillar');
        data.engagements.forEach(function (item, index) {
          var card = engagementCards[index];
          if (!card) return;
          var heading = card.querySelector('h3');
          var paragraph = card.querySelector('p');
          if (heading && item.title) heading.textContent = item.title;
          if (paragraph && item.text) paragraph.textContent = item.text;
        });
      }
    }).catch(function (err) {
      console.error('Impossible de charger le contenu CMS de la page La coach.', err);
    });
  }

  // Programmes — textes uniquement ; prix, durées, liens Stripe et paiement restent protégés
  var programmesTitle = document.querySelector('[data-cms-programmes-title]');
  if (programmesTitle) {
    loadCmsJson('content/programmes.json').then(function (data) {
      var setText = function (selector, value) {
        var el = document.querySelector(selector);
        if (el && value) el.textContent = value;
      };

      if (data.title) programmesTitle.textContent = data.title;
      setText('[data-cms-programmes-intro]', data.intro);
      setText('[data-cms-programmes-online-title]', data.online_title);
      setText('[data-cms-programmes-signature-label]', data.signature_label);
      setText('[data-cms-programmes-signature-emphasis]', data.signature_emphasis);
      setText('[data-cms-programmes-included-title]', data.included_title);
      setText('[data-cms-programmes-included-intro]', data.included_intro);

      if (Array.isArray(data.formulas)) {
        var cards = document.querySelectorAll('.pricing-grid .price-card');
        data.formulas.forEach(function (formula, index) {
          var card = cards[index];
          if (!card) return;
          var subtitle = card.querySelector('.plan-sub');
          if (subtitle && formula.subtitle) subtitle.textContent = formula.subtitle;
          if (Array.isArray(formula.features)) {
            var list = card.querySelector('ul');
            if (list) {
              list.innerHTML = '';
              formula.features.forEach(function (feature) {
                var li = document.createElement('li');
                li.textContent = feature;
                list.appendChild(li);
              });
            }
          }
        });
      }

      if (Array.isArray(data.pillars)) {
        var pillars = document.querySelectorAll('.programme-pillars .pillar');
        data.pillars.forEach(function (item, index) {
          var pillar = pillars[index];
          if (!pillar) return;
          var heading = pillar.querySelector('h3');
          var paragraph = pillar.querySelector('p');
          if (heading && item.title) heading.textContent = item.title;
          if (paragraph && item.text) paragraph.textContent = item.text;
        });
      }
    }).catch(function (err) {
      console.error('Impossible de charger le contenu CMS de la page Programmes.', err);
    });
  }

  var testimonialsGrid = document.querySelector('[data-cms-testimonials]');
  if (testimonialsGrid) {
    loadCmsJson('content/temoignages.json').then(function (data) {
      var title = document.querySelector('[data-cms-testimonials-title]');
      var intro = document.querySelector('[data-cms-testimonials-intro]');
      if (title && data.title) title.textContent = data.title;
      if (intro && data.intro) intro.textContent = data.intro;
      if (!Array.isArray(data.items)) return;

      testimonialsGrid.innerHTML = '';
      data.items.forEach(function (item) {
        var card = document.createElement('div');
        card.className = 'testi-card';

        var img = document.createElement('img');
        img.className = 'testi-photo';
        img.src = item.image || '';
        img.alt = 'Transformation de ' + (item.name || 'cliente');

        var quote = document.createElement('p');
        quote.className = 'quote';
        quote.textContent = '« ' + (item.quote || '') + ' »';

        var who = document.createElement('div');
        who.className = 'who';
        var strong = document.createElement('strong');
        strong.textContent = item.name || '';
        who.appendChild(strong);
        who.appendChild(document.createTextNode(item.type || ''));

        card.appendChild(img);
        card.appendChild(quote);
        card.appendChild(who);
        testimonialsGrid.appendChild(card);
      });
    }).catch(function (err) {
      console.error('Impossible de charger les témoignages CMS.', err);
    });
  }

  var faqWrap = document.querySelector('[data-cms-faq]');
  if (faqWrap) {
    loadCmsJson('content/faq.json').then(function (data) {
      var title = document.querySelector('[data-cms-faq-title]');
      var intro = document.querySelector('[data-cms-faq-intro]');
      if (title && data.title) title.textContent = data.title;
      if (intro && data.intro) intro.textContent = data.intro;
      if (!Array.isArray(data.categories)) return;

      faqWrap.innerHTML = '';
      data.categories.forEach(function (category, categoryIndex) {
        var heading = document.createElement('h3');
        heading.className = 'faq-category';
        if (categoryIndex > 0) heading.style.marginTop = '52px';
        heading.textContent = category.title || '';
        faqWrap.appendChild(heading);

        (category.items || []).forEach(function (item) {
          var details = document.createElement('details');
          details.className = 'faq-item';
          if (item.open) details.open = true;

          var summary = document.createElement('summary');
          summary.textContent = item.question || '';

          var answer = document.createElement('p');
          answer.className = 'faq-a';
          answer.textContent = item.answer || '';

          details.appendChild(summary);
          details.appendChild(answer);
          faqWrap.appendChild(details);
        });
      });
    }).catch(function (err) {
      console.error('Impossible de charger la FAQ CMS.', err);
    });
  }

  var contactTitle = document.querySelector('[data-cms-contact-title]');
  if (contactTitle) {
    loadCmsJson('content/contact.json').then(function (data) {
      var intro = document.querySelector('[data-cms-contact-intro]');
      var badge = document.querySelector('[data-cms-contact-badge]');
      if (data.title) contactTitle.textContent = data.title;
      if (intro && data.intro) intro.textContent = data.intro;
      if (badge && data.response_badge) badge.textContent = data.response_badge;
    }).catch(function (err) {
      console.error('Impossible de charger le contenu contact CMS.', err);
    });
  }

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

  // Carrousel de transformations sur l'accueil
  var gallery = document.querySelector('.trust-gallery');
  var prev = document.querySelector('.trust-carousel-prev');
  var next = document.querySelector('.trust-carousel-next');
  if (gallery && prev && next) {
    function getStep() {
      var item = gallery.querySelector('.trust-gallery-item');
      if (!item) return gallery.clientWidth;
      var gap = parseFloat(getComputedStyle(gallery).gap) || 0;
      return item.getBoundingClientRect().width + gap;
    }
    function updateCarouselButtons() {
      var maxScroll = gallery.scrollWidth - gallery.clientWidth - 2;
      prev.disabled = gallery.scrollLeft <= 2;
      next.disabled = gallery.scrollLeft >= maxScroll;
    }
    prev.addEventListener('click', function () {
      gallery.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      gallery.scrollBy({ left: getStep(), behavior: 'smooth' });
    });
    gallery.addEventListener('scroll', function () {
      window.requestAnimationFrame(updateCarouselButtons);
    });
    window.addEventListener('resize', updateCarouselButtons);
    updateCarouselButtons();
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
