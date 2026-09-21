// Weather API Configuration
// NOTE: For production, keep API credentials on a server-side proxy.
const CONFIG = {
    API_KEY: '765545934f3742bdd012c460eb0094df',
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5/',
    GEOCODING_URL: 'https://api.openweathermap.org/geo/1.0/direct',
    ICON_BASE_URL: 'https://openweathermap.org/img/wn/',
    DEFAULT_CITY: 'Hyderabad'
};

const ENDPOINTS = {
    CURRENT: 'weather',
    FORECAST: 'forecast'
};

const ERROR_MESSAGES = {
    API_ERROR: 'Unable to fetch weather data. Please try again.',
    LOCATION_ERROR: 'Unable to get your location. Please allow location access.',
    CITY_NOT_FOUND: 'City not found. Try a city name, state, or country.',
};

const BACKGROUND_IMAGES = {
    clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1920',
    clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920',
    rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920',
    snow: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=1920',
    thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1920',
    mist: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=1920'
};
