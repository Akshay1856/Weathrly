import json
import requests
from datetime import datetime, timedelta
import numpy as np
import matplotlib.pyplot as plt

class WeatherDataProcessor:
    def __init__(self):
        self.cities = [
            "New York", "London", "Tokyo", "Paris", "Bangalore", 
            "Delhi", "Chennai", "Mumbai", "Los Angeles", "Singapore"
        ]
        
    def generate_mock_weather_data(self):
        """Generate realistic mock weather data for demonstration"""
        weather_data = {}
        
        for city in self.cities:
            # Generate realistic temperature based on city
            base_temp = self.get_base_temperature(city)
            current_temp = base_temp + np.random.randint(-5, 6)
            
            # Generate weather conditions
            conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Snowy"]
            weights = self.get_weather_weights(city)
            condition = np.random.choice(conditions, p=weights)
            
            weather_data[city] = {
                "current": {
                    "location": f"{city}, {self.get_country(city)}",
                    "temperature": current_temp,
                    "condition": condition,
                    "humidity": np.random.randint(40, 90),
                    "windSpeed": np.random.randint(5, 25),
                    "visibility": np.random.randint(5, 20),
                    "pressure": np.random.randint(995, 1025),
                    "uvIndex": np.random.randint(1, 11),
                    "icon": self.get_icon_from_condition(condition)
                },
                "forecast": self.generate_forecast(base_temp, condition)
            }
        
        return weather_data
    
    def get_base_temperature(self, city):
        """Get base temperature for different cities"""
        temp_map = {
            "New York": 20, "London": 15, "Tokyo": 25, "Paris": 18,
            "Bangalore": 24, "Delhi": 28, "Chennai": 30, "Mumbai": 28,
            "Los Angeles": 24, "Singapore": 30
        }
        return temp_map.get(city, 20)
    
    def get_country(self, city):
        """Get country for city"""
        country_map = {
            "New York": "USA", "London": "UK", "Tokyo": "Japan", "Paris": "France",
            "Bangalore": "India", "Delhi": "India", "Chennai": "India", 
            "Mumbai": "India", "Los Angeles": "USA", "Singapore": "Singapore"
        }
        return country_map.get(city, "Unknown")
    
    def get_weather_weights(self, city):
        """Get weather probability weights for different cities"""
        if city in ["Los Angeles", "Singapore"]:
            return [0.6, 0.3, 0.1, 0.0, 0.0]  # More sunny
        elif city in ["London", "Mumbai", "Chennai"]:
            return [0.2, 0.2, 0.3, 0.3, 0.0]  # More rainy
        elif city in ["Delhi", "Bangalore"]:
            return [0.4, 0.3, 0.2, 0.1, 0.0]  # Moderate
        else:
            return [0.3, 0.3, 0.2, 0.2, 0.0]  # Balanced
    
    def get_icon_from_condition(self, condition):
        """Convert condition to icon name"""
        icon_map = {
            "Sunny": "sunny",
            "Partly Cloudy": "partly-cloudy",
            "Cloudy": "cloudy",
            "Rainy": "rainy",
            "Snowy": "snowy"
        }
        return icon_map.get(condition, "sunny")
    
    def generate_forecast(self, base_temp, current_condition):
        """Generate 5-day forecast"""
        forecast = []
        days = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday"]
        
        for i, day in enumerate(days):
            temp_variation = np.random.randint(-3, 4)
            high = base_temp + temp_variation + np.random.randint(2, 6)
            low = base_temp + temp_variation - np.random.randint(2, 6)
            
            conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"]
            condition = np.random.choice(conditions)
            
            forecast.append({
                "day": day,
                "high": high,
                "low": low,
                "condition": condition,
                "icon": self.get_icon_from_condition(condition)
            })
        
        return forecast
    
    def analyze_temperature_trends(self, weather_data):
        """Analyze temperature trends across cities"""
        cities = list(weather_data.keys())
        temperatures = [weather_data[city]["current"]["temperature"] for city in cities]
        
        plt.figure(figsize=(12, 6))
        plt.bar(cities, temperatures, color='orange', alpha=0.7)
        plt.title('Current Temperature Across Cities')
        plt.xlabel('Cities')
        plt.ylabel('Temperature (°C)')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig('temperature_analysis.png')
        plt.show()
        
        return {
            "average_temp": np.mean(temperatures),
            "max_temp": max(temperatures),
            "min_temp": min(temperatures),
            "temp_range": max(temperatures) - min(temperatures)
        }
    
    def export_weather_data(self, weather_data, filename="weather_data.json"):
        """Export weather data to JSON file"""
        with open(filename, 'w') as f:
            json.dump(weather_data, f, indent=2)
        print(f"Weather data exported to {filename}")
    
    def process_weather_alerts(self, weather_data):
        """Process and generate weather alerts"""
        alerts = []
        
        for city, data in weather_data.items():
            temp = data["current"]["temperature"]
            condition = data["current"]["condition"]
            wind_speed = data["current"]["windSpeed"]
            
            # Temperature alerts
            if temp > 35:
                alerts.append(f"🔥 Heat Warning in {city}: {temp}°C")
            elif temp < 0:
                alerts.append(f"❄️ Freeze Warning in {city}: {temp}°C")
            
            # Wind alerts
            if wind_speed > 20:
                alerts.append(f"💨 High Wind Alert in {city}: {wind_speed} km/h")
            
            # Severe weather alerts
            if condition == "Rainy" and wind_speed > 15:
                alerts.append(f"⛈️ Storm Warning in {city}")
        
        return alerts

# Example usage
if __name__ == "__main__":
    processor = WeatherDataProcessor()
    
    print("🌤️ Generating weather data...")
    weather_data = processor.generate_mock_weather_data()
    
    print("📊 Analyzing temperature trends...")
    trends = processor.analyze_temperature_trends(weather_data)
    print(f"Average temperature: {trends['average_temp']:.1f}°C")
    print(f"Temperature range: {trends['temp_range']:.1f}°C")
    
    print("⚠️ Processing weather alerts...")
    alerts = processor.process_weather_alerts(weather_data)
    for alert in alerts:
        print(alert)
    
    print("💾 Exporting weather data...")
    processor.export_weather_data(weather_data)
    
    print("✅ Weather data processing complete!")
