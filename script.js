// Global variables
let currentUnit = 'metric';
let currentCity = 'Hyderabad'; // Default city
let weatherData = null;

// DOM elements
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
    retryBtn: document.getElementById('retry-btn')
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    updateCurrentDate();
    loadWeather(currentCity);
}

function setupEventListeners() {
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    elements.locationBtn.addEventListener('click', getCurrentLocation);
    elements.unitToggle.addEventListener('click', toggleUnit);
    elements.retryBtn.addEventListener('click', () => loadWeather(currentCity));
}

function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.currentDate.textContent = now.toLocaleDateString('en-US', options);
}

async function loadWeather(city) {
    showLoading(true);
    hideError();
    
    try {
        const currentWeather = await fetchCurrentWeather(city);
        const forecast = await fetchForecast(city);
        
        weatherData = { current: currentWeather, forecast: forecast };
        displayWeatherData(weatherData);
        updateBackground(currentWeather.weather[0].main);
    } catch (error) {
        handleError(error);
    } finally {
        showLoading(false);
    }
}

async function fetchCurrentWeather(city) {
    const url = `${CONFIG.API_BASE_URL}${ENDPOINTS.CURRENT}?q=${city}&units=${currentUnit}&appid=${CONFIG.API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);
        }
        throw new Error(ERROR_MESSAGES.API_ERROR);
    }
    
    return response.json();
}

async function fetchForecast(city) {
    const url = `${CONFIG.API_BASE_URL}${ENDPOINTS.FORECAST}?q=${city}&units=${currentUnit}&appid=${CONFIG.API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(ERROR_MESSAGES.API_ERROR);
    }
    
    return response.json();
}

function displayWeatherData(data) {
    const { current, forecast } = data;
    
    // Display current weather
    elements.cityName.textContent = `${current.name}, ${current.sys.country}`;
    elements.currentTemp.textContent = `${Math.round(current.main.temp)}°`;
    elements.weatherIcon.src = `${CONFIG.ICON_BASE_URL}${current.weather[0].icon}@2x.png`;
    elements.weatherIcon.alt = current.weather[0].description;
    elements.weatherDescription.textContent = current.weather[0].description;
    elements.feelsLike.textContent = `${Math.round(current.main.feels_like)}°`;
    elements.humidity.textContent = `${current.main.humidity}%`;
    elements.windSpeed.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
    elements.visibility.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    
    // Display hourly forecast
    displayHourlyForecast(forecast.list.slice(0, 8));
    
    // Display daily forecast
    displayDailyForecast(forecast.list);
}

function displayHourlyForecast(hourlyData) {
    elements.hourlyForecast.innerHTML = '';
    
    hourlyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const hour = date.getHours();
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <p>${hour}:00</p>
            <img src="${CONFIG.ICON_BASE_URL}${item.weather[0].icon}.png" alt="${item.weather[0].description}">
            <p>${Math.round(item.main.temp)}°</p>
        `;
        
        elements.hourlyForecast.appendChild(forecastItem);
    });
}

function displayDailyForecast(forecastData) {
    elements.dailyForecast.innerHTML = '';
    
    // Group forecast by days
    const dailyData = {};
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!dailyData[day]) {
            dailyData[day] = {
                temps: [],
                icons: [],
                date: date
            };
        }
        
        dailyData[day].temps.push(item.main.temp);
        dailyData[day].icons.push(item.weather[0].icon);
    });
    
    // Take only 5 days
    const days = Object.keys(dailyData).slice(0, 5);
    
    days.forEach(day => {
        const data = dailyData[day];
        const maxTemp = Math.max(...data.temps);
        const minTemp = Math.min(...data.temps);
        const mostCommonIcon = getMostCommonIcon(data.icons);
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <p>${day}</p>
            <img src="${CONFIG.ICON_BASE_URL}${mostCommonIcon}.png" alt="Weather icon">
            <p>${Math.round(maxTemp)}°/${Math.round(minTemp)}°</p>
        `;
        
        elements.dailyForecast.appendChild(forecastItem);
    });
}

function getMostCommonIcon(icons) {
    const counts = {};
    icons.forEach(icon => {
        counts[icon] = (counts[icon] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

function handleSearch() {
    const city = elements.searchInput.value.trim();
    if (city) {
        currentCity = city;
        loadWeather(city);
        elements.searchInput.value = '';
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError(ERROR_MESSAGES.LOCATION_ERROR);
        return;
    }
    
    showLoading(true);
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const city = await getCityFromCoordinates(latitude, longitude);
                currentCity = city;
                loadWeather(city);
            } catch (error) {
                handleError(error);
            }
        },
        (error) => {
            showError(ERROR_MESSAGES.LOCATION_ERROR);
            showLoading(false);
        }
    );
}

async function getCityFromCoordinates(lat, lon) {
    const url = `${CONFIG.API_BASE_URL}${ENDPOINTS.CURRENT}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(ERROR_MESSAGES.API_ERROR);
    }
    
    const data = await response.json();
    return data.name;
}

function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    elements.unitToggle.textContent = currentUnit === 'metric' ? '°C' : '°F';
    
    if (weatherData) {
        loadWeather(currentCity);
    }
}

function updateBackground(weatherMain) {
    const body = document.body;
    let backgroundImage;
    
    switch (weatherMain.toLowerCase()) {
        case 'clear':
            backgroundImage = BACKGROUND_IMAGES.clear;
            break;
        case 'clouds':
            backgroundImage = BACKGROUND_IMAGES.clouds;
            break;
        case 'rain':
        case 'drizzle':
            backgroundImage = BACKGROUND_IMAGES.rain;
            break;
        case 'snow':
            backgroundImage = BACKGROUND_IMAGES.snow;
            break;
        case 'thunderstorm':
            backgroundImage = BACKGROUND_IMAGES.thunderstorm;
            break;
        case 'mist':
        case 'fog':
            backgroundImage = BACKGROUND_IMAGES.mist;
            break;
        default:
            backgroundImage = BACKGROUND_IMAGES.clear;
    }
    
    body.style.backgroundImage = `url(${backgroundImage})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundAttachment = 'fixed';
}

function showLoading(show) {
    elements.loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.style.display = 'block';
}

function hideError() {
    elements.errorMessage.style.display = 'none';
}

function handleError(error) {
    console.error('Weather API Error:', error);
    showError(error.message || ERROR_MESSAGES.API_ERROR);
}

// Utility functions
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

// Add some animations
function addAnimations() {
    const cards = document.querySelectorAll('.weather-card, .forecast-item');
    cards.forEach(card => {
        card.style.animation = 'fadeIn 0.5s ease-in';
    });
}

// CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Initialize animations
document.addEventListener('DOMContentLoaded', addAnimations);
