// Stackly Dashboard Management & SVG Charting Module

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Global Theme
  StacklyDashboard.initTheme();

  // Bind Common Header Profile Dropdown (in case a dashboard page uses normal navbar)
  StacklyDashboard.bindGlobalEvents();
});

const StacklyDashboard = {
  // Theme management
  initTheme: () => {
    const savedTheme = localStorage.getItem('stackly_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    StacklyDashboard.updateThemeToggleIcons(savedTheme);
  },

  initTabs: (role) => {
    const urlParams = new URLSearchParams(window.location.search);
    let activeTab = urlParams.get('tab') || 'dashboard';

    // If customer and guest, allow only cart and wishlist tabs
    const currentUser = (typeof StacklyAuth !== 'undefined') ? StacklyAuth.getCurrentUser() : null;
    if (role === 'customer' && !currentUser) {
      if (activeTab !== 'cart' && activeTab !== 'wishlist') {
        activeTab = 'cart'; // default for guests
      }
    }

    // Function to perform the switch
    const switchTab = (tabId) => {
      // 1. Hide all tab content panes
      const panes = document.querySelectorAll('.dashboard-tab-content');
      panes.forEach(pane => {
        pane.style.display = 'none';
      });

      // 2. Show active tab content pane
      const activePane = document.getElementById(`tab-content-${tabId}`);
      if (activePane) {
        activePane.style.display = 'flex';
      }

      // 3. Highlight sidebar active item
      const sidebarLinks = document.querySelectorAll('.sidebar-link');
      sidebarLinks.forEach(link => {
        if (link.getAttribute('data-id') === tabId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // 4. Update url search param without reload
      const newUrl = window.location.pathname + '?tab=' + tabId;
      window.history.pushState(null, '', newUrl);

      // 5. Fire dynamic tab hooks for charts redraw or data refresh
      window.dispatchEvent(new CustomEvent('dashboardTabChanged', { detail: { tab: tabId } }));
    };

    // Intercept clicks on sidebar links
    const sidebar = document.getElementById('dashboardSidebar');
    if (sidebar) {
      const links = sidebar.querySelectorAll('.sidebar-link');
      links.forEach(link => {
        if (link.id === 'sidebarLogoutBtn') return;

        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && href.includes('?tab=')) {
            e.preventDefault();
            const tabId = href.split('?tab=')[1];
            switchTab(tabId);
            
            // Close mobile drawer on link click
            const sidebarEl = document.getElementById('dashboardSidebar');
            if (sidebarEl) sidebarEl.classList.remove('active');
          }
        });
      });
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      const params = new URLSearchParams(window.location.search);
      const tabId = params.get('tab') || 'dashboard';
      switchTab(tabId);
    });

    // Initial switch to default/requested tab
    switchTab(activeTab);
  },

  toggleTheme: () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('stackly_theme', newTheme);
    StacklyDashboard.updateThemeToggleIcons(newTheme);
    
    // Notify charts to redraw under new coloring
    window.dispatchEvent(new Event('themeChanged'));
  },

  updateThemeToggleIcons: (theme) => {
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(btn => {
      if (theme === 'light') {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
      } else {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M17.636 17.636l-.707-.707M6.364 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;
      }
    });
  },

  bindGlobalEvents: () => {
    // Set dynamic avatar letter and user details
    const currentUser = (typeof StacklyAuth !== 'undefined') ? StacklyAuth.getCurrentUser() : null;
    const avatarImg = document.querySelector('.topbar-right .avatar');
    if (currentUser && avatarImg) {
      const initial = currentUser.username[0].toUpperCase();
      avatarImg.innerText = initial;
    }

    const profileTrigger = document.getElementById('topbarProfileTrigger');
    if (currentUser && profileTrigger) {
      let profileInfo = profileTrigger.querySelector('.profile-info');
      if (!profileInfo) {
        profileInfo = document.createElement('div');
        profileInfo.className = 'profile-info';
        profileTrigger.appendChild(profileInfo);
      }
      profileInfo.innerHTML = `
        <span class="name">${currentUser.username}</span>
        <span class="role" style="text-transform: capitalize;">${currentUser.role}</span>
      `;
    }

    // Topbar Profile Actions
    const profileMenu = document.getElementById('topbarProfileMenu');
    if (profileTrigger && profileMenu && !profileTrigger.dataset.bound) {
      profileTrigger.dataset.bound = 'true';
      profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('active');
      });
      document.addEventListener('click', () => {
        profileMenu.classList.remove('active');
      });
    }

    // Topbar Notifications Actions (Redirect to 404 page)
    const notifTrigger = document.getElementById('topbarNotifTrigger');
    if (notifTrigger && !notifTrigger.dataset.bound) {
      notifTrigger.dataset.bound = 'true';
      notifTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const base = (typeof getBasePath === 'function') ? getBasePath() : (window.location.pathname.includes('/pages/') ? '../' : './');
        const pages = (typeof getPagesPath === 'function') ? getPagesPath() : 'pages/';
        const dashboardRef = encodeURIComponent(window.location.href);
        window.location.href = `${base}${pages}404.html?from=dashboard&ref=${dashboardRef}`;
      });
    }

    // Sidebar Mobile Drawer toggle
    const sidebarToggle = document.getElementById('sidebarMobileToggle');
    const sidebarElement = document.getElementById('dashboardSidebar');
    if (sidebarToggle && sidebarElement && !sidebarToggle.dataset.bound) {
      sidebarToggle.dataset.bound = 'true';
      sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebarElement.classList.toggle('active');
      });
      document.addEventListener('click', (e) => {
        if (!sidebarElement.contains(e.target) && !sidebarToggle.contains(e.target)) {
          sidebarElement.classList.remove('active');
        }
      });
    }

    // Bind theme toggles
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', StacklyDashboard.toggleTheme);
      }
    });

    // Make all quick links and secondary items go to 404
    const links404 = document.querySelectorAll('a[href*="404.html"]');
    links404.forEach(l => {
      if (!l.dataset.bound) {
        l.dataset.bound = 'true';
        l.addEventListener('click', (e) => {
          // Just let normal navigation occur, which routes to 404
        });
      }
    });
  },

  // Premium SVG Chart Drawer
  renderLineChart: (svgContainerId, dataPoints, labels) => {
    const container = document.getElementById(svgContainerId);
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 240;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxVal = Math.max(...dataPoints) * 1.15;
    const minVal = 0;

    // Helper map function
    const getX = (index) => paddingLeft + (index / (dataPoints.length - 1)) * chartWidth;
    const getY = (val) => paddingTop + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

    // Draw SVG contents
    let svgContent = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--primary)"/>
            <stop offset="100%" stop-color="var(--secondary)"/>
          </linearGradient>
          <filter id="svgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
    `;

    // 1. Grid Lines
    const gridRows = 4;
    for (let i = 0; i <= gridRows; i++) {
      const val = minVal + (maxVal - minVal) * (i / gridRows);
      const y = getY(val);
      svgContent += `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4,4"/>
        <text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" fill="var(--text-muted)" font-size="10">$${Math.round(val)}</text>
      `;
    }

    // 2. Build Path & Area Points
    let pathString = '';
    let areaString = `M ${getX(0)} ${getY(0)} `;

    dataPoints.forEach((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) {
        pathString += `M ${x} ${y} `;
      } else {
        pathString += `L ${x} ${y} `;
      }
      areaString += `L ${x} ${y} `;
    });

    areaString += `L ${getX(dataPoints.length - 1)} ${getY(0) + chartHeight} L ${getX(0)} ${getY(0) + chartHeight} Z`;

    // Render Area & Line
    svgContent += `
      <path d="${areaString}" fill="url(#area-grad)"/>
      <path d="${pathString}" fill="none" stroke="url(#glow-grad)" stroke-width="3" stroke-linecap="round" filter="url(#svgGlow)"/>
    `;

    // 3. Render Nodes & Labels
    dataPoints.forEach((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      svgContent += `
        <circle cx="${x}" cy="${y}" r="5" fill="#ffffff" stroke="#00f0ff" stroke-width="2" filter="url(#svgGlow)" style="cursor:pointer;"/>
        <text x="${x}" y="${paddingTop + chartHeight + 18}" text-anchor="middle" fill="var(--text-muted)" font-size="10">${labels[idx]}</text>
      `;
    });

    svgContent += `</svg>`;
    container.innerHTML = svgContent;
  },

  renderBarChart: (svgContainerId, dataPoints, labels) => {
    const container = document.getElementById(svgContainerId);
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 240;
    const paddingLeft = 40;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxVal = Math.max(...dataPoints) * 1.15;
    const minVal = 0;

    const getY = (val) => paddingTop + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    const barWidth = (chartWidth / dataPoints.length) * 0.6;
    const barSpacing = (chartWidth / dataPoints.length) * 0.4;

    let svgContent = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--accent)"/>
            <stop offset="100%" stop-color="var(--primary)"/>
          </linearGradient>
          <filter id="svgBarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
    `;

    // 1. Grid Lines
    const gridRows = 4;
    for (let i = 0; i <= gridRows; i++) {
      const val = minVal + (maxVal - minVal) * (i / gridRows);
      const y = getY(val);
      svgContent += `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4,4"/>
        <text x="${paddingLeft - 8}" y="${y + 3}" text-anchor="end" fill="var(--text-muted)" font-size="10">${Math.round(val)}</text>
      `;
    }

    // 2. Bars
    dataPoints.forEach((val, idx) => {
      const x = paddingLeft + idx * (barWidth + barSpacing) + barSpacing / 2;
      const y = getY(val);
      const barHeight = paddingTop + chartHeight - y;

      svgContent += `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="url(#bar-grad)" filter="url(#svgBarGlow)">
          <title>${labels[idx]}: ${val}</title>
        </rect>
        <text x="${x + barWidth / 2}" y="${paddingTop + chartHeight + 18}" text-anchor="middle" fill="var(--text-muted)" font-size="10">${labels[idx]}</text>
      `;
    });

    svgContent += `</svg>`;
    container.innerHTML = svgContent;
  }
};

// Expose StacklyDashboard to window context
window.StacklyDashboard = StacklyDashboard;
