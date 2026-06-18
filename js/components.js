// Stackly Web Components Library

// SVG Logo definition used globally
const STACKLY_LOGO_SVG = (size = 40) => `
<svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
  <defs>
    <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8a2be2" />
      <stop offset="100%" stop-color="#00f0ff" />
    </linearGradient>
    <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff007f" />
      <stop offset="100%" stop-color="#8a2be2" />
    </linearGradient>
    <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Top plate -->
  <path d="M60 20 L95 38 L60 56 L25 38 Z" fill="url(#logoGrad1)" filter="url(#logoGlow)" />
  <!-- Middle plate -->
  <path d="M45 42 L80 60 L45 78 L10 60 Z" fill="url(#logoGrad2)" opacity="0.85" />
  <!-- Bottom plate -->
  <path d="M60 64 L95 82 L60 100 L25 82 Z" fill="url(#logoGrad1)" />
</svg>
`;

// Helper to resolve paths since pages are inside /pages and index.html is at root
function getBasePath() {
  const isInsidePages = window.location.pathname.includes('/pages/');
  return isInsidePages ? '../' : './';
}

// Stackly Logo Component for raw HTML pages
class StacklyLogo extends HTMLElement {
  connectedCallback() {
    const size = this.getAttribute('size') || 40;
    this.innerHTML = STACKLY_LOGO_SVG(Number(size));
  }
}
customElements.define('stackly-logo', StacklyLogo);

function getPagesPath() {
  return 'pages/';
}

