let menuToggle = document.querySelector('.icon-button');
const menuOverlay = document.querySelector('.menu-overlay');

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
    const linkContainer = document.createElement('div');
    linkContainer.className = 'link-container';
    linkResults.appendChild(linkContainer);

    const longURL = document.createElement('p');
    longURL.textContent = inputUrl;
    longURL.className = 'long-url';
    linkContainer.append(longURL);

    const horizontalRule = document.createElement('hr');
    linkContainer.appendChild(horizontalRule);

    const shortLink = document.createElement('div');
    linkResults.appendChild(shortLink);

    const shortURL = document.createElement('p');
    shortURL.textContent = shortResult;
    shortURL.className = 'short-url';
    shortLink.appendChild(shortURL);

    const button = document.createElement('div');
    button.className = 'button';
    shortLink.appendChild(button);

    const btn = document.createElement('button');
    button.appendChild(btn);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let inputUrl = input.value.trim();
    if (inputUrl === '') {
        input.classList.add('error');
        errorMessage.classList.add('error');
        return;
    }
    else {
        console.log(inputUrl);
        shortenUrl(inputUrl);
        result();
    }

    form.reset();
});




