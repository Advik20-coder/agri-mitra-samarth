import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Calendar, Sprout, Mic, MicOff, TrendingUp, Droplets, Sun } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CropRecommendation {
  cropName: string;
  hindiName: string;
  suitability: 'excellent' | 'good' | 'average' | 'poor';
  expectedYield: string;
  marketValue: 'high' | 'medium' | 'low';
  profitMargin: string;
  sowingTime: string;
  harvestTime: string;
  waterRequirement: 'high' | 'medium' | 'low';
  tips: string[];
}

const soilTypes = [
  { value: 'alluvial', label: 'जलोढ़ मिट्टी (Alluvial Soil)' },
  { value: 'black', label: 'काली मिट्टी (Black Cotton Soil)' },
  { value: 'red', label: 'लाल मिट्टी (Red Soil)' },
  { value: 'sandy', label: 'रेतीली मिट्टी (Sandy Soil)' },
  { value: 'clay', label: 'चिकनी मिट्टी (Clay Soil)' },
  { value: 'loamy', label: 'दोमट मिट्टी (Loamy Soil)' }
];

const seasons = [
  { value: 'kharif', label: 'खरीफ (जून-अक्टूबर)' },
  { value: 'rabi', label: 'रबी (नवंबर-मार्च)' },
  { value: 'zaid', label: 'जायद (अप्रैल-जून)' }
];

const getCropRecommendations = (soilType: string, season: string): CropRecommendation[] => {
  const recommendations: Record<string, Record<string, CropRecommendation[]>> = {
    alluvial: {
      kharif: [
        {
          cropName: 'Rice',
          hindiName: 'धान',
          suitability: 'excellent',
          expectedYield: '40-50 क्विंटल/एकड़',
          marketValue: 'high',
          profitMargin: '30-40%',
          sowingTime: 'जून-जुलाई',
          harvestTime: 'अक्टूबर-नवंबर',
          waterRequirement: 'high',
          tips: ['अच्छी पैदावार के लिए उन्नत किस्म चुनें', 'जल निकासी का प्रबंध करें', 'नियमित छिड़काव करें']
        },
        {
          cropName: 'Sugarcane',
          hindiName: 'गन्ना',
          suitability: 'excellent',
          expectedYield: '400-500 क्विंटल/एकड़',
          marketValue: 'high',
          profitMargin: '40-50%',
          sowingTime: 'मार्च-अप्रैल',
          harvestTime: 'दिसंबर-फरवरी',
          waterRequirement: 'high',
          tips: ['18 महीने की फसल है', 'नियमित सिंचाई आवश्यक', 'अच्छी मार्केट वैल्यू']
        }
      ],
      rabi: [
        {
          cropName: 'Wheat',
          hindiName: 'गेहूं',
          suitability: 'excellent',
          expectedYield: '25-30 क्विंटल/एकड़',
          marketValue: 'high',
          profitMargin: '25-35%',
          sowingTime: 'नवंबर-दिसंबर',
          harvestTime: 'अप्रैल-मई',
          waterRequirement: 'medium',
          tips: ['MSP का फायदा मिलता है', 'समय पर बुआई जरूरी', 'संतुलित उर्वरक दें']
        },
        {
          cropName: 'Mustard',
          hindiName: 'सरसों',
          suitability: 'good',
          expectedYield: '15-20 क्विंटल/एकड़',
          marketValue: 'medium',
          profitMargin: '20-30%',
          sowingTime: 'अक्टूबर-नवंबर',
          harvestTime: 'मार्च-अप्रैल',
          waterRequirement: 'low',
          tips: ['तेल की बढ़ती मांग', 'कम पानी की आवश्यकता', 'अच्छा market rate']
        }
      ]
    },
    black: {
      kharif: [
        {
          cropName: 'Cotton',
          hindiName: 'कपास',
          suitability: 'excellent',
          expectedYield: '8-12 क्विंटल/एकड़',
          marketValue: 'high',
          profitMargin: '35-45%',
          sowingTime: 'मई-जून',
          harvestTime: 'अक्टूबर-दिसंबर',
          waterRequirement: 'medium',
          tips: ['काली मिट्टी के लिए सबसे अच्छी', 'Bt cotton किस्म चुनें', 'अच्छी export demand']
        },
        {
          cropName: 'Soybean',
          hindiName: 'सोयाबीन',
          suitability: 'excellent',
          expectedYield: '12-18 क्विंटल/एकड़',
          marketValue: 'high',
          profitMargin: '30-40%',
          sowingTime: 'जून-जुलाई',
          harvestTime: 'सितंबर-अक्टूबर',
          waterRequirement: 'medium',
          tips: ['प्रोटीन की high demand', 'काली मिट्टी में बेहतरीन', 'अच्छा market price']
        }
      ],
      rabi: [
        {
          cropName: 'Gram',
          hindiName: 'चना',
          suitability: 'excellent',
          expectedYield: '15-20 क्विंटल/एकड़',
          marketValue: 'high',
          profitMargin: '40-50%',
          sowingTime: 'अक्टूबर-नवंबर',
          harvestTime: 'मार्च-अप्रैल',
          waterRequirement: 'low',
          tips: ['दाल की बढ़ती मांग', 'कम पानी चाहिए', 'MSP भी अच्छा मिलता']
        }
      ]
    }
  };

  return recommendations[soilType]?.[season] || [];
};

