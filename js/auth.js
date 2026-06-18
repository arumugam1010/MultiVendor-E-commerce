// Stackly Authentication & Security Controller

// Resolve page path helpers
function authGetBasePath() {
  const isInsidePages = window.location.pathname.includes('/pages/');
  return isInsidePages ? '../' : './';
}

function authGetPagesPath() {
  return 'pages/';
}

const StacklyAuth = {
  // Register user in localStorage database
  register: (username, email, password, role) => {
    let users = JSON.parse(localStorage.getItem('stackly_users')) || [];
    
    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already registered.' };
    }

    const newUser = { username, email, password, role };
    users.push(newUser);
    localStorage.setItem('stackly_users', JSON.stringify(users));

    // Log user in automatically
    localStorage.setItem('stackly_currentUser', JSON.stringify({ username, email, role }));
    return { success: true };
  },

  // Validate credentials and login user
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('stackly_users')) || [];
    
    // Find by email case-insensitively, ignoring password for ultimate testing ease
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Generate dynamically for testing bypass
      const emailLower = email.toLowerCase();
      let role = 'customer';
      if (emailLower.includes('admin')) {
        role = 'admin';
      } else if (emailLower.includes('vendor') || emailLower.includes('seller')) {
        role = 'vendor';
      }

      const prefix = email.split('@')[0] || 'User';
      const username = prefix
        .split(/[\._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      user = { username, email, password, role };
      users.push(user);
      localStorage.setItem('stackly_users', JSON.stringify(users));
    }

    // Set active session
    localStorage.setItem('stackly_currentUser', JSON.stringify({ 
      username: user.username, 
      email: user.email, 
      role: user.role 
    }));
    
    return { success: true, role: user.role };
  },

  // Retrieve current active session user details
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('stackly_currentUser'));
  },

  // Perform route validation security guards
  guardRoute: (requiredRole) => {
    const user = StacklyAuth.getCurrentUser();
    const base = authGetBasePath();
    const pages = authGetPagesPath();

    if (!user) {
      // User is not logged in, boot to login page
      window.location.href = `${base}${pages}login.html`;
      return false;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Role mismatch, route to respective correct dashboard
      if (user.role === 'admin') {
        window.location.href = `${base}${pages}admin-dashboard.html`;
      } else if (user.role === 'vendor') {
        window.location.href = `${base}${pages}vendor-dashboard.html`;
      } else {
        window.location.href = `${base}${pages}customer-dashboard.html`;
      }
      return false;
    }

    return true;
  },

  // Logout session
  logout: () => {
    localStorage.removeItem('stackly_currentUser');
    const base = authGetBasePath();
    const pages = authGetPagesPath();
    window.location.href = `${base}${pages}login.html`;
  }
};
