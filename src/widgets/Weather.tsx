import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cloud, Sun, CloudRain, Snow, MapPin, Loader2 } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Note: In a real app, you'd need an API key from OpenWeatherMap
  const API_KEY = 'demo_key'; // Replace with actual API key

  useEffect(() => {
    // Get user's location on component mount
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        () => {
          // Fallback to a default city if geolocation fails
          getWeatherByCity('New York');
        }
      );
    } else {
      getWeatherByCity('New York');
    }
  };

  const getWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError('');

    try {
      // Since we don't have a real API key, simulate weather data
      simulateWeatherData('Current Location');
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByCity = async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Simulate weather data since we don't have a real API key
      simulateWeatherData(city);
    } catch (err) {
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  const simulateWeatherData = (locationName: string) => {
    // Simulate realistic weather data
    const conditions = [
      { desc: 'Clear sky', temp: 22, icon: 'clear', humidity: 45, wind: 5 },
      { desc: 'Partly cloudy', temp: 18, icon: 'clouds', humidity: 60, wind: 8 },
      { desc: 'Light rain', temp: 15, icon: 'rain', humidity: 85, wind: 12 },
      { desc: 'Sunny', temp: 25, icon: 'clear', humidity: 40, wind: 3 }
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    setTimeout(() => {
      setWeather({
        location: locationName,
        temperature: randomCondition.temp,
        description: randomCondition.desc,
        humidity: randomCondition.humidity,
        windSpeed: randomCondition.wind,
        icon: randomCondition.icon
      });
    }, 1000); // Simulate network delay
  };

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case 'clear':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'snow':
        return <Snow className="h-6 w-6 text-blue-200" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const handleSearch = () => {
    if (location.trim()) {
      getWeatherByCity(location);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Enter city..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-sm"
          />
          <Button
            onClick={handleSearch}
            disabled={loading || !location.trim()}
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <MapPin className="h-3 w-3" />
            )}
          </Button>
        </div>

        {error && (
          <div className="text-xs text-red-500 text-center">
            {error}
          </div>
        )}

        {weather && !loading && (
          <div className="space-y-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getWeatherIcon(weather.icon)}
                <span className="text-2xl font-bold">{weather.temperature}°C</span>
              </div>
              <div className="text-sm font-medium">{weather.location}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {weather.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Humidity</div>
                <div>{weather.humidity}%</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Wind</div>
                <div>{weather.windSpeed} km/h</div>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="text-xs text-muted-foreground text-center">
            Loading current location weather...
          </div>
        )}
      </CardContent>
    </Card>
  );
};