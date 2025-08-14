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

## 📸 Screenshots

*Screenshots will be added here*

## 🎯 Demo

[Live Demo Link](https://gopal1234561.github.io/Weather_Dashboard/) *(GitHub Pages deployment)*

## 🚀 Quick Start


### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- OpenWeatherMap API key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusernrme/weather-dashboard.git
   cd weather-dashboard
   ```
   ```

2. **Get your API key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key from the dashboard

3. **Configure the API key**
   - Open `config.js`
   - Replace the placeholder API key:
   ```javascript
   API_KEY: 'your-actual-api-key-here'
   ```

4. **Run the application**
   - Simply open `index.html` in your browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

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

## 🔧 Configuration

The application can be customized through the `config.js` file:

```javascript
const CONFIG = {
    API_KEY: 'your-api-key',           // Your OpenWeatherMap API key
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5/',
    ICON_BASE_URL: 'https://openweathermap.org/img/wn/',
    DEFAULT_CITY: 'Hyderabad',         // Default city on load
    UNITS: 'metric'                    // 'metric' or 'imperial'
};
```

## 🎨 Customization

### Changing Default City
Update the `DEFAULT_CITY` in `config.js`:
```javascript
DEFAULT_CITY: 'Your City Name'
```

### Modifying Units
Change between metric and imperial units:
```javascript
UNITS: 'imperial'  // For Fahrenheit and miles
```

### Custom Background Images
Update the `BACKGROUND_IMAGES` object in `config.js` with your preferred image URLs:
```javascript
const BACKGROUND_IMAGES = {
    'clear': 'your-custom-image-url',
    'rain': 'your-custom-image-url',
    // ... other weather conditions
};
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

3. **CORS Issues**
   - Use a local server instead of opening the file directly
   - Install a CORS extension for development

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Font Awesome](https://fontawesome.com/) for the icons
- [Google Fonts](https://fonts.google.com/) for the typography
- [Unsplash](https://unsplash.com/) for the background images

## 📞 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/yourusername/weather-dashboard](https://github.com/yourusername/weather-dashboard)

---

<div align="center">>
</div
  <p>Built with ❤️ using vanilla JavaScript</p>
</div>
</div>
