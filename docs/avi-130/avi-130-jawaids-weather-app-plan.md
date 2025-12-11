# Implementation Plan: Jawaid's Weather App

**Issue**: Linear #AVI-130
**Project**: Avi's workspace/qbTest
**Status**: In Progress
**Spec**: docs/avi-130/avi-130-jawaids-weather-app-spec.md

---

## Context

**Overview**: A simple web application that displays weather forecasts for any location entered by zipcode, city, or region. The app provides both a 7-day forecast and a 24-hour hourly forecast, with San Francisco weather loaded by default on page load. Users can toggle between Fahrenheit and Celsius, with no customization or saved preferences between sessions.

**Requirements**:
- Fetch weather data from WeatherAPI.com
- Display current weather conditions, 7-day forecast, and 24-hour hourly forecast
- Accept zipcode, city name, or region as search input
- Auto-load San Francisco weather on initial page load
- Toggle between Fahrenheit and Celsius temperature units
- Handle errors gracefully with user-friendly messages
- No user preferences persistence between sessions

**Acceptance Criteria**:
- San Francisco weather loads within 3 seconds of page load
- Location search returns results within 2 seconds
- Temperature unit toggle updates instantly (< 100ms)
- Invalid location searches show clear error messaging
- Works reliably on desktop browsers (Chrome, Firefox, Safari, Edge)

---

## Discovery Log

| # | Question | Answer |
|---|----------|--------|
| Q1 | Which technology stack would you like to use for this web application? | Vue |
| Q2 | For API calls to WeatherAPI.com, should the application make requests directly from the browser (client-side), or would you prefer a backend server to handle API requests (to keep the API key secure)? | Just the browser for now |
| Q3 | What build tooling would you like to use? | Vite |
| Q4 | For testing, what framework would you like to use? | Vitest |
| Q5 | Where will this application be deployed? | Netlify |
| Q6 | For styling, do you have a preference? | Tailwind |

---

## Technology Stack

### New Project

**Frontend**: Vue 3 (Composition API) with Vite - Modern, performant framework with excellent developer experience
**Styling**: Tailwind CSS - Utility-first CSS framework for rapid UI development
**State/Data**: Vue Composition API with reactive refs - Built-in state management sufficient for this simple application
**API Integration**: Fetch API (client-side) - Direct browser requests to WeatherAPI.com
**Testing**: Vitest - Fast unit testing framework optimized for Vite projects
**Deployment**: Netlify - Simple static hosting with automatic deployments

---

## Architecture

### Project Structure
```
jawaid-weather-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css          # Tailwind imports and custom styles
│   ├── components/
│   │   ├── SearchBar.vue         # Location search input
│   │   ├── CurrentWeather.vue    # Current conditions display
│   │   ├── SevenDayForecast.vue  # 7-day forecast cards
│   │   ├── HourlyForecast.vue    # 24-hour hourly forecast
│   │   ├── TemperatureToggle.vue # F/C toggle button
│   │   ├── LoadingSpinner.vue    # Loading state indicator
│   │   └── ErrorMessage.vue      # Error display component
│   ├── services/
│   │   └── weatherApi.js         # WeatherAPI.com integration
│   ├── composables/
│   │   └── useWeather.js         # Weather data state and logic
│   ├── utils/
│   │   └── formatters.js         # Date/time/temp formatting utilities
│   ├── App.vue                   # Root component
│   └── main.js                   # Application entry point
├── tests/
│   ├── unit/
│   │   ├── components/           # Component tests
│   │   ├── services/             # API service tests
│   │   └── utils/                # Utility function tests
│   └── setup.js                  # Test configuration
├── .env.example                  # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js             # PostCSS configuration for Tailwind
├── tailwind.config.js            # Tailwind configuration
├── vite.config.js                # Vite build configuration
├── vitest.config.js              # Vitest test configuration
└── README.md
```

