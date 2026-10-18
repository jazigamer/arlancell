const KEY_PRODUCTS = "arlancell_products_v4";
const KEY_LEADS = "arlancell_leads_v4";
const KEY_ORDERS = "arlancell_orders_v4";
const KEY_CATEGORIES = "arlancell_categories_v4";
const KEY_SETTINGS = "arlancell_settings_v4";

const defaultSettings = {
  nomeLoja: "Arlancell",
  whatsapp: "5585982163973",
  email: "contato@arlancell.com.br",
  cupons: { ARLAN10: 0.10, BEMVINDO15: 0.15 },
  freteGratisAcima: 299,
  
  bannerTitle: "iPhone 15 Pro Max",
  bannerSubtitle: "Mais potência. Mais possibilidades.",
  bannerPrice: "R$ 6.999,00",
  bannerImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Exemplo (você troca no admin)
  videoTitulo: "Testando a nova Película 3D da Arlancell",
  videoSubtitulo: "Veja a resistência e o toque premium na prática.",
};

export const storage = {
  getProducts() { try { return JSON.parse(localStorage.getItem(KEY_PRODUCTS)); } catch { return null; } },
  setProducts(p) { localStorage.setItem(KEY_PRODUCTS, JSON.stringify(p)); },

  getLeads() { try { return JSON.parse(localStorage.getItem(KEY_LEADS)) || []; } catch { return []; } },
  addLead(lead) {
    const leads = this.getLeads();
    const novo = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), origem: "newsletter", ...lead };
    leads.push(novo);
    localStorage.setItem(KEY_LEADS, JSON.stringify(leads));
    return novo;
  },
  removeLead(id) { localStorage.setItem(KEY_LEADS, JSON.stringify(this.getLeads().filter((l) => l.id !== id))); },
  clearLeads() { localStorage.removeItem(KEY_LEADS); },

  getOrders() { try { return JSON.parse(localStorage.getItem(KEY_ORDERS)) || []; } catch { return []; } },
  addOrder(order) {
    const orders = this.getOrders();
    const novo = {
      id: crypto.randomUUID(),
      numero: `#${String(orders.length + 1).padStart(4, "0")}`,
      createdAt: new Date().toISOString(),
      status: "pendente",
      ...order,
    };
    orders.push(novo);
    localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
    return novo;
  },
  updateOrderStatus(id, status) {
    const orders = this.getOrders().map((o) => (o.id === id ? { ...o, status } : o));
    localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
  },
  removeOrder(id) { localStorage.setItem(KEY_ORDERS, JSON.stringify(this.getOrders().filter((o) => o.id !== id))); },

  getCategories() { try { return JSON.parse(localStorage.getItem(KEY_CATEGORIES)); } catch { return null; } },
  setCategories(c) { localStorage.setItem(KEY_CATEGORIES, JSON.stringify(c)); },

  getSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY_SETTINGS));
      return { ...defaultSettings, ...(s || {}) };
    } catch { return defaultSettings; }
  },
  setSettings(s) { localStorage.setItem(KEY_SETTINGS, JSON.stringify(s)); },
};




