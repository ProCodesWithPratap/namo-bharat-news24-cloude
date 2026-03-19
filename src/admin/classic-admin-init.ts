// @ts-nocheck
export function initClassicAdminPanel() {
  const API = {
    login: '/api/users/login',
    me: '/api/users/me',
    articles: '/api/articles',
    categories: '/api/categories',
    authors: '/api/authors',
    media: '/api/media',
    siteSettings: '/api/globals/site-settings'
  };

  let currentConfig = null;
  let currentArticles = [];
  let currentCategories = [];
  let currentAuthors = [];
  let currentMedia = [];
  let editingArticleId = null;
  let previewEls = null;

  function toast(msg, isError = false) {
    const t = document.getElementById('toast-el');
    t.textContent = msg + (isError ? '' : ' ✓');
    t.style.background = isError ? 'var(--red)' : 'var(--green)';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

  async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

    const res = await fetch(path, { ...options, headers, credentials: 'include' });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_e) {}
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        redirectToLogin();
      }
      const message = data?.errors?.[0]?.message || data?.message || data?.error || ('HTTP ' + res.status);
      throw new Error(message);
    }
    return data;
  }

  function redirectToLogin() {
    window.location.href = '/payload-admin/login?redirect=/admin';
  }

  async function ensureAuth() {
    try {
      const data = await apiFetch(API.me, { method: 'GET' });
      if (!data?.user) throw new Error('Authentication required');
      return data.user;
    } catch (_error) {
      redirectToLogin();
      throw new Error('Authentication required');
    }
  }

  function hideAllPanels() {
    document.querySelectorAll('[id^=panel-]').forEach(p => p.style.display = 'none');
  }

  function hideAllPages() {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  }

  function clearSidebarActiveState() {
    document.querySelectorAll('.sidebar-body .edit-item').forEach(e => e.classList.remove('active'));
  }

  function showPanel(name, el) {
    hideAllPages();
    hideAllPanels();
    const target = document.getElementById('panel-' + name);
    if (target) target.style.display = 'block';
    clearSidebarActiveState();
    if (el) el.classList.add('active');
  }
  window.showPanel = showPanel;

  function showPage(name, el) {
    hideAllPanels();
    hideAllPages();
    const target = document.getElementById('page-' + name);
    if (target) target.style.display = 'block';
    clearSidebarActiveState();
    if (el) el.classList.add('active');
    if (name === 'articles') loadArticles();
    if (name === 'write') syncArticlePreview();
    if (name === 'media') renderMediaLibrary();
  }
  window.showPage = showPage;

  function switchSideTab(el, id) {
    document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    ['stab-design', 'stab-layout', 'stab-pages', 'stab-business'].forEach(tabId => {
      const node = document.getElementById(tabId);
      if (node) node.style.display = tabId === id ? 'block' : 'none';
    });
  }
  window.switchSideTab = switchSideTab;

  function panelInputs(panelId) {
    return Array.from(document.querySelectorAll('#' + panelId + ' input, #' + panelId + ' textarea, #' + panelId + ' select'));
  }

  function pageInputs(pageId) {
    return Array.from(document.querySelectorAll('#' + pageId + ' input, #' + pageId + ' textarea, #' + pageId + ' select'));
  }

  function isToggleOn(el) {
    return !!el && el.classList.contains('on');
  }

  function setToggle(el, on) {
    if (!el) return;
    el.classList.toggle('on', !!on);
  }

  function enableToggleClicks() {
    document.querySelectorAll('.toggle').forEach(toggle => {
      if (toggle.dataset.bound === '1') return;
      toggle.dataset.bound = '1';
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('on');
        renderPreview();
      });
    });
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeJs(text) {
    return String(text == null ? '' : text)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'");
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\u0900-\u097f-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || ('item-' + Date.now());
  }

  function lexicalFromText(text) {
    const paragraphs = String(text || '')
      .split(/\n{2,}/)
      .map(block => block.trim())
      .filter(Boolean)
      .map(block => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: block, version: 1 }],
        direction: 'ltr'
      }));

    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: paragraphs.length ? paragraphs : [{
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: '', version: 1 }],
          direction: 'ltr'
        }]
      }
    };
  }

  function textFromLexical(node) {
    if (!node || typeof node !== 'object') return '';
    const root = node.root || node;
    const children = Array.isArray(root.children) ? root.children : [];
    return children.map(child => {
      if (!Array.isArray(child.children)) return '';
      return child.children.map(grand => grand.text || '').join('');
    }).filter(Boolean).join('\n\n');
  }

  function getPreviewEls() {
    if (previewEls) return previewEls;
    const rightCol = document.querySelectorAll('.shell > div > div')[2] || document.querySelector('.shell > div:last-child');
    const box = rightCol ? rightCol.querySelector('div[style*="min-height:400px"]') : null;
    const header = box ? box.children[0] : null;
    const nav = box ? box.children[1] : null;
    const body = box ? box.children[2] : null;
    previewEls = { box, header, nav, body };
    return previewEls;
  }

  function gatherNavItems() {
    return Array.from(document.querySelectorAll('#nav-items .nav-menu-item')).map((row, index) => {
      const inputs = row.querySelectorAll('input');
      return {
        id: row.dataset.id || '',
        label: (inputs[0] && inputs[0].value || '').trim(),
        href: (inputs[1] && inputs[1].value || '').trim() || '/',
        enabled: isToggleOn(row.querySelector('.toggle')),
        navOrder: index + 1,
      };
    }).filter(item => item.label);
  }

  function renderNavItems(items) {
    const wrap = document.getElementById('nav-items');
    if (!wrap) return;
    wrap.innerHTML = '';
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'nav-menu-item';
      row.dataset.id = item.id || '';
      row.innerHTML = '<span class="drag-handle">⠿</span><input type="text" style="flex:1;border:none;outline:none;background:transparent"><input type="text" style="width:80px;font-size:11px"><div class="toggle"></div>';
      const inputs = row.querySelectorAll('input');
      inputs[0].value = item.label || '';
      inputs[1].value = item.href || '/';
      setToggle(row.querySelector('.toggle'), item.enabled !== false);
      wrap.appendChild(row);
    });
    enableToggleClicks();
    bindLiveInputs();
  }

  function addNavItem() {
    const items = gatherNavItems();
    items.push({ label: 'नई श्रेणी', href: '/new-category', enabled: true, navOrder: items.length + 1 });
    renderNavItems(items);
    renderPreview();
    toast('Nav item added');
  }
  window.addNavItem = addNavItem;


  function ensureSettingsFields() {
    const card = document.querySelector('#page-settings .card');
    if (!card || card.dataset.extraFields === '1') return;
    card.dataset.extraFields = '1';
    const fields = [
      { label: 'Contact Email', type: 'email', value: '' },
      { label: 'Editorial Email', type: 'email', value: '' },
      { label: 'Address', type: 'text', value: '' }
    ];
    fields.forEach(field => {
      const wrap = document.createElement('div');
      wrap.className = 'form-group';
      wrap.innerHTML = '<label>' + field.label + '</label><input type="' + field.type + '" value="' + field.value + '">';
      card.appendChild(wrap);
    });
  }

  function gatherConfigFromForm() {
    const logo = panelInputs('panel-logo');
    const colors = panelInputs('panel-colors');
    const header = panelInputs('panel-header');
    const social = Array.from(document.querySelectorAll('#panel-social-links .social-row'));
    const settings = pageInputs('page-settings');
    const navItems = gatherNavItems();
    const contactEmailInput = settings[3];
    const editorialEmailInput = settings[4];
    const addressInput = settings[5];

    return {
      site: {
        name: (settings[0] && settings[0].value) || (logo[0] && logo[0].value) || 'नमो: भारत न्यूज़ 24',
        tagline: (settings[1] && settings[1].value) || (logo[1] && logo[1].value) || 'तथ्य स्पष्ट, विचार निष्पक्ष।',
        phone: (settings[2] && settings[2].value) || (header[0] && header[0].value) || '',
        address: (addressInput && addressInput.value) || currentConfig?.site?.address || '',
        contactEmail: (contactEmailInput && contactEmailInput.value) || currentConfig?.site?.contactEmail || '',
        editorialEmail: (editorialEmailInput && editorialEmailInput.value) || currentConfig?.site?.editorialEmail || '',
        logoSize: Number((logo[3] && logo[3].value) || 32),
        menuItems: navItems.filter(x => x.enabled).map(x => x.label),
        menuMeta: navItems,
        logoInitials: (logo[2] && logo[2].value) || 'NB'
      },
      colors: {
        primary: (colors[1] && colors[1].value) || '#C0392B',
        navbar: (colors[3] && colors[3].value) || '#1a1a1a',
        header: (colors[5] && colors[5].value) || '#222222'
      },
      social: {
        facebook: social[0]?.querySelector('input')?.value || '',
        instagram: social[1]?.querySelector('input')?.value || '',
        youtube: social[2]?.querySelector('input')?.value || '',
        whatsapp: social[3]?.querySelector('input')?.value || '',
        x: social[4]?.querySelector('input')?.value || ''
      },
      updatedAt: new Date().toISOString()
    };
  }

  function populateForm(config) {
    if (!config) return;
    const logo = panelInputs('panel-logo');
    const colors = panelInputs('panel-colors');
    const header = panelInputs('panel-header');
    const settings = pageInputs('page-settings');
    const socialRows = Array.from(document.querySelectorAll('#panel-social-links .social-row'));

    if (logo[0]) logo[0].value = config.site?.name || logo[0].value;
    if (logo[1]) logo[1].value = config.site?.tagline || logo[1].value;
    if (logo[2]) logo[2].value = config.site?.logoInitials || logo[2].value;
    if (logo[3]) logo[3].value = config.site?.logoSize || logo[3].value;

    if (settings[0]) settings[0].value = config.site?.name || settings[0].value;
    if (settings[1]) settings[1].value = config.site?.tagline || settings[1].value;
    if (settings[2]) settings[2].value = config.site?.phone || settings[2].value;
    if (settings[3]) settings[3].value = config.site?.contactEmail || settings[3].value;
    if (settings[4]) settings[4].value = config.site?.editorialEmail || settings[4].value;
    if (settings[5]) settings[5].value = config.site?.address || settings[5].value;
    if (header[0]) header[0].value = config.site?.phone || header[0].value;

    if (colors[0]) colors[0].value = config.colors?.primary || colors[0].value;
    if (colors[1]) colors[1].value = config.colors?.primary || colors[1].value;
    if (colors[2]) colors[2].value = config.colors?.navbar || colors[2].value;
    if (colors[3]) colors[3].value = config.colors?.navbar || colors[3].value;
    if (colors[4]) colors[4].value = config.colors?.header || colors[4].value;
    if (colors[5]) colors[5].value = config.colors?.header || colors[5].value;

    const socialValues = [config.social?.facebook, config.social?.instagram, config.social?.youtube, config.social?.whatsapp, config.social?.x];
    socialRows.forEach((row, index) => {
      const input = row.querySelector('input');
      if (input && socialValues[index] !== undefined) input.value = socialValues[index] || '';
    });

    currentConfig = config;
    renderPreview();
  }

  function renderPreview() {
    const preview = getPreviewEls();
    const cfg = gatherConfigFromForm();
    currentConfig = cfg;
    if (preview.header) {
      preview.header.textContent = cfg.site.name || 'नमो: भारत न्यूज़ 24';
      preview.header.style.background = cfg.colors.primary || '#C0392B';
    }
    if (preview.nav) {
      preview.nav.style.background = cfg.colors.navbar || '#1a1a1a';
      const items = cfg.site.menuItems && cfg.site.menuItems.length ? cfg.site.menuItems : ['होम', 'राष्ट्रीय', 'राज्य'];
      preview.nav.innerHTML = items.slice(0, 6).map(label => '<span style="color:#ccc;font-size:10px">' + escapeHtml(label) + '</span>').join('');
      preview.nav.style.display = 'flex';
      preview.nav.style.gap = '12px';
    }
    if (preview.body) {
      preview.body.innerHTML = '<div style="font-size:12px;color:#666">' + escapeHtml(cfg.site.tagline || 'Preview updates in real-time') + '</div>';
    }
    document.documentElement.style.setProperty('--red', cfg.colors.primary || '#C0392B');
    document.documentElement.style.setProperty('--red2', cfg.colors.primary || '#a93226');
  }

  function getArticleForm() {
    const inputs = pageInputs('page-write');
    return {
      title: inputs[0],
      category: inputs[1],
      author: inputs[2],
      content: inputs[3]
    };
  }

  function syncArticlePreview() {
    const form = getArticleForm();
    const previewCard = document.querySelector('#page-write .two .card:last-child');
    if (!previewCard) return;
    const categoryLabel = form.category.options[form.category.selectedIndex]?.text || 'राष्ट्रीय';
    const authorLabel = form.author.options[form.author.selectedIndex]?.text || 'AI News Desk';
    previewCard.innerHTML = '<div class="ct">Article Preview</div><div style="font-size:18px;font-weight:700;margin:12px 0 8px">' + escapeHtml(form.title.value || 'खबर का शीर्षक...') + '</div><div style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">' + escapeHtml(categoryLabel) + ' • ' + escapeHtml(authorLabel) + '</div><div style="font-size:13px;line-height:1.6;color:var(--text-primary);white-space:pre-wrap">' + escapeHtml((form.content.value || 'Article content preview...').slice(0, 900)) + '</div>';
  }

  function resetArticleForm() {
    const form = getArticleForm();
    form.title.value = '';
    if (form.category.options.length) form.category.selectedIndex = 0;
    if (form.author.options.length) form.author.selectedIndex = 0;
    form.content.value = '';
    editingArticleId = null;
    syncArticlePreview();
  }

  function mapArticleForTable(item) {
    return {
      id: item.id,
      title: item.headlineHindi || item.headline || '',
      category: item.category?.nameHindi || item.category?.name || '',
      author: Array.isArray(item.author) ? (item.author[0]?.nameHindi || item.author[0]?.name || '') : '',
      content: textFromLexical(item.body),
      status: item.status || 'draft',
      views: item.views || 0,
      publishDate: item.publishDate || item.updatedAt || item.createdAt || ''
    };
  }

  function renderArticlesList(items) {
    const table = document.querySelector('#page-articles .tbl');
    if (!table) return;
    const rows = (items || []).map(raw => {
      const item = mapArticleForTable(raw);
      const statusClass = item.status === 'published' ? 'b-green' : (item.status === 'draft' ? 'b-gray' : 'b-orange');
      return '<tr>' +
        '<td>' + escapeHtml(item.title || '') + '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">' +
        '<button class="btn" style="font-size:10px;padding:3px 8px" onclick="editArticle(\'' + escapeJs(item.id) + '\')">Edit</button>' +
        '<button class="btn btn-green" style="font-size:10px;padding:3px 8px" onclick="publishExistingArticle(\'' + escapeJs(item.id) + '\')">Publish</button>' +
        '<button class="btn" style="font-size:10px;padding:3px 8px" onclick="deleteArticle(\'' + escapeJs(item.id) + '\')">Delete</button>' +
        '</div></td>' +
        '<td>' + escapeHtml(item.category || '') + '</td>' +
        '<td>' + escapeHtml(String(item.views || 0)) + '</td>' +
        '<td><span class="badge ' + statusClass + '">' + escapeHtml(item.status || 'draft') + '</span></td>' +
        '</tr>';
    }).join('');
    table.innerHTML = '<tr><th>Title</th><th>Category</th><th>Views</th><th>Status</th></tr>' + (rows || '<tr><td colspan="4" style="text-align:center;color:var(--text-secondary);padding:20px">No articles yet</td></tr>');
  }

  function fillSelect(select, items, placeholder) {
    if (!select) return;
    select.innerHTML = '';
    if (placeholder) {
      const empty = document.createElement('option');
      empty.textContent = placeholder;
      empty.value = '';
      select.appendChild(empty);
    }
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.label;
      select.appendChild(option);
    });
  }

  async function loadReferenceData() {
    const [categoriesRes, authorsRes, settingsRes] = await Promise.all([
      apiFetch(API.categories + '?limit=100&sort=navOrder&depth=0'),
      apiFetch(API.authors + '?limit=100&sort=name&depth=0'),
      apiFetch(API.siteSettings + '?depth=0')
    ]);

    currentCategories = (categoriesRes.docs || []).map(item => ({
      id: item.id,
      label: item.nameHindi || item.name || item.slug,
      name: item.name || item.slug,
      nameHindi: item.nameHindi || item.name || item.slug,
      slug: item.slug,
      navOrder: item.navOrder || 99,
      showInNav: item.showInNav !== false
    }));

    currentAuthors = (authorsRes.docs || []).map(item => ({
      id: item.id,
      label: item.nameHindi || item.name,
      name: item.name,
      nameHindi: item.nameHindi || item.name
    }));

    const articleForm = getArticleForm();
    fillSelect(articleForm.category, currentCategories.map(item => ({ id: item.id, label: item.label })), 'Select category');
    fillSelect(articleForm.author, currentAuthors.map(item => ({ id: item.id, label: item.label })), 'Select author');

    const navItems = currentCategories.filter(item => item.showInNav).sort((a, b) => a.navOrder - b.navOrder).map(item => ({
      id: item.id,
      label: item.nameHindi || item.name,
      href: '/' + item.slug,
      enabled: true,
      navOrder: item.navOrder
    }));
    renderNavItems(navItems);

    populateForm({
      site: {
        name: settingsRes.siteName || 'नमो: भारत न्यूज़ 24',
        tagline: settingsRes.tagline || 'तथ्य स्पष्ट, विचार निष्पक्ष।',
        phone: settingsRes.phone || '',
        address: settingsRes.address || '',
        contactEmail: settingsRes.contactEmail || '',
        editorialEmail: settingsRes.editorialEmail || '',
        menuMeta: navItems,
      },
      social: settingsRes.social || {},
      colors: currentConfig?.colors || { primary: '#C0392B', navbar: '#1a1a1a', header: '#222222' }
    });
  }

  async function loadArticles() {
    try {
      const data = await apiFetch(API.articles + '?limit=100&sort=-updatedAt&depth=2');
      currentArticles = data.docs || [];
      renderArticlesList(currentArticles);
    } catch (error) {
      toast(error.message || 'Articles load failed', true);
    }
  }

  async function saveArticle(status = 'published') {
    const form = getArticleForm();
    const payload = {
      headline: form.title.value.trim(),
      headlineHindi: form.title.value.trim(),
      slug: slugify(form.title.value),
      excerpt: form.content.value.trim().slice(0, 180),
      body: lexicalFromText(form.content.value.trim()),
      category: form.category.value,
      author: form.author.value ? [form.author.value] : [],
      status,
      ...(status === 'published' ? { publishDate: new Date().toISOString() } : {})
    };

    if (!payload.headline || !form.content.value.trim() || !payload.category) {
      toast('Headline, category and body required', true);
      return;
    }

    try {
      await ensureAuth();
      if (editingArticleId) {
        await apiFetch(API.articles + '/' + editingArticleId, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiFetch(API.articles, { method: 'POST', body: JSON.stringify(payload) });
      }
      toast('Article saved to server');
      resetArticleForm();
      await loadArticles();
      showPage('articles');
    } catch (error) {
      toast(error.message || 'Article save failed', true);
    }
  }

  async function editArticle(id) {
    const item = currentArticles.find(x => x.id === id);
    if (!item) return toast('Article not found', true);
    const form = getArticleForm();
    form.title.value = item.headlineHindi || item.headline || '';
    form.category.value = typeof item.category === 'object' ? (item.category?.id || '') : (item.category || '');
    const firstAuthor = Array.isArray(item.author) ? item.author[0] : null;
    form.author.value = firstAuthor?.id || '';
    form.content.value = textFromLexical(item.body);
    editingArticleId = id;
    syncArticlePreview();
    showPage('write');
  }
  window.editArticle = editArticle;

  async function publishExistingArticle(id) {
    try {
      await ensureAuth();
      await apiFetch(API.articles + '/' + id, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'published', publishDate: new Date().toISOString() })
      });
      toast('Article published');
      await loadArticles();
    } catch (error) {
      toast(error.message || 'Publish failed', true);
    }
  }
  window.publishExistingArticle = publishExistingArticle;

  async function deleteArticle(id) {
    if (!confirm('Delete this article?')) return;
    try {
      await ensureAuth();
      await apiFetch(API.articles + '/' + id, { method: 'DELETE' });
      toast('Article deleted');
      await loadArticles();
    } catch (error) {
      toast(error.message || 'Delete failed', true);
    }
  }
  window.deleteArticle = deleteArticle;

  async function persistNavigation() {
    const navItems = gatherNavItems();
    await ensureAuth();

    const existingById = new Map(currentCategories.map(item => [item.id, item]));
    const keptIds = new Set();

    for (const [index, item] of navItems.entries()) {
      const slug = slugify(item.href.replace(/^\//, '') || item.label);
      const data = {
        name: existingById.get(item.id)?.name || item.label,
        nameHindi: item.label,
        slug,
        showInNav: item.enabled,
        navOrder: index + 1
      };

      if (item.id && existingById.has(item.id)) {
        await apiFetch(API.categories + '/' + item.id, { method: 'PATCH', body: JSON.stringify(data) });
        keptIds.add(item.id);
      } else {
        const created = await apiFetch(API.categories, { method: 'POST', body: JSON.stringify(data) });
        if (created?.doc?.id) keptIds.add(created.doc.id);
      }
    }

    const hiddenCategories = currentCategories.filter(item => item.showInNav && item.id && !keptIds.has(item.id));
    for (const item of hiddenCategories) {
      await apiFetch(API.categories + '/' + item.id, { method: 'PATCH', body: JSON.stringify({ showInNav: false }) });
    }
  }

  async function publishChanges() {
    const config = gatherConfigFromForm();
    try {
      await ensureAuth();
      await apiFetch(API.siteSettings, {
        method: 'PATCH',
        body: JSON.stringify({
          siteName: config.site.name,
          tagline: config.site.tagline,
          phone: config.site.phone,
          address: config.site.address,
          contactEmail: config.site.contactEmail,
          editorialEmail: config.site.editorialEmail,
          social: config.social
        })
      });
      await persistNavigation();
      currentConfig = config;
      await loadReferenceData();
      renderPreview();
      toast('Settings and navigation published');
    } catch (error) {
      toast(error.message || 'Publish failed', true);
    }
  }
  window.publishChanges = publishChanges;

  async function exportConfig() {
    const payload = {
      config: gatherConfigFromForm(),
      articles: currentArticles.map(mapArticleForTable),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'namo-bharat-admin-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Exported');
  }
  window.exportConfig = exportConfig;

  function resetAll() {
    if (!confirm('Clear saved login session?')) return;
    window.location.href = '/admin/logout';
  }
  window.resetAll = resetAll;

  function bindLiveInputs() {
    document.querySelectorAll('input, textarea, select').forEach(el => {
      if (el.dataset.bound === '1') return;
      el.dataset.bound = '1';
      el.addEventListener('input', () => {
        renderPreview();
        syncArticlePreview();
      });
      el.addEventListener('change', () => {
        renderPreview();
        syncArticlePreview();
      });
    });
  }

  function setupMediaUI() {
    const page = document.getElementById('page-media');
    if (!page || page.dataset.ready === '1') return;
    page.dataset.ready = '1';
    const card = page.querySelector('.card');
    const list = document.createElement('div');
    list.id = 'media-list';
    list.style.marginTop = '16px';
    card.appendChild(list);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/mp4,video/webm';
    input.style.display = 'none';
    page.appendChild(input);
    const zone = page.querySelector('.upload-zone');
    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const alt = prompt('Alt text for this media') || file.name;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', alt);
      try {
        await ensureAuth();
        await apiFetch(API.media, { method: 'POST', body: formData, headers: {} });
        toast('Media uploaded');
        input.value = '';
        await renderMediaLibrary();
      } catch (error) {
        toast(error.message || 'Upload failed', true);
      }
    });
  }

  async function renderMediaLibrary() {
    setupMediaUI();
    const list = document.getElementById('media-list');
    if (!list) return;
    list.innerHTML = '<div style="font-size:12px;color:var(--text-secondary)">Loading media…</div>';
    try {
      const data = await apiFetch(API.media + '?limit=24&sort=-updatedAt&depth=0');
      currentMedia = data.docs || [];
      if (!currentMedia.length) {
        list.innerHTML = '<div style="font-size:12px;color:var(--text-secondary)">No media uploaded yet.</div>';
        return;
      }
      list.innerHTML = '<div class="ct">Recent Uploads</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">' + currentMedia.map(item => {
        const url = item.url || item.thumbnailURL || item.filename || '';
        return '<div style="border:1px solid var(--border-light);border-radius:8px;padding:10px;background:#fff">' +
          (url ? '<div style="height:90px;background:#f5f6fa;border-radius:6px;overflow:hidden;margin-bottom:8px;display:flex;align-items:center;justify-content:center"><img src="' + escapeHtml(url) + '" alt="' + escapeHtml(item.alt || item.filename || 'media') + '" style="max-width:100%;max-height:100%;object-fit:cover"></div>' : '') +
          '<div style="font-size:11px;font-weight:600;line-height:1.4">' + escapeHtml(item.alt || item.filename || 'Untitled media') + '</div>' +
          '<div style="font-size:10px;color:var(--text-secondary);margin-top:4px">' + escapeHtml(item.filename || '') + '</div>' +
          '</div>';
      }).join('') + '</div>';
    } catch (error) {
      list.innerHTML = '<div style="font-size:12px;color:var(--red)">' + escapeHtml(error.message || 'Media load failed') + '</div>';
    }
  }

  function wireButtons() {
    const topbarBtns = document.querySelectorAll('.topbar-right .btn');
    if (topbarBtns[1]) topbarBtns[1].setAttribute('title', 'Export current config and articles');

    const newArticleBtn = document.querySelector('#page-articles .page-header .btn-red');
    if (newArticleBtn) newArticleBtn.addEventListener('click', () => {
      resetArticleForm();
      showPage('write');
    });

    const publishArticleBtn = document.querySelector('#page-write .page-header .btn-red');
    if (publishArticleBtn) publishArticleBtn.addEventListener('click', () => saveArticle('published'));

    const aiGenerateBtn = document.querySelector('#page-ai-writer .ai-body .btn-red');
    if (aiGenerateBtn) aiGenerateBtn.addEventListener('click', () => {
      const topic = document.querySelector('#page-ai-writer input[type="text"]')?.value?.trim() || 'आज की मुख्य खबर';
      const out = document.getElementById('ai-out');
      out.style.display = 'block';
      out.textContent = topic + ' पर ड्राफ्ट:\n\n' + topic + ' को लेकर ताज़ा गतिविधि तेज़ है। प्रशासन, स्थानीय लोग और संबंधित पक्ष इस मुद्दे पर अपनी प्रतिक्रिया दे रहे हैं। प्रारंभिक जानकारी के मुताबिक स्थिति पर लगातार नजर रखी जा रही है और आगे आधिकारिक अपडेट आने की उम्मीद है।';
      toast('AI draft generated');
    });
  }

  async function init() {
    ensureSettingsFields();
    enableToggleClicks();
    bindLiveInputs();
    wireButtons();
    setupMediaUI();
    showPanel('logo', document.querySelector('.edit-item.active'));
    renderPreview();
    syncArticlePreview();
    try {
      await loadReferenceData();
      await loadArticles();
      await renderMediaLibrary();
    } catch (error) {
      toast(error.message || 'Admin bootstrap failed', true);
    }
  }

  init();
}
