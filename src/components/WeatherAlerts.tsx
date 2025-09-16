import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    icon: string;
  }>;
  alerts: string[];
  farmingAdvice: string[];
}

export const WeatherAlerts = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  // Simulate real-time weather data
  const generateWeatherData = (loc: string): WeatherData => {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      location: loc,
      temperature: Math.floor(Math.random() * 20) + 20, // 20-40°C
      condition,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      visibility: Math.floor(Math.random() * 5) + 8, // 8-12 km
      uvIndex: Math.floor(Math.random() * 8) + 1, // 1-8
      forecast: [
        { day: 'आज', temp: 32, condition: 'धूप', icon: '☀️' },
        { day: 'कल', temp: 28, condition: 'बादल', icon: '☁️' },
        { day: 'परसों', temp: 25, condition: 'बारिश', icon: '🌧️' },
        { day: 'तीन दिन बाद', temp: 30, condition: 'आंशिक बादल', icon: '⛅' },
        { day: 'पांच दिन बाद', temp: 35, condition: 'धूप', icon: '☀️' }
      ],
      alerts: [
        'आज शाम तेज बारिश की संभावना',
        'अगले 2 दिन तेज हवा चलेगी',
        'UV Index उच्च - सुरक्षा करें'
      ],
      farmingAdvice: [
        'धान की फसल के लिए अच्छा समय',
        'छिड़काव से बचें - बारिश की संभावना',
        'सिंचाई की आवश्यकता नहीं',
        'फसल को हवा से बचाने का प्रबंध करें'
      ]
    };
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Voice input not supported");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("शहर का नाम बोलें...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLocation(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice input error");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const fetchWeatherData = async () => {
    if (!location.trim()) {
      toast.error("कृपया स्थान दर्ज करें");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const data = generateWeatherData(location);
      setWeatherData(data);
      setIsLoading(false);
      toast.success("मौसम की जानकारी अपडेट हो गई");
    }, 2000);
  };

  // Auto-refresh weather data every 30 seconds
  useEffect(() => {
    if (weatherData) {
      const interval = setInterval(() => {
        const updatedData = generateWeatherData(weatherData.location);
        setWeatherData(updatedData);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [weatherData]);

  const getWeatherIcon = (condition: string) => {
    const icons = {
      'Sunny': <Sun className="h-8 w-8 text-yellow-500" />,
      'Cloudy': <Cloud className="h-8 w-8 text-gray-500" />,
      'Rainy': <CloudRain className="h-8 w-8 text-blue-500" />,
      'Partly Cloudy': <Cloud className="h-8 w-8 text-gray-400" />
    };
    return icons[condition as keyof typeof icons] || <Sun className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            होम
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            🌤️ Weather Alerts
          </h1>
        </div>

        {/* Location Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📍 मौसम की जानकारी के लिए स्थान दर्ज करें
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceInput}
                className={isListening ? "bg-red-100" : ""}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="शहर का नाम दर्ज करें या बोलकर बताएं..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && fetchWeatherData()}
              />
              <Button 
                onClick={fetchWeatherData}
                disabled={isLoading}
                className="bg-gradient-primary"
              >
                {isLoading ? "लोड हो रहा है..." : "मौसम देखें"}
              </Button>
            </div>
            {isListening && (
              <div className="mt-2 text-center p-2 bg-muted rounded">
                🎤 सुन रहा हूं... शहर का नाम बोलें
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weather Data */}
        {weatherData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Current Weather */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getWeatherIcon(weatherData.condition)}
                  वर्तमान मौसम
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{weatherData.location}</h3>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {weatherData.temperature}°C
                  </div>
                  <p className="text-muted-foreground mb-4">{weatherData.condition}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>नमी: {weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>हवा: {weatherData.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <span>दृश्यता: {weatherData.visibility} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span>UV Index: {weatherData.uvIndex}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">⚠️ मौसम चेतावनी</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherData.alerts.map((alert, index) => (
                    <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">{alert}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Farming Advice */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">🌾 खेती सुझाव</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherData.farmingAdvice.map((advice, index) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">{advice}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 5-Day Forecast */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>📅 5 दिन का मौसम पूर्वानुमान</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-medium mb-2">{day.day}</p>
                      <div className="text-2xl mb-2">{day.icon}</div>
                      <p className="text-lg font-bold">{day.temp}°C</p>
                      <p className="text-sm text-muted-foreground">{day.condition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Default State */}
        {!weatherData && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <Cloud className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Weather Information</h3>
              <p className="text-muted-foreground mb-4">
                अपना स्थान दर्ज करें और वर्तमान मौसम की जानकारी, चेतावनियां और खेती सुझाव प्राप्त करें
              </p>
              <p className="text-sm text-muted-foreground">
                📡 हर 30 सेकंड में अपडेट होने वाली जानकारी
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};