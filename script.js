// ====== Global Variables ======
const apiCache = new Map();
let currentMode = 'email';
let debounceTimer;

// ====== DOM Elements ======
const elements = {
  // Tool Containers
  emailTool: document.getElementById('email-tool'),
  usernameTool: document.getElementById('username-tool'),
  ipTool: document.getElementById('ip-tool'),
  whoisTool: document.getElementById('whois-tool'),
  imageTool: document.getElementById('image-tool'),
  phoneTool: document.getElementById('phone-tool'),
  dorkTool: document.getElementById('dork-tool'),
  btcTool: document.getElementById('btc-tool'),
  youtubeTool: document.getElementById('youtube-tool'),
  screenshotTool: document.getElementById('screenshot-tool'),
  headersTool: document.getElementById('headers-tool'),
  sslTool: document.getElementById('ssl-tool'),
  domainAgeTool: document.getElementById('domain-age-tool'),
  profilePicTool: document.getElementById('profile-pic-tool'),
  archiveTool: document.getElementById('archive-tool'),
  emailPatternTool: document.getElementById('email-pattern-tool'),

  // Inputs
  emailInput: document.getElementById('email-input'),
  usernameInput: document.getElementById('username-input'),
  ipInput: document.getElementById('ip-input'),
  whoisInput: document.getElementById('whois-input'),
  imageInput: document.getElementById('image-input'),
  phoneInput: document.getElementById('phone-input'),
  dorkType: document.getElementById('dork-type'),
  dorkQuery: document.getElementById('dork-query'),
  btcInput: document.getElementById('btc-input'),
  youtubeInput: document.getElementById('youtube-input'),
  screenshotInput: document.getElementById('screenshot-input'),
  headersInput: document.getElementById('headers-input'),
  sslInput: document.getElementById('ssl-input'),
  domainAgeInput: document.getElementById('domain-age-input'),
  profilePicInput: document.getElementById('profile-pic-input'),
  archiveInput: document.getElementById('archive-input'),
  emailPatternInput: document.getElementById('email-pattern-input'),

  // Buttons
  checkEmail: document.getElementById('check-email'),
  checkUsername: document.getElementById('check-username'),
  checkIp: document.getElementById('check-ip'),
  checkWhois: document.getElementById('check-whois'),
  checkPhone: document.getElementById('check-phone'),
  generateDork: document.getElementById('generate-dork'),
  checkBtc: document.getElementById('check-btc'),
  checkYoutube: document.getElementById('check-youtube'),
  takeScreenshot: document.getElementById('take-screenshot'),
  checkHeaders: document.getElementById('check-headers'),
  checkSsl: document.getElementById('check-ssl'),
  checkDomainAge: document.getElementById('check-domain-age'),
  checkProfilePic: document.getElementById('check-profile-pic'),
  checkArchive: document.getElementById('check-archive'),
  checkEmailPattern: document.getElementById('check-email-pattern'),
  darkModeToggle: document.getElementById('dark-mode-toggle'),

  // Results
  emailResult: document.getElementById('email-result'),
  usernameResult: document.getElementById('username-result'),
  ipResult: document.getElementById('ip-result'),
  whoisResult: document.getElementById('whois-result'),
  imageResult: document.getElementById('image-result'),
  phoneResult: document.getElementById('phone-result'),
  dorkResult: document.getElementById('dork-result'),
  btcResult: document.getElementById('btc-result'),
  youtubeResult: document.getElementById('youtube-result'),
  screenshotResult: document.getElementById('screenshot-result'),
  headersResult: document.getElementById('headers-result'),
  sslResult: document.getElementById('ssl-result'),
  domainAgeResult: document.getElementById('domain-age-result'),
  profilePicResult: document.getElementById('profile-pic-result'),
  archiveResult: document.getElementById('archive-result'),
  emailPatternResult: document.getElementById('email-pattern-result')
};

// ====== Tool Switching ======
document.querySelectorAll('.tool-selector button').forEach(button => {
  button.addEventListener('click', () => {
    // Update active button
    document.querySelectorAll('.tool-selector button').forEach(btn => 
      btn.classList.remove('active'));
    button.classList.add('active');
    
    // Hide all tools
    document.querySelectorAll('.tool').forEach(tool => 
      tool.style.display = 'none');
    
    // Show selected tool
    currentMode = button.dataset.tool;
    document.getElementById(`${currentMode}-tool`).style.display = 'block';
  });
});

// ====== API Functions with Caching ======
async function cachedFetch(url, options = {}) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  // Return cached response if available
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    apiCache.set(cacheKey, data);
    return data;
    
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// ====== Tool Functions ======

