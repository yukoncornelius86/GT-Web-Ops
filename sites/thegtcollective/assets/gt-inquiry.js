(() => {
  'use strict';
  const form = document.getElementById('gtProjectForm');
  if (!form) return;
  const service = form.elements.service;
  const status = document.getElementById('gtFormStatus');
  const planBox = document.getElementById('gtPlanContext');
  const extra = document.getElementById('gtCleaningDetails');
  const params = new URLSearchParams(location.search);
  const requested = (params.get('service') || '').trim();
  const aliases = {
    'preservation baseline / assessment':'baseline', 'preservation consultation':'unsure',
    'preservation or mechanical service':'mechanical', 'preservation & mechanical':'mechanical',
    'precision preservation cleaning':'cleaning', 'dry ice cleaning':'cleaning', 'dry-ice':'cleaning', 'dryice':'cleaning',
    'paint preservation & protection':'paint', 'ceramic coating':'paint', 'ceramic':'paint', 'paint correction':'paint',
    'gt stewardship':'stewardship',
    'auction preparation & representation':'auction', 'auction preparation & listing support':'auction',
    'auction preparation':'auction', 'auction listing support':'auction',
    'gt undercarriage preservation':'underbody', 'undercarriage preservation':'underbody', 'two-year refresh treatment':'underbody',
    'not sure yet':'unsure'
  };
  const titles = {
    unsure:'Preservation Consultation', baseline:'Preservation Baseline / Assessment', mechanical:'Preservation & Mechanical',
    cleaning:'Precision Preservation Cleaning', paint:'Paint Preservation & Protection', stewardship:'GT Stewardship',
    auction:'Auction Preparation & Listing Support', underbody:'GT Undercarriage Preservation'
  };
  const initial = aliases[requested.toLowerCase()] || requested.toLowerCase();
  service.value = Object.hasOwn(titles, initial) ? initial : 'unsure';
  let scope = params.get('scope') || (['Auction Preparation', 'Auction Listing Support', 'Two-Year Refresh Treatment'].includes(requested) ? requested : '');
  let plan = null;
  const planKey = params.get('plan');
  if (planKey) service.value = 'stewardship';

  function showServiceDetails() {
    const cleaning = ['cleaning','underbody'].includes(service.value);
    extra.hidden = !cleaning;
    extra.querySelectorAll('input,select').forEach(field => { field.disabled = !cleaning; });
    document.getElementById('gtAuctionScope').hidden = service.value !== 'auction';
    form.elements.auctionScope.disabled = service.value !== 'auction';
    planBox.hidden = !(service.value === 'stewardship' && planKey);
    if (scope && service.value === 'auction' && !form.elements.auctionScope.value) {
      form.elements.auctionScope.value = scope === 'Auction Listing Support' ? 'Listing support' : scope === 'Auction Preparation' ? 'Vehicle preparation' : 'Preparation and listing support';
    }
  }
  service.addEventListener('change', showServiceDetails);
  showServiceDetails();

  async function loadPlan() {
    if (!planKey) return;
    planBox.textContent = 'Loading your selected Stewardship plan…';
    try {
      const response = await fetch('https://hub.thegtcollective.com/api/public/stewardship-plans', {headers:{Accept:'application/json'},signal:AbortSignal.timeout(10000)});
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error('Plans unavailable');
      plan = (payload.plans || []).find(item => item.plan_key === planKey) || null;
      if (!plan) { planBox.textContent = 'This plan link may have changed. Mike will help you choose from the current Stewardship options.'; return; }
      const price = plan.show_price && plan.retail_price != null ? Number(plan.retail_price).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}) + (plan.billing_frequency ? ' / ' + plan.billing_frequency.toLowerCase() : '') : '';
      planBox.textContent = 'Your selected plan: ' + plan.plan_name + (price ? ' · ' + price : '') + '. Mike will confirm the fit and included care with you.';
    } catch {
      planBox.textContent = 'Your Stewardship interest is noted. Current plan details could not load; Mike will confirm the options with you.';
    }
  }
  loadPlan();
  const attribution = () => window.GT_TRAFFIC?.attribution('project_review') || {source_url:location.href,form_type:'project_review'};
  const track = (name, details = {}) => window.GT_TRAFFIC?.event(name, {...attribution(),requested_service:titles[service.value],...details});
  let sending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const token = form.querySelector('[name="cf-turnstile-response"]')?.value || '';
    if (!token) {
      status.dataset.error = 'true';
      status.textContent = 'Please complete the security check before sending. If it is unavailable, call 240-980-1740 or email crew@thegtcollective.com.';
      status.focus();
      return;
    }
    const data = new FormData(form);
    const value = name => String(data.get(name) || '').trim();
    if (value('preferredContact') === 'Phone' && !value('phone')) {
      status.dataset.error = 'true'; status.textContent = 'Add a phone number, or choose email as your preferred contact.';
      form.elements.phone.focus(); return;
    }
    const selectedPlan = service.value === 'stewardship' ? plan : null;
    const selectedScope = service.value === 'auction' ? value('auctionScope') : service.value === 'underbody' ? scope : '';
    const notes = [value('goal'), 'Timing: ' + (value('timing') || 'To discuss'), 'Preferred contact: ' + value('preferredContact'),
      selectedScope && 'Requested scope: ' + selectedScope,
      selectedPlan && 'Stewardship plan: ' + selectedPlan.plan_name,
      service.value === 'stewardship' && planKey && 'Plan reference: ' + planKey,
      data.getAll('areas').length && 'Affected areas: ' + data.getAll('areas').join(', '),
      value('method') && 'Method interest: ' + value('method'),
      value('drivable') && 'Drivable: ' + value('drivable'),
      value('partsRemoved') && 'Parts removed: ' + value('partsRemoved')].filter(Boolean).join('\n\n');
    const payload = {
      ...attribution(), first_name:value('firstName'), last_name:value('lastName'), email:value('email'), phone:value('phone'),
      vehicle:value('vehicle'), requested_service:titles[service.value], service_id:service.value,
      service_objective:value('goal'), desired_outcome:value('goal'), notes,
      project_timing:value('timing'), preferred_contact:value('preferredContact'),
      affected_areas:data.getAll('areas'), method_interest:value('method'), vehicle_drivable:value('drivable'), parts_removed:value('partsRemoved'),
      requested_scope:selectedScope, stewardship_plan_key:service.value === 'stewardship' ? planKey || '' : '', stewardship_plan_name:selectedPlan?.plan_name || '',
      source_site:'thegtcollective.com', consent_to_contact:true, turnstile_token:token, turnstile_action:'booking_modal'
    };
    sending = true;
    const button = form.querySelector('button[type=submit]');
    button.disabled = true; button.textContent = 'Sending…';
    status.dataset.error = 'false'; status.textContent = 'Sending your project review…';
    track('lead_submit_attempt');
    try {
      const response = await fetch('https://n8n.thegtcollective.com/webhook/service-request', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload),signal:AbortSignal.timeout(45000)
      });
      const text = await response.text();
      let result;
      try { result = text ? JSON.parse(text) : null; } catch { throw new Error('unconfirmed'); }
      if (!response.ok || result?.ok === false || result?.ignored === true) throw new Error(result?.reason === 'captcha_failed' ? 'security' : 'rejected');
      if (!result || (result.ok !== true && result.success !== true && !result.lead_id)) throw new Error('unconfirmed');
      track('lead_submit', {result:'accepted'});
      track('lead_accepted');
      document.getElementById('gtInquiryLayout').hidden = true;
      const success = document.getElementById('gtInquirySuccess');
      success.hidden = false;
      success.focus();
    } catch (error) {
      track('lead_submit_failed', {failure_type:error.name === 'TimeoutError' ? 'timeout' : error.message === 'security' ? 'security' : 'unconfirmed'});
      status.dataset.error = 'true';
      status.textContent = error.message === 'security'
        ? 'The security check expired. Complete the new check, then send again.'
        : 'We could not confirm receipt. Your details are still here. Please call 240-980-1740 or email crew@thegtcollective.com before retrying if you are unsure whether it arrived.';
      status.focus();
    } finally {
      sending = false; button.disabled = false; button.textContent = 'Send for Review';
      if (window.turnstile) window.turnstile.reset();
    }
  });
  // Enable only after the secure submission handler is attached.
  form.querySelector('button[type=submit]').disabled = false;
})();
