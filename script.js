let menuToggle = document.querySelector('.icon-button');
const menuOverlay = document.querySelector('nav');

function toggleIcon() {
    menuToggle.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

menuToggle.addEventListener('click', () => {
    toggleIcon();
});

let shortResult;
async function shortenUrl(longUrl) {
    const accessToken = "48f32e11f28ac7b1d5f486eed652f3554cdf6485";
    const apiUrl = "https://api-ssl.bitly.com/v4/shorten";

    try {
        const response = await fetch (apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                long_url: longUrl,
                domain: 'bit.ly'
            })
        });

        if (!response.ok) {
            throw new Error("Failed to shorten URL");
        }

        const data = await response.json();
        shortResult = data.link;
    } 
    catch (error) {
        console.error(error);
    }
}

const input = document.querySelector('.url');
const form = document.querySelector('form');
const errorMessage = document.querySelector('.link-container p');
const linkResults = document.querySelector('.link-results');

function result() {
    let inputURL = input.value.trim();

    const linkContainer = document.createElement('div');
    linkContainer.className = 'link-result';
    linkResults.appendChild(linkContainer);

    const longURL = document.createElement('p');
    longURL.textContent = inputURL;
    longURL.className = 'long-url';
    linkContainer.append(longURL);

    const horizontalRule = document.createElement('hr');
    linkContainer.appendChild(horizontalRule);

    const shortLink = document.createElement('div');
    linkContainer.appendChild(shortLink);

    const shortURL = document.createElement('p');
    shortURL.textContent = shortResult;
    shortURL.className ='short-url';
    shortLink.appendChild(shortURL);

    const button = document.createElement('div');
    button.className = 'button';
    shortLink.appendChild(button);

    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    button.appendChild(btn);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let inputValue = input.value.trim();
    let inputUrl = ensureHttps(inputValue);
    
    if (inputValue === '') {
        input.classList.add('error');
        errorMessage.classList.add('error');
        return;
    }
    else {
        input.classList.remove('error');
        errorMessage.classList.remove('error');
        shortenUrl(inputUrl);
        result();
    }

    form.reset();
});

function ensureHttps(url) {
    if(!url.startsWith('https://')) {
        url = 'https://' + url;
    }
    return url;
}

// copyButton = document.querySelector('button');
// copyButton.addEventListener('click', () => {
//     navigator.clipboard.writeText(shortResult);
//     copyButton.textContent = 'Copied!';
// });