### Key Patterns
- **State Management**: Composable function (`useWeather`) encapsulates all weather data state, API calls, and business logic. Components consume this composable for reactive data access.
- **Error Handling**: Centralized error handling in the weather composable with user-friendly error messages based on error type (not found, network error, API error, rate limit). ErrorMessage component displays errors consistently.
- **Integration Points**: WeatherAPI.com REST API (client-side fetch calls) - location search, current weather, forecast data. API key stored in environment variable.

---

## Data Models

```typescript
// Temperature unit type
type TemperatureUnit = 'F' | 'C';

// Current weather conditions
interface CurrentWeather {
  location: string;              // Resolved location name from API
  temperature: number;           // Current temperature
  feelsLike: number;            // Feels-like temperature
  condition: string;            // Weather condition (e.g., "Sunny", "Rainy")
  conditionIcon: string;        // URL to weather icon
  humidity: number;             // Humidity percentage
  windSpeed: number;            // Wind speed in mph or km/h
  windDirection: string;        // Wind direction (e.g., "NW")
  lastUpdated: string;          // ISO timestamp of last update
}

// Daily forecast item
interface DailyForecast {
  date: string;                 // ISO date string
  dayOfWeek: string;           // e.g., "Monday"
  highTemp: number;            // High temperature
  lowTemp: number;             // Low temperature
  condition: string;           // Weather condition
  conditionIcon: string;       // URL to weather icon
  precipitationChance: number; // Precipitation chance (0-100)
  windSpeed: number;           // Average wind speed
}

// Hourly forecast item
interface HourlyForecast {
  time: string;                // ISO timestamp
  timeDisplay: string;         // Formatted time (e.g., "2:00 PM")
  temperature: number;         // Temperature at this hour
  condition: string;           // Weather condition
  conditionIcon: string;       // URL to weather icon
  precipitationChance: number; // Precipitation chance (0-100)
}

// Complete weather data structure
interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];      // 7 days
  hourly: HourlyForecast[];    // Next 24 hours
}

// Application state (managed by useWeather composable)
interface WeatherState {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  temperatureUnit: TemperatureUnit;
  currentLocation: string;
}

// API error types
type WeatherError = 
  | 'NOT_FOUND'           // Location not found
  | 'NETWORK_ERROR'       // Network/connection issue
  | 'API_ERROR'           // API service error
  | 'RATE_LIMIT'          // Rate limit exceeded
  | 'UNKNOWN';            // Other errors
```

---

## Technical Specifications

**Performance Requirements**:
- Initial page load with San Francisco weather: < 3 seconds (under normal network conditions)
- Location search response: < 2 seconds
- Temperature unit toggle: < 100ms (instant UI update, no API call)
- UI interactions (hover, click): < 16ms response time for 60fps

**Scale Considerations**:
- Client-side only application (no backend server)
- API key exposed in client code (acceptable for now per user decision)
- WeatherAPI.com free tier rate limits apply (check API documentation)
- No caching strategy implemented (fresh data on every request)

**Mandatory Constraints**:
- Desktop browser support: Chrome, Firefox, Safari, Edge (latest versions)
- No mobile optimization required (desktop focus)
- No user authentication or data persistence
- No saved preferences between sessions

---

## Implementation Sequence

### User Stories (Priority Order from Spec)

1. **US-1**: View Default Weather
2. **US-2**: Search by Location
3. **US-3**: View 7-Day Forecast
4. **US-4**: View 24-Hour Forecast
5. **US-5**: Toggle Temperature Units

*Note: The order above defines implementation priority.*

---

### Phase 1: Foundation & Setup
**Goal**: Establish project infrastructure and base configuration

**Tasks**:
- Initialize Vite + Vue 3 project with TypeScript support
- Install and configure Tailwind CSS
- Set up Vitest for unit testing
- Configure environment variables (.env file with VITE_WEATHER_API_KEY)
- Create project structure (folders for components, services, composables, utils)
- Set up Netlify deployment configuration (netlify.toml)
- Create base App.vue layout with header and main content area
- Implement LoadingSpinner.vue component
- Implement ErrorMessage.vue component
- Create weatherApi.js service skeleton with API base URL and key injection
- Create useWeather.js composable skeleton with reactive state
- Write initial README with setup instructions

