// @ts-nocheck
export function initClassicAdminPanel() {
  const API = {
    me: '/api/users/me',
    logout: '/api/users/logout',
    articles: '/api/articles',
    categories: '/api/categories',
    media: '/api/media',
    siteSettings: '/api/globals/site-settings'
  };

  let currentConfig = null;
  let currentArticles = [];
  let currentCategories = [];
  let currentMedia = [];
  let editingArticleId = null;
  let selectedHeroMedia = null;
  let articleSlugTouched = false;

  function toast(msg, isError = false) {
    const t = document.getElementById('toast-el');
    if (!t) return;
    t.textContent = msg + (isError ? '' : ' ✓');
    t.style.background = isError ? 'var(--red)' : 'var(--green)';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

  async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (!(options.body instanceof FormData) && options.body != null && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const res = await fetch(path, { ...options, headers, credentials: 'include' });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_e) {}
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) redirectToLogin();
      throw new Error(data?.errors?.[0]?.message || data?.message || data?.error || ('HTTP ' + res.status));
    }
    return data;
  }

  function redirectToLogin() {
    window.location.href = '/payload-admin/login?redirect=/admin';
  }

  async function ensureAuth() {
    const data = await apiFetch(API.me, { method: 'GET' });
    if (!data?.user) {
      redirectToLogin();
      throw new Error('Authentication required');
    }
    return data.user;
  }

  function hideAllPanels() { document.querySelectorAll('[id^=panel-]').forEach((p) => p.style.display = 'none'); }
  function hideAllPages() { document.querySelectorAll('.page').forEach((p) => p.style.display = 'none'); }
  function clearSidebarActiveState() { document.querySelectorAll('.sidebar-body .edit-item').forEach((e) => e.classList.remove('active')); }
  function closeMobileSidebar() { document.querySelector('.shell')?.classList.remove('sidebar-open'); }

  function showPanel(name, el) {
    hideAllPages(); hideAllPanels();
    const target = document.getElementById('panel-' + name);
    if (target) target.style.display = 'block';
    clearSidebarActiveState();
    if (el) el.classList.add('active');
    closeMobileSidebar();
  }
  window.showPanel = showPanel;

  function showPage(name, el) {
    hideAllPanels(); hideAllPages();
    const target = document.getElementById('page-' + name);
    if (target) target.style.display = 'block';
    clearSidebarActiveState();
    if (el) el.classList.add('active');
    if (name === 'articles') loadArticles();
    if (name === 'dashboard') renderDashboard();
    if (name === 'categories') renderCategories();
    if (name === 'media') renderMediaLibrary();
    if (name === 'write') syncArticlePreview();
    closeMobileSidebar();
  }
  window.showPage = showPage;

  function switchSideTab(el, id) {
    document.querySelectorAll('.stab').forEach((t) => t.classList.remove('active'));
    el.classList.add('active');
    ['stab-design', 'stab-layout', 'stab-pages', 'stab-business'].forEach((tabId) => {
      const node = document.getElementById(tabId);
      if (node) node.style.display = tabId === id ? 'block' : 'none';
    });
  }
  window.switchSideTab = switchSideTab;

  function isToggleOn(el) { return !!el && el.classList.contains('on'); }
  function setToggle(el, on) { if (el) el.classList.toggle('on', !!on); }
  function escapeHtml(text) { return String(text == null ? '' : text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function escapeJs(text) { return String(text == null ? '' : text).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }
  function slugify(value) { return String(value || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\u0900-\u097f-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') || ('item-' + Date.now()); }
  function formatDateDisplay(value) { if (!value) return '—'; try { return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return value; } }
  function toDateTimeLocal(value) { if (!value) return ''; const d = new Date(value); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); }
  function fromDateTimeLocal(value) { return value ? new Date(value).toISOString() : undefined; }
  function lexicalFromText(text) {
    const blocks = String(text || '').split(/\n{2,}/).map((block) => block.trim()).filter(Boolean).map((block) => ({ type: 'paragraph', format: '', indent: 0, version: 1, children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: block, version: 1 }], direction: 'ltr' }));
    return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: blocks.length ? blocks : [{ type: 'paragraph', format: '', indent: 0, version: 1, children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: '', version: 1 }], direction: 'ltr' }] } };
  }
  function textFromLexical(node) { const root = node?.root || node; return Array.isArray(root?.children) ? root.children.map((child) => Array.isArray(child.children) ? child.children.map((grand) => grand.text || '').join('') : '').filter(Boolean).join('\n\n') : ''; }

  function getArticleForm() {
    return {
      headlineHindi: document.getElementById('article-headline-hindi'),
      headlineEnglish: document.getElementById('article-headline-english'),
      slug: document.getElementById('article-slug'),
      category: document.getElementById('article-category'),
      excerpt: document.getElementById('article-excerpt'),
      body: document.getElementById('article-body'),
      status: document.getElementById('article-status'),
      publishDate: document.getElementById('article-publish-date'),
      featured: document.getElementById('article-featured-toggle'),
      breakingNews: document.getElementById('article-breaking-toggle'),
      heroMeta: document.getElementById('hero-upload-meta'),
      heroInput: document.getElementById('hero-upload-input'),
      preview: document.getElementById('article-live-preview')
    };
  }

  function getCategoryForm() {
    return {
      nameHindi: document.getElementById('category-name-hindi'),
      nameEnglish: document.getElementById('category-name-english'),
      slug: document.getElementById('category-slug')
    };
  }

  function renderPreview() {
    const header = document.getElementById('preview-header');
    const nav = document.getElementById('preview-nav');
    const body = document.getElementById('preview-body');
    if (header) header.textContent = currentConfig?.site?.name || 'नमो: भारत न्यूज़ 24';
    if (nav) nav.innerHTML = currentCategories.slice(0, 6).map((item) => '<span style="color:#ccc;font-size:10px">' + escapeHtml(item.nameHindi || item.name) + '</span>').join('');
    if (body) body.textContent = currentConfig?.site?.tagline || 'Preview updates in real-time';
  }

  function syncArticlePreview() {
    const form = getArticleForm();
    if (!form.preview) return;
    const categoryLabel = form.category?.options?.[form.category.selectedIndex]?.text || 'राष्ट्रीय';
    const imageUrl = selectedHeroMedia?.url || selectedHeroMedia?.thumbnailURL || '';
    const body = escapeHtml(form.body?.value || '').replace(/\n/g, '<br/>');
    form.preview.srcdoc = `<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1" /><style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:0;background:#f5f5f5;color:#111}header{background:#c0392b;color:#fff;padding:14px 18px;text-align:center;font-weight:700}.wrap{max-width:760px;margin:0 auto;background:#fff;min-height:100vh;padding:20px}.badge{display:inline-block;background:#fde8e8;color:#c0392b;padding:4px 8px;border-radius:999px;font-size:12px;font-weight:700;margin-right:8px}h1{font-size:32px;line-height:1.2;margin:14px 0}p.meta{color:#666;font-size:14px}img{width:100%;border-radius:12px;margin:18px 0}.excerpt{font-size:18px;color:#333;margin-bottom:16px}.body{font-size:17px;line-height:1.8;white-space:normal}</style></head><body><header>नमो: भारत न्यूज़ 24</header><div class="wrap"><div><span class="badge">${escapeHtml(categoryLabel)}</span>${isToggleOn(form.breakingNews) ? '<span class="badge">ब्रेकिंग</span>' : ''}${isToggleOn(form.featured) ? '<span class="badge">टॉप न्यूज़</span>' : ''}</div><h1>${escapeHtml(form.headlineHindi?.value || 'खबर का शीर्षक...')}</h1><p class="meta">${escapeHtml(form.headlineEnglish?.value || '')}</p>${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="preview image" />` : ''}<div class="excerpt">${escapeHtml(form.excerpt?.value || '')}</div><div class="body">${body || 'लेख का लाइव प्रीव्यू यहां दिखाई देगा।'}</div></div></body></html>`;
  }

  function fillSelect(select, items, placeholder) {
    if (!select) return;
    select.innerHTML = '';
    if (placeholder) {
      const empty = document.createElement('option');
      empty.value = '';
      empty.textContent = placeholder;
      select.appendChild(empty);
    }
    items.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.label;
      select.appendChild(option);
    });
  }

  function enableToggleClicks() {
    document.querySelectorAll('.toggle').forEach((toggle) => {
      if (toggle.dataset.bound === '1') return;
      toggle.dataset.bound = '1';
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('on');
        syncArticlePreview();
      });
    });
  }

  function bindLiveInputs() {
    const form = getArticleForm();
    [form.headlineHindi, form.headlineEnglish, form.slug, form.category, form.excerpt, form.body, form.status, form.publishDate].forEach((el) => {
      if (!el || el.dataset.bound === '1') return;
      el.dataset.bound = '1';
      el.addEventListener('input', () => {
        if (el === form.headlineHindi && !articleSlugTouched) form.slug.value = slugify(form.headlineHindi.value);
        syncArticlePreview();
      });
      el.addEventListener('change', syncArticlePreview);
    });
    form.slug?.addEventListener('input', () => { articleSlugTouched = true; });

    const categoryForm = getCategoryForm();
    categoryForm.nameHindi?.addEventListener('input', () => {
      if (!categoryForm.slug.dataset.touched) categoryForm.slug.value = slugify(categoryForm.nameHindi.value);
    });
    categoryForm.slug?.addEventListener('input', () => { categoryForm.slug.dataset.touched = '1'; });
  }

  function resetArticleForm() {
    const form = getArticleForm();
    editingArticleId = null;
    selectedHeroMedia = null;
    articleSlugTouched = false;
    form.headlineHindi.value = '';
    form.headlineEnglish.value = '';
    form.slug.value = '';
    form.category.value = '';
    form.excerpt.value = '';
    form.body.value = '';
    form.status.value = 'draft';
    form.publishDate.value = '';
    setToggle(form.featured, false);
    setToggle(form.breakingNews, false);
    if (form.heroInput) form.heroInput.value = '';
    if (form.heroMeta) form.heroMeta.textContent = 'No image selected';
    syncArticlePreview();
  }

  function mapArticleForTable(item) {
    return {
      id: item.id,
      title: item.headlineHindi || item.headline || 'Untitled',
      category: item.category?.nameHindi || item.category?.name || '—',
      updatedAt: item.updatedAt || item.publishDate || item.createdAt,
      status: item.status || 'draft'
    };
  }

  function renderArticlesList(items) {
    const table = document.querySelector('#page-articles .tbl');
    if (!table) return;
    const rows = (items || []).map((raw) => {
      const item = mapArticleForTable(raw);
      const nextStatus = item.status === 'published' ? 'draft' : 'published';
      const toggleText = item.status === 'published' ? 'Unpublish' : 'Publish';
      const statusClass = item.status === 'published' ? 'b-green' : 'b-gray';
      return '<tr>' +
        '<td><div style="font-weight:600;white-space:normal">' + escapeHtml(item.title) + '</div></td>' +
        '<td>' + escapeHtml(item.category) + '</td>' +
        '<td>' + escapeHtml(formatDateDisplay(item.updatedAt)) + '</td>' +
        '<td><span class="badge ' + statusClass + '">' + escapeHtml(item.status) + '</span></td>' +
        '<td><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn" onclick="editArticle(\'' + escapeJs(item.id) + '\')">Edit</button><button class="btn btn-green" onclick="toggleArticleStatus(\'' + escapeJs(item.id) + '\',\'' + nextStatus + '\')">' + toggleText + '</button><button class="btn" onclick="deleteArticle(\'' + escapeJs(item.id) + '\')">Delete</button></div></td>' +
        '</tr>';
    }).join('');
    table.innerHTML = '<tr><th>Title</th><th>Category</th><th>Updated</th><th>Status</th><th>Actions</th></tr>' + (rows || '<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);padding:20px">No articles found</td></tr>');
  }

  function renderDashboard() {
    document.getElementById('dashboard-total-articles').textContent = String(currentArticles.length);
    document.getElementById('dashboard-published-articles').textContent = String(currentArticles.filter((item) => item.status === 'published').length);
    document.getElementById('dashboard-draft-articles').textContent = String(currentArticles.filter((item) => item.status !== 'published').length);
    document.getElementById('dashboard-categories-count').textContent = String(currentCategories.length);
    const table = document.getElementById('dashboard-recent-table');
    if (table) {
      const rows = currentArticles.slice(0, 6).map((item) => '<tr><td style="white-space:normal">' + escapeHtml(item.headlineHindi || item.headline || 'Untitled') + '</td><td>' + escapeHtml(item.category?.nameHindi || item.category?.name || '—') + '</td><td>' + escapeHtml(item.status || 'draft') + '</td><td>' + escapeHtml(formatDateDisplay(item.updatedAt || item.publishDate)) + '</td></tr>').join('');
      table.innerHTML = '<tr><th>Headline</th><th>Category</th><th>Status</th><th>Updated</th></tr>' + (rows || '<tr><td colspan="4">No article data available</td></tr>');
    }
  }

  function renderCategories() {
    const table = document.getElementById('category-list-table');
    if (!table) return;
    table.innerHTML = '<tr><th>Name</th><th>Slug</th><th>Nav</th></tr>' + (currentCategories.map((item) => '<tr><td>' + escapeHtml(item.nameHindi || item.name) + '</td><td>' + escapeHtml(item.slug) + '</td><td>' + (item.showInNav ? 'Yes' : 'No') + '</td></tr>').join('') || '<tr><td colspan="3">No categories found</td></tr>');
  }

  async function loadReferenceData() {
    const [categoriesRes, settingsRes] = await Promise.all([
      apiFetch(API.categories + '?limit=100&sort=navOrder&depth=0'),
      apiFetch(API.siteSettings + '?depth=0')
    ]);
    currentCategories = (categoriesRes.docs || []).map((item) => ({ id: item.id, label: item.nameHindi || item.name || item.slug, name: item.name || item.slug, nameHindi: item.nameHindi || item.name || item.slug, slug: item.slug, navOrder: item.navOrder || 99, showInNav: item.showInNav !== false }));
    currentConfig = { site: { name: settingsRes.siteName || 'नमो: भारत न्यूज़ 24', tagline: settingsRes.tagline || 'तथ्य स्पष्ट, विचार निष्पक्ष।' } };
    fillSelect(getArticleForm().category, currentCategories.map((item) => ({ id: item.id, label: item.label })), 'Select category');
    renderCategories();
    renderPreview();
  }

  async function loadArticles() {
    const data = await apiFetch(API.articles + '?limit=100&sort=-updatedAt&depth=2');
    currentArticles = data.docs || [];
    renderArticlesList(currentArticles);
    renderDashboard();
  }

  async function uploadHeroImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', getArticleForm().headlineHindi.value || file.name);
    const created = await apiFetch(API.media, { method: 'POST', body: formData, headers: {} });
    return created?.doc || created;
  }

  async function saveArticle(forcedStatus) {
    const form = getArticleForm();
    const status = forcedStatus || form.status.value || 'draft';
    const publishDate = form.publishDate.value ? fromDateTimeLocal(form.publishDate.value) : (status === 'published' ? new Date().toISOString() : undefined);
    const payload = {
      headlineHindi: form.headlineHindi.value.trim(),
      headline: form.headlineEnglish.value.trim() || form.headlineHindi.value.trim(),
      slug: (form.slug.value || slugify(form.headlineHindi.value)).trim(),
      category: form.category.value,
      excerpt: form.excerpt.value.trim(),
      body: lexicalFromText(form.body.value.trim()),
      featured: isToggleOn(form.featured),
      breakingNews: isToggleOn(form.breakingNews),
      status,
      ...(publishDate ? { publishDate } : {}),
      ...(selectedHeroMedia?.id ? { heroMedia: selectedHeroMedia.id } : {})
    };
    if (!payload.headlineHindi || !payload.category || !form.body.value.trim()) return toast('Hindi headline, category and article body are required', true);
    await ensureAuth();
    if (editingArticleId) await apiFetch(API.articles + '/' + editingArticleId, { method: 'PATCH', body: JSON.stringify(payload) });
    else await apiFetch(API.articles, { method: 'POST', body: JSON.stringify(payload) });
    toast(status === 'published' ? 'Article published' : 'Draft saved');
    resetArticleForm();
    await loadArticles();
    showPage('articles', document.querySelector('.edit-item[onclick*="articles"]'));
  }

  async function editArticle(id) {
    const item = currentArticles.find((entry) => entry.id === id);
    if (!item) return toast('Article not found', true);
    const form = getArticleForm();
    editingArticleId = id;
    articleSlugTouched = true;
    form.headlineHindi.value = item.headlineHindi || '';
    form.headlineEnglish.value = item.headline || '';
    form.slug.value = item.slug || '';
    form.category.value = typeof item.category === 'object' ? (item.category?.id || '') : (item.category || '');
    form.excerpt.value = item.excerpt || '';
    form.body.value = textFromLexical(item.body);
    form.status.value = item.status === 'published' ? 'published' : 'draft';
    form.publishDate.value = toDateTimeLocal(item.publishDate);
    setToggle(form.featured, !!item.featured);
    setToggle(form.breakingNews, !!item.breakingNews);
    selectedHeroMedia = typeof item.heroMedia === 'object' ? item.heroMedia : null;
    form.heroMeta.textContent = selectedHeroMedia?.url ? selectedHeroMedia.url : 'Existing hero image linked';
    syncArticlePreview();
    showPage('write', document.querySelector('.edit-item[onclick*="write"]'));
  }
  window.editArticle = editArticle;

  async function toggleArticleStatus(id, status) {
    await ensureAuth();
    await apiFetch(API.articles + '/' + id, { method: 'PATCH', body: JSON.stringify({ status, ...(status === 'published' ? { publishDate: new Date().toISOString() } : {}) }) });
    toast(status === 'published' ? 'Article published' : 'Article moved to draft');
    await loadArticles();
  }
  window.toggleArticleStatus = toggleArticleStatus;

  async function deleteArticle(id) {
    if (!confirm('Delete this article?')) return;
    await ensureAuth();
    await apiFetch(API.articles + '/' + id, { method: 'DELETE' });
    toast('Article deleted');
    await loadArticles();
  }
  window.deleteArticle = deleteArticle;

  async function createCategory() {
    const form = getCategoryForm();
    const payload = { nameHindi: form.nameHindi.value.trim(), name: form.nameEnglish.value.trim(), slug: form.slug.value.trim(), showInNav: true };
    if (!payload.nameHindi || !payload.name || !payload.slug) return toast('Category name and slug are required', true);
    await ensureAuth();
    await apiFetch(API.categories, { method: 'POST', body: JSON.stringify(payload) });
    toast('Category created');
    form.nameHindi.value = ''; form.nameEnglish.value = ''; form.slug.value = ''; delete form.slug.dataset.touched;
    await loadReferenceData();
  }

  function setupMediaUI() {
    const page = document.getElementById('page-media');
    if (!page || page.dataset.ready === '1') return;
    page.dataset.ready = '1';
    const card = page.querySelector('.card');
    const list = document.createElement('div'); list.id = 'media-list'; list.style.marginTop = '16px'; card.appendChild(list);
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.style.display = 'none'; page.appendChild(input);
    page.querySelector('.upload-zone')?.addEventListener('click', () => input.click());
    input.addEventListener('change', async () => {
      const file = input.files?.[0]; if (!file) return;
      try { await ensureAuth(); await uploadHeroImage(file); toast('Media uploaded'); input.value = ''; await renderMediaLibrary(); }
      catch (error) { toast(error.message || 'Upload failed', true); }
    });
  }

  async function renderMediaLibrary() {
    setupMediaUI();
    const list = document.getElementById('media-list');
    if (!list) return;
    list.innerHTML = '<div style="font-size:12px;color:var(--text-secondary)">Loading media…</div>';
    const data = await apiFetch(API.media + '?limit=24&sort=-updatedAt&depth=0');
    currentMedia = data.docs || [];
    list.innerHTML = currentMedia.length ? '<div class="ct">Recent Uploads</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">' + currentMedia.map((item) => {
      const url = item.url || item.thumbnailURL || '';
      return '<div style="border:1px solid var(--border-light);border-radius:8px;padding:10px;background:#fff"><div style="height:90px;background:#f5f6fa;border-radius:6px;overflow:hidden;margin-bottom:8px;display:flex;align-items:center;justify-content:center">' + (url ? '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(item.alt || item.filename || 'media') + '" style="max-width:100%;max-height:100%;object-fit:cover">' : '') + '</div><div style="font-size:11px;font-weight:600;line-height:1.4">' + escapeHtml(item.alt || item.filename || 'Untitled media') + '</div></div>';
    }).join('') + '</div>' : '<div style="font-size:12px;color:var(--text-secondary)">No media uploaded yet.</div>';
  }

  async function logout() {
    try { await fetch(API.logout, { method: 'POST', credentials: 'include' }); } catch (_e) {}
    redirectToLogin();
  }

  function wireButtons() {
    document.getElementById('admin-mobile-toggle')?.addEventListener('click', () => document.querySelector('.shell')?.classList.toggle('sidebar-open'));
    document.getElementById('admin-logout-btn')?.addEventListener('click', logout);
    document.querySelector('#page-articles .page-header .btn-red')?.addEventListener('click', () => { resetArticleForm(); showPage('write', document.querySelector('.edit-item[onclick*="write"]')); });
    document.querySelector('#page-write .page-header .btn-red')?.addEventListener('click', () => saveArticle('published'));
    document.getElementById('save-draft-btn')?.addEventListener('click', () => saveArticle('draft'));
    document.getElementById('create-category-btn')?.addEventListener('click', createCategory);
    const heroInput = document.getElementById('hero-upload-input');
    document.getElementById('hero-upload-zone')?.addEventListener('click', () => heroInput?.click());
    heroInput?.addEventListener('change', async () => {
      const file = heroInput.files?.[0]; if (!file) return;
      try {
        await ensureAuth();
        selectedHeroMedia = await uploadHeroImage(file);
        getArticleForm().heroMeta.textContent = selectedHeroMedia?.url || selectedHeroMedia?.filename || 'Hero image uploaded';
        syncArticlePreview();
        toast('Hero image uploaded');
      } catch (error) { toast(error.message || 'Hero image upload failed', true); }
    });
  }

  async function exportConfig() {
    const payload = { exportedAt: new Date().toISOString(), articleCount: currentArticles.length, categoryCount: currentCategories.length };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'namo-bharat-admin-export.json'; a.click(); URL.revokeObjectURL(url); toast('Exported');
  }
  window.exportConfig = exportConfig;
  window.resetAll = logout;
  window.publishChanges = async function publishChanges() { toast('Site settings preview is ready; content tools are live'); };

  async function init() {
    enableToggleClicks();
    bindLiveInputs();
    wireButtons();
    showPanel('logo', document.querySelector('.edit-item.active'));
    syncArticlePreview();
    try {
      await ensureAuth();
      await loadReferenceData();
      await loadArticles();
      await renderMediaLibrary();
      renderCategories();
    } catch (error) {
      toast(error.message || 'Admin bootstrap failed', true);
    }
  }

  init();
}
