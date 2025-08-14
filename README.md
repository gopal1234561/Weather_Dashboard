# Weather Dashboard 🌤️

A modern, responsive weather dashboard application that provides real-time weather information, forecasts, and location-based services. Built with vanilla JavaScript, HTML5, and CSS3.

## 🚀 Features

- **Real-time Weather Data**: Get current weather conditions for any city worldwide
- **Location-based Services**: Automatic weather detection using geolocation
- **Hourly Forecasts**: 8-hour detailed weather predictions
- **5-Day Forecast**: Extended weather outlook
- **Unit Conversion**: Switch between Celsius/Fahrenheit and metric/imperial units
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dynamic Backgrounds**: Beautiful background images that change based on weather conditions
- **Error Handling**: Graceful handling of network issues and API errors
- **Search Functionality**: Quick city search with autocomplete support

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: OpenWeatherMap API
- **Icons**: Font Awesome & OpenWeatherMap icons
- **Fonts**: Google Fonts (Inter)
- **Styling**: CSS Grid, Flexbox, CSS Animations

## 📁 Project Structure
```
weather-dashboard/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # Main JavaScript functionality
├── config.js           # API configuration and constants
├── README.md           # Project documentation
└── assets/             # Images and icons (if any)
```

### Modifying Units
Change between metric and imperial units:
```javascript
UNITS: 'imperial'  // For Fahrenheit and miles
```

## 🌐 API Endpoints Used

- **Current Weather**: `/weather` - Real-time weather data
- **Forecast**: `/forecast` - 5-day forecast with 3-hour intervals

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px and above

## 🔍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure your API key is valid and active
   - Check if you've exceeded the API rate limits

2. **Location Not Working**
   - Ensure location services are enabled in your browser
   - Check if the site has permission to access location
## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Font Awesome](https://fontawesome.com/) for the icons
- [Google Fonts](https://fonts.google.com/) for the typography
- [Unsplash](https://unsplash.com/) for the background images

