let menuToggle = document.querySelector('.icon-button');
const menuOverlay = document.querySelector('nav');

function toggleIcon() {
    menuToggle.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

menuToggle.addEventListener('click', () => {
    toggleIcon();
});

let shortUrl;
async function shortenUrl(url) {
    const apiUrl = "https://api-ssl.bitly.com/v4/shorten";
    const accessToken = "48f32e11f28ac7b1d5f486eed652f3554cdf6485";

    try {
        const response = await fetch (apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                long_url: url
            })
        });

        if (!response.ok) {
            throw new Error("Failed to shorten URL");
        }

        const data = await response.json();
        return data.link;
    } 
    catch (error) {
        console.error(error);
        return null;
    }
}

const input = document.querySelector('.url');
const form = document.querySelector('form');
const errorMessage = document.querySelector('.link-container p');
const result = document.querySelector('.link-result');
const linkContainer = document.querySelector('.link-results');

const longLink = document.querySelector('.long-url');
const shortLink = document.querySelector('.short-url');
let longUrl;
let short;

function displayLinkResult() {
    longLink.textContent = longUrl;
    shortLink.textContent = short;
    const cloned = result.cloneNode(true);
    cloned.classList.add('active');
    linkContainer.appendChild(cloned);
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let inputValue = input.value.trim();
    longUrl = ensureHttps(inputValue);
    
    if (inputValue === '') {
        input.classList.add('error');
        errorMessage.classList.add('error');
        return;
    }
    else {
        input.classList.remove('error');
        errorMessage.classList.remove('error');
        short = await shortenUrl(longUrl);

        if (short) {
            displayLinkResult();
        }
        else {
            console.error('Failed to shorten the URL');
        }
    }

    form.reset();
});

function ensureHttps(url) {
    return url.startsWith('https://') ? url : `https://${url}`;
}

const shortResult = document.querySelector('.link-result .short-url')
copyButton = document.querySelector('.link-result button');
copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(shortResult)
        .then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000); // Reset text after 2 seconds
        })
        .catch(err => console.error('Failed to copy: ', err));
});


// What's left to de done:
// 1. The short url isn't showing in the link result.
// 2. The copy button isn't working.