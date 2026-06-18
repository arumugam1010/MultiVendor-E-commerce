// Mock Database for Stackly Marketplace

// Inline SVGs for premium looking products to avoid broken placeholder links
function adjustImagePath(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('data:') || imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  let cleanPath = imagePath;
  while (cleanPath.startsWith('../') || cleanPath.startsWith('./')) {
    if (cleanPath.startsWith('../')) {
      cleanPath = cleanPath.slice(3);
    } else {
      cleanPath = cleanPath.slice(2);
    }
  }
  const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
  return prefix + cleanPath;
}

function normalizeImagePath(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('data:') || imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  let cleanPath = imagePath;
  while (cleanPath.startsWith('../') || cleanPath.startsWith('./')) {
    if (cleanPath.startsWith('../')) {
      cleanPath = cleanPath.slice(3);
    } else {
      cleanPath = cleanPath.slice(2);
    }
  }
  if (!cleanPath.startsWith('assets/')) {
    cleanPath = 'assets/' + cleanPath;
  }
  return cleanPath;
}

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', count: 1840, icon: 'cpu' },
  { id: 'fashion', name: 'Fashion & Apparel', count: 2450, icon: 'shirt' },
  { id: 'home', name: 'Home & Living', count: 920, icon: 'home' },
  { id: 'sports', name: 'Sports & Outdoors', count: 650, icon: 'activity' },
  { id: 'books', name: 'Books & Office', count: 480, icon: 'book' },
  { id: 'beauty', name: 'Beauty & Health', count: 710, icon: 'sparkles' }
];

const VENDORS = [
  { id: 'v1', name: 'NovaTech Enterprises', rating: 4.9, sales: '1,240', logo: 'N', image: 'electronics' },
  { id: 'v2', name: 'Aura Fashion House', rating: 4.8, sales: '2,890', logo: 'A', image: 'fashion' },
  { id: 'v3', name: 'Stellar Living Co.', rating: 4.7, sales: '940', logo: 'S', image: 'home' },
  { id: 'v4', name: 'Velocity Sports', rating: 4.6, sales: '1,120', logo: 'V', image: 'sports' }
];

