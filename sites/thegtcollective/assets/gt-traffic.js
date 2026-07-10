(function () {
  var endpoint = 'https://n8n.thegtcollective.com/webhook/gt-traffic-event';
  var params = new URLSearchParams(window.location.search || '');
  var trackedKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'fbclid',
    'gclid'
  ];

  function safeStorage(type) {
    try {
      return type === 'local' ? window.localStorage : window.sessionStorage;
    } catch (err) {
      return null;
    }
  }

  function randomId(prefix) {
    return prefix + '-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function getOrCreate(storage, key, prefix) {
    if (!storage) return randomId(prefix);
    var value = storage.getItem(key);
    if (!value) {
      value = randomId(prefix);
      storage.setItem(key, value);
    }
    return value;
  }

  var local = safeStorage('local');
  var session = safeStorage('session');
  var visitorId = getOrCreate(local, 'gt_visitor_id', 'gtv');
  var sessionId = getOrCreate(session, 'gt_session_id', 'gts');
  var startedForms = {};

  function currentAttribution() {
    var data = {};
    trackedKeys.forEach(function (key) {
      var value = params.get(key);
      if (value) data[key] = value.slice(0, 250);
    });
    data.referrer = document.referrer || '';
    data.landing_url = window.location.href;
    return data;
  }

  function firstTouchAttribution() {
    var key = 'gt_first_touch';
    var first = null;
    if (session) {
      try {
        first = JSON.parse(session.getItem(key) || 'null');
      } catch (err) {
        first = null;
      }
    }
    var current = currentAttribution();
    var hasCampaignSignal = trackedKeys.some(function (k) { return current[k]; }) || current.referrer;
    if (!first && hasCampaignSignal) {
      first = {
        captured_at: new Date().toISOString(),
        referrer: current.referrer,
        landing_url: current.landing_url
      };
      trackedKeys.forEach(function (k) {
        if (current[k]) first[k] = current[k];
      });
      if (session) session.setItem(key, JSON.stringify(first));
    }
    return first || current;
  }

  function attributionForForm(formType) {
    var first = firstTouchAttribution();
    var current = currentAttribution();
    return {
      source_url: window.location.href,
      landing_url: first.landing_url || current.landing_url || '',
      referrer: first.referrer || current.referrer || '',
      utm_source: first.utm_source || current.utm_source || '',
      utm_medium: first.utm_medium || current.utm_medium || '',
      utm_campaign: first.utm_campaign || current.utm_campaign || '',
      utm_content: first.utm_content || current.utm_content || '',
      utm_term: first.utm_term || current.utm_term || '',
      fbclid: first.fbclid || current.fbclid || '',
      gclid: first.gclid || current.gclid || '',
      visitor_id: visitorId,
      session_id: sessionId,
      form_type: formType || ''
    };
  }

  function selectedServiceFromPage(formType) {
    var selector = formType === 'contact' ? '#msgService' : '.service-opt.selected';
    var el = document.querySelector(selector);
    if (!el) return '';
    return (el.value || (el.dataset && el.dataset.service) || el.textContent || '').trim().slice(0, 180);
  }

  function formTypeFromElement(el) {
    var form = el.closest && el.closest('form');
    if (form) {
      return form.dataset.gtForm || form.dataset.previewForm || form.id || form.name || 'form';
    }
    var id = el.id || '';
    if (id.indexOf('book') === 0 || el.closest('#bookingModal')) return 'booking';
    if (id.indexOf('msg') === 0 || el.closest('#contact')) return 'contact';
    return '';
  }

  function formIdentity(formType) {
    return [window.location.pathname || '/', formType || 'form'].join(':');
  }

  function markFormStarted(formType, extra) {
    formType = (formType || 'form').toString().slice(0, 80);
    var identity = formIdentity(formType);
    var storageKey = 'gt_form_started:' + identity;
    if (startedForms[identity]) return;
    if (session && session.getItem(storageKey)) return;
    startedForms[identity] = true;
    if (session) session.setItem(storageKey, new Date().toISOString());

    extra = extra || {};
    postEvent('form_started', Object.assign(
      attributionForForm(formType),
      {
        form_type: formType,
        form_id: extra.form_id || '',
        form_name: extra.form_name || '',
        requested_service: extra.requested_service || selectedServiceFromPage(formType) || '',
        form_step: extra.form_step || 'first_interaction'
      }
    ));
  }

  function setupFormStartTracking() {
    document.addEventListener('focusin', function (event) {
      var target = event.target;
      if (!target || !target.matches || !target.matches('input, select, textarea')) return;
      var formType = formTypeFromElement(target);
      if (!formType) return;
      markFormStarted(formType, {
        form_id: (target.closest('form') && target.closest('form').id) || '',
        form_name: (target.closest('form') && target.closest('form').name) || '',
        form_step: 'field_focus'
      });
    }, true);

    document.addEventListener('click', function (event) {
      var service = event.target && event.target.closest && event.target.closest('.service-opt');
      if (!service) return;
      markFormStarted('booking', {
        requested_service: service.dataset.service || '',
        form_step: 'service_selected'
      });
    }, true);
  }

  function postEvent(eventType, extra) {
    var payload = Object.assign({
      event_type: eventType,
      timestamp: new Date().toISOString(),
      site: 'thegtcollective.com',
      page_url: window.location.href,
      path: window.location.pathname || '/',
      page_title: document.title || '',
      referrer: document.referrer || '',
      visitor_id: visitorId,
      session_id: sessionId,
      language: navigator.language || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      screen: window.screen ? [window.screen.width, window.screen.height].join('x') : '',
      user_agent: navigator.userAgent || ''
    }, currentAttribution(), extra || {});

    var body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      var blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
      if (navigator.sendBeacon(endpoint, blob)) return;
    }

    fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'omit',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: body,
      keepalive: true
    }).catch(function () {});
  }

  window.GT_TRAFFIC = {
    event: postEvent,
    attribution: attributionForForm,
    formStarted: markFormStarted
  };

  postEvent('page_view');
  setupFormStartTracking();
})();
