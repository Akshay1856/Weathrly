"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Droplets, Wind, Eye, Gauge, Sun, Cloud, CloudRain, CloudSnow, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WeatherData {
  current: {
    location: string
    temperature: number
    condition: string
    description?: string
    humidity: number
    windSpeed: number
    visibility: number
    pressure: number
    uvIndex: number
    icon: string
    feelsLike: number
  }
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
    icon: string
  }>
}

const popularCities = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Bangalore",
  "Delhi",
  "Chennai",
  "Mumbai",
  "Los Angeles",
  "Singapore",
]

const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivli",
  "Vasai-Virar",
  "Varanasi",
]

const allCities = [...popularCities, ...indianCities]

const WeatherIcon = ({ condition, size = 24 }: { condition: string; size?: number }) => {
  switch (condition) {
    case "sunny":
      return <Sun size={size} className="text-yellow-500" />
    case "partly-cloudy":
      return <Cloud size={size} className="text-gray-500" />
    case "cloudy":
      return <Cloud size={size} className="text-gray-600" />
    case "rainy":
      return <CloudRain size={size} className="text-blue-500" />
    case "snowy":
      return <CloudSnow size={size} className="text-blue-300" />
    default:
      return <Sun size={size} className="text-yellow-500" />
  }
}

export default function WeatherApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("New York")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  useEffect(() => {
    if (searchQuery) {
      const filtered = allCities.filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredCities(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery])

  useEffect(() => {
    // Load weather for default city on component mount
    fetchWeatherData(selectedCity)
  }, [])

  const fetchWeatherData = async (city: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      console.error("Weather fetch error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")

      // Don't clear weather data on error, keep showing last successful data
      if (!weatherData) {
        // Only set fallback data if we have no data at all
        setWeatherData({
          current: {
            location: `${city}`,
            temperature: 22,
            condition: "Partly Cloudy",
            description: "partly cloudy",
            humidity: 65,
            windSpeed: 12,
            visibility: 10,
            pressure: 1013,
            uvIndex: 6,
            icon: "partly-cloudy",
            feelsLike: 24,
          },
          forecast: [
            { day: "Today", high: 25, low: 18, condition: "Partly Cloudy", icon: "partly-cloudy" },
            { day: "Tomorrow", high: 28, low: 20, condition: "Sunny", icon: "sunny" },
            { day: "Wednesday", high: 24, low: 16, condition: "Rainy", icon: "rainy" },
            { day: "Thursday", high: 26, low: 19, condition: "Cloudy", icon: "cloudy" },
            { day: "Friday", high: 23, low: 15, condition: "Partly Cloudy", icon: "partly-cloudy" },
          ],
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setSearchQuery("")
    setShowSuggestions(false)
    fetchWeatherData(city)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      handleCitySelect(searchQuery.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-teal-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900">Weathrly</h1>
              <p className="text-sm text-teal-600 font-medium">Your friendly weather companion</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12"
                  disabled={loading}
                />
                <Button
                  onClick={handleSearch}
                  className="ml-2 bg-teal-600 hover:bg-teal-700"
                  disabled={loading || !searchQuery.trim()}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10">
                  {filteredCities.slice(0, 8).map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      disabled={loading}
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{city}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}. Please try again or select a different city.
            </AlertDescription>
          </Alert>
        )}

        {/* Popular Cities */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Cities</h2>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <Badge
                key={city}
                variant={selectedCity === city ? "default" : "secondary"}
                className={`cursor-pointer px-3 py-1 transition-colors ${
                  selectedCity === city ? "bg-teal-600 hover:bg-teal-700 text-white" : "hover:bg-gray-200"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !loading && handleCitySelect(city)}
              >
                {city}
              </Badge>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
              <p className="text-gray-600">Loading weather data...</p>
            </div>
          </div>
        )}

        {/* Weather Content */}
        {!loading && weatherData && (
          <>
            {/* Current Weather */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">{weatherData.current.location}</CardTitle>
                      <p className="text-cyan-100 capitalize">
                        {weatherData.current.description || weatherData.current.condition}
                      </p>
                    </div>
                    <WeatherIcon condition={weatherData.current.icon} size={64} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-6xl font-bold mb-4">{weatherData.current.temperature}°C</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4" />
                      <span>Humidity: {weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wind className="h-4 w-4" />
                      <span>Wind: {weatherData.current.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Visibility: {weatherData.current.visibility} km</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4" />
                      <span>Pressure: {weatherData.current.pressure} hPa</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weather Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Feels like</span>
                    <span className="font-semibold">{weatherData.current.feelsLike}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dew Point</span>
                    <span className="font-semibold">{weatherData.current.temperature - 5}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-semibold text-sm">{new Date().toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 5-Day Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-semibold text-gray-900 mb-2">{day.day}</div>
                      <div className="flex justify-center mb-2">
                        <WeatherIcon condition={day.icon} size={32} />
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{day.condition}</div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{day.high}°</span>
                        <span className="text-gray-500">{day.low}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-teal-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>© 2025 Weathrly. Developed by Akshaya Raj</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a
                href="https://www.linkedin.com/in/akshaya-raj-39a98132a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://github.com/Akshay1856"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/akshay__1856/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.652-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.245 17.815.228 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.009 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="mailto:akshaya18raj@gmail.com" className="text-teal-600 hover:text-teal-800 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