**Deliverables**:
- Working development environment (`npm run dev`)
- Passing test suite setup (`npm run test`)
- Netlify deployment configuration ready
- Base component structure in place

---

### Phase 2: US-1 - View Default Weather

**User Story Reference**: US-1 from spec

**Acceptance Criteria** (from spec):
1. **Given** the user opens the webpage, **when** the page loads, **then** San Francisco weather forecast is automatically displayed
2. **Given** the page is loading default weather, **when** data is being fetched, **then** a loading indicator is shown
3. **Given** the default weather has loaded, **when** displayed, **then** both 7-day and 24-hour forecasts are visible

**Implementation Tasks**:
- Implement weatherApi.js functions:
  - `fetchWeatherByLocation(query)` - calls WeatherAPI.com forecast endpoint
  - Parse API response into WeatherData structure
- Implement useWeather.js composable:
  - `loadWeather(location)` - fetches and updates state
  - `onMounted` hook to auto-load "San Francisco" weather
  - Error handling with user-friendly messages
- Create CurrentWeather.vue component:
  - Display location name, current temp, feels-like, condition with icon
  - Show humidity, wind speed, wind direction
  - Display last updated timestamp
- Create basic SevenDayForecast.vue component (placeholder cards)
- Create basic HourlyForecast.vue component (placeholder cards)
- Integrate components in App.vue
- Show LoadingSpinner during initial load
- Show ErrorMessage if API call fails
- Write tests:
  - weatherApi.fetchWeatherByLocation (mock API responses)
  - useWeather composable state updates
  - CurrentWeather component rendering
  - Auto-load behavior on app mount

**Technical Decisions**: Use WeatherAPI.com forecast endpoint which returns current + forecast data in single call. Store API key in environment variable with VITE_ prefix for client-side access.

**Deliverables**: App loads San Francisco weather automatically, displays current conditions with loading and error states, shows placeholder forecast sections.

---

### Phase 3: US-2 - Search by Location

**User Story Reference**: US-2 from spec

**Acceptance Criteria** (from spec):
1. **Given** the user is on the page, **when** they enter a zipcode in the search box and submit, **then** weather for that location is displayed
2. **Given** the user is on the page, **when** they enter a city name and submit, **then** weather for that city is displayed
3. **Given** the user is on the page, **when** they enter a region and submit, **then** weather for that region is displayed
4. **Given** the user enters an invalid location, **when** they submit, **then** a user-friendly error message is displayed suggesting they check their input
5. **Given** the user searches successfully, **when** results are displayed, **then** the location name found by the API is clearly shown

**Implementation Tasks**:
- Create SearchBar.vue component:
  - Input field with placeholder text "Enter city, zipcode, or region"
  - Search button
  - Form submit handler
  - Empty input validation
  - Loading state during search
- Update useWeather.js composable:
  - Add `searchLocation(query)` method
  - Clear previous errors before new search
  - Handle different error types (not found, network, API, rate limit)
  - Map API error responses to user-friendly messages per edge cases (EC-001 through EC-006)
- Enhance ErrorMessage.vue:
  - Display error message with appropriate styling
  - Different styles for different error types (info vs critical)
- Update App.vue to include SearchBar component
- Write tests:
  - SearchBar empty input validation
  - SearchBar submit triggers weather search
  - useWeather error handling for each error type
  - Location name display after successful search
  - Zipcode, city, and region search scenarios

**Technical Decisions**: WeatherAPI.com accepts various location formats (city, zipcode, lat/lon) in same parameter. Use API's location name resolution for display.

**Deliverables**: Functional search bar that accepts any location format, displays appropriate errors for invalid input or API failures, updates weather display with new location data.

---

### Phase 4: US-3 - View 7-Day Forecast

**User Story Reference**: US-3 from spec