// // 1. Stackly Logo Loader Component (3 seconds countdown)
class StacklyLoader extends HTMLElement {
  connectedCallback() {
    // Skip loader overlay entirely on all dashboard pages to make transition snappy
    const path = window.location.pathname;
    if (path.includes('customer-dashboard.html') || path.includes('vendor-dashboard.html') || path.includes('admin-dashboard.html')) {
      this.innerHTML = '';
      this.remove();
      return;
    }

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    this.innerHTML = `
      <style>
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #ffffff;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          text-align: center;
          width: 90%;
          max-width: 500px;
        }
        .loader-logo-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          animation: logoPulse 2s infinite ease-in-out;
        }
        .loader-logo-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3.5px solid rgba(243, 244, 246, 0.8);
          border-top: 3.5px solid #8a2be2;
          border-right: 3.5px solid #00f0ff;
          border-bottom: 3.5px solid #ff007f;
          animation: spinRing 1.8s linear infinite;
          z-index: 1;
        }
        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loader-logo-wrap::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 110px;
          height: 110px;
          background: radial-gradient(circle, rgba(138, 43, 226, 0.08) 0%, rgba(138, 43, 226, 0) 70%);
          border-radius: 50%;
          z-index: -1;
          filter: blur(12px);
        }
        .loader-title {
          font-family: var(--font-title, 'Inter', sans-serif);
          font-size: 2.6rem;
          font-weight: 900;
          color: #080a15;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .loader-title span {
          background: var(--primary-gradient, linear-gradient(135deg, #8a2be2, #00f0ff));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Journey Timeline */
        .journey-container {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          width: 100%;
          position: relative;
          margin: 1.5rem 0;
        }
        .journey-track-bg {
          position: absolute;
          top: 27px;
          left: 27px;
          right: 27px;
          height: 4px;
          background: #f3f4f6;
          border-radius: 2px;
          z-index: 1;
        }
        .journey-track-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #8a2be2, #00f0ff, #ff007f);
          border-radius: 2px;
          transition: width 0.4s ease-out;
        }
        .journey-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          flex: 1;
        }
        .journey-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #e5e7eb;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
        }
        .journey-icon svg {
          width: 22px;
          height: 22px;
          transition: transform 0.4s ease;
        }
        .journey-label {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.75rem;
          font-weight: 750;
          color: #9ca3af;
          margin-top: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color 0.4s ease;
        }

        /* Active Journey States */
        .journey-step.active .journey-icon {
          background: linear-gradient(135deg, #8a2be2, #00f0ff);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 10px 15px -3px rgba(138, 43, 226, 0.25);
          transform: scale(1.15);
        }
        .journey-step.active .journey-label {
          color: #8a2be2;
        }
        .journey-step.active .journey-icon svg {
          transform: scale(1.1);
        }

        /* Special SVG Animations per Step */
        .journey-step.active#step-pack .journey-icon svg {
          animation: boxPulse 1.2s infinite ease-in-out;
        }
        .journey-step.active#step-seller .journey-icon svg {
          animation: storePulse 1.2s infinite ease-in-out;
        }
        .journey-step.active#step-truck .journey-icon svg {
          animation: truckDrive 1s infinite alternate ease-in-out;
        }
        .journey-step.active#step-customer .journey-icon svg {
          animation: customerPop 0.6s ease-out forwards;
        }

        .loader-status {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.9rem;
          font-weight: 700;
          color: #4b5563;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          min-height: 1.5rem;
          margin-top: 0.5rem;
        }

        @keyframes logoPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes boxPulse {
          0% { transform: scale(1) rotate(0); }
          50% { transform: scale(1.18) rotate(3deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes storePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes truckDrive {
          0% { transform: translateX(-3px); }
          100% { transform: translateX(3px); }
        }
        @keyframes customerPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3) rotate(5deg); }
          100% { transform: scale(1.1); }
        }
      </style>
      <div class="loader-overlay">
        <div class="loader-content">
          <div class="loader-logo-wrap">
            <div class="loader-logo-ring"></div>
            <div style="position: relative; z-index: 2; display: flex; align-items: center; justify-content: center;">
              ${STACKLY_LOGO_SVG(68)}
            </div>
          </div>
          <h1 class="loader-title">Stack<span>ly</span></h1>
          
          <div class="journey-container">
            <div class="journey-track-bg">
              <div class="journey-track-fill" id="journeyTrackFill"></div>
            </div>
            
            <div class="journey-step" id="step-pack">
              <div class="journey-icon">
                <!-- Box Icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <span class="journey-label">Pack</span>
            </div>

            <div class="journey-step" id="step-seller">
              <div class="journey-icon">
                <!-- Shop Icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <span class="journey-label">Seller</span>
            </div>

            <div class="journey-step" id="step-truck">
              <div class="journey-icon">
                <!-- Truck Icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <span class="journey-label">Ship</span>
            </div>

            <div class="journey-step" id="step-customer">
              <div class="journey-icon">
                <!-- Home Icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 18v-6"/><path d="M9 15l3-3 3 3"/></svg>
              </div>
              <span class="journey-label">Deliver</span>
            </div>
          </div>

          <div class="loader-status" id="loaderStatusLabel">Preparing Order...</div>
        </div>
      </div>
    `;

    const stepPack = this.querySelector('#step-pack');
    const stepSeller = this.querySelector('#step-seller');
    const stepTruck = this.querySelector('#step-truck');
    const stepCustomer = this.querySelector('#step-customer');
    const trackFill = this.querySelector('#journeyTrackFill');
    const statusLabel = this.querySelector('#loaderStatusLabel');
    const overlay = this.querySelector('.loader-overlay');

    // Step 1: Pack (t=100ms)
    setTimeout(() => {
      if (stepPack) stepPack.classList.add('active');
      if (statusLabel) statusLabel.innerText = "Packing Product...";
    }, 100);

    // Fill segment 1: Pack -> Seller (t=600ms)
    setTimeout(() => {
      if (trackFill) trackFill.style.width = '33.3%';
      if (statusLabel) statusLabel.innerText = "Routing to Seller...";
    }, 600);

    // Step 2: Seller (t=1100ms)
    setTimeout(() => {
      if (stepSeller) stepSeller.classList.add('active');
      if (statusLabel) statusLabel.innerText = "Handed over to Seller...";
    }, 1100);

    // Fill segment 2: Seller -> Truck (t=1600ms)
    setTimeout(() => {
      if (trackFill) trackFill.style.width = '66.6%';
      if (statusLabel) statusLabel.innerText = "Dispatching shipment...";
    }, 1600);

    // Step 3: Ship / Truck (t=2100ms)
    setTimeout(() => {
      if (stepTruck) stepTruck.classList.add('active');
      if (statusLabel) statusLabel.innerText = "Out for Delivery (En Route)...";
    }, 2100);

    // Fill segment 3: Truck -> Deliver (t=2600ms)
    setTimeout(() => {
      if (trackFill) trackFill.style.width = '100%';
      if (statusLabel) statusLabel.innerText = "Approaching Destination...";
    }, 2600);

    // Step 4: Deliver / Customer (t=3100ms)
    setTimeout(() => {
      if (stepCustomer) stepCustomer.classList.add('active');
      if (statusLabel) statusLabel.innerText = "Package Reached Customer!";
    }, 3100);

    // Fade out and cleanup (t=3700ms)
    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          document.body.style.overflow = '';
          this.innerHTML = '';
          this.remove();
        }, 600);
      }
    }, 3700);
  }
}
customElements.define('stackly-loader', StacklyLoader);