const PRODUCTS = [
  {
    id: 'p1',
    name: 'StackPhone 14 Pro Neon',
    price: 999.00,
    rating: 4.9,
    reviewsCount: 124,
    category: 'electronics',
    image: 'assets/phone.webp',
    vendor: 'NovaTech Enterprises',
    description: 'Experience futuristic connectivity with the neon-infused StackPhone 14 Pro. Equipped with a triple-lens holo-camera and cosmic display.',
    featured: true,
    trending: true,
    deal: true,
    discount: 10
  },
  {
    id: 'p2',
    name: 'AetherBook Carbon Pro',
    price: 1499.00,
    rating: 4.8,
    reviewsCount: 89,
    category: 'electronics',
    image: 'assets/laptop.webp',
    vendor: 'NovaTech Enterprises',
    description: 'Ultrathin aerospace carbon body, matching high performance with a stellar HSL-rendered dynamic display screen.',
    featured: true,
    trending: false,
    deal: false,
    discount: 0
  },
  {
    id: 'p3',
    name: 'Stellar Pulse Chronograph',
    price: 249.00,
    rating: 4.7,
    reviewsCount: 54,
    category: 'electronics',
    image: 'assets/watch.webp',
    vendor: 'NovaTech Enterprises',
    description: 'Keep track of space-time with this premium neon digital watch, featuring light pulse bio-sensors.',
    featured: false,
    trending: true,
    deal: true,
    discount: 20
  },
  {
    id: 'p4',
    name: 'Cosmic Sound ANC Headphones',
    price: 199.00,
    rating: 4.6,
    reviewsCount: 202,
    category: 'electronics',
    image: 'assets/headphones.webp',
    vendor: 'NovaTech Enterprises',
    description: 'High-fidelity audio coupled with active background space-noise cancelling.',
    featured: true,
    trending: true,
    deal: true,
    discount: 15
  },
  {
    id: 'p5',
    name: 'Aura Zero Gravity Sneakers',
    price: 129.00,
    rating: 4.9,
    reviewsCount: 340,
    category: 'fashion',
    image: 'assets/aura_sneakers_realistic.webp',
    vendor: 'Aura Fashion House',
    description: 'Walk on cloud dust. Premium mesh design with energy return glowing soles.',
    featured: true,
    trending: true,
    deal: false,
    discount: 0
  },
  {
    id: 'p6',
    name: 'Cosmos Cyberpunk Parka',
    price: 189.00,
    rating: 4.5,
    reviewsCount: 68,
    category: 'fashion',
    image: 'assets/jacket.webp',
    vendor: 'Aura Fashion House',
    description: 'Waterproof multi-pocket jacket with neon glow strips, perfect for urban exploration.',
    featured: false,
    trending: true,
    deal: true,
    discount: 25
  },
  {
    id: 'p7',
    name: 'Lumina 4K Streamer Camera',
    price: 320.00,
    rating: 4.8,
    reviewsCount: 41,
    category: 'electronics',
    image: 'assets/camera.webp',
    vendor: 'NovaTech Enterprises',
    description: 'Auto-tracking AI lens with integrated ring light for flawless stream output.',
    featured: false,
    trending: false,
    deal: false,
    discount: 0
  },
  {
    id: 'p8',
    name: 'Nebula Ergonomic Pod Chair',
    price: 450.00,
    rating: 4.7,
    reviewsCount: 97,
    category: 'home',
    image: 'assets/chair.webp',
    vendor: 'Stellar Living Co.',
    description: 'Zero gravity support designed for long-duration stack programming sessions.',
    featured: true,
    trending: false,
    deal: true,
    discount: 5
  },
  {
    id: 'p9',
    name: 'Quantum Espresso Pro Maker',
    price: 389.00,
    rating: 4.8,
    reviewsCount: 76,
    category: 'home',
    image: 'assets/home_espresso.webp',
    vendor: 'Stellar Living Co.',
    description: 'A premium modern stainless steel espresso maker for perfect morning brews, styled beautifully for futuristic kitchens.',
    featured: true,
    trending: true,
    deal: true,
    discount: 10
  },
  {
    id: 'p10',
    name: 'NeonPulse RGB Mechanical Keyboard',
    price: 159.00,
    rating: 4.9,
    reviewsCount: 112,
    category: 'electronics',
    image: 'assets/elec_keyboard.webp',
    vendor: 'NovaTech Enterprises',
    description: 'An ergonomic mechanical gaming keyboard featuring clicky tactile switches and glowing multi-zone RGB LED lighting patterns.',
    featured: true,
    trending: true,
    deal: true,
    discount: 15
  },
  {
    id: 'p11',
    name: 'Astra Leather Cyber Backpack',
    price: 120.00,
    rating: 4.7,
    reviewsCount: 43,
    category: 'fashion',
    image: 'assets/fashion_backpack.webp',
    vendor: 'Aura Fashion House',
    description: 'Minimalist black top-grain leather backpack built with waterproof zippers and a padded 16-inch laptop pocket.',
    featured: true,
    trending: false,
    deal: false,
    discount: 0
  },
  {
    id: 'p12',
    name: 'NovaPods ANC Wireless Earbuds',
    price: 89.00,
    rating: 4.8,
    reviewsCount: 95,
    category: 'electronics',
    image: 'assets/elec_earbuds.webp',
    vendor: 'NovaTech Enterprises',
    description: 'True wireless stereo earbuds with active background noise-cancelling (ANC) audio and compact matte charging case.',
    featured: true,
    trending: true,
    deal: true,
    discount: 20
  }
];