**Acceptance Criteria** (from spec):
1. **Given** weather data is loaded, **when** viewing the forecast, **then** 7 days of forecast data are displayed
2. **Given** viewing the 7-day forecast, **when** looking at each day, **then** high and low temperatures are shown
3. **Given** viewing the 7-day forecast, **when** looking at each day, **then** weather conditions (sunny, rainy, cloudy, etc.) are shown
4. **Given** viewing the 7-day forecast, **when** looking at each day, **then** precipitation chance is shown
5. **Given** viewing the 7-day forecast, **when** looking at each day, **then** wind information is shown
6. **Given** viewing the 7-day forecast, **when** looking at each day, **then** the day of the week and date are clearly labeled

**Implementation Tasks**:
- Update weatherApi.js to parse 7-day forecast data from API response into DailyForecast array
- Implement SevenDayForecast.vue component:
  - Grid/flex layout for 7 forecast cards
  - Each card displays: day of week, date, weather icon, condition, high/low temps, precipitation chance, wind speed
  - Responsive styling with Tailwind
  - Handle case where API returns fewer than 7 days
- Create utils/formatters.js:
  - `formatDate(isoString)` - format to readable date
  - `formatDayOfWeek(isoString)` - extract day name
  - `formatTemperature(value, unit)` - format temp with unit symbol
- Update useWeather.js to populate daily forecast data in state
- Write tests:
  - SevenDayForecast renders 7 cards with correct data
  - Each card displays all required information
  - Date and day formatting utilities
  - Temperature formatting with F/C units

**Technical Decisions**: Use CSS Grid for forecast card layout. Weather icons provided by WeatherAPI.com. Display wind speed in mph (API default for US locations).

**Deliverables**: Complete 7-day forecast display with all required weather information formatted and styled clearly.

---

### Phase 5: US-4 - View 24-Hour Forecast

**User Story Reference**: US-4 from spec

**Acceptance Criteria** (from spec):
1. **Given** weather data is loaded, **when** viewing the forecast, **then** hourly forecast for the next 24 hours from current time is displayed
2. **Given** viewing the hourly forecast, **when** looking at each hour, **then** temperature is shown
3. **Given** viewing the hourly forecast, **when** looking at each hour, **then** weather conditions are shown
4. **Given** viewing the hourly forecast, **when** looking at each hour, **then** precipitation chance is shown
5. **Given** viewing the hourly forecast, **when** looking at each hour, **then** the time is clearly labeled

**Implementation Tasks**:
- Update weatherApi.js to parse hourly forecast data:
  - Extract next 24 hours from current time (not midnight to midnight)
  - Filter API response to get 24 consecutive hours starting from now
  - Transform to HourlyForecast array
- Implement HourlyForecast.vue component:
  - Horizontal scrollable container for 24 hour cards
  - Each card displays: time, temperature, weather icon, condition, precipitation chance
  - Compact card design (narrow width)
  - Smooth scrolling with scroll snap
  - Tailwind styling
- Add to utils/formatters.js:
  - `formatTime(isoString)` - format to 12-hour time (e.g., "2:00 PM")
- Update useWeather.js to populate hourly forecast data in state
- Write tests:
  - HourlyForecast renders 24 hour cards
  - Correct filtering of next 24 hours from current time
  - Time formatting utility (AM/PM)
  - Each card displays required information

**Technical Decisions**: Use horizontal scroll with CSS scroll-snap for browsing 24 hours. Calculate "next 24 hours" on client side by filtering API's hourly data based on current timestamp.

**Deliverables**: Scrollable 24-hour forecast showing temperature, conditions, and precipitation for each hour from current time.

---

### Phase 6: US-5 - Toggle Temperature Units

**User Story Reference**: US-5 from spec