export const CropPlanning = () => {
  const [selectedSoil, setSelectedSoil] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isListening, setIsListening] = useState(false);
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
      toast.success("बोलें: 'काली मिट्टी खरीफ' या 'जलोढ़ रबी'...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      // Match soil type
      const matchedSoil = soilTypes.find(soil => transcript.includes(soil.label.toLowerCase()));
      const matchedSeason = seasons.find(season => transcript.includes(season.label.toLowerCase()));
      
      if (matchedSoil) {
        setSelectedSoil(matchedSoil.value);
      }
      if (matchedSeason) {
        setSelectedSeason(matchedSeason.value);
      }
      
      if (matchedSoil && matchedSeason) {
        const recs = getCropRecommendations(matchedSoil.value, matchedSeason.value);
        setRecommendations(recs);
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

  const handlePlanGeneration = () => {
    if (!selectedSoil || !selectedSeason) {
      toast.error("कृपया मिट्टी का प्रकार और सीजन चुनें");
      return;
    }

    const recs = getCropRecommendations(selectedSoil, selectedSeason);
    setRecommendations(recs);
    
    if (recs.length > 0) {
      toast.success("फसल योजना तैयार हो गई!");
    } else {
      toast.error("इस combination के लिए सुझाव उपलब्ध नहीं हैं");
    }
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'average':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarketValueColor = (value: string) => {
    switch (value) {
      case 'high':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600';
    }
  };

  const getWaterIcon = (requirement: string) => {
    switch (requirement) {
      case 'high':
        return <Droplets className="h-4 w-4 text-blue-600" />;
      case 'medium':
        return <Droplets className="h-4 w-4 text-blue-400" />;
      case 'low':
        return <Droplets className="h-4 w-4 text-blue-200" />;
      default:
        return <Droplets className="h-4 w-4" />;
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
            📅 Crop Planning
          </h1>
        </div>

        {/* Input Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              फसल योजना बनाएं
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">मिट्टी का प्रकार:</label>
                <Select value={selectedSoil} onValueChange={setSelectedSoil}>
                  <SelectTrigger>
                    <SelectValue placeholder="मिट्टी चुनें..." />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map(soil => (
                      <SelectItem key={soil.value} value={soil.value}>
                        {soil.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">सीजन चुनें:</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="सीजन चुनें..." />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map(season => (
                      <SelectItem key={season.value} value={season.value}>
                        {season.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={handlePlanGeneration}
                  className="w-full bg-gradient-primary"
                  disabled={!selectedSoil || !selectedSeason}
                >
                  योजना बनाएं
                </Button>
              </div>
            </div>

            {isListening && (
              <div className="mt-4 text-center p-3 bg-muted rounded-lg">
                🎤 सुन रहा हूं... मिट्टी और सीजन बताएं (जैसे: "काली मिट्टी खरीफ")
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">🌾 अनुशंसित फसलें</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((crop, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-primary">{crop.hindiName}</h3>
                        <p className="text-sm text-muted-foreground">{crop.cropName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSuitabilityColor(crop.suitability)}`}>
                        {crop.suitability === 'excellent' ? 'उत्कृष्ट' :
                         crop.suitability === 'good' ? 'अच्छा' :
                         crop.suitability === 'average' ? 'औसत' : 'खराब'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">अपेक्षित उत्पादन</div>
                          <div className="font-bold text-primary">{crop.expectedYield}</div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">लाभ मार्जिन</div>
                          <div className="font-bold text-green-600">{crop.profitMargin}</div>
                        </div>
                      </div>

                      {/* Market Value & Water Requirement */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">मार्केट वैल्यू:</span>
                          <span className={`font-medium ${getMarketValueColor(crop.marketValue)}`}>
                            {crop.marketValue === 'high' ? 'उच्च' :
                             crop.marketValue === 'medium' ? 'मध्यम' : 'कम'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getWaterIcon(crop.waterRequirement)}
                          <span className="text-sm">पानी:</span>
                          <span className="font-medium">
                            {crop.waterRequirement === 'high' ? 'अधिक' :
                             crop.waterRequirement === 'medium' ? 'मध्यम' : 'कम'}
                          </span>
                        </div>
                      </div>

                      {/* Timing */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-700 dark:text-blue-300">समय सारणी</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">बुआई: </span>
                            <span className="font-medium">{crop.sowingTime}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">कटाई: </span>
                            <span className="font-medium">{crop.harvestTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="font-medium mb-2 text-green-700 dark:text-green-300">💡 सुझाव:</h4>
                        <ul className="space-y-1">
                          {crop.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm text-muted-foreground">
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Default State */}
        {recommendations.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Sprout className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Smart Crop Planning</h3>
              <p className="text-muted-foreground mb-4">
                अपनी मिट्टी का प्रकार और सीजन चुनें - हम आपको बेहतरीन फसल सुझाव देंगे
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <Sun className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-700 dark:text-green-300">वैज्ञानिक सुझाव</h4>
                  <p className="text-sm text-green-600 dark:text-green-400">मिट्टी और मौसम के आधार पर</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">मार्केट एनालिसिस</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">बेहतर कीमत की गारंटी</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-purple-700 dark:text-purple-300">टाइमिंग गाइड</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">सही समय पर बुआई-कटाई</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};