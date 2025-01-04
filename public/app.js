const locationInput = document.getElementById('location');
const locationBox = document.getElementById('locationBox');
const selectedLocation = document.getElementById('selectedLocation');
const locationText = document.getElementById('locationText');
const changeLocationBtn = document.getElementById('changeLocation');
const itemSearchBox = document.getElementById('itemSearchBox');
const itemInput = document.getElementById('item');
const resultDiv = document.getElementById('result');

// Available locations from our data
const availableLocations = ['new york', 'london'];

async function checkLocation(location) {
    const locationLower = location.toLowerCase();
    if (availableLocations.includes(locationLower)) {
        // Valid location
        locationBox.style.display = 'none';
        selectedLocation.style.display = 'flex';
        itemSearchBox.style.display = 'block';
        locationText.textContent = location.charAt(0).toUpperCase() + location.slice(1);
        resultDiv.innerHTML = '';
    } else {
        // Invalid location
        resultDiv.innerHTML = `
            <div class="error">
                Sorry, we don't have price data for ${location} yet.
                Available cities: New York, London
            </div>
        `;
        itemSearchBox.style.display = 'none';
    }
}

locationInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
        checkLocation(this.value.trim());
    }
});

locationInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
        checkLocation(this.value.trim());
    }
});

changeLocationBtn.addEventListener('click', function() {
    locationBox.style.display = 'block';
    selectedLocation.style.display = 'none';
    itemSearchBox.style.display = 'none';
    resultDiv.innerHTML = '';
    locationInput.value = '';
    itemInput.value = '';
    locationInput.focus();
});

async function searchPrice() {
    const location = locationText.textContent.trim();
    const item = itemInput.value.trim();

    if (!location || !item) return;

    try {
        const response = await fetch(`/api/price?location=${encodeURIComponent(location)}&item=${encodeURIComponent(item)}`);
        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
                <div class="price-card">
                    <h3>Price Information</h3>
                    <p class="item">🏷️ ${item.charAt(0).toUpperCase() + item.slice(1)}</p>
                    <p class="price">💰 ${data.avg_price} ${data.currency}</p>
                    ${data.unit ? `<p class="unit">📏 ${data.unit}</p>` : ''}
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="error">${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = '<div class="error">Failed to fetch price information</div>';
    }
}

itemInput.addEventListener('input', debounce(searchPrice, 500));

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 