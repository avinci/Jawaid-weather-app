/**
 * Weather API Service
 * Handles all interactions with WeatherAPI.com
 */

const API_BASE_URL = 'https://api.weatherapi.com/v1'
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

export interface CurrentWeather {
  location: string
  temperature: number
  feelsLike: number
  condition: string
  conditionIcon: string
  humidity: number
  windSpeed: number
  windDirection: string
  lastUpdated: string
}

export interface DailyForecast {
  date: string
  dayOfWeek: string
  highTemp: number
  lowTemp: number
  condition: string
  conditionIcon: string
  precipitationChance: number
  windSpeed: number
}

export interface HourlyForecast {
  time: string
  timeDisplay: string
  temperature: number
  condition: string
  conditionIcon: string
  precipitationChance: number
}

export interface WeatherData {
  current: CurrentWeather
  daily: DailyForecast[]
  hourly: HourlyForecast[]
}

/**
 * Fetch weather data for a given location
 * @param query - Location query (city name, zipcode, or region)
 * @returns Weather data including current conditions and forecasts
 */
export async function fetchWeatherByLocation(query: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error('Weather API key is not configured')
  }
  
  if (import.meta.env.DEV) {
    console.debug(`[weatherApi] Fetching weather for: ${query}`)
  }
  
  const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=7&aqi=no`
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      // EC-001: Location not found
      if (response.status === 400) {
        throw new Error('Location not found. Please check your spelling and try again.')
      } 
      // API authentication errors
      else if (response.status === 401) {
        throw new Error('Invalid API key.')
      } 
      // EC-006: Rate limit exceeded
      else if (response.status === 403) {
        throw new Error('Service temporarily unavailable. Please try again in a few minutes.')
      } 
      // EC-002: API service error
      else {
        throw new Error('Unable to fetch weather data. Please try again later.')
      }
    }
    
    const data = await response.json()
    
    return parseWeatherData(data)
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw if already a user-friendly error message
      if (error.message.includes('Location not found') || 
          error.message.includes('API key') || 
          error.message.includes('temporarily unavailable') ||
          error.message.includes('Unable to fetch weather data')) {
        throw error
      }
      // EC-004: Network connection error
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('Connection lost. Please check your internet and try again.')
      }
      throw new Error('Unable to fetch weather data. Please try again later.')
    }
    throw new Error('An unexpected error occurred while fetching weather data.')
  }
}

/**
 * Parse raw API response into WeatherData structure
 * @param data - Raw API response
 * @returns Parsed weather data
 */
function parseWeatherData(data: any): WeatherData {
  const current: CurrentWeather = {
    location: `${data.location.name}, ${data.location.region || data.location.country}`,
    temperature: data.current.temp_f,
    feelsLike: data.current.feelslike_f,
    condition: data.current.condition.text,
    conditionIcon: `https:${data.current.condition.icon}`,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_mph,
    windDirection: data.current.wind_dir,
    lastUpdated: data.current.last_updated
  }
  
  const daily: DailyForecast[] = data.forecast.forecastday.map((day: any) => ({
    date: day.date,
    dayOfWeek: new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
    highTemp: day.day.maxtemp_f,
    lowTemp: day.day.mintemp_f,
    condition: day.day.condition.text,
    conditionIcon: `https:${day.day.condition.icon}`,
    precipitationChance: day.day.daily_chance_of_rain,
    windSpeed: day.day.maxwind_mph
  }))
  
  // Get next 24 hours from current time
  const currentTime = new Date().getTime()
  const allHours: any[] = []
  
  data.forecast.forecastday.forEach((day: any) => {
    allHours.push(...day.hour)
  })
  
  const hourly: HourlyForecast[] = allHours
    .filter((hour: any) => new Date(hour.time).getTime() >= currentTime)
    .slice(0, 24)
    .map((hour: any) => {
      const time = new Date(hour.time)
      return {
        time: hour.time,
        timeDisplay: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        temperature: hour.temp_f,
        condition: hour.condition.text,
        conditionIcon: `https:${hour.condition.icon}`,
        precipitationChance: hour.chance_of_rain
      }
    })
  
  return { current, daily, hourly }
}
