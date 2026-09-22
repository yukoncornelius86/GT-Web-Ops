(() => {
  'use strict';
  const form = document.getElementById('gtClubForm');
  if (!form) return;
  const vehicles = document.getElementById('clubVehicles');
  const add = document.getElementById('clubAddVehicle');
  const status = document.getElementById('clubStatus');
  let sequence = 0, sending = false;
  const submissionId = crypto.randomUUID();
  const track = (event, extra = {}) => window.GT_TRAFFIC?.event(event, {form_type:'drivers_club', ...extra});
  function addVehicle(focus) {
    if (vehicles.children.length >= 5) return;
    const n = ++sequence;
    const field = document.createElement('fieldset');
    field.className = 'club-vehicle';
    const input = (key, label, type = 'text') => `<div class="gt-field"><label for="vehicle-${n}-${key}">${label}</label><input id="vehicle-${n}-${key}" data-key="${key}" type="${type}" maxlength="120" ${key === 'year' ? 'min="1886" max="2100" step="1"' : ''}></div>`;
    field.innerHTML = `<legend>Vehicle ${n}</legend><div class="gt-fields">${input('year','Year','number')}${input('make','Make')}${input('model','Model')}</div><div class="gt-field"><label for="vehicle-${n}-story">A short ownership story</label><textarea id="vehicle-${n}-story" data-key="story" maxlength="2000"></textarea></div>${input('use','How do you use it?')}<div class="gt-field"><label for="vehicle-${n}-photo">Photo (optional)</label><input id="vehicle-${n}-photo" data-key="photo" type="file" accept="image/jpeg,image/png,image/webp"></div><button type="button" class="gt-action secondary club-remove">Remove this vehicle</button>`;
    field.querySelector('button').addEventListener('click', () => { field.remove(); add.disabled = false; add.focus(); });
    vehicles.append(field); add.disabled = vehicles.children.length >= 5;
    if (focus) field.querySelector('input').focus();
  }
  add.addEventListener('click', () => addVehicle(true));
  addVehicle(false);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const token = form.querySelector('[name="cf-turnstile-response"]')?.value || '';
    const fail = message => { status.dataset.error = 'true'; status.textContent = message; status.focus(); };
    if (!token) { fail('Please complete the security check before sending.'); return; }
    const data = new FormData(form);
    const payload = {submission_id:submissionId, vehicles:[], consent:data.get('consent') === 'on',
      interests:data.getAll('interests'), participation:data.getAll('participation'),
      attribution:window.GT_TRAFFIC?.attribution('drivers_club') || {}};
    ['first_name','last_name','email','phone','geography','referral_source','drive_radius','overnight_interest','hotel_level','dietary','worth_saturday','desired_experience','company_website'].forEach(key => { payload[key] = String(data.get(key) || '').trim(); });
    const body = new FormData();
    for (const vehicle of vehicles.children) {
      const record = {};
      vehicle.querySelectorAll('[data-key]:not([type=file])').forEach(input => { record[input.dataset.key] = input.value.trim(); });
      const photo = vehicle.querySelector('[type=file]').files[0];
      if (!Object.values(record).some(Boolean) && !photo) continue;
      if (!record.year || !record.make || !record.model) { fail('Add the year, make, and model for each vehicle, or remove the blank vehicle.'); return; }
      if (photo) {
        if (photo.size > 4 * 1024 * 1024 || !['image/jpeg','image/png','image/webp'].includes(photo.type)) { fail('Choose a JPEG, PNG, or WebP photo up to 4 MB.'); return; }
        body.append(`photo_${payload.vehicles.length}`, photo);
      }
      payload.vehicles.push(record);
    }
    body.append('payload', JSON.stringify(payload)); body.append('turnstile_token', token);
    const button = form.querySelector('[type=submit]');
    sending = true; button.disabled = true; button.textContent = 'Sending…';
    status.dataset.error = 'false'; status.textContent = 'Saving your interest…';
    track('drivers_club_submit_attempt');
    try {
      const response = await fetch('https://hub.thegtcollective.com/api/public/drivers-club/interest', {method:'POST', body, credentials:'omit', signal:AbortSignal.timeout(60000)});
      const result = await response.json();
      if (!response.ok || result.ok !== true || result.accepted !== true) throw new Error(result.error || 'Receipt could not be confirmed.');
      track('drivers_club_interest_completed', {referral_source:payload.attribution.utm_source || 'direct_or_referral'});
      form.hidden = true;
      const success = document.getElementById('clubSuccess'); success.hidden = false; success.focus();
    } catch (error) {
      track('drivers_club_submit_failed');
      fail((error.name === 'TimeoutError' ? 'Receipt could not be confirmed in time.' : error.message) + ' Your details are still here. Complete a fresh security check to retry, or contact crew@thegtcollective.com.');
    } finally {
      sending = false; button.disabled = false; button.textContent = 'Join the interest list';
      window.turnstile?.reset();
    }
  });
  form.querySelector('[type=submit]').disabled = false;
})();
