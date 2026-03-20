export const classicAdminMarkup = `<div class="shell">
    <!-- TOPBAR -->
    <div class="topbar">
      <div class="logo">
        <span class="badge b-red">ULTIMATE SUITE</span>
        नमो: भारत न्यूज़ 24
      </div>
      <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--color-text-secondary)">
        <div style="width:6px;height:6px;border-radius:50%;background:var(--green)"></div>
        Live • All Features Active
      </div>
      <div class="topbar-right">
        <button class="btn" onclick="resetAll()">↺ Reset</button>
        <button class="btn" onclick="exportConfig()">📤 Export</button>
        <button class="btn btn-red" onclick="publishChanges()">🚀 Publish All</button>
      </div>
    </div>

    <!-- SIDEBAR WITH TABS -->
    <div class="sidebar">
      <div class="sidebar-tabs">
        <div class="stab active" onclick="switchSideTab(this,'stab-design')">Design</div>
        <div class="stab" onclick="switchSideTab(this,'stab-layout')">Layout</div>
        <div class="stab" onclick="switchSideTab(this,'stab-pages')">Pages</div>
        <div class="stab" onclick="switchSideTab(this,'stab-business')">Business</div>
      </div>

      <!-- DESIGN TAB -->
      <div class="sidebar-body" id="stab-design">
        <div class="section-label">Branding</div>
        <div class="edit-item active" onclick="showPanel('logo',this)"><div class="edit-icon" style="background:#FEE">🖼</div><div><div class="edit-label">Logo & Brand</div><div class="edit-sub">Upload, initials, size</div></div></div>
        <div class="edit-item" onclick="showPanel('colors',this)"><div class="edit-icon" style="background:#FEE">🎨</div><div><div class="edit-label">Colors & Theme</div><div class="edit-sub">Primary, navbar, all UI</div></div></div>
        <div class="edit-item" onclick="showPanel('fonts',this)"><div class="edit-icon" style="background:#EEF">✦</div><div><div class="edit-label">Typography</div><div class="edit-sub">Fonts, sizes, weights</div></div></div>

        <div class="section-label">Header & Nav</div>
        <div class="edit-item" onclick="showPanel('header',this)"><div class="edit-icon" style="background:#EFE">▬</div><div><div class="edit-label">Header Bar</div><div class="edit-sub">Top info, phone, links</div></div></div>
        <div class="edit-item" onclick="showPanel('navbar',this)"><div class="edit-icon" style="background:#EFE">☰</div><div><div class="edit-label">Navigation Menu</div><div class="edit-sub">Menu items, order</div></div></div>
        <div class="edit-item" onclick="showPanel('ticker',this)"><div class="edit-icon" style="background:#FEE">⚡</div><div><div class="edit-label">Breaking Ticker</div><div class="edit-sub">Text, color, speed</div></div></div>

        <div class="section-label">Homepage</div>
        <div class="edit-item" onclick="showPanel('hero',this)"><div class="edit-icon" style="background:#EEF">★</div><div><div class="edit-label">Hero Section</div><div class="edit-sub">Featured layout</div></div></div>
        <div class="edit-item" onclick="showPanel('sections',this)"><div class="edit-icon" style="background:#EFE">⊞</div><div><div class="edit-label">Content Sections</div><div class="edit-sub">Categories, order</div></div></div>
        <div class="edit-item" onclick="showPanel('sidebar-widget',this)"><div class="edit-icon" style="background:#FEF">▦</div><div><div class="edit-label">Sidebar Widgets</div><div class="edit-sub">Trending, weather, ads</div></div></div>
        <div class="edit-item" onclick="showPanel('ads-edit',this)"><div class="edit-icon" style="background:#FEE">$</div><div><div class="edit-label">Ad Placements</div><div class="edit-sub">Banner, sidebar, article</div></div></div>

        <div class="section-label">Footer & Social</div>
        <div class="edit-item" onclick="showPanel('footer',this)"><div class="edit-icon" style="background:#EEE">▬</div><div><div class="edit-label">Footer Content</div><div class="edit-sub">Links, copyright</div></div></div>
        <div class="edit-item" onclick="showPanel('social-links',this)"><div class="edit-icon" style="background:#EEF">⊛</div><div><div class="edit-label">Social Links</div><div class="edit-sub">All platforms</div></div></div>
      </div>

      <!-- LAYOUT TAB -->
      <div class="sidebar-body" id="stab-layout" style="display:none">
        <div class="section-label">Page Layouts</div>
        <div class="edit-item" onclick="showPanel('layout-home',this)"><div class="edit-icon" style="background:#EFE">⊟</div><div><div class="edit-label">Homepage Layout</div><div class="edit-sub">Grid style, columns</div></div></div>
        <div class="edit-item" onclick="showPanel('layout-article',this)"><div class="edit-icon" style="background:#EEF">📄</div><div><div class="edit-label">Article Page</div><div class="edit-sub">Layout, sidebar, related</div></div></div>
        <div class="edit-item" onclick="showPanel('layout-category',this)"><div class="edit-icon" style="background:#FEF">📁</div><div><div class="edit-label">Category Page</div><div class="edit-sub">List vs grid</div></div></div>
        <div class="section-label">Spacing & Mobile</div>
        <div class="edit-item" onclick="showPanel('spacing',this)"><div class="edit-icon" style="background:#FEE">↔</div><div><div class="edit-label">Spacing & Padding</div><div class="edit-sub">Global controls</div></div></div>
        <div class="edit-item" onclick="showPanel('mobile',this)"><div class="edit-icon" style="background:#EFE">📱</div><div><div class="edit-label">Mobile Settings</div><div class="edit-sub">Responsive tweaks</div></div></div>
      </div>

      <!-- PAGES TAB -->
      <div class="sidebar-body" id="stab-pages" style="display:none">
        <div class="section-label">Core Pages</div>
        <div class="edit-item" onclick="showPanel('page-home',this)"><div class="edit-icon" style="background:#EFE">🏠</div><div><div class="edit-label">Homepage</div><div class="edit-sub">SEO, title, meta</div></div></div>
        <div class="edit-item" onclick="showPanel('page-about',this)"><div class="edit-icon" style="background:#EEF">ℹ</div><div><div class="edit-label">About Us</div><div class="edit-sub">Content & settings</div></div></div>
        <div class="edit-item" onclick="showPanel('page-contact',this)"><div class="edit-icon" style="background:#FEE">📞</div><div><div class="edit-label">Contact Page</div><div class="edit-sub">Address, form, map</div></div></div>
        <div class="edit-item" onclick="showPanel('page-privacy',this)"><div class="edit-icon" style="background:#FEF">🔒</div><div><div class="edit-label">Privacy Policy</div><div class="edit-sub">Policy text</div></div></div>
        <div class="edit-item" onclick="showPanel('page-advertise',this)"><div class="edit-icon" style="background:#FEE">📢</div><div><div class="edit-label">Advertise Page</div><div class="edit-sub">Rates & contact</div></div></div>
        <div class="section-label">Regional Pages</div>
        <div class="edit-item" onclick="showPanel('page-bihar',this)"><div class="edit-icon" style="background:#EFE">🗺</div><div><div class="edit-label">Bihar Page</div><div class="edit-sub">Regional settings</div></div></div>
        <div class="edit-item" onclick="showPanel('page-katihar',this)"><div class="edit-icon" style="background:#EFE">📍</div><div><div class="edit-label">Katihar Page</div><div class="edit-sub">Local news</div></div></div>
      </div>

      <!-- BUSINESS TAB -->
      <div class="sidebar-body" id="stab-business" style="display:none">
        <div class="section-label">Content Management</div>
        <div class="edit-item" onclick="showPage('dashboard',this)"><div class="edit-icon">📊</div><div><div class="edit-label">Dashboard</div><div class="edit-sub">Overview & stats</div></div></div>
        <div class="edit-item" onclick="showPage('articles',this)"><div class="edit-icon">📰</div><div><div class="edit-label">Articles</div><div class="edit-sub">Manage content</div></div></div>
        <div class="edit-item" onclick="showPage('write',this)"><div class="edit-icon">✍️</div><div><div class="edit-label">Write Article</div><div class="edit-sub">Editor & preview</div></div></div>
        <div class="edit-item" onclick="showPage('ai-writer',this)"><div class="edit-icon">🤖</div><div><div class="edit-label">AI Writer</div><div class="edit-sub">Claude AI generator</div></div></div>
        <div class="edit-item" onclick="showPage('comments',this)"><div class="edit-icon">💬</div><div><div class="edit-label">Comments</div><div class="edit-sub">Moderation</div></div></div>

        <div class="section-label">Features</div>
        <div class="edit-item" onclick="showPage('breaking',this)"><div class="edit-icon">📡</div><div><div class="edit-label">Breaking News</div><div class="edit-sub">Live updates</div></div></div>
        <div class="edit-item" onclick="showPage('live-blog',this)"><div class="edit-icon">📝</div><div><div class="edit-label">Live Blog</div><div class="edit-sub">Real-time events</div></div></div>
        <div class="edit-item" onclick="showPage('newsletter',this)"><div class="edit-icon">📧</div><div><div class="edit-label">Newsletter</div><div class="edit-sub">Campaigns & subs</div></div></div>
        <div class="edit-item" onclick="showPage('polls',this)"><div class="edit-icon">🗳</div><div><div class="edit-label">Polls</div><div class="edit-sub">Surveys & votes</div></div></div>

        <div class="section-label">Integrations</div>
        <div class="edit-item" onclick="showPage('integrations',this)"><div class="edit-icon">🔗</div><div><div class="edit-label">Integrations</div><div class="edit-sub">Services & APIs</div></div></div>
        <div class="edit-item" onclick="showPage('push',this)"><div class="edit-icon">🔔</div><div><div class="edit-label">Push Notifications</div><div class="edit-sub">Alerts & messages</div></div></div>
        <div class="edit-item" onclick="showPage('whatsapp',this)"><div class="edit-icon">💬</div><div><div class="edit-label">WhatsApp Bot</div><div class="edit-sub">Messaging</div></div></div>
        <div class="edit-item" onclick="showPage('youtube',this)"><div class="edit-icon">📺</div><div><div class="edit-label">YouTube Integration</div><div class="edit-sub">Videos & embeds</div></div></div>
        <div class="edit-item" onclick="showPage('weather',this)"><div class="edit-icon">🌤</div><div><div class="edit-label">Weather Widget</div><div class="edit-sub">Settings & API</div></div></div>

        <div class="section-label">Business & Admin</div>
        <div class="edit-item" onclick="showPage('analytics',this)"><div class="edit-icon">📈</div><div><div class="edit-label">Analytics</div><div class="edit-sub">GA4 & traffic</div></div></div>
        <div class="edit-item" onclick="showPage('seo',this)"><div class="edit-icon">🔍</div><div><div class="edit-label">SEO & Tracking</div><div class="edit-sub">Meta tags, IDs</div></div></div>
        <div class="edit-item" onclick="showPage('ads',this)"><div class="edit-icon">📢</div><div><div class="edit-label">Advertisements</div><div class="edit-sub">Slots & AdSense</div></div></div>
        <div class="edit-item" onclick="showPage('media',this)"><div class="edit-icon">🖼</div><div><div class="edit-label">Media Library</div><div class="edit-sub">Images & assets</div></div></div>
        <div class="edit-item" onclick="showPage('reporters',this)"><div class="edit-icon">👥</div><div><div class="edit-label">Reporters</div><div class="edit-sub">Team members</div></div></div>
        <div class="edit-item" onclick="showPage('settings',this)"><div class="edit-icon">⚙️</div><div><div class="edit-label">Settings</div><div class="edit-sub">All preferences</div></div></div>
      </div>
    </div>

    <!-- MAIN CONTENT AREA -->
    <div class="main">
      <!-- PREVIEW & PAGES -->
      <div class="preview-area">

        <!-- DEFAULT PANELS (Design Mode) -->
        <div id="panel-logo" style="background:white;border-radius:6px;padding:20px;min-height:400px">
          <div class="panel-header"><div class="panel-title">🖼 Logo & Brand Identity</div><span class="badge b-red">Live</span></div>
          <div class="panel-body">
            <div class="form-group">
              <label>Site Name</label>
              <input type="text" value="नमो:भारत न्यूज़24">
            </div>
            <div class="form-group">
              <label>Tagline</label>
              <input type="text" value="तथ्य स्पष्ट, विचार निष्पक्ष।">
            </div>
            <div class="form-group">
              <label>Logo Upload</label>
              <div class="upload-zone">📤 Click to upload logo (PNG/SVG)</div>
            </div>
            <div class="form-group">
              <label>Logo Initials</label>
              <input type="text" value="NB" maxlength="3">
            </div>
            <div class="form-group">
              <label>Logo Size</label>
              <input type="range" min="24" max="60" value="32">
            </div>
            <div class="form-group">
              <label>Favicon</label>
              <div class="upload-zone">🔲 Upload Favicon (32×32)</div>
            </div>
            <div class="form-group">
              <label>OG / Share Image</label>
              <div class="upload-zone">🌐 Upload Social Share (1200×630)</div>
            </div>
          </div>
        </div>

        <!-- COLORS PANEL -->
        <div id="panel-colors" style="display:none;background:white;border-radius:6px;padding:20px">
          <div class="panel-header"><div class="panel-title">🎨 Colors & Theme</div><span class="badge b-red">Live</span></div>
          <div class="panel-body">
            <div class="form-group">
              <label>Primary Color</label>
              <div class="color-row">
                <input type="color" value="#C0392B" style="width:50px">
                <input type="text" value="#C0392B">
              </div>
              <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
                <div class="color-swatch cs-active" style="background:#C0392B"></div>
                <div class="color-swatch" style="background:#2C3E50"></div>
                <div class="color-swatch" style="background:#1ABC9C"></div>
                <div class="color-swatch" style="background:#2980B9"></div>
                <div class="color-swatch" style="background:#8E44AD"></div>
                <div class="color-swatch" style="background:#27AE60"></div>
                <div class="color-swatch" style="background:#E67E22"></div>
              </div>
            </div>
            <div class="form-group">
              <label>Navbar Background</label>
              <div class="color-row">
                <input type="color" value="#1a1a1a" style="width:50px">
                <input type="text" value="#1a1a1a">
              </div>
            </div>
            <div class="form-group">
              <label>Top Info Bar</label>
              <div class="color-row">
                <input type="color" value="#222222" style="width:50px">
                <input type="text" value="#222222">
              </div>
            </div>
            <div class="form-group">
              <label>Ticker Background</label>
              <div class="color-row">
                <input type="color" value="#FFF3CD" style="width:50px">
                <input type="text" value="#FFF3CD">
              </div>
            </div>
            <div class="form-group">
              <label>Footer Background</label>
              <div class="color-row">
                <input type="color" value="#1a1a1a" style="width:50px">
                <input type="text" value="#1a1a1a">
              </div>
            </div>
            <div class="form-group">
              <label>Dark Mode</label>
              <div class="toggle on" style="margin-top:4px"></div>
            </div>
          </div>
        </div>

        <!-- FONTS PANEL -->
        <div id="panel-fonts" style="display:none;background:white;border-radius:6px;padding:20px">
          <div class="panel-header"><div class="panel-title">✦ Typography</div></div>
          <div class="panel-body">
            <div class="form-group">
              <label>Heading Font</label>
              <div class="font-card selected"><div style="font-size:16px;font-weight:500">नमो न्यूज़ 24</div><span class="badge b-red">Selected</span></div>
              <div class="font-card"><div style="font-size:16px">नमो न्यूज़ 24</div><span class="badge b-gray">Hind</span></div>
            </div>
            <div class="form-group">
              <label>Body Font Size</label>
              <input type="range" min="12" max="18" value="14"> <span style="font-size:12px">14px</span>
            </div>
            <div class="form-group">
              <label>Headline Size</label>
              <input type="range" min="16" max="36" value="22"> <span style="font-size:12px">22px</span>
            </div>
            <div class="form-group">
              <label>Line Height</label>
              <select><option>1.5</option><option selected>1.6</option><option>1.7</option></select>
            </div>
          </div>
        </div>

        <!-- HEADER PANEL -->
        <div id="panel-header" style="display:none;background:white;border-radius:6px;padding:20px">
          <div class="panel-header"><div class="panel-title">▬ Header Bar</div><span class="badge b-red">Live</span></div>
          <div class="panel-body">
            <div class="setting-row"><span>Show Top Info Bar</span><div class="toggle on"></div></div>
            <div class="setting-row"><span>Show Date/Time</span><div class="toggle on"></div></div>
            <div class="divider"></div>
            <div class="form-group"><label>Phone Number</label><input type="text" value="+91-91628 68368"></div>
            <div class="form-group"><label>Show WhatsApp</label><div class="toggle on"></div></div>
            <div class="form-group"><label>Header Quick Links</label>
              <div style="display:flex;flex-direction:column;gap:6px">
                <div style="display:flex;gap:6px"><input type="text" value="ई-पेपर"><input type="text" value="/e-paper" style="width:90px"></div>
                <div style="display:flex;gap:6px"><input type="text" value="वीडियो"><input type="text" value="/videos" style="width:90px"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- NAVBAR PANEL -->
        <div id="panel-navbar" style="display:none;background:white;border-radius:6px;padding:20px">
          <div class="panel-header"><div class="panel-title">☰ Navigation Menu</div><span class="badge b-red">Live</span></div>
          <div class="panel-body">
            <div id="nav-items">
              <div class="nav-menu-item"><span class="drag-handle">⠿</span><input type="text" value="होम" style="flex:1;border:none;outline:none;background:transparent"><input type="text" value="/" style="width:80px;font-size:11px"><div class="toggle on"></div></div>
              <div class="nav-menu-item"><span class="drag-handle">⠿</span><input type="text" value="राष्ट्रीय" style="flex:1;border:none;outline:none;background:transparent"><input type="text" value="/national" style="width:80px;font-size:11px"><div class="toggle on"></div></div>
              <div class="nav-menu-item"><span class="drag-handle">⠿</span><input type="text" value="राज्य" style="flex:1;border:none;outline:none;background:transparent"><input type="text" value="/states" style="width:80px;font-size:11px"><div class="toggle on"></div></div>
            </div>
            <button class="btn btn-default" onclick="addNavItem()" style="margin-top:10px">+ Add Item</button>
          </div>
        </div>

        <!-- TICKER PANEL -->
        <div id="panel-ticker" style="display:none;background:white;border-radius:6px;padding:20px">
          <div class="panel-header"><div class="panel-title">⚡ Breaking Ticker</div><span class="badge b-red">Live</span></div>
          <div class="panel-body">
            <div class="form-group"><label>Ticker Text</label><input type="text" value="ब्रेकिंग: नमो भारत न्यूज़ 24 पर आपका स्वागत है"></div>
            <div class="form-group"><label>Ticker Speed (pixels/second)</label><input type="number" value="50"></div>
            <div class="setting-row"><span>Auto-rotate news</span><div class="toggle on"></div></div>
            <div class="form-group"><label>Ticker Background</label><input type="color" value="#FFF3CD"></div>
            <div class="form-group"><label>Badge Background</label><input type="color" value="#C0392B"></div>
          </div>
        </div>

        <!-- MORE PANELS (abbreviated for space) -->
        <div id="panel-hero" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">★ Hero Section</div></div><div class="panel-body"><input type="text" placeholder="Hero title"><textarea placeholder="Hero description" style="min-height:80px"></textarea></div></div>
        <div id="panel-sections" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">⊞ Content Sections</div></div><div class="panel-body"><input type="text" placeholder="Section name"><input type="number" value="3" placeholder="Articles to show"></div></div>
        <div id="panel-sidebar-widget" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">▦ Sidebar Widgets</div></div><div class="panel-body"><div class="setting-row"><span>Show Trending</span><div class="toggle on"></div></div><div class="setting-row"><span>Show Weather</span><div class="toggle on"></div></div><div class="setting-row"><span>Show Ads</span><div class="toggle on"></div></div></div></div>
        <div id="panel-ads-edit" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">$ Ad Placements</div></div><div class="panel-body"><input type="text" placeholder="Ad slot name"><input type="text" placeholder="Ad code"></div></div>
        <div id="panel-footer" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">▬ Footer Content</div></div><div class="panel-body"><textarea placeholder="Footer text" style="min-height:100px"></textarea></div></div>
        <div id="panel-social-links" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">⊛ Social Links</div></div><div class="panel-body">
          <div class="social-row"><div class="social-icon" style="background:#1877F2">f</div><input type="url" value="https://facebook.com/"><div class="toggle on"></div></div>
          <div class="social-row"><div class="social-icon" style="background:#E1306C">ig</div><input type="url" value="https://instagram.com/"><div class="toggle on"></div></div>
          <div class="social-row"><div class="social-icon" style="background:#FF0000">yt</div><input type="url" value="https://youtube.com/"><div class="toggle on"></div></div>
          <div class="social-row"><div class="social-icon" style="background:#25D366">wa</div><input type="url" value="https://whatsapp.com/"><div class="toggle on"></div></div>
          <div class="social-row" style="border-bottom:none"><div class="social-icon" style="background:#1DA1F2">tw</div><input type="url" placeholder="Twitter URL"><div class="toggle"></div></div>
        </div></div>

        <!-- LAYOUT PANELS -->
        <div id="panel-layout-home" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">⊟ Homepage Layout</div><span class="badge b-red">Live</span></div><div class="panel-body">
          <div class="form-group"><label>Grid Style</label><select><option>3 Columns</option><option>2 Columns</option><option>4 Columns</option><option>List view</option></select></div>
          <div class="setting-row"><span>Show dividers</span><div class="toggle on"></div></div>
          <div class="setting-row"><span>Show "See More"</span><div class="toggle on"></div></div>
          <div class="setting-row" style="border-bottom:none"><span>Infinite scroll</span><div class="toggle"></div></div>
        </div></div>
        <div id="panel-layout-article" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">📄 Article Page Layout</div></div><div class="panel-body">
          <div class="setting-row"><span>Show Related Articles</span><div class="toggle on"></div></div>
          <div class="setting-row"><span>Show Author Box</span><div class="toggle on"></div></div>
          <div class="setting-row"><span>Show Comments</span><div class="toggle on"></div></div>
          <div class="setting-row"><span>Show Share Buttons</span><div class="toggle on"></div></div>
          <div class="setting-row"><span>Reading Progress Bar</span><div class="toggle"></div></div>
          <div class="setting-row" style="border-bottom:none"><span>Table of Contents</span><div class="toggle"></div></div>
        </div></div>
        <div id="panel-layout-category" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">📁 Category Page</div></div><div class="panel-body"><div class="form-group"><label>Layout</label><select><option>Grid View</option><option>List View</option></select></div></div></div>
        <div id="panel-spacing" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">↔ Spacing & Padding</div></div><div class="panel-body">
          <div class="form-group"><label>Max Width</label><select><option>1200px</option><option>1400px</option><option selected>1280px</option></select></div>
          <div class="form-group"><label>Page Padding</label><input type="range" min="8" max="40" value="16"></div>
          <div class="form-group"><label>Card Gap</label><input type="range" min="8" max="32" value="16"></div>
          <div class="form-group"><label>Border Radius</label><input type="range" min="0" max="16" value="4"></div>
        </div></div>
        <div id="panel-mobile" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">📱 Mobile Settings</div></div><div class="panel-body">
          <div class="setting-row"><span>Bottom nav bar</span><div class="toggle on"></div></div>
          <div class="setting-row"><span>Sticky header</span><div class="toggle on"></div></div>
          <div class="setting-row"><span>Collapsible nav</span><div class="toggle on"></div></div>
          <div class="setting-row" style="border-bottom:none"><span>App banner</span><div class="toggle"></div></div>
        </div></div>

        <!-- PAGE SETTING PANELS -->
        <div id="panel-page-home" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">🏠 Homepage SEO</div></div><div class="panel-body">
          <div class="form-group"><label>Page Title</label><input type="text" value="नमो: भारत न्यूज़ 24 - ताजा हिंदी खबरें"></div>
          <div class="form-group"><label>Meta Description</label><textarea style="min-height:70px">भारत और दुनिया की हर महत्वपूर्ण खबर...</textarea></div>
          <div class="form-group"><label>Keywords</label><input type="text" value="हिंदी खबर, ब्रेकिंग न्यूज़, भारत समाचार"></div>
        </div></div>
        <div id="panel-page-about" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">ℹ About Page</div></div><div class="panel-body">
          <div class="form-group"><label>Heading</label><input type="text" value="हमारे बारे में"></div>
          <div class="form-group"><label>About Text</label><textarea style="min-height:140px">नमो: भारत न्यूज़ 24 एक हिंदी समाचार पोर्टल है...</textarea></div>
        </div></div>
        <div id="panel-page-contact" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">📞 Contact Page</div></div><div class="panel-body">
          <div class="form-group"><label>Phone</label><input type="text" value="+91-91628 68368"></div>
          <div class="form-group"><label>Email</label><input type="email" value="contact@namobharatnews24.com"></div>
          <div class="form-group"><label>Address</label><textarea>9th Floor, Mani Casadona, New Town, West Bengal</textarea></div>
        </div></div>
        <div id="panel-page-privacy" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">🔒 Privacy Policy</div></div><div class="panel-body">
          <div class="form-group"><label>Last Updated</label><input type="text" value="18 March 2026"></div>
          <div class="form-group"><label>Policy Content</label><textarea style="min-height:200px">यह प्राइवेसी पॉलिसी...</textarea></div>
        </div></div>
        <div id="panel-page-advertise" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">📢 Advertise Page</div></div><div class="panel-body">
          <div class="form-group"><label>Heading</label><input type="text" value="विज्ञापन दें"></div>
          <div class="form-group"><label>Ad Rates Info</label><textarea style="min-height:100px"></textarea></div>
        </div></div>
        <div id="panel-page-bihar" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">🗺 Bihar Page</div></div><div class="panel-body"><input type="text" placeholder="Regional page settings"></div></div>
        <div id="panel-page-katihar" style="display:none;background:white;border-radius:6px;padding:20px"><div class="panel-header"><div class="panel-title">📍 Katihar Page</div></div><div class="panel-body"><input type="text" placeholder="Local page settings"></div></div>

        <!-- BUSINESS PAGES -->
        <div id="page-dashboard" class="page">
          <div class="page-header"><div><div class="pt">📊 Dashboard</div><div class="ps">System overview & statistics</div></div></div>
          <div class="sg">
            <div class="sc"><div class="sl">Total Visitors</div><div class="sv">12,458</div><div style="font-size:11px;color:var(--green)">↑ 8.2%</div></div>
            <div class="sc"><div class="sl">Page Views</div><div class="sv">48,392</div><div style="font-size:11px;color:var(--green)">↑ 12%</div></div>
            <div class="sc"><div class="sl">Subscribers</div><div class="sv">2,847</div><div style="font-size:11px;color:var(--green)">↑ 3.1%</div></div>
            <div class="sc"><div class="sl">Active Users</div><div class="sv">632</div><div style="font-size:11px;color:var(--green)">↑ 15%</div></div>
          </div>
          <div class="card"><div class="ct">🔥 Top Articles</div><table class="tbl"><tr><th>Title</th><th>Views</th><th>Status</th></tr><tr><td>चुनाव परिणाम</td><td>12,458</td><td><span class="badge b-green">Live</span></td></tr><tr><td>आर्थिक सुधार</td><td>8,932</td><td><span class="badge b-green">Live</span></td></tr></table></div>
        </div>

        <div id="page-articles" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">📰 Articles</div></div><button class="btn btn-red">+ New Article</button></div>
          <div class="card"><div class="ct">All Articles</div><table class="tbl"><tr><th>Title</th><th>Category</th><th>Views</th><th>Status</th></tr><tr><td>चुनाव परिणाम</td><td>Politics</td><td>12,458</td><td><span class="badge b-green">Published</span></td></tr></table></div>
        </div>

        <div id="page-write" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">✍️ Write Article</div></div><button class="btn btn-red">Publish</button></div>
          <div class="two">
            <div class="card">
              <div class="form-group"><label>Headline</label><input type="text" placeholder="खबर का शीर्षक..."></div>
              <div class="form-group"><label>Category</label><select><option>राष्ट्रीय</option><option>राजनीति</option><option>खेल</option></select></div>
              <div class="form-group"><label>Author</label><select><option>AI News Desk</option><option>Pratap Kumar</option></select></div>
              <div class="form-group"><label>Body</label><textarea style="min-height:300px" placeholder="Article content..."></textarea></div>
            </div>
            <div class="card"><div style="font-size:14px;color:var(--text-secondary)">← Live preview</div></div>
          </div>
        </div>

        <div id="page-ai-writer" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">🤖 AI Article Writer</div><div class="ps">Generate articles with Claude AI</div></div></div>
          <div class="two">
            <div class="ai-box">
              <div class="ai-hdr"><div class="ai-dot"></div><span>Claude AI Writer</span></div>
              <div class="ai-body">
                <div class="fg"><label>Topic</label><input type="text" placeholder="बिहार में नई शिक्षा नीति..."></div>
                <div class="two" style="gap:8px"><div class="fg"><label>Category</label><select><option>राष्ट्रीय</option></select></div><div class="fg"><label>Length</label><select><option>Medium</option></select></div></div>
                <button class="btn btn-red" style="width:100%">✦ Generate with AI</button>
                <div id="ai-out" style="display:none;margin-top:12px;background:var(--color-background-secondary);padding:10px;border-radius:4px;font-size:12px">Generated content will appear here...</div>
              </div>
            </div>
            <div class="card"><div class="ct">AI Thumbnail Generator</div><div class="fg"><label>Prompt</label><input type="text" placeholder="Describe image..."></div><button class="btn btn-red" style="width:100%">Generate Thumbnail</button></div>
          </div>
        </div>

        <div id="page-comments" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">💬 Comments</div><div class="ps">Pending: 12</div></div></div>
          <div class="card"><table class="tbl"><tr><th>User</th><th>Comment</th><th>Article</th><th>Action</th></tr><tr><td>राज कुमार</td><td>बहुत अच्छी खबर...</td><td>चुनाव परिणाम</td><td><button class="btn btn-green" style="font-size:10px;padding:3px 8px">Approve</button></td></tr></table></div>
        </div>

        <div id="page-breaking" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">📡 Breaking News</div></div><button class="btn btn-red">+ New Breaking</button></div>
          <div class="card">
            <div style="background:#FFE5E5;padding:12px;border-left:4px solid var(--red);margin-bottom:12px">
              <span class="badge b-red">BREAKING</span> नई नीति घोषणा आज दोपहर को
            </div>
            <div style="background:#FFE5E5;padding:12px;border-left:4px solid var(--red)">
              <span class="badge b-red">BREAKING</span> संसद सत्र शुरू हुआ
            </div>
          </div>
        </div>

        <div id="page-live-blog" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">📝 Live Blog</div></div></div>
          <div class="card"><div class="ct">Active Live Events</div><div style="padding:12px;text-align:center;color:var(--text-secondary)">No active live blogs</div></div>
        </div>

        <div id="page-newsletter" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">📧 Newsletter</div></div></div>
          <div class="two">
            <div class="card"><div class="ct">Stats</div>
              <div class="setting-row"><span>Total Subscribers</span><strong>2,847</strong></div>
              <div class="setting-row"><span>Active</span><strong>2,421</strong></div>
              <div class="setting-row"><span>Unsubscribed</span><strong>426</strong></div>
              <div class="setting-row" style="border-bottom:none"><span>Open Rate</span><strong>34%</strong></div>
            </div>
            <div class="card"><div class="ct">Send Newsletter</div><div class="fg"><label>Subject</label><input type="text"></div><div class="fg"><label>Content</label><textarea style="min-height:100px"></textarea></div><button class="btn btn-red" style="width:100%">Send to All</button></div>
          </div>
        </div>

        <div id="page-polls" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">🗳 Polls</div></div><button class="btn btn-red">+ New Poll</button></div>
          <div class="card">
            <div style="font-weight:600;margin-bottom:12px">क्या आप अगले चुनावों में भाग लेंगे?</div>
            <div style="font-size:12px"><div style="display:flex;gap:8px;margin-bottom:8px"><div style="flex:1">हां (65%)</div><div style="flex:1;height:8px;background:var(--green);border-radius:4px;width:65%"></div></div><div style="display:flex;gap:8px"><div style="flex:1">नहीं (35%)</div><div style="flex:1;height:8px;background:var(--red);border-radius:4px;width:35%"></div></div></div>
            <div style="font-size:10px;color:var(--text-tertiary);margin-top:8px">1,234 votes • Ends in 2 days</div>
          </div>
        </div>

        <div id="page-integrations" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">🔗 Integrations</div></div></div>
          <div class="three">
            <div class="card" style="text-align:center"><div style="font-size:28px;margin-bottom:10px">🔥</div><div style="font-weight:600;margin-bottom:4px">Firebase</div><div style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">DB + Auth</div><button class="btn btn-red" style="width:100%;font-size:11px">Configure</button></div>
            <div class="card" style="text-align:center"><div style="font-size:28px;margin-bottom:10px">🤖</div><div style="font-weight:600;margin-bottom:4px">Claude AI</div><div style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">Article generation</div><button class="btn btn-green" style="width:100%;font-size:11px">Connected ✓</button></div>
            <div class="card" style="text-align:center"><div style="font-size:28px;margin-bottom:10px">📊</div><div style="font-weight:600;margin-bottom:4px">Google Analytics</div><div style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">Traffic & behaviour</div><button class="btn btn-red" style="width:100%;font-size:11px">Configure</button></div>
            <div class="card" style="text-align:center"><div style="font-size:28px;margin-bottom:10px">☁️</div><div style="font-weight:600;margin-bottom:4px">Cloudinary</div><div style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">Image CDN</div><button class="btn btn-red" style="width:100%;font-size:11px">Configure</button></div>
            <div class="card" style="text-align:center"><div style="font-size:28px;margin-bottom:10px">🟩</div><div style="font-weight:600;margin-bottom:4px">Sanity CMS</div><div style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">Content Management</div><button class="btn btn-red" style="width:100%;font-size:11px">Configure</button></div>
            <div class="card" style="text-align:center"><div style="font-size:28px;margin-bottom:10px">📧</div><div style="font-weight:600;margin-bottom:4px">Mailchimp</div><div style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">Email delivery</div><button class="btn btn-red" style="width:100%;font-size:11px">Configure</button></div>
          </div>
        </div>

        <div id="page-push" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">🔔 Push Notifications</div></div></div>
          <div class="card"><div class="ct">Send Push Notification</div><div class="form-group"><label>Title</label><input type="text"></div><div class="form-group"><label>Message</label><textarea></textarea></div><button class="btn btn-red" style="width:100%">Send to All</button></div>
        </div>

        <div id="page-whatsapp" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">💬 WhatsApp Integration</div></div></div>
          <div class="card"><div class="ct">WhatsApp Settings</div><div class="form-group"><label>WhatsApp Business API Key</label><input type="text" placeholder="Your API key"></div><div class="form-group"><label>Phone Number ID</label><input type="text" placeholder="Your phone ID"></div><button class="btn btn-red" style="width:100%">Save Settings</button></div>
        </div>

        <div id="page-youtube" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">📺 YouTube Integration</div></div></div>
          <div class="card"><div class="ct">YouTube Channel</div><div class="form-group"><label>Channel ID</label><input type="text" value="@namobharatnews24live"></div><div class="form-group"><label>API Key</label><input type="text" placeholder="YouTube API key"></div><button class="btn btn-red" style="width:100%">Save</button></div>
        </div>

        <div id="page-weather" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">🌤 Weather Widget</div></div></div>
          <div class="two">
            <div class="card"><div class="ct">Settings</div><div class="form-group"><label>Default City</label><input type="text" value="Katihar, Bihar"></div><div class="form-group"><label>Unit</label><select><option>Celsius</option><option>Fahrenheit</option></select></div><div class="form-group"><label>OpenWeather API Key</label><input type="text"></div><div class="setting-row" style="border-bottom:none"><span>Show on Homepage</span><div class="toggle on"></div></div></div>
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;padding:18px;color:#fff;text-align:center"><div style="font-size:11px;opacity:.8">Katihar, Bihar</div><div style="font-size:38px;font-weight:300;margin:10px 0">28°C</div><div style="font-size:13px">Partly Cloudy ⛅</div></div>
          </div>
        </div>

        <div id="page-analytics" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">📈 Analytics</div><div class="ps">GA4 powered insights</div></div></div>
          <div class="sg"><div class="sc"><div class="sl">Pageviews</div><div class="sv">551</div><div style="font-size:11px;color:var(--green)">+18%</div></div><div class="sc"><div class="sl">Unique Visitors</div><div class="sv">284</div></div><div class="sc"><div class="sl">Avg Session</div><div class="sv">2:14</div></div><div class="sc"><div class="sl">Bounce Rate</div><div class="sv" style="color:var(--orange)">62%</div></div></div>
        </div>

        <div id="page-seo" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">🔍 SEO & Tracking</div></div></div>
          <div class="two">
            <div class="card"><div class="ct">Meta Tags</div><div class="form-group"><label>Meta Title</label><input type="text" value="नमो: भारत न्यूज़ 24"></div><div class="form-group"><label>Meta Description</label><textarea>भारत की खबरें...</textarea></div><div class="form-group"><label>Keywords</label><input type="text" value="हिंदी खबर, ब्रेकिंग न्यूज़"></div></div>
            <div class="card"><div class="ct">Tracking IDs</div><div class="form-group"><label>Google Analytics GA4</label><input type="text" placeholder="G-XXXXXXXXXX"></div><div class="form-group"><label>Google Tag Manager</label><input type="text" placeholder="GTM-XXXXXX"></div><div class="form-group"><label>Facebook Pixel</label><input type="text" placeholder="XXXXXXXXXXXXXXXXXX"></div></div>
          </div>
        </div>

        <div id="page-ads" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">📢 Advertisements</div></div></div>
          <div class="card"><div class="ct">Ad Slots</div>
            <div style="display:flex;gap:12px;padding:12px;border:1px solid var(--border-light);border-radius:6px;margin-bottom:10px"><span>▬</span><div style="flex:1"><div style="font-weight:500">Homepage Top Banner</div><div style="font-size:10px;color:var(--text-secondary)">728×90</div></div><input type="text" style="width:150px" placeholder="Ad code"><div class="toggle"></div></div>
            <div style="display:flex;gap:12px;padding:12px;border:1px solid var(--border-light);border-radius:6px;margin-bottom:10px"><span>▐</span><div style="flex:1"><div style="font-weight:500">Article Sidebar</div><div style="font-size:10px;color:var(--text-secondary)">300×250</div></div><input type="text" style="width:150px" placeholder="Ad code"><div class="toggle on"></div></div>
          </div>
          <div class="card"><div class="ct">Google AdSense</div><div class="form-group"><label>Publisher ID</label><input type="text" placeholder="pub-XXXXXXXXXXXXXXXX"></div></div>
        </div>

        <div id="page-media" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">🖼 Media Library</div></div></div>
          <div class="card"><div class="upload-zone" style="border-radius:8px;padding:40px">📤 Drag & drop images or click to upload</div></div>
        </div>

        <div id="page-reporters" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">👥 Reporters & Team</div></div><button class="btn btn-red">+ Add Reporter</button></div>
          <div class="card"><div class="ct">Team Members</div><table class="tbl"><tr><th>Name</th><th>Role</th><th>Status</th></tr><tr><td>AI News Desk</td><td>AI Writer</td><td><span class="badge b-green">Active</span></td></tr><tr><td>Pratap Kumar</td><td>Editor</td><td><span class="badge b-green">Active</span></td></tr></table></div>
        </div>

        <div id="page-settings" class="page" style="display:none">
          <div class="page-header"><div><div class="pt">⚙️ Settings</div></div></div>
          <div class="two">
            <div class="card"><div class="ct">General</div>
              <div class="form-group"><label>Site Name</label><input type="text" value="नमो: भारत न्यूज़ 24"></div>
              <div class="form-group"><label>Tagline</label><input type="text" value="तथ्य स्पष्ट, विचार निष्पक्ष।"></div>
              <div class="form-group"><label>Phone</label><input type="text" value="+91-91628 68368"></div>
            </div>
            <div class="card"><div class="ct">Features</div>
              <div class="setting-row"><span>AI Chatbot</span><div class="toggle on"></div></div>
              <div class="setting-row"><span>Breaking Ticker</span><div class="toggle on"></div></div>
              <div class="setting-row"><span>Comments</span><div class="toggle on"></div></div>
              <div class="setting-row" style="border-bottom:none"><span>Newsletter</span><div class="toggle on"></div></div>
            </div>
          </div>
        </div>

        <div id="panel-default" style="display:none;background:white;border-radius:6px;padding:40px;text-align:center">
          <div style="font-size:32px;margin-bottom:12px">←</div>
          <div>Select an item from the left panel</div>
        </div>

      </div>

      <!-- RIGHT PANEL -->
      <div style="background:white;border-left:0.5px solid var(--border-light);padding:18px;overflow-y:auto;display:flex;flex-direction:column">
        <div style="font-size:14px;font-weight:600;margin-bottom:16px">Live Preview</div>
        <div style="background:#f0f0f0;border-radius:8px;padding:16px;flex:1;overflow-y:auto">
          <div id="preview-box" style="background:#fff;border-radius:6px;min-height:400px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
            <div id="preview-header" style="background:var(--red);color:#fff;padding:12px;text-align:center;font-weight:600">नमो: भारत न्यूज़ 24</div>
            <div id="preview-nav" style="background:#1a1a1a;padding:8px;display:flex;gap:12px"><span style="color:#ccc;font-size:10px">होम</span><span style="color:#ccc;font-size:10px">राष्ट्रीय</span><span style="color:#ccc;font-size:10px">खेल</span></div>
            <div id="preview-body" style="padding:12px;font-size:12px;color:#666">Preview updates in real-time</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="toast" id="toast-el"></div>`;
