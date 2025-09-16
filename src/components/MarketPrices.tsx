import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Mic, MicOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CropPrice {
  name: string;
  hindiName: string;
  currentPrice: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  msp: number; // Minimum Support Price
  marketDemand: 'high' | 'medium' | 'low';
}

const cropPricesData: CropPrice[] = [
  {
    name: "Onion (Red)",
    hindiName: "प्याज (लाल)",
    currentPrice: 14.20,
    unit: "kg",
    change: 2.5,
    trend: 'up',
    msp: 12.50,
    marketDemand: 'high'
  },
  {
    name: "Potato",
    hindiName: "आलू",
    currentPrice: 11.50,
    unit: "kg", 
    change: -1.2,
    trend: 'down',
    msp: 10.00,
    marketDemand: 'medium'
  },
  {
    name: "Maize",
    hindiName: "मक्का",
    currentPrice: 22.80,
    unit: "kg",
    change: 0.8,
    trend: 'up',
    msp: 20.00,
    marketDemand: 'high'
  },
  {
    name: "Wheat",
    hindiName: "गेहूं",
    currentPrice: 25.80,
    unit: "kg",
    change: 0.0,
    trend: 'stable',
    msp: 24.00,
    marketDemand: 'medium'
  },
  {
    name: "Rice (Common)",
    hindiName: "चावल (साधारण)",
    currentPrice: 34.50,
    unit: "kg",
    change: 1.5,
    trend: 'up',
    msp: 32.00,
    marketDemand: 'high'
  },
  {
    name: "Cauliflower",
    hindiName: "फूलगोभी",
    currentPrice: 14.50,
    unit: "kg",
    change: -2.3,
    trend: 'down',
    msp: 12.00,
    marketDemand: 'low'
  },
  {
    name: "Tomato",
    hindiName: "टमाटर",
    currentPrice: 18.75,
    unit: "kg",
    change: 3.2,
    trend: 'up',
    msp: 15.00,
    marketDemand: 'high'
  },
  {
    name: "Cotton",
    hindiName: "कपास",
    currentPrice: 42.50,
    unit: "kg",
    change: 1.8,
    trend: 'up',
    msp: 40.00,
    marketDemand: 'medium'
  },
  {
    name: "Sugarcane",
    hindiName: "गन्ना",
    currentPrice: 3.25,
    unit: "kg",
    change: 0.5,
    trend: 'up',
    msp: 3.00,
    marketDemand: 'medium'
  },
  {
    name: "Mustard",
    hindiName: "सरसों",
    currentPrice: 45.20,
    unit: "kg",
    change: -0.8,
    trend: 'down',
    msp: 43.00,
    marketDemand: 'medium'
  }
];

export const MarketPrices = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [filteredPrices, setFilteredPrices] = useState<CropPrice[]>(cropPricesData);
  const [isListening, setIsListening] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { t } = useLanguage();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

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
      toast.success("कौन सी फसल का भाव जानना चाहते हैं? बोलें...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      // Match crop from speech
      const matchedCrop = cropPricesData.find(crop => 
        transcript.includes(crop.hindiName) || 
        transcript.includes(crop.name.toLowerCase()) ||
        transcript.includes(crop.hindiName.split(' ')[0])
      );
      
      if (matchedCrop) {
        setSelectedCrop(matchedCrop.name);
        setFilteredPrices([matchedCrop]);
      } else {
        toast.error("फसल पहचानी नहीं गई, कृपया दोबारा कोशिश करें");
      }
      
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

  const handleCropFilter = (cropName: string) => {
    if (cropName === 'all') {
      setFilteredPrices(cropPricesData);
      setSelectedCrop('');
    } else {
      const filtered = cropPricesData.filter(crop => crop.name === cropName);
      setFilteredPrices(filtered);
      setSelectedCrop(cropName);
    }
  };

  const refreshPrices = () => {
    // Simulate price fluctuation
    const updatedPrices = cropPricesData.map(crop => ({
      ...crop,
      currentPrice: Number((crop.currentPrice + (Math.random() - 0.5) * 2).toFixed(2)),
      change: Number(((Math.random() - 0.5) * 5).toFixed(1)),
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable' as 'up' | 'down' | 'stable'
    }));
    
    setFilteredPrices(selectedCrop ? 
      updatedPrices.filter(crop => crop.name === selectedCrop) : 
      updatedPrices
    );
    
    setLastUpdated(new Date());
    toast.success("कीमतें अपडेट हो गईं");
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
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
            💰 Market Price Tracking
          </h1>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                📊 बाजार की कीमतें
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={isListening ? "bg-red-100" : ""}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPrices}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  फसल चुनें या बोलकर बताएं:
                </label>
                <Select value={selectedCrop} onValueChange={handleCropFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="सभी फसलें दिखाएं..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी फसलें</SelectItem>
                    {cropPricesData.map(crop => (
                      <SelectItem key={crop.name} value={crop.name}>
                        {crop.hindiName} ({crop.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                आखिरी अपडेट: {lastUpdated.toLocaleTimeString('hi-IN')}
              </div>
            </div>

            {isListening && (
              <div className="mt-4 text-center p-3 bg-muted rounded-lg">
                🎤 सुन रहा हूं... कौन सी फसल का भाव जानना चाहते हैं?
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrices.map((crop, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{crop.hindiName}</h3>
                    <p className="text-sm text-muted-foreground">{crop.name}</p>
                  </div>
                  {getTrendIcon(crop.trend)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Price */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      ₹{crop.currentPrice}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      प्रति {crop.unit}
                    </div>
                    <div className={`flex items-center justify-center gap-1 mt-2 ${
                      crop.change > 0 ? 'text-green-600' : 
                      crop.change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {getTrendIcon(crop.trend)}
                      <span className="text-sm">
                        {crop.change > 0 ? '+' : ''}{crop.change}%
                      </span>
                    </div>
                  </div>

                  {/* MSP */}
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">MSP:</span>
                      <span className="font-bold">₹{crop.msp}/{crop.unit}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">MSP से:</span>
                      <span className={`text-sm font-medium ${
                        crop.currentPrice > crop.msp ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {crop.currentPrice > crop.msp ? '+' : ''}
                        ₹{(crop.currentPrice - crop.msp).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Market Demand */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">बाजार मांग:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(crop.marketDemand)}`}>
                      {crop.marketDemand === 'high' ? 'उच्च' :
                       crop.marketDemand === 'medium' ? 'मध्यम' : 'कम'}
                    </span>
                  </div>

                  {/* Quick Info */}
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    {crop.currentPrice > crop.msp ? 
                      '✅ MSP से ऊपर - बेचने का अच्छा समय' :
                      '⚠️ MSP से नीचे - प्रतीक्षा करें या सरकारी खरीद केंद्र जाएं'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>💡 बाजार टिप्स</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">बेचने का सही समय</h4>
                <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                  <li>• MSP से ऊपर की कीमत मिले तो बेचें</li>
                  <li>• त्योहारी सीजन में मांग बढ़ती है</li>
                  <li>• फसल कटाई के तुरंत बाद न बेचें</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">भंडारण टिप्स</h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• अच्छी storage से बेहतर कीमत मिलती है</li>
                  <li>• नमी से बचाकर रखें</li>
                  <li>• कीट-पतंगों से सुरक्षा करें</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">बाजार जानकारी</h4>
                <ul className="text-sm text-purple-600 dark:text-purple-400 space-y-1">
                  <li>• eNAM ऐप से daily rates चेक करें</li>
                  <li>• नजदीकी mandi के भाव जानें</li>
                  <li>• Transport cost भी जोड़कर calculate करें</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};