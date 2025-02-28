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
    const accessToken = "e3b544aa3aaa0d6d47cb0dfa17aae00978067689";

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
        shortUrl = data.link;
    } 
    catch (error) {
        console.error(error);
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

form.addEventListener('submit', (event) => {
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
        short = shortenUrl(longUrl);
        displayLinkResult();
    }

    form.reset();
});

function ensureHttps(url) {
    if(!url.startsWith('https://')) {
        url = 'https://' + url;
    }
    return url;
}

copyButton = document.querySelector('.link-result button');
copyButton.addEventListener('click', () => {
    console.log('copy button clicked');
    navigator.clipboard.writeText(short);
    copyButton.textContent = 'Copied!';
});


// What's left to de done:
// 1. Use a different API to shorten the url - a free one.
// 2. The container for the generated short url shouldn't be created in the javascript but in the html file.
// 3. Do a general check.