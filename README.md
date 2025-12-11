# Jawaid's Weather App

A simple web application that displays weather forecasts for any location. Enter a city, zipcode, or region to view current conditions, a 7-day forecast, and 24-hour hourly forecast.

## Features

- 🌤️ Current weather conditions
- 📅 7-day weather forecast
- ⏰ 24-hour hourly forecast
- 🔍 Search by city, zipcode, or region
- 🌡️ Toggle between Fahrenheit and Celsius
- 🏙️ Auto-loads San Francisco weather on page load

## Tech Stack

- **Frontend**: Vue 3 (Composition API) with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Vue Test Utils
- **API**: WeatherAPI.com
- **Deployment**: Netlify

## Project Structure

```
jawaid-weather-app/
├── docs/                     # Epic specifications and plans
├── public/                   # Static assets
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css      # Tailwind imports and custom styles
│   ├── components/           # Vue components
│   │   ├── LoadingSpinner.vue
│   │   └── ErrorMessage.vue
│   ├── composables/          # Vue composables
│   │   └── useWeather.ts     # Weather state management
│   ├── services/             # API services
│   │   └── weatherApi.ts     # WeatherAPI.com integration
│   ├── utils/                # Utility functions
│   ├── App.vue               # Root component
│   └── main.ts               # Application entry point
├── tests/
│   └── unit/                 # Unit tests
├── .env.example              # Environment variable template
├── netlify.toml              # Netlify deployment configuration
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
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
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests |

## Deployment

This project is configured for deployment on Netlify.

### Deploying to Netlify

1. **Connect your repository** to Netlify
2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Set environment variable**:
   - Add `VITE_WEATHER_API_KEY` in Netlify dashboard under Site settings → Environment variables
4. **Deploy**

The `netlify.toml` file includes all necessary configuration for deployment.

## Development Status

This project is currently in Phase 1 (Foundation & Setup). See `docs/avi-130/` for specifications and implementation plans.

### Completed
- ✅ Project initialization with Vite + Vue 3 + TypeScript
- ✅ Tailwind CSS configuration
- ✅ Vitest testing setup
- ✅ Base project structure
- ✅ LoadingSpinner and ErrorMessage components
- ✅ Service and composable skeletons
- ✅ Netlify deployment configuration

### Coming Soon
- Weather data fetching (Phase 2)
- Location search (Phase 3)
- 7-day forecast display (Phase 4)
- 24-hour forecast display (Phase 5)
- Temperature unit toggle (Phase 6)

## License

MIT
