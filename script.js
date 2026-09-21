// Weather Dashboard - upgraded
let currentUnit = localStorage.getItem('weather-unit') || 'metric';
let currentCity = localStorage.getItem('weather-city') || 'Hyderabad';
let weatherData = null;
let searchTimer = null;

const elements = {
    cityName: document.getElementById('city-name'),
    currentDate: document.getElementById('current-date'),
    currentTemp: document.getElementById('current-temp'),
    unitToggle: document.getElementById('unit-toggle'),
    weatherIcon: document.getElementById('weather-icon'),
    weatherDescription: document.getElementById('weather-description'),
    feelsLike: document.getElementById('feels-like'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    visibility: document.getElementById('visibility'),
    hourlyForecast: document.getElementById('hourly-forecast'),
    dailyForecast: document.getElementById('daily-forecast'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    locationBtn: document.getElementById('location-btn'),
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    retryBtn: document.getElementById('retry-btn'),
    suggestions: document.getElementById('suggestions'),
    recentCities: document.getElementById('recent-cities'),
    feelsLikeLabel: document.getElementById('feels-like-label'),
    windLabel: document.getElementById('wind-label'),
    visibilityLabel: document.getElementById('visibility-label'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    pressure: document.getElementById('pressure'),
    cloudiness: document.getElementById('cloudiness'),
    rainChance: document.getElementById('rain-chance'),
    uvIndex: document.getElementById('uv-index'),
    windDirection: document.getElementById('wind-direction'),
    airQuality: document.getElementById('air-quality'),
    temperatureChart: document.getElementById('temperature-chart'),
    sunriseLarge: document.getElementById('sunrise-large'),
    sunsetLarge: document.getElementById('sunset-large'),
    sunProgress: document.getElementById('sun-progress')
};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    elements.unitToggle.textContent = currentUnit === 'metric' ? '°C' : '°F';
    setupEventListeners();
    renderRecentCities();
    loadWeatherByCity(currentCity);
}

function setupEventListeners() {
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
        if (event.key === 'Escape') hideSuggestions();
    });

    elements.searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        const query = elements.searchInput.value.trim();
        if (query.length < 2) {
            hideSuggestions();
            return;
        }
        searchTimer = setTimeout(() => loadSuggestions(query), 300);
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search-wrapper')) hideSuggestions();
    });

    elements.locationBtn.addEventListener('click', getCurrentLocation);
    elements.unitToggle.addEventListener('click', toggleUnit);
    elements.retryBtn.addEventListener('click', () => loadWeatherByCity(currentCity));
}

async function loadWeatherByCity(city) {
    showLoading(true);
    hideError();
    hideSuggestions();

    try {
        const places = await geocodeCity(city);
        if (!places.length) throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);

        const place = places[0];
        currentCity = place.name;
        saveRecentCity(formatPlace(place));

        await loadWeatherByCoordinates(place.lat, place.lon, formatPlace(place));
    } catch (error) {
        handleError(error);
    } finally {
        showLoading(false);
    }
}

async function loadWeatherByCoordinates(lat, lon, displayCity) {
    const [currentWeather, forecast] = await Promise.all([
        fetchWeatherByCoordinates(lat, lon),
        fetchForecastByCoordinates(lat, lon)
    ]);

    weatherData = { current: currentWeather, forecast };
    currentCity = currentWeather.name || displayCity;
    localStorage.setItem('weather-city', currentCity);

    displayWeatherData(weatherData);
    updateBackground(currentWeather.weather?.[0]?.main);
    updateRecentCitiesUI();
}

