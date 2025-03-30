// ===== Constants =====
const API_ENDPOINTS = {
  HIBP: 'https://haveibeenpwned.com/api/v3/breachedaccount/',
  IPAPI: 'https://ipapi.co/json/',
  WHOIS: 'https://whoisapi.whoisxmlapi.com/api/v1'
};

// ===== Cache System =====
const cache = new Map();

async function cachedFetch(url, options = {}) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// ===== Tool Handlers =====
const tools = {
  async checkEmail(email) {
    const response = await fetch(`https://email-validator-api.com/v1?email=${email}`);
    return response.json();
  },

  async searchUsername(username) {
    const platforms = await fetch('platforms.json').then(res => res.json());
    return platforms.map(p => ({
      ...p,
      url: p.url.replace('{}', username)
    }));
  },

  async checkBreach(email) {
    const response = await fetch(`${API_ENDPOINTS.HIBP}${email}`, {
      headers: { 'hibp-api-key': 'YOUR_API_KEY' }
    });
    return response.ok ? response.json() : [];
  }
};

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all tool buttons
  document.querySelectorAll('[data-tool]').forEach(button => {
    button.addEventListener('click', async () => {
      const tool = button.dataset.tool;
      const input = document.getElementById(`${tool}-input`).value;
      const resultElement = document.getElementById(`${tool}-result`);
      
      resultElement.innerHTML = '<div class="loading">Processing...</div>';
      
      try {
        const data = await tools[`${tool}Tool`](input);
        resultElement.innerHTML = formatResults(tool, data);
      } catch (error) {
        resultElement.innerHTML = `<div class="error">Error: ${error.message}</div>`;
      }
    });
  });
});