const INITIAL_USERS = [
  {
    username: 'Stackly Admin',
    email: 'admin@stackly.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'NovaTech Seller',
    email: 'vendor@stackly.com',
    password: 'vendor123',
    role: 'vendor'
  },
  {
    username: 'Alex Mercer',
    email: 'customer@stackly.com',
    password: 'customer123',
    role: 'customer'
  }
];

const MOCK_ORDERS = [
  { id: 'STK-9402', customer: 'Alex Mercer', date: 'Jun 17, 2026', total: 1198.00, status: 'Paid', items: '2x StackPhone' },
  { id: 'STK-8501', customer: 'Alex Mercer', date: 'Jun 16, 2026', total: 1499.00, status: 'Paid', items: '1x AetherBook' },
  { id: 'STK-7294', customer: 'Alex Mercer', date: 'Jun 15, 2026', total: 129.00, status: 'Pending', items: '1x Gravity Shoes' },
  { id: 'STK-6102', customer: 'Alex Mercer', date: 'Jun 14, 2026', total: 199.00, status: 'Paid', items: '1x Cosmic ANC' },
  { id: 'STK-5049', customer: 'Alex Mercer', date: 'Jun 12, 2026', total: 249.00, status: 'Cancelled', items: '1x Pulse Watch' }
];

const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'New Vendor Application', desc: 'Quantum Systems requests approval', time: '5 mins ago', icon: 'vendor' },
  { id: 'n2', title: 'Order Completed', desc: 'Order STK-8501 shipped successfully', time: '2 hours ago', icon: 'order' },
  { id: 'n3', title: 'Inventory Alert', desc: 'Stellar Pulse Chronograph running low', time: '1 day ago', icon: 'alert' }
];

const MOCK_REVIEWS = [
  { name: 'Bruce W.', rating: 5, comment: 'The AetherBook Carbon is extremely lightweight. Visual excellence matches the high processing speed.' },
  { name: 'Sarah C.', rating: 5, comment: 'StackPhone Pro neon display looks awesome! The dark UI glows in daylight. Super premium build!' },
  { name: 'Clark K.', rating: 4, comment: 'Great noise-cancelling headphones. Comfortable, blocks sound perfectly. Fast delivery.' }
];

