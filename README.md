# Jawaid's Weather App

A simple, responsive web application that displays weather forecasts for any location. Enter a city, zipcode, or region to view current conditions, a 7-day forecast, and 24-hour hourly forecast.

## Features

- 🌤️ **Current Weather**: Real-time conditions including temperature, feels-like, humidity, and wind
- 📅 **7-Day Forecast**: High/low temperatures, conditions, precipitation chance, and wind speed
- ⏰ **24-Hour Forecast**: Hourly forecast for the next 24 hours with scrollable interface
- 🔍 **Location Search**: Search by city name, zipcode, or region
- 🌡️ **Unit Toggle**: Switch between Fahrenheit and Celsius instantly
- 🏙️ **Default Location**: Auto-loads San Francisco weather on page load
- ♿ **Accessible**: Keyboard navigation, ARIA labels, and proper semantic HTML
- 📱 **Responsive**: Optimized for desktop browsers (Chrome, Firefox, Safari, Edge)

## Tech Stack

- **Frontend**: Vue 3 (Composition API) with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + Vue Test Utils
- **API**: WeatherAPI.com (free tier)
- **Deployment**: Netlify

## Project Structure

```
jawaid-weather-app/
├── docs/                         # Epic specifications and plans
│   └── avi-130/                  # Epic AVI-130 documentation
│       ├── avi-130-jawaids-weather-app-spec.md
│       └── avi-130-jawaids-weather-app-plan.md
├── public/                       # Static assets
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css          # Tailwind imports and custom styles
│   ├── components/               # Vue components
│   │   ├── CurrentWeather.vue    # Current conditions display
│   │   ├── ErrorMessage.vue      # Error state component
│   │   ├── HourlyForecast.vue    # 24-hour forecast
│   │   ├── LoadingSpinner.vue    # Loading state component
│   │   ├── SearchBar.vue         # Location search with dropdown
│   │   ├── SearchDropdown.vue    # Search suggestions
│   │   ├── SevenDayForecast.vue  # 7-day forecast grid
│   │   └── TemperatureToggle.vue # F/C unit toggle
│   ├── composables/              # Vue composables
│   │   └── useWeather.ts         # Weather state management
│   ├── services/                 # API services
│   │   └── weatherApi.ts         # WeatherAPI.com integration
│   ├── utils/                    # Utility functions
│   │   ├── debounce.ts           # Debounce helper
│   │   ├── formatters.ts         # Date/time/temp formatting
│   │   └── logger.ts             # Structured logging
│   ├── App.vue                   # Root component
│   ├── main.ts                   # Application entry point
│   └── vite-env.d.ts             # TypeScript environment types
├── tests/
│   ├── unit/                     # Unit tests (112 tests, all passing)
│   │   ├── components/           # Component tests
│   │   ├── composables/          # Composable tests
│   │   ├── services/             # API service tests
│   │   └── utils/                # Utility function tests
│   └── setup.ts                  # Test configuration
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore patterns
├── index.html                    # HTML entry point
├── netlify.toml                  # Netlify deployment configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── vitest.config.ts              # Vitest test configuration
└── README.md                     # This file
```

## Setup Instructions

### Prerequisites

- Node.js 20.x or higher
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/avinci/Jawaid-weather-app.git
   cd Jawaid-weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your WeatherAPI.com API key:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
   
   Get a free API key at [https://www.weatherapi.com/](https://www.weatherapi.com/)

### Development

**Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Run tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm test -- --watch
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload at http://localhost:5173 |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests once (CI mode) |
| `npm test -- --watch` | Run tests in watch mode for development |
| `npm test -- --coverage` | Run tests with coverage report |

### Test Types

This project uses comprehensive testing strategies:

- **Unit Tests**: Isolated component/function tests with full mocking
  - Fast and deterministic
  - Located in `tests/unit/`
  - Comprehensive coverage of all code paths
  - Run with: `npm test`

**Note**: Previous "BVT (Build Verification Tests)" were integration-level tests that have been removed in favor of comprehensive unit tests with proper mocking.

### Test Coverage

Current test coverage: **112 tests, all passing**

To generate a coverage report:
```bash
npm test -- --run --coverage
```

Coverage reports are generated in the `coverage/` directory and can be viewed by opening `coverage/index.html` in a browser.

## Deployment

This project is configured for deployment on Netlify.

### Prerequisites for Deployment

- A free [Netlify account](https://www.netlify.com/)
- A [WeatherAPI.com API key](https://www.weatherapi.com/signup.aspx) (free tier available)
- Repository pushed to GitHub/GitLab/Bitbucket

### Deploying to Netlify

1. **Connect Your Repository**
   - Log in to Netlify
   - Click "Add new site" → "Import an existing project"
   - Authorize Netlify to access your Git provider
   - Select the `Jawaid-weather-app` repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20 (configured in `netlify.toml`)

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Click "Add a variable"
   - Key: `VITE_WEATHER_API_KEY`
   - Value: Your WeatherAPI.com API key
   - Scopes: Select all (or at minimum: "Build" and "Runtime")

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - Your site will be available at `https://your-site-name.netlify.app`

### Post-Deployment

After deployment, verify:
- [ ] Application loads without errors
- [ ] San Francisco weather loads by default
- [ ] Location search works
- [ ] Temperature toggle works
- [ ] All forecasts display correctly
- [ ] No console errors in browser developer tools

### Netlify Configuration

The `netlify.toml` file includes:
- Build command and publish directory
- Node.js version (20)
- Redirect rules for single-page application routing

All updates pushed to your repository's main branch will automatically trigger a new deployment.

## Development Status

✅ **All phases complete!** This project is production-ready.

### Completed Features

- ✅ **Phase 1**: Foundation & Setup - Project initialization, Vite + Vue 3 + TypeScript
- ✅ **Phase 2**: View Default Weather - San Francisco auto-loads with current conditions
- ✅ **Phase 3**: Search by Location - Search by city, zipcode, or region
- ✅ **Phase 4**: View 7-Day Forecast - Complete daily forecasts with all weather details
- ✅ **Phase 5**: View 24-Hour Forecast - Scrollable hourly forecast for next 24 hours
- ✅ **Phase 6**: Toggle Temperature Units - Instant F/C toggle with no persistence
- ✅ **Phase 7**: Polish, Testing & Deployment - Production-ready with 112 passing tests

See `docs/avi-130/` for detailed specifications and implementation plans.

## Browser Support

Tested and verified on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Performance

- ⚡ Initial load < 3 seconds (with San Francisco weather)
- ⚡ Search results < 2 seconds
- ⚡ Temperature toggle < 100ms
- ⚡ Bundle size: ~81 KB (gzipped ~30 KB)

## Accessibility

This application follows WCAG 2.1 Level AA guidelines:
- ♿ Keyboard navigation supported
- ♿ ARIA labels for screen readers
- ♿ Semantic HTML structure
- ♿ Color contrast ratios meet standards
- ♿ Focus indicators visible

## API Usage

This application uses the [WeatherAPI.com](https://www.weatherapi.com/) free tier:
- **Rate Limit**: 1 million calls/month (free tier)
- **Data**: Current weather + 7-day forecast + hourly forecast
- **Update Frequency**: Real-time data

**Note**: API key is exposed in client-side code (acceptable for demo/personal use). For production applications with sensitive data, consider implementing a backend proxy.

## Contributing

This is a personal project for learning purposes. Feel free to fork and adapt for your own use.

## License

MIT
