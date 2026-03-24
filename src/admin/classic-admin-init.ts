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

  const CATEGORY_WRITE_ROLES = new Set(['section-editor', 'managing-editor', 'editor-in-chief', 'super-admin']);
  const MEDIA_UPLOAD_ROLES = new Set(['section-editor', 'managing-editor', 'editor-in-chief', 'super-admin', 'photo-editor', 'video-editor']);
  const PREVIEW_ONLY_PAGES = new Set(['ai-writer', 'comments', 'breaking', 'live-blog', 'newsletter', 'polls', 'integrations', 'push', 'whatsapp', 'youtube', 'weather', 'analytics', 'seo', 'ads', 'reporters', 'settings']);

  let currentConfig = null;
  let currentArticles = [];
  let currentCategories = [];
  let currentMedia = [];
  let authToken = null;
  let currentUser = null;
  let currentRole = 'reporter';
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
    if (authToken && !headers.has('Authorization')) headers.set('Authorization', 'Bearer ' + authToken);
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

  function roleLabel(role) {
    const labels = {
      'super-admin': 'Super Admin',
      'editor-in-chief': 'Editor-in-Chief',
      'managing-editor': 'Managing Editor',
      'section-editor': 'Section Editor',
      'sub-editor': 'Sub-Editor',
      reporter: 'Reporter',
      'photo-editor': 'Photo Editor',
      'video-editor': 'Video Editor',
      'seo-editor': 'SEO Editor',
      'ad-manager': 'Ad Manager',
    };
    return labels[role] || 'Team Member';
  }

  function canManageCategories() {
    return CATEGORY_WRITE_ROLES.has(currentRole);
  }

  function canUploadMedia() {
    return MEDIA_UPLOAD_ROLES.has(currentRole);
  }

  async function ensureAuth() {
    const data = await apiFetch(API.me, { method: 'GET' });
    authToken = data?.token || authToken;
    if (!data?.user) {
      redirectToLogin();
      throw new Error('Authentication required');
    }
    currentUser = data.user;
    currentRole = data.user?.role || 'reporter';
    return data.user;
  }

  function hideAllPanels() { document.querySelectorAll('[id^=panel-]').forEach((p) => p.style.display = 'none'); }
  function hideAllPages() { document.querySelectorAll('.page').forEach((p) => p.style.display = 'none'); }
  function clearSidebarActiveState() { document.querySelectorAll('.sidebar-body .edit-item').forEach((e) => e.classList.remove('active')); }
  function closeMobileSidebar() { document.querySelector('.shell')?.classList.remove('sidebar-open'); }

  function markItemDisabled(element, reason) {
    if (!element || element.dataset.disabledByRole === '1') return;
    element.dataset.disabledByRole = '1';
    element.style.opacity = '0.55';
    element.style.pointerEvents = 'none';
    element.style.cursor = 'not-allowed';
    const sub = element.querySelector('.edit-sub');
    if (sub && !sub.dataset.originalText) {
      sub.dataset.originalText = sub.textContent || '';
      sub.textContent = reason;
    }
    element.title = reason;
  }

  function markButtonDisabled(element, reason) {
    if (!element || element.dataset.disabledByRole === '1') return;
    element.dataset.disabledByRole = '1';
    element.disabled = true;
    element.style.opacity = '0.55';
    element.style.cursor = 'not-allowed';
    element.title = reason;
  }

  function disableSidebarItemByAction(fragment, reason) {
    document.querySelectorAll(`.edit-item[onclick*="${fragment}"]`).forEach((element) => markItemDisabled(element, reason));
  }

  function applyAdminHonestyLabels() {
    const suiteBadge = document.querySelector('.topbar .logo .badge');
    if (suiteBadge) suiteBadge.textContent = 'CUSTOM ADMIN';

    const statusNode = document.querySelector('.topbar > div[style*="align-items:center"]');
    if (statusNode) {
      statusNode.innerHTML = `<div style="width:6px;height:6px;border-radius:50%;background:var(--green)"></div>Core CMS live • ${roleLabel(currentRole)} • Some sections preview-only`;
    }

    const resetButton = document.querySelector('.topbar-right button[onclick*="resetAll"]');
    if (resetButton) resetButton.textContent = '↺ Clear Editor';

    const publishButton = document.querySelector('.topbar-right button[onclick*="publishChanges"]');
    if (publishButton) publishButton.textContent = '↻ Refresh Data';

    const aiSidebarLabel = document.querySelector('.edit-item[onclick*="ai-writer"] .edit-sub');
    if (aiSidebarLabel) aiSidebarLabel.textContent = 'Preview-only tools';

    const aiPageTitle = document.querySelector('#page-ai-writer .pt');
    if (aiPageTitle) aiPageTitle.textContent = '🤖 AI Writer Preview';

    const aiPageSub = document.querySelector('#page-ai-writer .ps');
    if (aiPageSub) aiPageSub.textContent = 'Preview-only section';

    const aiHeader = document.querySelector('#page-ai-writer .ai-hdr span');
    if (aiHeader) aiHeader.textContent = 'AI Writer Preview';

    const integrationsCards = document.querySelectorAll('#page-integrations .card');
    integrationsCards.forEach((card) => {
      const titleNode = card.querySelector('div[style*="font-weight:600"]');
      if (titleNode && titleNode.textContent?.trim() === 'Claude AI') {
        titleNode.textContent = 'AI Provider';
      }
      const button = card.querySelector('button');
      if (button && button.textContent?.includes('Connected')) {
        button.textContent = 'Preview';
        button.classList.remove('btn-green');
        button.classList.add('btn');
      }
    });
  }

  function applyRolePermissions() {
    applyAdminHonestyLabels();

    if (!canManageCategories()) {
      disableSidebarItemByAction("showPage('categories'", 'Requires editor role');
      markButtonDisabled(document.getElementById('create-category-btn'), 'Requires editor role');
      const categoryForm = getCategoryForm();
      [categoryForm.nameHindi, categoryForm.nameEnglish, categoryForm.slug].forEach((field) => {
        if (field) {
          field.disabled = true;
          field.placeholder = 'Requires editor role';
        }
      });
    }

    if (!canUploadMedia()) {
      disableSidebarItemByAction("showPage('media'", 'Requires media/editor role');
      const heroZone = document.getElementById('hero-upload-zone');
      const heroInput = document.getElementById('hero-upload-input');
      const heroMeta = document.getElementById('hero-upload-meta');
      if (heroZone) {
        heroZone.style.opacity = '0.55';
        heroZone.style.cursor = 'not-allowed';
        heroZone.title = 'Requires media/editor role';
        heroZone.textContent = 'Media upload requires editor or media role';
      }
      if (heroInput) heroInput.disabled = true;
      if (heroMeta) heroMeta.textContent = 'Media upload unavailable for your role';
    }

    PREVIEW_ONLY_PAGES.forEach((page) => {
      disableSidebarItemByAction(`showPage('${page}'`, 'Preview-only section');
    });
  }

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
    if (PREVIEW_ONLY_PAGES.has(name)) {
      toast('This section is preview-only right now', true);
      closeMobileSidebar();
      return;
    }
    if (name === 'categories' && !canManageCategories()) {
      toast('Category management requires editor role', true);
      closeMobileSidebar();
      return;
    }
    if (name === 'media' && !canUploadMedia()) {
      toast('Media library requires editor or media role', true);
      closeMobileSidebar();
      return;
    }

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
  function escapeHtml(text) { return String(text == null ? '' : text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;'); }
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
    if (form.heroMeta) form.heroMeta.textContent = canUploadMedia() ? 'No image selected' : 'Media upload unavailable for your role';
    syncArticlePreview();
  }

  function clearEditor() {
    resetArticleForm();
    showPage('write', document.querySelector('.edit-item[onclick*="write"]'));
    toast('Editor cleared');
  }
  window.clearEditor = clearEditor;

  function addNavItem() {
    const container = document.getElementById('nav-items');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'nav-menu-item';
    row.innerHTML = '<span class="drag-handle">⠿</span><input type="text" value="नया लिंक" style="flex:1;border:none;outline:none;background:transparent"><input type="text" value="/new-link" style="width:80px;font-size:11px"><div class="toggle on"></div>';
    container.appendChild(row);
    enableToggleClicks();
    toast('Navigation item added to preview');
  }
  window.addNavItem = addNavItem;

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

  async function refreshAdminData(showToast = true) {
    await ensureAuth();
    await loadReferenceData();
    await loadArticles();
    if (canUploadMedia()) {
      await renderMediaLibrary();
    }
    renderCategories();
    if (showToast) toast('Admin data refreshed');
  }

  async function uploadHeroImage(file) {
    if (!canUploadMedia()) {
      throw new Error('Media upload requires editor or media role');
    }
    if (!authToken) await ensureAuth();
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('_payload', JSON.stringify({
      alt: (getArticleForm().headlineHindi.value || file.name).trim() || file.name
    }));
    const created = await apiFetch(API.media, { method: 'POST', body: formData });
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
    form.heroMeta.textContent = selectedHeroMedia?.url ? selectedHeroMedia.url : (canUploadMedia() ? 'Existing hero image linked' : 'Media upload unavailable for your role');
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
    if (!canManageCategories()) {
      return toast('Category management requires editor role', true);
    }
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
    const uploadZone = page.querySelector('.upload-zone');
    if (canUploadMedia()) {
      uploadZone?.addEventListener('click', () => input.click());
    } else if (uploadZone) {
      uploadZone.style.opacity = '0.55';
      uploadZone.style.cursor = 'not-allowed';
      uploadZone.textContent = 'Media library requires editor or media role';
    }
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
    if (!canUploadMedia()) {
      list.innerHTML = '<div style="font-size:12px;color:var(--text-secondary)">Media library is available for editor and media roles.</div>';
      return;
    }
    list.innerHTML = '<div style="font-size:12px;color:var(--text-secondary)">Loading media…</div>';
    const data = await apiFetch(API.media + '?limit=24&sort=-updatedAt&depth=0');
    currentMedia = data.docs || [];
    list.innerHTML = currentMedia.length ? '<div class="ct">Recent Uploads</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">' + currentMedia.map((item) => {
      const url = item.url || item.thumbnailURL || '';
      return '<div style="border:1px solid var(--border-light);border-radius:8px;padding:10px;background:#fff"><div style="height:90px;background:#f5f6fa;border-radius:6px;overflow:hidden;margin-bottom:8px;display:flex;align-items:center;justify-content:center">' + (url ? '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(item.alt || item.filename || 'media') + '" style="max-width:100%;max-height:100%;object-fit:cover">' : '') + '</div><div style="font-size:11px;font-weight:600;line-height:1.4">' + escapeHtml(item.alt || item.filename || 'Untitled media') + '</div></div>';
    }).join('') + '</div>' : '<div style="font-size:12px;color:var(--text-secondary)">No media uploaded yet.</div>';
  }

  async function logout() {
    authToken = null;
    currentUser = null;
    currentRole = 'reporter';
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
    const heroZone = document.getElementById('hero-upload-zone');
    if (canUploadMedia()) {
      heroZone?.addEventListener('click', () => heroInput?.click());
    }
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
    const payload = {
      exportedAt: new Date().toISOString(),
      siteName: currentConfig?.site?.name || 'नमो: भारत न्यूज़ 24',
      tagline: currentConfig?.site?.tagline || 'तथ्य स्पष्ट, विचार निष्पक्ष।',
      articleCount: currentArticles.length,
      categoryCount: currentCategories.length,
      publishedCount: currentArticles.filter((item) => item.status === 'published').length,
      draftCount: currentArticles.filter((item) => item.status !== 'published').length,
      currentRole,
      currentUser: currentUser?.name || currentUser?.email || 'Unknown'
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'namo-bharat-admin-summary.json'; a.click(); URL.revokeObjectURL(url); toast('Summary exported');
  }
  window.exportConfig = exportConfig;
  window.resetAll = clearEditor;
  window.publishChanges = async function publishChanges() { await refreshAdminData(true); };

  async function init() {
    enableToggleClicks();
    bindLiveInputs();
    showPanel('logo', document.querySelector('.edit-item.active'));
    syncArticlePreview();
    try {
      await ensureAuth();
      applyRolePermissions();
      wireButtons();
      await refreshAdminData(false);
    } catch (error) {
      toast(error.message || 'Admin bootstrap failed', true);
    }
  }

  init();
}