// 2. Stackly Header Component
class StacklyHeader extends HTMLElement {
  connectedCallback() {
    const base = getBasePath();
    const pages = getPagesPath();
    const currentUser = JSON.parse(localStorage.getItem('stackly_currentUser'));
    const cart = JSON.parse(localStorage.getItem('stackly_cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('stackly_wishlist')) || [];

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;

    let authSection = `
      <a href="${base}${pages}login.html" class="btn btn-secondary" style="padding: 0.5rem 1.2rem; font-size: 0.9rem;">Log In</a>
      <a href="${base}${pages}register.html" class="btn btn-primary" style="padding: 0.5rem 1.2rem; font-size: 0.9rem;">Register</a>
    `;

    if (currentUser) {
      let dashboardUrl = `${base}${pages}customer-dashboard.html`;
      let profileUrl = `${base}${pages}customer-dashboard.html?tab=profile`;
      if (currentUser.role === 'admin') {
        dashboardUrl = `${base}${pages}admin-dashboard.html`;
        profileUrl = `${base}${pages}admin-dashboard.html?tab=settings`;
      } else if (currentUser.role === 'vendor') {
        dashboardUrl = `${base}${pages}vendor-dashboard.html`;
        profileUrl = `${base}${pages}vendor-dashboard.html?tab=settings`;
      }

      authSection = `
        <div class="profile-menu">
          <div class="profile-trigger" id="navbarProfileTrigger">
            <div class="avatar">${currentUser.username[0].toUpperCase()}</div>
            <div class="profile-info">
              <span class="name">${currentUser.username}</span>
              <span class="role" style="text-transform: capitalize;">${currentUser.role}</span>
            </div>
          </div>
          <div class="dropdown-menu" id="navbarProfileDropdown">
            <div class="dropdown-item" onclick="window.location.href='${dashboardUrl}'">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              My Dashboard
            </div>
            <div class="dropdown-item" onclick="window.location.href='${profileUrl}'">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              My Profile
            </div>
            <div class="dropdown-item" onclick="window.location.href='${dashboardUrl}?tab=settings'">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Settings
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" id="navbarLogoutBtn" style="color: var(--danger);">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Log Out
            </div>
          </div>
        </div>
      `;
    }

    this.innerHTML = `
      <style>
        .navbar-wrapper {
          position: sticky;
          top: 0;
          width: 100%;
          height: 80px;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--nav-shadow);
          z-index: 1000;
          display: flex;
          align-items: center;
          transition: background var(--transition-normal);
        }
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 1.5rem;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-title);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .navbar-brand span {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .navbar-link {
          font-family: var(--font-title);
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-secondary);
          position: relative;
          padding: 0.25rem 0;
        }
        .navbar-link:hover, .navbar-link.active {
          color: var(--text-primary);
        }
        .navbar-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary-gradient);
          transition: width var(--transition-fast);
        }
        .navbar-link:hover::after, .navbar-link.active::after {
          width: 100%;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .badge-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--accent);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-surface-opaque);
        }
        .mobile-nav-toggle {
          display: none;
          cursor: pointer;
        }
        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 0;
          width: 100%;
          background: var(--bg-surface-opaque);
          border-bottom: 1px solid var(--border-color);
          padding: 1.5rem;
          display: none;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: var(--card-shadow);
          z-index: 999;
        }
        .mobile-menu.active {
          display: flex;
        }
        @media (max-width: 992px) {
          .navbar-links {
            display: none;
          }
          .mobile-nav-toggle {
            display: flex;
          }
        }

        /* User Profile Menu styling */
        .profile-menu {
          position: relative;
        }
        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 50px;
          border: 1px solid transparent;
          transition: all var(--transition-fast);
        }
        .profile-trigger:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--border-color);
        }
        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          border: 2px solid var(--primary);
          flex-shrink: 0;
        }
        .profile-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .profile-info .name {
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.2;
          color: var(--text-primary);
        }
        .profile-info .role {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Dropdown styling */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 240px;
          background: var(--bg-surface-opaque);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--card-shadow);
          padding: 0.75rem;
          display: none;
          flex-direction: column;
          gap: 0.25rem;
          z-index: 1000;
        }
        .dropdown-menu.active {
          display: flex;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
        }
        .dropdown-item svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
        .dropdown-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.5rem 0;
        }
      </style>
      <nav class="navbar-wrapper">
        <div class="container navbar-container">
          <a href="${base}index.html" class="navbar-brand">
            ${STACKLY_LOGO_SVG(34)}
            Stack<span>ly</span>
          </a>
          
          <div class="navbar-links">
            <a href="${base}index.html" class="navbar-link" id="nav-home">Home</a>
            <a href="${base}${pages}products.html" class="navbar-link" id="nav-products">Products</a>
            <a href="${base}${pages}categories.html" class="navbar-link" id="nav-categories">Categories</a>
            <a href="${base}${pages}deals.html" class="navbar-link" id="nav-deals">Deals</a>
            <a href="${base}${pages}services.html" class="navbar-link" id="nav-services">Services</a>
            <a href="${base}${pages}about.html" class="navbar-link" id="nav-about">About</a>
            <a href="${base}${pages}contact.html" class="navbar-link" id="nav-contact">Contact</a>
          </div>

          <div class="navbar-actions">
            <!-- Wishlist -->
            <a href="${base}${pages}404.html" class="topbar-action-btn" title="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </a>

            <!-- Cart -->
            <a href="${base}${pages}404.html" class="topbar-action-btn" title="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </a>

            <!-- Auth profile menu / Login -->
            ${authSection}

            <!-- Mobile menu trigger -->
            <button class="topbar-action-btn mobile-nav-toggle" id="navbarMenuToggleBtn" style="border: none; background: none;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Navigation Drawer -->
      <div class="mobile-menu" id="navbarMobileMenu">
        <a href="${base}index.html" class="navbar-link">Home</a>
        <a href="${base}${pages}products.html" class="navbar-link">Products</a>
        <a href="${base}${pages}categories.html" class="navbar-link">Categories</a>
        <a href="${base}${pages}deals.html" class="navbar-link">Deals</a>
        <a href="${base}${pages}services.html" class="navbar-link">Services</a>
        <a href="${base}${pages}about.html" class="navbar-link">About</a>
        <a href="${base}${pages}contact.html" class="navbar-link">Contact</a>
      </div>
    `;

    this.bindEvents();
    this.highlightActivePage();
  }

  highlightActivePage() {
    const path = window.location.pathname;
    let id = '';
    if (path.endsWith('index.html') || path.endsWith('/')) id = 'nav-home';
    else if (path.includes('products.html')) id = 'nav-products';
    else if (path.includes('categories.html')) id = 'nav-categories';
    else if (path.includes('deals.html')) id = 'nav-deals';
    else if (path.includes('services.html')) id = 'nav-services';
    else if (path.includes('about.html')) id = 'nav-about';
    else if (path.includes('contact.html')) id = 'nav-contact';

    if (id) {
      const activeLink = this.querySelector(`#${id}`);
      if (activeLink) activeLink.classList.add('active');
    }
  }

  bindEvents() {
    // Dropdown profile toggle
    const trigger = this.querySelector('#navbarProfileTrigger');
    const dropdown = this.querySelector('#navbarProfileDropdown');
    if (trigger && dropdown) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });
      document.addEventListener('click', () => {
        dropdown.classList.remove('active');
      });
    }