// Helper to seed localStorage databases if they do not exist yet or are outdated
function seedDatabase() {
  const currentSeedVersion = '10'; // Force refresh seed databases
  const seededVersion = localStorage.getItem('stackly_seed_version');
  
  if (seededVersion !== currentSeedVersion) {
    localStorage.removeItem('stackly_users');
    localStorage.removeItem('stackly_products');
    localStorage.removeItem('stackly_vendors');
    localStorage.removeItem('stackly_orders');
    localStorage.removeItem('stackly_notifications');
    localStorage.removeItem('stackly_reviews');
    localStorage.removeItem('stackly_cart');
    localStorage.removeItem('stackly_wishlist');
    localStorage.setItem('stackly_seed_version', currentSeedVersion);
  }

  if (!localStorage.getItem('stackly_users')) {
    localStorage.setItem('stackly_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('stackly_products')) {
    localStorage.setItem('stackly_products', JSON.stringify(PRODUCTS));
  }
  if (!localStorage.getItem('stackly_vendors')) {
    localStorage.setItem('stackly_vendors', JSON.stringify(VENDORS));
  }
  if (!localStorage.getItem('stackly_orders')) {
    localStorage.setItem('stackly_orders', JSON.stringify(MOCK_ORDERS));
  }
  if (!localStorage.getItem('stackly_notifications')) {
    localStorage.setItem('stackly_notifications', JSON.stringify(MOCK_NOTIFICATIONS));
  }
  if (!localStorage.getItem('stackly_reviews')) {
    localStorage.setItem('stackly_reviews', JSON.stringify(MOCK_REVIEWS));
  }
  if (!localStorage.getItem('stackly_wishlist')) {
    const defaultWishlist = [
      PRODUCTS[0], // StackPhone 14 Pro Neon
      PRODUCTS[2], // Stellar Pulse Chronograph
      PRODUCTS[4], // Aura Zero Gravity Sneakers
      PRODUCTS[9]  // NeonPulse RGB Mechanical Keyboard
    ];
    localStorage.setItem('stackly_wishlist', JSON.stringify(defaultWishlist));
  }
  if (!localStorage.getItem('stackly_cart')) {
    const defaultCart = [
      { ...PRODUCTS[1], quantity: 1 },  // AetherBook Carbon Pro
      { ...PRODUCTS[3], quantity: 1 },  // Cosmic Sound ANC Headphones
      { ...PRODUCTS[7], quantity: 1 },  // Nebula Ergonomic Pod Chair
      { ...PRODUCTS[10], quantity: 1 }  // Astra Leather Cyber Backpack
    ];
    localStorage.setItem('stackly_cart', JSON.stringify(defaultCart));
  }
}

// Self-run on include
seedDatabase();

// Export variables or attach to window for easy Vanilla HTML/JS access
window.StacklyDB = {
  getCategories: () => CATEGORIES,
  getProducts: () => {
    const prods = JSON.parse(localStorage.getItem('stackly_products')) || PRODUCTS;
    return prods.map(p => ({ ...p, image: adjustImagePath(p.image) }));
  },
  getVendors: () => JSON.parse(localStorage.getItem('stackly_vendors')) || VENDORS,
  getOrders: () => JSON.parse(localStorage.getItem('stackly_orders')) || MOCK_ORDERS,
  getNotifications: () => JSON.parse(localStorage.getItem('stackly_notifications')) || MOCK_NOTIFICATIONS,
  getReviews: () => JSON.parse(localStorage.getItem('stackly_reviews')) || MOCK_REVIEWS,
  
  saveProducts: (prods) => {
    const normalized = prods.map(p => ({ ...p, image: normalizeImagePath(p.image) }));
    localStorage.setItem('stackly_products', JSON.stringify(normalized));
  },
  saveOrders: (ords) => localStorage.setItem('stackly_orders', JSON.stringify(ords)),
  saveNotifications: (notifs) => localStorage.setItem('stackly_notifications', JSON.stringify(notifs)),
  
  addToCart: (product, qty = 1) => {
    let cart = JSON.parse(localStorage.getItem('stackly_cart')) || [];
    let normalizedProduct = { ...product, image: normalizeImagePath(product.image) };
    let existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.push({ ...normalizedProduct, quantity: qty });
    }
    localStorage.setItem('stackly_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  },
  
  getCart: () => {
    const cart = JSON.parse(localStorage.getItem('stackly_cart')) || [];
    return cart.map(item => ({ ...item, image: adjustImagePath(item.image) }));
  },
  clearCart: () => {
    localStorage.setItem('stackly_cart', JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'));
  },
  
  addToWishlist: (product) => {
    let wishlist = JSON.parse(localStorage.getItem('stackly_wishlist')) || [];
    let normalizedProduct = { ...product, image: normalizeImagePath(product.image) };
    if (!wishlist.find(item => item.id === product.id)) {
      wishlist.push(normalizedProduct);
    }
    localStorage.setItem('stackly_wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
  },
  
  getWishlist: () => {
    const wishlist = JSON.parse(localStorage.getItem('stackly_wishlist')) || [];
    return wishlist.map(item => ({ ...item, image: adjustImagePath(item.image) }));
  },
  removeFromWishlist: (id) => {
    let wishlist = JSON.parse(localStorage.getItem('stackly_wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== id);
    const normalized = wishlist.map(item => ({ ...item, image: normalizeImagePath(item.image) }));
    localStorage.setItem('stackly_wishlist', JSON.stringify(normalized));
    window.dispatchEvent(new Event('wishlistUpdated'));
  }
};