// 1. Email Verification
elements.checkEmail.addEventListener('click', async () => {
  try {
    elements.emailResult.textContent = "Verifying...";
    const email = elements.emailInput.value.trim();
    if (!email) throw new Error("Please enter an email");
    
    const data = await cachedFetch(
      `https://apilayer.net/api/check?access_key=YOUR_MAILBOXLAYER_KEY&email=${email}`
    );
    
    elements.emailResult.innerHTML = data.format_valid && data.smtp_check
      ? `<span class="success">✅ Valid email (${email})</span>`
      : `<span class="error">❌ Invalid or non-existent email</span>`;
    
  } catch (error) {
    elements.emailResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 2. Username Search
elements.checkUsername.addEventListener('click', async () => {
  try {
    elements.usernameResult.innerHTML = "<div class='loading'>Searching...</div>";
    const username = elements.usernameInput.value.trim();
    if (!username) throw new Error("Please enter a username");
    
    const response = await fetch('platforms.json');
    const platforms = await response.json();
    
    let results = platforms.map(site => {
      const url = site.url.replace('{}', username);
      return `<div class="platform-result">
                <a href="${url}" target="_blank">${site.name}</a>
                <button class="copy-btn" data-url="${url}">📋</button>
              </div>`;
    }).join('');
    
    elements.usernameResult.innerHTML = `
      <h3>Results for "${username}":</h3>
      ${results}
    `;
    
    // Add copy functionality
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        navigator.clipboard.writeText(e.target.dataset.url);
        e.target.textContent = "Copied!";
        setTimeout(() => e.target.textContent = "📋", 2000);
      });
    });
    
  } catch (error) {
    elements.usernameResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 3. IP Lookup
elements.checkIp.addEventListener('click', async () => {
  try {
    elements.ipResult.textContent = "Fetching...";
    const ip = elements.ipInput.value.trim();
    if (!ip) throw new Error("Please enter an IP");
    
    const data = await cachedFetch(`https://ipapi.co/${ip}/json/`);
    
    elements.ipResult.innerHTML = `
      <strong>IP:</strong> ${data.ip}<br>
      <strong>Location:</strong> ${data.city}, ${data.country_name}<br>
      <strong>ISP:</strong> ${data.org}<br>
      <strong>ASN:</strong> ${data.asn}<br>
      <strong>Coordinates:</strong> ${data.latitude}, ${data.longitude}
    `;
    
  } catch (error) {
    elements.ipResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 4. WHOIS Lookup
elements.checkWhois.addEventListener('click', async () => {
  try {
    elements.whoisResult.textContent = "Fetching...";
    const domain = elements.whoisInput.value.trim();
    if (!domain) throw new Error("Please enter a domain");
    
    const data = await cachedFetch(`https://whois.freeaiapi.xyz/?name=${domain}`);
    
    elements.whoisResult.innerHTML = `
      <strong>Domain:</strong> ${domain}<br>
      <strong>Created:</strong> ${data.creation_date || 'N/A'}<br>
      <strong>Expires:</strong> ${data.expiration_date || 'N/A'}<br>
      <strong>Registrar:</strong> ${data.registrar || 'N/A'}<br>
      <strong>Status:</strong> ${data.domain_status || 'N/A'}
    `;
    
  } catch (error) {
    elements.whoisResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 5. Reverse Image Search
elements.imageInput.addEventListener('change', (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;
    
    elements.imageResult.innerHTML = "<div class='loading'>Preparing search...</div>";
    
    const reader = new FileReader();
    reader.onload = (event) => {
      elements.imageResult.innerHTML = `
        <img src="${event.target.result}" class="preview-image">
        <div class="image-actions">
          <button onclick="searchGoogleLens()">Search Google Lens</button>
          <button onclick="searchTineye()">Search TinEye</button>
        </div>
      `;
    };
    reader.readAsDataURL(file);
    
  } catch (error) {
    elements.imageResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

function searchGoogleLens() {
  const file = elements.imageInput.files[0];
  const url = URL.createObjectURL(file);
  window.open(`https://lens.google.com/uploadbyurl?url=${url}`, '_blank');
}

function searchTineye() {
  alert("For TinEye, you need their API key. See documentation.");
}

// 6. Phone Lookup
elements.checkPhone.addEventListener('click', async () => {
  try {
    elements.phoneResult.textContent = "Checking...";
    const phone = elements.phoneInput.value.trim();
    if (!phone) throw new Error("Please enter a phone number");
    
    const data = await cachedFetch(
      `http://apilayer.net/api/validate?access_key=YOUR_NUMVERIFY_KEY&number=${phone}`
    );
    
    elements.phoneResult.innerHTML = `
      <strong>Number:</strong> ${phone}<br>
      <strong>Valid:</strong> ${data.valid ? '✅' : '❌'}<br>
      <strong>Carrier:</strong> ${data.carrier || 'N/A'}<br>
      <strong>Location:</strong> ${data.location || 'N/A'}<br>
      <strong>Country:</strong> ${data.country_name || 'N/A'}
    `;
    
  } catch (error) {
    elements.phoneResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 7. Google Dork Generator
elements.generateDork.addEventListener('click', () => {
  try {
    const dork = elements.dorkType.value;
    const query = elements.dorkQuery.value.trim();
    if (!query) throw new Error("Please enter a search term");
    
    const url = `https://google.com/search?q=${dork}${encodeURIComponent(query)}`;
    elements.dorkResult.innerHTML = `
      <p>Generated Dork:</p>
      <code>${dork}${query}</code>
      <a href="${url}" target="_blank" class="search-btn">Search on Google</a>
    `;
    
  } catch (error) {
    elements.dorkResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 8. BTC Address Lookup
elements.checkBtc.addEventListener('click', () => {
  try {
    const address = elements.btcInput.value.trim();
    if (!address) throw new Error("Please enter a BTC address");
    
    elements.btcResult.innerHTML = `
      <p>Opening Blockchain Explorer...</p>
      <a href="https://www.blockchain.com/explorer/addresses/btc/${address}" 
         target="_blank" 
         class="explorer-btn">
        View Address
      </a>
    `;
    window.open(`https://www.blockchain.com/explorer/addresses/btc/${address}`, '_blank');
    
  } catch (error) {
    elements.btcResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 9. YouTube Data Extractor
elements.checkYoutube.addEventListener('click', async () => {
  try {
    elements.youtubeResult.textContent = "Extracting...";
    const url = elements.youtubeInput.value.trim();
    if (!url.includes("youtube.com")) throw new Error("Invalid YouTube URL");
    
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) throw new Error("Couldn't extract video ID");
    
    const data = await cachedFetch(`https://noembed.com/embed?url=https://youtube.com/watch?v=${videoId}`);
    
    elements.youtubeResult.innerHTML = `
      <div class="video-info">
        <img src="${data.thumbnail_url}" class="video-thumbnail">
        <div>
          <strong>Title:</strong> ${data.title}<br>
          <strong>Channel:</strong> ${data.author_name}<br>
          <strong>Duration:</strong> ${data.duration || 'N/A'}<br>
          <a href="${data.url}" target="_blank">Watch on YouTube</a>
        </div>
      </div>
    `;
    
  } catch (error) {
    elements.youtubeResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 10. Website Screenshot
elements.takeScreenshot.addEventListener('click', async () => {
  try {
    elements.screenshotResult.innerHTML = "<div class='loading'>Capturing...</div>";
    const url = elements.screenshotInput.value.trim();
    if (!url) throw new Error("Please enter a URL");
    
    // Using html2canvas for client-side screenshots
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `https://cors-anywhere.herokuapp.com/${url}`;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      html2canvas(iframe.contentDocument.body).then(canvas => {
        elements.screenshotResult.innerHTML = '';
        elements.screenshotResult.appendChild(canvas);
        document.body.removeChild(iframe);
      });
    };
    
  } catch (error) {
    elements.screenshotResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 11. HTTP Headers Analyzer
elements.checkHeaders.addEventListener('click', async () => {
  try {
    elements.headersResult.textContent = "Analyzing...";
    const url = elements.headersInput.value.trim();
    if (!url) throw new Error("Please enter a URL");
    
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const headers = {};
    response.headers.forEach((value, key) => headers[key] = value);
    
    elements.headersResult.innerHTML = `
      <pre>${JSON.stringify(headers, null, 2)}</pre>
    `;
    
  } catch (error) {
    elements.headersResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 12. SSL Certificate Checker
elements.checkSsl.addEventListener('click', async () => {
  try {
    elements.sslResult.textContent = "Checking...";
    const domain = elements.sslInput.value.trim();
    if (!domain) throw new Error("Please enter a domain");
    
    const data = await cachedFetch(`https://api.ssllabs.com/api/v3/analyze?host=${domain}`);
    
    elements.sslResult.innerHTML = `
      <strong>Domain:</strong> ${domain}<br>
      <strong>Grade:</strong> ${data.endpoints?.[0]?.grade || 'N/A'}<br>
      <strong>Issuer:</strong> ${data.certs?.[0]?.issuerSubject || 'N/A'}<br>
      <strong>Expires:</strong> ${data.certs?.[0]?.notAfter || 'N/A'}
    `;
    
  } catch (error) {
    elements.sslResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 13. Domain Age Checker (New)
elements.checkDomainAge.addEventListener('click', async () => {
  try {
    elements.domainAgeResult.textContent = "Checking...";
    const domain = elements.domainAgeInput.value.trim();
    if (!domain) throw new Error("Please enter a domain");
    
    const data = await cachedFetch(`https://api.whois.vu/?q=${domain}`);
    
    elements.domainAgeResult.innerHTML = `
      <strong>Domain:</strong> ${domain}<br>
      <strong>Created:</strong> ${data.created || 'N/A'}<br>
      <strong>Age:</strong> ${data.age ? `${data.age} days` : 'N/A'}<br>
      <strong>Expires:</strong> ${data.expires || 'N/A'}
    `;
    
  } catch (error) {
    elements.domainAgeResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 14. Profile Picture Viewer (New)
elements.checkProfilePic.addEventListener('click', async () => {
  try {
    elements.profilePicResult.innerHTML = "<div class='loading'>Searching...</div>";
    const username = elements.profilePicInput.value.trim();
    if (!username) throw new Error("Please enter a username");
    
    const services = {
      Twitter: `https://unavatar.io/twitter/${username}`,
      GitHub: `https://unavatar.io/github/${username}`,
      Instagram: `https://unavatar.io/instagram/${username}`,
      Reddit: `https://unavatar.io/reddit/${username}`
    };
    
    let results = '';
    for (const [service, url] of Object.entries(services)) {
      results += `
        <div class="profile-pic-service">
          <h4>${service}</h4>
          <img src="${url}" onerror="this.style.display='none'">
          <a href="${url}" target="_blank">View Full</a>
        </div>
      `;
    }
    
    elements.profilePicResult.innerHTML = `
      <h3>Profile Pictures for "${username}":</h3>
      <div class="profile-pics-grid">${results}</div>
    `;
    
  } catch (error) {
    elements.profilePicResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 15. Page Archive Checker (New)
elements.checkArchive.addEventListener('click', async () => {
  try {
    elements.archiveResult.textContent = "Checking...";
    const url = elements.archiveInput.value.trim();
    if (!url) throw new Error("Please enter a URL");
    
    const data = await cachedFetch(`https://archive.org/wayback/available?url=${url}`);
    
    if (data.archived_snapshots?.closest) {
      elements.archiveResult.innerHTML = `
        <strong>URL:</strong> ${url}<br>
        <strong>Last Archived:</strong> ${data.archived_snapshots.closest.timestamp}<br>
        <a href="${data.archived_snapshots.closest.url}" target="_blank">View Archive</a>
      `;
    } else {
      elements.archiveResult.innerHTML = "No archived versions found";
    }
    
  } catch (error) {
    elements.archiveResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// 16. Email Pattern Search (New)
elements.checkEmailPattern.addEventListener('click', async () => {
  try {
    elements.emailPatternResult.textContent = "Searching...";
    const domain = elements.emailPatternInput.value.trim();
    if (!domain) throw new Error("Please enter a domain");
    
    const data = await cachedFetch(
      `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=YOUR_HUNTER_KEY`
    );
    
    if (data.data?.pattern) {
      elements.emailPatternResult.innerHTML = `
        <strong>Domain:</strong> ${domain}<br>
        <strong>Common Pattern:</strong> ${data.data.pattern}<br>
        <strong>Confidence:</strong> ${data.data.confidence || 'N/A'}%<br>
        <strong>Sample Email:</strong> ${data.data.pattern.replace('{first}', 'john').replace('{last}', 'doe')}@${domain}
      `;
    } else {
      elements.emailPatternResult.innerHTML = "No common email pattern found";
    }
    
  } catch (error) {
    elements.emailPatternResult.innerHTML = `<span class="error">⚠️ ${error.message}</span>`;
  }
});

// ====== Utility Functions ======

// Dark Mode Toggle
elements.darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  elements.darkModeToggle.textContent = document.body.classList.contains('dark-mode')
    ? '☀️ Light Mode'
    : '🌙 Dark Mode';
  
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  elements.darkModeToggle.textContent = '☀️ Light Mode';
}

// Debounce function for input events
function debounce(func, delay) {
  return function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
  };
}

// Initialize tool
document.getElementById('email-tool').style.display = 'block';