**Acceptance Criteria** (from spec):
1. **Given** weather data is displayed, **when** the page loads, **then** temperatures are shown in Fahrenheit by default
2. **Given** temperatures are in Fahrenheit, **when** the user clicks the Celsius toggle, **then** all temperatures update to Celsius
3. **Given** temperatures are in Celsius, **when** the user clicks the Fahrenheit toggle, **then** all temperatures update to Fahrenheit
4. **Given** the temperature unit is toggled, **when** viewing forecasts, **then** both 7-day and hourly forecasts reflect the selected unit
5. **Given** the user toggles units, **when** the page is refreshed, **then** the default (Fahrenheit) is restored

**Implementation Tasks**:
- Create TemperatureToggle.vue component:
  - Toggle button UI (F | C)
  - Active state styling
  - Click handler to update temperature unit
- Update useWeather.js composable:
  - Add `temperatureUnit` reactive ref (default 'F')
  - Add `toggleTemperatureUnit()` method
  - Store both F and C values from API (no conversion needed, API provides both)
- Update components to use selected unit:
  - CurrentWeather.vue - display temp in selected unit
  - SevenDayForecast.vue - display high/low in selected unit
  - HourlyForecast.vue - display temp in selected unit
- Update utils/formatters.js:
  - Enhance `formatTemperature()` to append °F or °C symbol
- Add TemperatureToggle to App.vue header
- Write tests:
  - TemperatureToggle click updates unit state
  - Temperature displays update reactively when unit changes
  - Default is Fahrenheit on mount
  - No persistence between sessions (unit resets on page refresh)
  - Performance: unit toggle updates UI in < 100ms

**Technical Decisions**: No temperature conversion calculations needed - WeatherAPI.com returns both Fahrenheit and Celsius in response. Simply display the appropriate value based on selected unit. No localStorage persistence to maintain fresh-start behavior.

**Deliverables**: Functional F/C toggle that instantly updates all displayed temperatures across current weather and forecasts, with Fahrenheit as default.

---

### Phase 7: Polish, Testing & Deployment

**Goal**: Finalize, validate, and deploy the complete application

**Tasks**:
- End-to-end manual testing:
  - Test all user stories with various locations (city, zipcode, region)
  - Test error scenarios (invalid location, network disconnect, empty search)
  - Test temperature toggle across all views
  - Verify default San Francisco load on page refresh
  - Test in Chrome, Firefox, Safari, Edge
- Performance optimization:
  - Verify initial load < 3 seconds with network throttling
  - Verify search results < 2 seconds
  - Verify temperature toggle < 100ms
  - Optimize bundle size if needed (code splitting, tree shaking)
- UI/UX polish:
  - Consistent spacing and alignment with Tailwind
  - Hover states on interactive elements
  - Responsive text sizing
  - Weather icon display consistency
  - Loading state transitions (smooth fade in/out)
  - Error message dismissal (auto-clear on new search)
- Accessibility review:
  - Keyboard navigation for search and toggle
  - ARIA labels for weather icons
  - Focus indicators
  - Color contrast check
- Code quality:
  - Run linter (ESLint) and fix issues
  - Add JSDoc comments to utility functions
  - Remove console.logs and debug code
- Documentation:
  - Complete README with:
    - Project description
    - Setup instructions
    - Environment variable configuration
    - Available scripts (dev, build, test)
    - Deployment instructions
  - Add inline code comments for complex logic
- Testing:
  - Achieve 80%+ test coverage
  - Add missing unit tests
  - Test edge cases (EC-001 through EC-006)
- Deployment:
  - Create Netlify account and link repository
  - Configure build settings (npm run build, dist/ folder)
  - Set VITE_WEATHER_API_KEY environment variable in Netlify
  - Deploy to production
  - Verify deployed app works correctly
  - Test with actual WeatherAPI.com API (not mocked)
- Post-deployment:
  - Smoke test all features in production
  - Verify performance meets success criteria
  - Document production URL

**Deliverables**:
- Production-ready application deployed to Netlify
- Complete README documentation
- Test coverage reports (80%+ coverage)
- All user stories verified working in production

---

## Needs Discussion

None at this time. All technical decisions have been made and documented in the Discovery Log.