    // Logout Action
    const logoutBtn = this.querySelector('#navbarLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('stackly_currentUser');
        const base = getBasePath();
        const pages = getPagesPath();
        window.location.href = `${base}${pages}login.html`;
      });
    }

    // Mobile menu toggle
    const toggle = this.querySelector('#navbarMenuToggleBtn');
    const mobileMenu = this.querySelector('#navbarMobileMenu');
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
      });
    }

    // Refresh count on custom cart triggers
    window.addEventListener('cartUpdated', () => this.refreshCounters());
    window.addEventListener('wishlistUpdated', () => this.refreshCounters());
  }

  refreshCounters() {
    // Badges are disabled as per design requirements
  }
}
customElements.define('stackly-header', StacklyHeader);

// 3. Stackly Footer Component
class StacklyFooter extends HTMLElement {
  connectedCallback() {
    const base = getBasePath();
    const pages = getPagesPath();
    this.innerHTML = `
      <style>
        .footer-wrapper {
          background: #080a15;
          border-top: 1px solid var(--border-color);
          padding: 5rem 0 2rem 0;
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr repeat(3, 1fr);
          gap: 4rem;
          margin-bottom: 4rem;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-title);
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
        }
        .footer-logo span {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .footer-desc {
          line-height: 1.7;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.75);
        }
        .footer-title {
          font-family: var(--font-title);
          font-size: 1.1rem;
          color: #ffffff;
          font-weight: 600;
          border-bottom: 2px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 0.5rem;
          width: fit-content;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .footer-link {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          transition: color var(--transition-fast), padding-left var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--secondary);
          padding-left: 4px;
        }
        .newsletter-form {
          display: flex;
          gap: 0.5rem;
        }
        .newsletter-form input {
          flex-grow: 1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-size: 0.9rem;
          transition: all var(--transition-normal);
        }
        .newsletter-form input:focus {
          border-color: var(--secondary);
          box-shadow: 0 0 10px var(--secondary-glow);
        }
        .footer-socials {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.75);
          transition: all var(--transition-fast);
        }
        .social-icon:hover {
          background: var(--primary-gradient);
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px var(--primary-glow);
        }
        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      </style>
      <footer class="footer-wrapper">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <a href="${base}index.html" class="footer-logo">
                ${STACKLY_LOGO_SVG(38)}
                Stack<span>ly</span>
              </a>
              <p class="footer-desc">
                Stackly is a next-generation decentralized multi-vendor marketplace featuring high-performance design, neon glassmorphism aesthetics, and native performance.
              </p>
              <div class="footer-socials">
                <a href="${base}${pages}404.html" class="social-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                <a href="${base}${pages}404.html" class="social-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="${base}${pages}404.html" class="social-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>
                <a href="${base}${pages}404.html" class="social-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
              </div>
            </div>
            
            <div class="footer-col">
              <h3 class="footer-title">Platform</h3>
              <div class="footer-links">
                <a href="${base}${pages}about.html" class="footer-link">About Us</a>
                <a href="${base}${pages}services.html" class="footer-link">Services</a>
                <a href="${base}${pages}deals.html" class="footer-link">Active Deals</a>
                <a href="${base}${pages}404.html" class="footer-link">FAQ Support</a>
              </div>
            </div>
 
            <div class="footer-col">
              <h3 class="footer-title">Legal</h3>
              <div class="footer-links">
                <a href="${base}${pages}404.html" class="footer-link">Privacy Policy</a>
                <a href="${base}${pages}404.html" class="footer-link">Terms & Conditions</a>
                <a href="${base}${pages}404.html" class="footer-link">Licenses & Fees</a>
                <a href="${base}${pages}404.html" class="footer-link">Refund Policy</a>
                <a href="${base}${pages}contact.html" class="footer-link">Contact Support</a>
              </div>
            </div>
 
            <div class="footer-col">
              <h3 class="footer-title">Newsletter</h3>
              <p class="footer-desc" style="font-size: 0.9rem;">Receive hot release info and vendor specials straight to your terminal.</p>
              <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed successfully to Stackly newsletter!'); this.reset();">
                <input type="email" placeholder="agent@cosmic.com" required>
                <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1rem;">Go</button>
              </form>
            </div>
          </div>
 
          <div class="footer-bottom">
            <p>&copy; 2026 Stackly Marketplace. Built with Vanilla Web Components. All rights reserved.</p>
            <div style="display: flex; gap: 1.5rem;">
              <a href="${base}${pages}404.html" class="footer-link">Privacy</a>
              <a href="${base}${pages}404.html" class="footer-link">Terms</a>
              <a href="${base}${pages}contact.html" class="footer-link">Support</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}
customElements.define('stackly-footer', StacklyFooter);

// 4. Stackly Sidebar (Dashboard Navigation Panel)
class StacklySidebar extends HTMLElement {
  static get observedAttributes() {
    return ['active'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active' && oldValue !== newValue) {
      const links = this.querySelectorAll('.sidebar-link');
      links.forEach(link => {
        if (link.getAttribute('data-id') === newValue) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  connectedCallback() {
    const base = getBasePath();
    const pages = getPagesPath();
    const role = this.getAttribute('role') || 'customer'; // admin, vendor, customer
    const activeItem = this.getAttribute('active') || 'dashboard';

    // Verify currentUser is logged in
    const currentUser = JSON.parse(localStorage.getItem('stackly_currentUser'));

    let vendorQueryParam = '';
    if (currentUser) {
      let vName = currentUser.username;
      if (currentUser.role === 'vendor' && window.StacklyDB) {
        const matchedVendor = window.StacklyDB.getVendors().find(v =>
          v.name.toLowerCase().includes(currentUser.username.toLowerCase()) ||
          currentUser.username.toLowerCase().includes(v.name.toLowerCase()) ||
          v.name.split(' ')[0].toLowerCase() === currentUser.username.split(' ')[0].toLowerCase()
        ) || window.StacklyDB.getVendors()[0];
        if (matchedVendor) {
          vName = matchedVendor.name;
        }
      }
      vendorQueryParam = '?vendor=' + encodeURIComponent(vName);
    }

    // Sidebar menus definitions
    const menus = {
      admin: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid', link: `${base}${pages}admin-dashboard.html?tab=dashboard` },
        { id: 'users', label: 'Users', icon: 'users', link: `${base}${pages}admin-dashboard.html?tab=users` },
        { id: 'vendors', label: 'Vendors', icon: 'briefcase', link: `${base}${pages}admin-dashboard.html?tab=vendors` },
        { id: 'products', label: 'Products', icon: 'shopping-bag', link: `${base}${pages}admin-dashboard.html?tab=products` },
        { id: 'orders', label: 'Orders', icon: 'clipboard', link: `${base}${pages}admin-dashboard.html?tab=orders` },
        { id: 'reports', label: 'Reports', icon: 'document-text', link: `${base}${pages}admin-dashboard.html?tab=reports` },
        { id: 'analytics', label: 'Analytics', icon: 'presentation-chart', link: `${base}${pages}admin-dashboard.html?tab=analytics` },
        { id: 'settings', label: 'Settings', icon: 'cog', link: `${base}${pages}admin-dashboard.html?tab=settings` }
      ],
      vendor: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid', link: `${base}${pages}vendor-dashboard.html?tab=dashboard` },
        { id: 'products', label: 'My Products', icon: 'shopping-bag', link: `${base}${pages}vendor-dashboard.html?tab=products` },
        { id: 'add-product', label: 'Add Product', icon: 'plus-circle', link: `${base}${pages}vendor-dashboard.html?tab=add-product` },
        { id: 'orders', label: 'Orders', icon: 'clipboard', link: `${base}${pages}vendor-dashboard.html?tab=orders` },
        { id: 'earnings', label: 'Earnings', icon: 'cash', link: `${base}${pages}vendor-dashboard.html?tab=earnings` },
        { id: 'inventory', label: 'Inventory', icon: 'archive', link: `${base}${pages}vendor-dashboard.html?tab=inventory` },
        { id: 'reviews', label: 'Reviews', icon: 'star', link: `${base}${pages}vendor-dashboard.html?tab=reviews` },
        { id: 'settings', label: 'Settings', icon: 'cog', link: `${base}${pages}vendor-dashboard.html?tab=settings` }
      ],
      customer: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid', link: `${base}${pages}customer-dashboard.html?tab=dashboard` },
        { id: 'orders', label: 'My Orders', icon: 'clipboard', link: `${base}${pages}customer-dashboard.html?tab=orders` },
        { id: 'wishlist', label: 'Wishlist', icon: 'heart', link: `${base}${pages}customer-dashboard.html?tab=wishlist` },
        { id: 'cart', label: 'Cart', icon: 'shopping-cart', link: `${base}${pages}customer-dashboard.html?tab=cart` },
        { id: 'profile', label: 'Profile', icon: 'user', link: `${base}${pages}customer-dashboard.html?tab=profile` },
        { id: 'notifications', label: 'Notifications', icon: 'bell', link: `${base}${pages}customer-dashboard.html?tab=notifications` },
        { id: 'reviews', label: 'Reviews', icon: 'star', link: `${base}${pages}customer-dashboard.html?tab=reviews` },
        { id: 'settings', label: 'Settings', icon: 'cog', link: `${base}${pages}customer-dashboard.html?tab=settings` }
      ]
    };

    // SVG Icon Map to avoid dependency libraries
    const iconMap = {
      'grid': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`,
      'users': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
      'briefcase': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
      'shopping-bag': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`,
      'clipboard': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`,
      'document-text': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
      'presentation-chart': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21h8M12 3v18"/></svg>`,
      'cog': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
      'plus-circle': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      'cash': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
      'archive': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>`,
      'star': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z"/></svg>`,
      'heart': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`,
      'shopping-cart': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
      'user': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
      'bell': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>`
    };

