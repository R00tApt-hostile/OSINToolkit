// Tool switcher
document.querySelectorAll('.tool-selector button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tool').forEach(tool => tool.style.display = 'none');
        document.querySelector(`#${button.dataset.tool}-tool`).style.display = 'block';
    });
});

// Email Verification
document.getElementById('check-email').addEventListener('click', async () => {
    const email = document.getElementById('email-input').value;
    if (!email) return;
    
    const resultDiv = document.getElementById('email-result');
    resultDiv.textContent = "Checking...";
    
    try {
        const response = await fetch(`https://apilayer.net/api/check?access_key=YOUR_MAILBOXLAYER_KEY&email=${email}`);
        const data = await response.json();
        resultDiv.textContent = data.format_valid && data.smtp_check 
            ? `✅ Valid email (${email})` 
            : `❌ Invalid or non-existent email`;
    } catch (error) {
        resultDiv.textContent = "Error: API limit reached or network issue";
    }
});

// Username Search
document.getElementById('check-username').addEventListener('click', async () => {
    const username = document.getElementById('username-input').value;
    if (!username) return;
    
    const resultDiv = document.getElementById('username-result');
    resultDiv.innerHTML = "<h3>Searching...</h3>";
    
    try {
        const response = await fetch('platforms.json');
        const platforms = await response.json();
        let results = platforms.map(site => 
            `<a href="${site.url.replace('{}', username)}" target="_blank">${site.name}</a>`
        ).join('<br>');
        resultDiv.innerHTML = `<h3>Results for "${username}":</h3>${results}`;
    } catch (error) {
        resultDiv.textContent = "Error loading platforms";
    }
});

// IP Lookup
document.getElementById('check-ip').addEventListener('click', async () => {
    const ip = document.getElementById('ip-input').value;
    if (!ip) return;
    
    const resultDiv = document.getElementById('ip-result');
    resultDiv.textContent = "Fetching...";
    
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        resultDiv.innerHTML = `
            <strong>IP:</strong> ${data.ip}<br>
            <strong>Location:</strong> ${data.city}, ${data.country}<br>
            <strong>ISP:</strong> ${data.org}<br>
            <strong>ASN:</strong> ${data.asn}
        `;
    } catch (error) {
        resultDiv.textContent = "Error: API limit reached or invalid IP";
    }
});

// WHOIS Lookup
document.getElementById('check-whois').addEventListener('click', async () => {
    const domain = document.getElementById('whois-input').value;
    if (!domain) return;
    
    const resultDiv = document.getElementById('whois-result');
    resultDiv.textContent = "Fetching...";
    
    try {
        const response = await fetch(`https://whois.freeaiapi.xyz/?name=${domain}`);
        const data = await response.json();
        resultDiv.textContent = `Created: ${data.creation_date || 'N/A'}\nExpires: ${data.expiration_date || 'N/A'}\nRegistrar: ${data.registrar || 'N/A'}`;
    } catch (error) {
        resultDiv.textContent = "Error fetching WHOIS data";
    }
});

// Reverse Image Search
document.getElementById('image-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const resultDiv = document.getElementById('image-result');
    resultDiv.textContent = "Opening Google Lens...";
    const googleUrl = `https://lens.google.com/uploadbyurl?url=${URL.createObjectURL(file)}`;
    window.open(googleUrl, '_blank');
});

// Phone Lookup
document.getElementById('check-phone').addEventListener('click', async () => {
    const phone = document.getElementById('phone-input').value;
    if (!phone) return;
    
    const resultDiv = document.getElementById('phone-result');
    resultDiv.textContent = "Checking...";
    
    try {
        const response = await fetch(`http://apilayer.net/api/validate?access_key=YOUR_NUMVERIFY_KEY&number=${phone}`);
        const data = await response.json();
        resultDiv.textContent = `Carrier: ${data.carrier || 'N/A'}\nLocation: ${data.location || 'N/A'}`;
    } catch (error) {
        resultDiv.textContent = "Error: API key required";
    }
});

// Google Dork Generator
document.getElementById('generate-dork').addEventListener('click', () => {
    const dork = document.getElementById('dork-type').value;
    const query = document.getElementById('dork-query').value;
    const resultDiv = document.getElementById('dork-result');
    resultDiv.innerHTML = `<a href="https://google.com/search?q=${dork}${query}" target="_blank">${dork}${query}</a>`;
});

// BTC Address Lookup
document.getElementById('check-btc').addEventListener('click', () => {
    const address = document.getElementById('btc-input').value;
    if (!address) return;
    window.open(`https://www.blockchain.com/explorer/addresses/btc/${address}`, '_blank');
});

// YouTube Data Extractor
document.getElementById('check-youtube').addEventListener('click', async () => {
    const url = document.getElementById('youtube-input').value;
    if (!url.includes("youtube.com")) return;
    
    const resultDiv = document.getElementById('youtube-result');
    resultDiv.textContent = "Fetching...";
    
    try {
        const videoId = url.split('v=')[1];
        const response = await fetch(`https://noembed.com/embed?url=https://youtube.com/watch?v=${videoId}`);
        const data = await response.json();
        resultDiv.textContent = `Title: ${data.title}\nAuthor: ${data.author_name}`;
    } catch (error) {
        resultDiv.textContent = "Error fetching video data";
    }
});

// Website Screenshot
document.getElementById('take-screenshot').addEventListener('click', async () => {
    const url = document.getElementById('screenshot-input').value;
    if (!url) return;
    
    const resultDiv = document.getElementById('screenshot-result');
    resultDiv.textContent = "Capturing...";
    
    try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `https://cors-anywhere.herokuapp.com/${url}`;
        document.body.appendChild(iframe);
        
        iframe.onload = () => {
            html2canvas(iframe.contentDocument.body).then(canvas => {
                resultDiv.innerHTML = '';
                resultDiv.appendChild(canvas);
            });
        };
    } catch (error) {
        resultDiv.textContent = "Error capturing screenshot";
    }
});

// HTTP Headers Analyzer
document.getElementById('check-headers').addEventListener('click', async () => {
    const url = document.getElementById('headers-input').value;
    if (!url) return;
    
    const resultDiv = document.getElementById('headers-result');
    resultDiv.textContent = "Analyzing...";
    
    try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
        resultDiv.textContent = JSON.stringify(response.headers, null, 2);
    } catch (error) {
        resultDiv.textContent = "Error fetching headers";
    }
});

// SSL Checker
document.getElementById('check-ssl').addEventListener('click', async () => {
    const domain = document.getElementById('ssl-input').value;
    if (!domain) return;
    
    const resultDiv = document.getElementById('ssl-result');
    resultDiv.textContent = "Checking...";
    
    try {
        const response = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${domain}`);
        const data = await response.json();
        resultDiv.textContent = `Grade: ${data.endpoints[0].grade || 'N/A'}\nExpires: ${data.certs[0].notAfter || 'N/A'}`;
    } catch (error) {
        resultDiv.textContent = "Error fetching SSL data";
    }
});
