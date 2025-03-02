const menuToggle = document.querySelector('.icon-button');
const menuFeatures = document.querySelector('nav');
const menuButton = document.querySelector('.nav-btn');
const input = document.querySelector('.url');
const form = document.querySelector('form');
const errorMessage = document.querySelector('.link-container p');
const result = document.querySelector('.link-result');
const linkContainer = document.querySelector('.link-results');

const longLink = document.querySelector('.long-url');
const shortLink = document.querySelector('.short-url');
let longUrl;
let shortUrl;

// Create a toggle function for the menu button
function toggleIcon() {
    menuToggle.classList.toggle('active');
    menuFeatures.classList.toggle('active');
    menuButton.classList.toggle('active');
}

// Display the menu when clicked
menuToggle.addEventListener('click', () => {
    toggleIcon();
});

// Create a function that shortens a long url
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

// A function that displays the shortened url
function displayLinkResult() {
    longLink.textContent = longUrl;
    shortLink.textContent = shortUrl;
    
    const cloned = result.cloneNode(true);
    cloned.classList.add('active');

    // Ensure the button inside the cloned result works
    const copyButton = cloned.querySelector('button');
    const shortResult = cloned.querySelector('.short-url');

    // Make the copy button copy the short url when clicked 
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(shortResult.textContent)
            .then(() => {
                copyButton.textContent = 'Copied!';
                copyButton.style.backgroundColor = 'var(--dark-violet)';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.style.backgroundColor = 'var(--cyan)';
                }, 2000); // Reset text after 2 seconds
            })
            .catch(err => console.error('Failed to copy: ', err));
    });

    // Always add the shortened url result to the link container
    linkContainer.appendChild(cloned);
}

function isValidUrl(userInput) {
    try {
        let url = new URL(userInput);
        return url.protocol === "http:" || url.protocol === "https:"; // Ensure it's HTTP or HTTPS
    } catch (err) {
        return false;
    }
}

// Ensure the input starts with 'https://'
function ensureHttps(url) {
    return url.startsWith('https://') ? url : `https://${url}`;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let inputValue = input.value.trim();
    let processedUrl = ensureHttps(inputValue);
    
    if (!isValidUrl(processedUrl)) {
        input.classList.add('error');
        input.classList.add('active');
        errorMessage.classList.add('error');
        return;
    } else {
        input.classList.remove('error');
        input.classList.remove('active');
        errorMessage.classList.remove('error');
        
        longUrl = processedUrl;
        shortUrl = await shortenUrl(longUrl);

        if (shortUrl) {
            displayLinkResult();
        } else {
            input.classList.add('error');
            input.classList.add('active');
            errorMessage.classList.add('error');
            errorMessage.textContent = "Please enter a valid URL";
            return;
        }
    }
    form.reset();
});


