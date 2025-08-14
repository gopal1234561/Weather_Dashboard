// Weather API Configuration
const CONFIG = {
    API_KEY: '765545934f3742bdd012c460eb0094df', // Replace with your OpenWeatherMap API key
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5/',
    ICON_BASE_URL: 'https://openweathermap.org/img/wn/',
    DEFAULT_CITY: 'Hyderabad',
    UNITS: 'metric' // 'metric' for Celsius, 'imperial' for Fahrenheit
};

// API Endpoints
const ENDPOINTS = {
    CURRENT: 'weather',
    FORECAST: 'forecast',
    ONE_CALL: 'onecall'
};

// Error Messages
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    API_ERROR: 'Unable to fetch weather data. Please try again.',
    LOCATION_ERROR: 'Unable to get your location. Please enable location services.',
    CITY_NOT_FOUND: 'City not found. Please check the spelling and try again.'
};

// Weather condition mappings
const WEATHER_CONDITIONS = {
    '01d': 'Clear sky',
    '02d': 'Few clouds',
    '03d': 'Scattered clouds',
    '04d': 'Broken clouds',
    '09d': 'Shower rain',
    '10d': 'Rain',
    '11d': 'Thunderstorm',
    '13d': 'Snow',
    '50d': 'Mist'
};

// Background images based on weather conditions
const BACKGROUND_IMAGES = {
    'clear': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1920',
    'clouds': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920',
   
     'rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920'
 ,
'snow': 'https://unsplash.com/photos/road-covered-by-snow-near-vehicle-traveling-at-daytime-R5SrmZPoO40'

,
    'thunderstorm': 'https://unsplash.com/photos/single-cell-thunderstorm-JG_HfydoNqY',
    'mist': 'https://unsplash.com/photos/bare-tree-between-road-7CME6Wlgrdk'
};
