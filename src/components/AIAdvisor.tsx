import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Mic, MicOff, MapPin, Wheat } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const stateData = {
  punjab: {
    name: "पंजाब / Punjab",
    crops: ["गेहूं", "धान", "मक्का", "कपास", "गन्ना", "सरसों", "आलू"],
    soilType: "Loamy Alluvial Soil (खादर व बांगर)",
    description: "पंजाब की मिट्टी मुख्यतः Alluvial Soil है जो कृषि के लिए अत्यंत उपजाऊ है। यहाँ की दोमट मिट्टी गेहूं, धान और अन्य फसलों के लिए आदर्श है।",
    districts: ["लुधियाना", "अमृतसर", "जालंधर", "पटियाला", "बठिंडा", "मोगा", "संगरूर", "फरीदकोट"]
  },
  "uttar pradesh": {
    name: "उत्तर प्रदेश / Uttar Pradesh", 
    crops: ["गेहूं", "धान", "गन्ना", "आलू", "चना", "अरहर", "सरसों", "जौ"],
    soilType: "Mixed Alluvial Soil (मिश्रित जलोढ़)",
    description: "UP की मिट्टी विविधता से भरपूर है। पश्चिमी UP में उपजाऊ जलोढ़ मिट्टी है जबकि पूर्वी भागों में दोमट और चिकनी मिट्टी पाई जाती है।",
    districts: ["लखनऊ", "कानपुर", "आगरा", "मेरठ", "वाराणसी", "प्रयागराज", "गोरखपुर", "मुजफ्फरनगर"]
  },
  bihar: {
    name: "बिहार / Bihar",
    crops: ["धान", "गेहूं", "मक्का", "दलहन", "जूट", "गन्ना", "आलू", "प्याज"],
    soilType: "Gangetic Alluvial Soil (गंगा की जलोढ़)",
    description: "बिहार की मिट्टी गंगा और उसकी सहायक नदियों द्वारा लाई गई उपजाऊ जलोढ़ मिट्टी है। यह धान और गेहूं की खेती के लिए बहुत उपयुक्त है।",
    districts: ["पटना", "गया", "भागलपुर", "मुजफ्फरपुर", "दरभंगा", "पूर्णिया", "सासाराम", "बेगूसराय"]
  },
  haryana: {
    name: "हरियाणा / Haryana",
    crops: ["गेहूं", "धान", "बाजरा", "ज्वार", "कपास", "गन्ना", "सरसों", "चना"],
    soilType: "Indo-Gangetic Alluvial Soil",
    description: "हरियाणा की मिट्टी सिंधु-गंगा के मैदान की उपजाऊ जलोढ़ मिट्टी है। यह राज्य हरित क्रांति का केंद्र रहा है।",
    districts: ["गुरुग्राम", "फरीदाबाद", "हिसार", "करनाल", "पानीपत", "अंबाला", "यमुनानगर", "रोहतक"]
  },
  "madhya pradesh": {
    name: "मध्य प्रदेश / Madhya Pradesh",
    crops: ["गेहूं", "धान", "ज्वार", "मक्का", "कपास", "सोयाबीन", "चना", "तिल"],
    soilType: "Black Cotton Soil (काली मिट्टी)",
    description: "MP में मुख्यतः काली मिट्टी (रेगुड़) पाई जाती है जो कपास और दलहन की खेती के लिए उत्तम है। यह नमी धारण करने में सक्षम है।",
    districts: ["भोपाल", "इंदौर", "जबलपुर", "ग्वालियर", "उज्जैन", "सागर", "रतलाम", "देवास"]
  }
};

export const AIAdvisor = () => {
  const [selectedState, setSelectedState] = useState('');
  const [stateInfo, setStateInfo] = useState<any>(null);
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
      toast.success("कौन से राज्य से हैं? बोलें...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      // Match state from speech
      const matchedState = Object.keys(stateData).find(state => 
        transcript.includes(state) || 
        transcript.includes(stateData[state as keyof typeof stateData].name.toLowerCase())
      );
      
      if (matchedState) {
        setSelectedState(matchedState);
        setStateInfo(stateData[matchedState as keyof typeof stateData]);
      } else {
        toast.error("राज्य पहचाना नहीं गया, कृपया दोबारा कोशिश करें");
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

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setStateInfo(stateData[state as keyof typeof stateData]);
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
            🤖 AI Agriculture Advisor
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* State Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                राज्य चुनें
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
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  आप कौन से राज्य से हैं? राज्य चुनें या बोलकर बताएं:
                </p>
                
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="राज्य चुनें..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(stateData).map(([key, data]) => (
                      <SelectItem key={key} value={key}>
                        {data.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isListening && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="animate-pulse text-primary">
                      🎤 सुन रहा हूं... अपना राज्य बताएं
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* State Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wheat className="h-5 w-5" />
                राज्य की जानकारी
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stateInfo ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">📍 {stateInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">{stateInfo.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">🌱 मिट्टी का प्रकार:</h4>
                    <p className="text-sm bg-muted p-3 rounded-lg">{stateInfo.soilType}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">🌾 मुख्य फसलें:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {stateInfo.crops.map((crop: string, index: number) => (
                        <div key={index} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg text-sm text-center">
                          {crop}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">🏘️ प्रमुख जिले:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {stateInfo.districts.map((district: string, index: number) => (
                        <div key={index} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm text-center">
                          {district}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>राज्य चुनें या बोलकर बताएं</p>
                  <p className="text-sm mt-2">आपको स्थानीय मिट्टी और फसल की जानकारी मिलेगी</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Cards */}
        {stateInfo && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">🌱 मिट्टी सुझाव</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-2">
                  <li>• नियमित मिट्टी जांच कराएं</li>
                  <li>• जैविक खाद का उपयोग करें</li>
                  <li>• उचित जल निकासी का प्रबंध करें</li>
                  <li>• फसल चक्र अपनाएं</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">🌾 फसल सुझाव</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-2">
                  <li>• मौसम के अनुसार बीज चुनें</li>
                  <li>• उन्नत किस्मों का उपयोग करें</li>
                  <li>• सही समय पर बुआई करें</li>
                  <li>• संतुलित उर्वरक दें</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-300">💡 सामान्य सुझाव</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-2">
                  <li>• कृषि विशेषज्ञ से सलाह लें</li>
                  <li>• आधुनिक तकनीक अपनाएं</li>  
                  <li>• बाजार की जानकारी रखें</li>
                  <li>• सरकारी योजनाओं का लाभ उठाएं</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};