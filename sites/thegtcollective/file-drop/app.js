(() => {
  'use strict';

  const API_BASE = 'https://hub.thegtcollective.com/api/public/file-drop';
  const MAX_FILES = 20;
  const MAX_FILE_BYTES = 1024 * 1024 * 1024;
  const state = { email: '', token: '', files: [] };

  const $ = (id) => document.getElementById(id);
  const panels = ['emailPanel', 'codePanel', 'uploadPanel', 'successPanel'];
  const status = $('status');

  function setStatus(message = '', isError = false) {
    status.textContent = message;
    status.classList.toggle('error', isError);
  }

  function showPanel(id, stepName) {
    panels.forEach((panelId) => $(panelId).classList.toggle('active', panelId === id));
    document.querySelectorAll('[data-step-indicator]').forEach((item) => {
      const names = ['email', 'code', 'upload'];
      const current = names.indexOf(stepName);
      const itemIndex = names.indexOf(item.dataset.stepIndicator);
      item.classList.toggle('active', itemIndex === current);
      item.classList.toggle('complete', itemIndex < current || id === 'successPanel');
    });
    setStatus();
  }

  async function api(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, options);
    let data = {};
    try { data = await response.json(); } catch (_) { /* handled below */ }
    if (!response.ok) throw new Error(data.error || 'The secure transfer service could not complete that request.');
    return data;
  }

  $('emailPanel').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = $('email').value.trim().toLowerCase();
    if (!$('email').checkValidity()) { $('email').reportValidity(); return; }
    const button = event.submitter;
    button.disabled = true;
    setStatus('Requesting your verification code…');
    try {
      await api('/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      state.email = email;
      $('emailSummary').textContent = email;
      showPanel('codePanel', 'code');
      $('code').focus();
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      button.disabled = false;
    }
  });

  $('codePanel').addEventListener('submit', async (event) => {
    event.preventDefault();
    const code = $('code').value.replace(/\D/g, '');
    if (!/^\d{6}$/.test(code)) { setStatus('Enter the six-digit code from your email.', true); return; }
    const button = event.submitter;
    button.disabled = true;
    setStatus('Verifying your code…');
    try {
      const data = await api('/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email, code })
      });
      state.token = data.upload_token;
      showPanel('uploadPanel', 'upload');
      $('dropZone').focus();
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      button.disabled = false;
    }
  });

  $('code').addEventListener('input', (event) => { event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6); });
  $('changeEmail').addEventListener('click', () => { state.email = ''; $('code').value = ''; showPanel('emailPanel', 'email'); $('email').focus(); });

  const dropZone = $('dropZone');
  dropZone.addEventListener('click', () => $('files').click());
  dropZone.addEventListener('dragover', (event) => { event.preventDefault(); dropZone.classList.add('dragging'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragging');
    selectFiles([...event.dataTransfer.files]);
  });
  $('files').addEventListener('change', (event) => selectFiles([...event.target.files]));

  function selectFiles(incoming) {
    const tooLarge = incoming.find((file) => file.size > MAX_FILE_BYTES);
    if (tooLarge) { setStatus(`${tooLarge.name} is larger than 1 GB.`, true); return; }
    const combined = [...state.files, ...incoming].filter((file, index, all) => all.findIndex((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified) === index);
    if (combined.length > MAX_FILES) { setStatus(`Choose no more than ${MAX_FILES} files per transfer.`, true); return; }
    state.files = combined;
    renderFiles();
    setStatus();
  }

  function renderFiles() {
    $('fileList').innerHTML = '';
    state.files.forEach((file, index) => {
      const row = document.createElement('div');
      row.className = 'file-item';
      row.dataset.fileIndex = String(index);
      const name = document.createElement('span');
      name.textContent = file.name;
      const detail = document.createElement('small');
      detail.textContent = file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
      const progress = document.createElement('div');
      progress.className = 'progress';
      progress.innerHTML = '<i></i>';
      row.append(name, detail, progress);
      $('fileList').append(row);
    });
    $('uploadButton').disabled = state.files.length === 0;
    $('uploadButton').textContent = state.files.length ? `Upload ${state.files.length} file${state.files.length === 1 ? '' : 's'}` : 'Upload selected files';
  }

  function sendChunk(uploadId, chunkIndex, blob, file, startOffset, bar, detail) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/uploads/${encodeURIComponent(uploadId)}/chunks/${chunkIndex}`);
      xhr.setRequestHeader('Authorization', `Bearer ${state.token}`);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.upload.addEventListener('progress', (event) => {
        if (!event.lengthComputable) return;
        const sent = Math.min(file.size, startOffset + event.loaded);
        const percent = Math.round(sent / file.size * 100);
        bar.style.width = `${percent}%`;
        detail.textContent = `${percent}%`;
      });
      xhr.addEventListener('load', () => {
        let data = {};
        try { data = JSON.parse(xhr.responseText || '{}'); } catch (_) { /* handled below */ }
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data.error || `${file.name} could not be uploaded.`));
      });
      xhr.addEventListener('error', () => reject(new Error(`${file.name} lost its connection.`)));
      xhr.send(blob);
    });
  }

  async function uploadFile(file, index) {
    const row = document.querySelector(`[data-file-index="${index}"]`);
    const detail = row.querySelector('small');
    const bar = row.querySelector('i');
    const initialized = await api('/uploads/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.token}` },
      body: JSON.stringify({ filename: file.name, size_bytes: file.size })
    });
    const chunkSize = initialized.chunk_size;
    const totalChunks = Math.ceil(file.size / chunkSize);
    for (let chunkIndex = initialized.next_chunk || 0; chunkIndex < totalChunks; chunkIndex += 1) {
      const start = chunkIndex * chunkSize;
      const blob = file.slice(start, Math.min(file.size, start + chunkSize));
      let lastError;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          await sendChunk(initialized.upload_id, chunkIndex, blob, file, start, bar, detail);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          if (attempt < 3) {
            detail.textContent = `Connection interrupted · retry ${attempt}/3`;
            await new Promise((resolve) => setTimeout(resolve, attempt * 900));
          }
        }
      }
      if (lastError) throw lastError;
    }
    const completed = await api(`/uploads/${encodeURIComponent(initialized.upload_id)}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${state.token}` }
    });
    row.classList.add('uploaded');
    detail.textContent = 'Delivered';
    bar.style.width = '100%';
    return completed;
  }

  $('uploadButton').addEventListener('click', async () => {
    const button = $('uploadButton');
    button.disabled = true;
    setStatus('Uploading securely… Keep this page open.');
    try {
      for (let index = 0; index < state.files.length; index += 1) await uploadFile(state.files[index], index);
      $('successCopy').textContent = `${state.files.length} file${state.files.length === 1 ? '' : 's'} delivered to The GT Collective’s private Google Drive intake.`;
      showPanel('successPanel', 'upload');
    } catch (error) {
      setStatus(error.message, true);
      button.disabled = false;
      button.textContent = 'Retry incomplete uploads';
    }
  });

  $('sendMore').addEventListener('click', () => {
    state.files = [];
    $('files').value = '';
    renderFiles();
    showPanel('uploadPanel', 'upload');
  });
})();
