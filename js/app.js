(() => {
  'use strict';

  const STORAGE_KEY = 'aula-matematica-situacions-v1';
  const fields = [
    'title', 'course', 'duration', 'subject', 'area', 'context', 'challenge', 'product',
    'competencies', 'criteria', 'knowledge', 'objectives', 'sessions', 'methodology',
    'inclusion', 'assessment', 'resources'
  ];
  const form = document.getElementById('situation-form');
  const list = document.getElementById('situation-list');
  const status = document.getElementById('form-status');
  let situations = [];

  function readStored() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value.filter(item => item && typeof item === 'object') : [];
    } catch (error) {
      console.warn('No s’han pogut llegir les situacions desades.', error);
      return [];
    }
  }

  function saveStored() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(situations));
      return true;
    } catch (error) {
      status.textContent = 'No s’ha pogut desar. Comprova l’espai disponible al navegador.';
      return false;
    }
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function render() {
    if (!situations.length) {
      list.innerHTML = '<div class="empty-state"><strong>Encara no tens cap situació desada.</strong><br>Omple el formulari i desa la primera proposta.</div>';
      return;
    }
    list.innerHTML = situations.map(item => {
      const summary = item.challenge || item.context || 'Afegeix-hi el context i el repte.';
      return `<article class="card">
        <p class="card-meta">${escapeHtml(item.course || 'Curs no indicat')} · ${escapeHtml(item.subject || 'Matemàtiques')}</p>
        <h3>${escapeHtml(item.title || 'Sense títol')}</h3>
        <p>${escapeHtml(summary)}</p>
        <div class="card-actions">
          <button class="button button-quiet" type="button" data-action="edit" data-id="${escapeHtml(item.id)}">Edita</button>
          <button class="button button-quiet" type="button" data-action="export" data-id="${escapeHtml(item.id)}">Descarrega JSON</button>
          <button class="button button-danger" type="button" data-action="delete" data-id="${escapeHtml(item.id)}">Elimina</button>
        </div>
      </article>`;
    }).join('');
  }

  function clearForm() {
    form.reset();
    document.getElementById('subject').value = 'Matemàtiques';
    document.getElementById('edit-id').value = '';
    document.getElementById('form-title').textContent = 'Nova situació d’aprenentatge';
    document.getElementById('save-button').textContent = 'Desa la situació';
    document.getElementById('cancel-edit').hidden = true;
  }

  function downloadJson(value, filename) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function safeFilename(title) {
    return (title || 'situacio-aprenentatge')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'situacio-aprenentatge';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const editId = document.getElementById('edit-id').value;
    const existing = situations.find(item => item.id === editId);
    const item = Object.fromEntries(fields.map(field => [field, document.getElementById(field).value.trim()]));
    item.id = existing ? existing.id : (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
    item.createdAt = existing ? existing.createdAt : new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    if (existing) situations = situations.map(entry => entry.id === editId ? item : entry);
    else situations.unshift(item);
    if (saveStored()) {
      render();
      clearForm();
      status.textContent = existing ? 'Situació actualitzada correctament.' : 'Situació desada correctament en aquest navegador.';
    }
  });

  document.getElementById('cancel-edit').addEventListener('click', () => {
    clearForm();
    status.textContent = 'Edició cancel·lada.';
  });

  document.getElementById('example-button').addEventListener('click', () => {
    const example = {
      title: 'Un pati més sostenible', course: '2n d’ESO', duration: '6 sessions de 55 minuts',
      subject: 'Matemàtiques', area: 'Ciències i Tecnologia',
      context: 'L’institut vol millorar el pati i reduir el consum d’aigua. L’alumnat analitzarà dades de l’espai i les necessitats de la comunitat educativa.',
      challenge: 'Com podem redissenyar una zona del pati perquè sigui més sostenible, accessible i agradable sense superar el pressupost?',
      product: 'Plànol a escala i presentació d’una proposta amb pressupost, càlculs justificats i estimació de l’estalvi d’aigua.',
      competencies: 'Resoldre problemes en contextos diversos utilitzant estratègies i representacions matemàtiques.\nComunicar raonaments i resultats amb llenguatge matemàtic.',
      criteria: 'Fa servir escales i mesures adequades per representar l’espai.\nCalcula i compara costos i percentatges de manera raonada.\nJustifica les decisions amb dades i comunica la proposta amb claredat.',
      knowledge: 'Escales i proporcionalitat.\nÀrees i perímetres de figures planes.\nOperacions amb nombres decimals i percentatges.\nTaules i representació de dades.',
      objectives: 'Representar un espai real a escala.\nResoldre situacions de pressupost amb nombres decimals i percentatges.\nArgumentar una proposta a partir de dades.',
      sessions: 'Sessió 1: presentació del repte, pluja d’idees i visita al pati.\nSessió 2: presa de mesures i elaboració d’un croquis.\nSessió 3: dibuix del plànol a escala i càlcul de superfícies.\nSessió 4: consulta de preus, pressupost i comparació d’alternatives.\nSessió 5: preparació de la proposta i revisió entre iguals.\nSessió 6: presentacions i autoavaluació.',
      methodology: 'Aprenentatge basat en projectes i treball cooperatiu en grups heterogenis de 3 o 4. Rols rotatius i revisió entre iguals.',
      inclusion: 'Proporcionar plantilles de plànol, vocabulari visual i exemples resolts. Oferir opcions per presentar la proposta oralment, per escrit o amb suport visual.',
      assessment: 'Llista de control del procés, rúbrica del producte final, coavaluació entre grups i autoavaluació individual.',
      resources: 'Cinta mètrica, paper quadriculat, calculadora, dispositiu amb full de càlcul i catàlegs de preus.'
    };
    fields.forEach(field => { document.getElementById(field).value = example[field] || ''; });
    document.getElementById('edit-id').value = '';
    document.getElementById('form-title').textContent = 'Nova situació d’aprenentatge';
    document.getElementById('save-button').textContent = 'Desa la situació';
    document.getElementById('cancel-edit').hidden = true;
    status.textContent = 'Exemple carregat. Pots modificar-lo abans de desar.';
    document.getElementById('title').focus();
  });

  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const item = situations.find(entry => entry.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === 'edit') {
      fields.forEach(field => { document.getElementById(field).value = item[field] || ''; });
      document.getElementById('edit-id').value = item.id;
      document.getElementById('form-title').textContent = 'Edita la situació d’aprenentatge';
      document.getElementById('save-button').textContent = 'Desa els canvis';
      document.getElementById('cancel-edit').hidden = false;
      document.getElementById('editor').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('title').focus({ preventScroll: true });
    } else if (button.dataset.action === 'export') {
      downloadJson(item, `${safeFilename(item.title)}.json`);
    } else if (button.dataset.action === 'delete' && window.confirm(`Vols eliminar «${item.title || 'Sense títol'}»?`)) {
      situations = situations.filter(entry => entry.id !== item.id);
      saveStored();
      render();
      status.textContent = 'Situació eliminada.';
    }
  });

  document.getElementById('export-all').addEventListener('click', () => {
    if (!situations.length) {
      status.textContent = 'No hi ha situacions per exportar.';
      return;
    }
    downloadJson(situations, 'les-meves-situacions-aprenentatge.json');
  });

  document.getElementById('import-button').addEventListener('click', () => document.getElementById('import-file').click());
  document.getElementById('import-file').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = Array.isArray(parsed) ? parsed : [parsed];
      const valid = imported.filter(item => item && typeof item === 'object' && !Array.isArray(item));
      if (!valid.length) throw new Error('El fitxer no conté cap situació vàlida.');
      const normalized = valid.map(item => ({
        ...Object.fromEntries(fields.map(field => [field, String(item[field] ?? '')])),
        id: String(item.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      const knownIds = new Set(situations.map(item => item.id));
      normalized.forEach(item => { if (knownIds.has(item.id)) item.id = `${item.id}-${Date.now()}`; });
      situations = [...normalized, ...situations];
      if (saveStored()) {
        render();
        status.textContent = `S’han importat ${normalized.length} situació/ns.`;
      }
    } catch (error) {
      status.textContent = `No s’ha pogut importar el fitxer: ${error.message}`;
    } finally {
      event.target.value = '';
    }
  });

  situations = readStored();
  render();
})();