async function geocodeCity(query) {
    const url = `${CONFIG.GEOCODING_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${CONFIG.API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(ERROR_MESSAGES.API_ERROR);
    return response.json();
}

async function loadSuggestions(query) {
    try {
        const places = await geocodeCity(query);
        if (!places.length) {
            hideSuggestions();
            return;
        }

        elements.suggestions.innerHTML = places.map((place, index) => `
            <button class="suggestion-item" type="button" data-index="${index}">
                <span class="suggestion-city">${escapeHtml(place.name)}</span>
                <span class="suggestion-country">${escapeHtml(formatPlace(place, true))}</span>
            </button>
        `).join('');

        elements.suggestions.querySelectorAll('.suggestion-item').forEach((button) => {
            button.addEventListener('click', () => {
                const place = places[Number(button.dataset.index)];
                loadWeatherByCoordinates(place.lat, place.lon, formatPlace(place));
                elements.searchInput.value = '';
            });
        });

        elements.suggestions.classList.add('visible');
    } catch {
        hideSuggestions();
    }
}

async function fetchWeatherByCoordinates(lat, lon) {
    const url = `${CONFIG.API_BASE_URL}${ENDPOINTS.CURRENT}?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${CONFIG.API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(ERROR_MESSAGES.API_ERROR);
    return response.json();
}

async function fetchForecastByCoordinates(lat, lon) {
    const url = `${CONFIG.API_BASE_URL}${ENDPOINTS.FORECAST}?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${CONFIG.API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(ERROR_MESSAGES.API_ERROR);
    return response.json();
}

function displayWeatherData(data) {
    const { current, forecast } = data;
    const symbol = currentUnit === 'metric' ? '°C' : '°F';
    const speedUnit = currentUnit === 'metric' ? 'km/h' : 'mph';

    elements.cityName.textContent = `${current.name}, ${current.sys.country}`;
    elements.currentDate.textContent = formatDate(current.dt * 1000);
    elements.currentTemp.textContent = `${Math.round(current.main.temp)}°`;
    elements.unitToggle.textContent = symbol;
    elements.weatherIcon.src = `${CONFIG.ICON_BASE_URL}${current.weather[0].icon}@2x.png`;
    elements.weatherIcon.alt = current.weather[0].description;
    elements.weatherDescription.textContent = capitalize(current.weather[0].description);
    elements.feelsLike.textContent = `${Math.round(current.main.feels_like)}°`;
    elements.humidity.textContent = `${current.main.humidity}%`;
    elements.windSpeed.textContent = `${formatWindSpeed(current.wind.speed)} ${speedUnit}`;
    elements.visibility.textContent = current.visibility
        ? `${(current.visibility / 1000).toFixed(1)} km`
        : 'N/A';
    elements.pressure.textContent = `${current.main.pressure} hPa`;
    elements.cloudiness.textContent = `${current.clouds?.all ?? 0}%`;
    elements.sunrise.textContent = formatTime(current.sys.sunrise * 1000);
    elements.sunset.textContent = formatTime(current.sys.sunset * 1000);
    elements.sunriseLarge.textContent = formatTime(current.sys.sunrise * 1000);
    elements.sunsetLarge.textContent = formatTime(current.sys.sunset * 1000);
    elements.rainChance.textContent = getRainChance(forecast.list);
    elements.windDirection.textContent = getWindDirection(current.wind?.deg);
    updateSunProgress(current.sys.sunrise * 1000, current.sys.sunset * 1000);

    displayHourlyForecast(forecast.list.slice(0, 8));
    renderTemperatureChart(forecast.list.slice(0, 8));
    displayDailyForecast(forecast.list);
}

function getRainChance(hourlyData) {
    const values = hourlyData.map(item => Number(item.pop ?? 0) * 100);
    return values.length ? Math.round(Math.max(...values)) : 0;
}

function getWindDirection(degrees) {
    if (typeof degrees !== 'number') return 'N/A';
    const directions = ['N','NE','E','SE','S','SW','W','NW'];
    return directions[Math.round(degrees / 45) % 8];
}

function updateSunProgress(sunrise, sunset) {
    const ratio = Math.max(0, Math.min(1, (Date.now() - sunrise) / Math.max(sunset - sunrise, 1)));
    if (elements.sunProgress) elements.sunProgress.style.left = (ratio * 100) + '%';
}

function renderTemperatureChart(items) {
    if (!elements.temperatureChart || !items.length) return;
    const temps = items.map(item => Number(item.main.temp));
    const min = Math.min(...temps), max = Math.max(...temps), range = Math.max(max - min, 1);
    const points = temps.map((temp,i) => ({x:18+i*664/Math.max(items.length-1,1),y:190-(temp-min)/range*135,temp}));
    const line = points.map(p => p.x+','+p.y).join(' ');
    const area = '18,190 '+line+' 682,190';
    elements.temperatureChart.innerHTML = [50,95,140,185].map(y => '<line class="chart-grid" x1="18" y1="'+y+'" x2="682" y2="'+y+'"/>').join('') +
      '<polygon class="chart-area" points="'+area+'"/><polyline class="chart-line" points="'+line+'"/>' +
      points.map((p,i) => '<circle class="chart-point" cx="'+p.x+'" cy="'+p.y+'" r="4"/><text class="chart-value" x="'+p.x+'" y="'+(p.y-10)+'" text-anchor="middle">'+Math.round(p.temp)+'°</text><text class="chart-label" x="'+p.x+'" y="214" text-anchor="middle">'+formatTime(items[i].dt*1000)+'</text>').join('');
}

function displayHourlyForecast(hourlyData) {
    elements.hourlyForecast.innerHTML = hourlyData.map((item) => `
        <div class="forecast-item">
            <p class="forecast-time">${formatTime(item.dt * 1000)}</p>
            <img src="${CONFIG.ICON_BASE_URL}${item.weather[0].icon}.png" alt="${escapeHtml(item.weather[0].description)}">
            <p class="forecast-temp">${Math.round(item.main.temp)}°</p>
            <small>${item.main.humidity}% humidity</small>
        </div>
    `).join('');
}

function displayDailyForecast(forecastData) {
    const days = new Map();

    forecastData.forEach((item) => {
        const dateKey = new Date(item.dt * 1000).toLocaleDateString('en-CA');
        if (!days.has(dateKey)) {
            days.set(dateKey, { date: new Date(item.dt * 1000), temps: [], icons: [], descriptions: [] });
        }
        const day = days.get(dateKey);
        day.temps.push(item.main.temp);
        day.icons.push(item.weather[0].icon);
        day.descriptions.push(item.weather[0].description);
    });

    elements.dailyForecast.innerHTML = Array.from(days.values()).slice(0, 5).map((day, index) => {
        const icon = getMostCommonIcon(day.icons);
        return `
            <div class="forecast-item daily-card">
                <p class="forecast-day">${index === 0 ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <img src="${CONFIG.ICON_BASE_URL}${icon}@2x.png" alt="Weather icon">
                <p class="forecast-temp">${Math.round(Math.max(...day.temps))}° / ${Math.round(Math.min(...day.temps))}°</p>
                <small>${capitalize(getMostCommonValue(day.descriptions))}</small>
            </div>
        `;
    }).join('');
}

function getMostCommonValue(values) {
    const counts = {};
    values.forEach((value) => counts[value] = (counts[value] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);
}

function getMostCommonIcon(icons) {
    return getMostCommonValue(icons);
}

function handleSearch() {
    const city = elements.searchInput.value.trim();
    if (!city) return;
    loadWeatherByCity(city);
    elements.searchInput.value = '';
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError(ERROR_MESSAGES.LOCATION_ERROR);
        return;
    }

    showLoading(true);
    hideError();

    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            try {
                await loadWeatherByCoordinates(coords.latitude, coords.longitude, 'Current location');
            } catch (error) {
                handleError(error);
            } finally {
                showLoading(false);
            }
        },
        () => {
            showError(ERROR_MESSAGES.LOCATION_ERROR);
            showLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
}

function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    localStorage.setItem('weather-unit', currentUnit);
    if (weatherData) loadWeatherByCity(currentCity);
}

function saveRecentCity(city) {
    const recent = getRecentCities().filter((item) => item.toLowerCase() !== city.toLowerCase());
    recent.unshift(city);
    localStorage.setItem('weather-recent-cities', JSON.stringify(recent.slice(0, 5)));
}

function getRecentCities() {
    try {
        return JSON.parse(localStorage.getItem('weather-recent-cities') || '[]');
    } catch {
        return [];
    }
}

function renderRecentCities() {
    const cities = getRecentCities();
    if (!cities.length) {
        elements.recentCities.innerHTML = '';
        return;
    }

    elements.recentCities.innerHTML = `
        <span class="recent-label">Recent:</span>
        ${cities.map((city) => `<button type="button" class="recent-city" data-city="${escapeHtml(city)}">${escapeHtml(city)}</button>`).join('')}
    `;

    elements.recentCities.querySelectorAll('.recent-city').forEach((button) => {
        button.addEventListener('click', () => loadWeatherByCity(button.dataset.city));
    });
}

function updateRecentCitiesUI() {
    renderRecentCities();
}

function formatPlace(place, countryOnly = false) {
    const parts = [];
    if (place.state && !countryOnly) parts.push(place.state);
    if (place.country) parts.push(place.country);
    return countryOnly ? parts.join(', ') : [place.name, ...parts].join(', ');
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatWindSpeed(speed) {
    return currentUnit === 'metric' ? Math.round(speed * 3.6) : Math.round(speed);
}

function capitalize(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
}

function updateBackground(weatherMain) {
    const key = String(weatherMain || 'clear').toLowerCase();
    const image = BACKGROUND_IMAGES[key] || BACKGROUND_IMAGES.clear;
    document.body.style.backgroundImage = `linear-gradient(rgba(15,23,42,.32), rgba(15,23,42,.45)), url("${image}")`;
}

function showLoading(show) {
    elements.loading.style.display = show ? 'flex' : 'none';
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.style.display = 'block';
}

function hideError() {
    elements.errorMessage.style.display = 'none';
}

function hideSuggestions() {
    elements.suggestions.classList.remove('visible');
}

function handleError(error) {
    console.error('Weather API Error:', error);
    showError(error.message || ERROR_MESSAGES.API_ERROR);
}

const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.forecast-item, .weather-card { animation: fadeIn .45s ease both; }
`;
document.head.appendChild(style);