    const roleMenu = menus[role] || menus.customer;

    let menuHTML = '';
    roleMenu.forEach(item => {
      const iconSVG = iconMap[item.icon] || '';
      const activeClass = item.id === activeItem ? 'active' : '';
      menuHTML += `
        <a href="${item.link}" class="sidebar-link ${activeClass}" data-id="${item.id}">
          ${iconSVG}
          <span>${item.label}</span>
        </a>
      `;
    });

    this.innerHTML = `
      <aside class="sidebar" id="dashboardSidebar">
        <div class="sidebar-brand" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <a href="${base}index.html" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: inherit; cursor: pointer;">
            ${STACKLY_LOGO_SVG(36)}
            <span style="font-family: var(--font-title); font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">Stack<span style="background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ly</span></span>
          </a>
          <button class="sidebar-close-btn" id="sidebarCloseBtn" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; display: none; padding: 0.25rem;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <nav class="sidebar-menu">
          ${menuHTML}
        </nav>
        
        <div class="sidebar-footer">
          <a href="#" class="sidebar-link" id="sidebarLogoutBtn" style="color: var(--danger);">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span>Log Out</span>
          </a>
        </div>
      </aside>
    `;

    // Logout trigger binding
    const logoutBtn = this.querySelector('#sidebarLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('stackly_currentUser');
        window.location.href = `${base}${pages}login.html`;
      });
    }

    // Mobile drawer Close trigger binding
    const closeBtn = this.querySelector('#sidebarCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const sidebar = this.querySelector('#dashboardSidebar');
        if (sidebar) sidebar.classList.remove('active');
      });
    }
  }
}
customElements.define('stackly-sidebar', StacklySidebar);

// 5. Stackly Dashboard Header (Topbar Navigation Panel)
class StacklyDashboardHeader extends HTMLElement {
  connectedCallback() {
    const base = getBasePath();
    const pages = getPagesPath();
    const currentUser = JSON.parse(localStorage.getItem('stackly_currentUser'));
    const role = currentUser ? currentUser.role : 'customer';
    const username = currentUser ? currentUser.username : 'Guest';

    // Build paths dynamically based on role
    let profileTabUrl = `${base}${pages}customer-dashboard.html?tab=profile`;
    let settingsTabUrl = `${base}${pages}customer-dashboard.html?tab=settings`;
    let notificationsTabUrl = `${base}${pages}customer-dashboard.html?tab=notifications`;

    if (role === 'admin') {
      profileTabUrl = `${base}${pages}admin-dashboard.html?tab=settings`;
      settingsTabUrl = `${base}${pages}admin-dashboard.html?tab=settings`;
      notificationsTabUrl = `${base}${pages}admin-dashboard.html?tab=dashboard`;
    } else if (role === 'vendor') {
      profileTabUrl = `${base}${pages}vendor-dashboard.html?tab=settings`;
      settingsTabUrl = `${base}${pages}vendor-dashboard.html?tab=settings`;
      notificationsTabUrl = `${base}${pages}vendor-dashboard.html?tab=dashboard`;
    }

    // Retrieve attributes
    const titleAttr = this.getAttribute('title');
    const searchId = this.getAttribute('search-id') || 'topbarSearchInput';
    const searchPlaceholder = this.getAttribute('search-placeholder') || 'Search parameters, nodes, logs...';
    const searchOninput = this.getAttribute('search-oninput') || '';
    const searchOnkeypress = this.getAttribute('search-onkeypress') || "if(event.key === 'Enter') window.location.href='404.html'";
    const noSearch = this.hasAttribute('no-search');

    // Title / Search-box left content
    let leftContentHTML = '';
    if (noSearch) {
      if (titleAttr) {
        leftContentHTML = `<span id="topbar-title" style="font-family:var(--font-title); font-size:1.25rem; font-weight:600; margin-left:1rem;">${titleAttr}</span>`;
      }
    } else {
      leftContentHTML = `
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="${searchId}" placeholder="${searchPlaceholder}" ${searchOninput ? `oninput="${searchOninput}"` : ''} onkeypress="${searchOnkeypress}">
        </div>
      `;
    }

    // Determine notification panel header and ID
    let notifTitle = 'Notifications';
    let notifListId = 'topbar-notif-list';
    if (role === 'admin') {
      notifTitle = 'System Signals';
      notifListId = 'admin-notif-list';
    } else if (role === 'vendor') {
      notifTitle = 'Store Alerts';
      notifListId = 'vendor-notif-list';
    } else {
      notifTitle = 'My Updates';
    }

    const initial = username[0].toUpperCase();

    this.innerHTML = `
      <header class="topbar">
        <div class="topbar-left">
          <button class="topbar-action-btn menu-toggle" id="sidebarMobileToggle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          ${leftContentHTML}
        </div>
        <div class="topbar-right">
          <button class="topbar-action-btn pulse-dot" id="topbarNotifTrigger" title="Notifications" onclick="window.location.href='${base}${pages}404.html?from=dashboard&ref=' + encodeURIComponent(window.location.href)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </button>

          <!-- Notifications Overlay -->
          <div class="notification-panel" id="topbarNotifPanel">
            <div class="notification-header">
              <span style="font-weight: 600;">${notifTitle}</span>
              <span class="badge badge-primary" id="topbarNotifBadge">Recent</span>
            </div>
            <div class="notification-list" id="${notifListId}">
              <div style="padding: 1rem; text-align: center; color: var(--text-muted);">
                No unread notification updates.
              </div>
            </div>
            <div class="notification-footer">
              <a href="${notificationsTabUrl}" style="color: var(--primary); font-weight: 600;">View All</a>
            </div>
          </div>

          <!-- User Menu trigger -->
          <div class="profile-menu">
            <div class="profile-trigger" id="topbarProfileTrigger">
              <div class="avatar">${initial}</div>
              <div class="profile-info">
                <span class="name">${username}</span>
                <span class="role" style="text-transform: capitalize;">${role}</span>
              </div>
            </div>
            <div class="dropdown-menu" id="topbarProfileMenu">
              <div class="dropdown-header" style="padding: 0.5rem 1rem; border-bottom: 1px solid var(--border-color); margin-bottom: 0.5rem; display: flex; flex-direction: column; gap: 0.15rem;">
                <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary); text-transform: capitalize;">${username}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: capitalize;">${role}</div>
              </div>
              <div class="dropdown-item" onclick="window.location.href='${profileTabUrl}'">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                My Profile
              </div>
              <div class="dropdown-item" onclick="window.location.href='${settingsTabUrl}'">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Settings
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}
customElements.define('stackly-dashboard-header', StacklyDashboardHeader);

// Global button click handler to redirect to 404 page
document.addEventListener('click', (event) => {
  // 1. If we are on 404.html, let it work normally
  if (window.location.pathname.includes('404.html')) {
    return;
  }

  // 2. Find closest button, element with 'btn' class, or submit inputs
  const button = event.target.closest('button, .btn, input[type="submit"]');
  if (button) {
    // 3. Exclude sidebar and topbar buttons for dashboard pages
    const isDashboardPage =
      window.location.pathname.includes('admin-dashboard.html') ||
      window.location.pathname.includes('vendor-dashboard.html') ||
      window.location.pathname.includes('customer-dashboard.html');

    if (isDashboardPage) {
      if (button.closest('stackly-sidebar') || button.closest('stackly-dashboard-header')) {
        return; // Allow sidebar navigation and topbar options
      }
      // Redirect all other buttons inside the dashboard to 404.html
      event.preventDefault();
      event.stopPropagation();
      const base = getBasePath();
      const dashboardRef = encodeURIComponent(window.location.href);
      window.location.href = `${base}pages/404.html?from=dashboard&ref=${dashboardRef}`;
      return;
    }

    // 4. If we are on login, register, forgot-password, let the buttons work normally
    if (
      window.location.pathname.includes('login.html') ||
      window.location.pathname.includes('register.html') ||
      window.location.pathname.includes('forgot-password.html')
    ) {
      return;
    }

    // 5. Exclude structural utility buttons and login/register links so basic navigation still works
    const href = button.getAttribute('href') || '';
    if (
      button.classList.contains('theme-toggle-btn') ||
      button.classList.contains('carousel-control-btn') ||
      button.classList.contains('banner-slider-btn') ||
      button.id === 'sidebarMobileToggle' ||
      button.id === 'topbarNotifTrigger' ||
      button.id === 'navbarProfileTrigger' ||
      button.id === 'navbarMenuToggleBtn' ||
      button.id === 'sidebarLogoutBtn' ||
      button.id === 'navbarLogoutBtn' ||
      href.includes('login.html') ||
      href.includes('register.html')
    ) {
      return;
    }

    // 6. Redirect to the 404 page using the correct relative path
    event.preventDefault();
    event.stopPropagation();
    const base = getBasePath();
    window.location.href = `${base}pages/404.html`;
  }
}, true); // Use capture phase to intercept before inline handlers run

// Automatically initialize Scroll Reveal Observer for all pages
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
  }
});

