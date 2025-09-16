import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, X, Send, Mic, MicOff, Upload, MapPin } from "lucide-react";
import { toast } from "sonner";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare const SpeechRecognition: {
  new (): SpeechRecognition;
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface LocationInfo {
  state: string;
  district: string;
  soilType: string;
  recommendedCrops: string[];
  soilDescription: string;
}

const locationData: Record<string, Record<string, LocationInfo>> = {
  punjab: {
    ludhiana: {
      state: "Punjab",
      district: "Ludhiana", 
      soilType: "Loamy Alluvial Soil",
      recommendedCrops: ["गेहूं", "धान", "मक्का", "सरसों", "आलू"],
      soilDescription: "पंजाब की मिट्टी मुख्यतः Alluvial Soil (खादर व बांगर) है, मिश्रित लोटी (loamy), अच्छी उपजाऊ मिट्टी जो गेहूँ, धान आदि खेती के लिए उपयुक्त है।"
    },
    sangrur: {
      state: "Punjab",
      district: "Sangrur",
      soilType: "Loamy Alluvial Soil", 
      recommendedCrops: ["गेहूं", "धान", "कपास", "गन्ना"],
      soilDescription: "संगरूर जिले की मिट्टी उपजाऊ खादर मिट्टी है जो कृषि के लिए अत्यंत उपयुक्त है।"
    },
    bathinda: {
      state: "Punjab",
      district: "Bathinda",
      soilType: "Sandy Loam Alluvial",
      recommendedCrops: ["कपास", "गेहूं", "धान", "मक्का"],
      soilDescription: "बठिंडा की मिट्टी रेतीली दोमट है जो कपास और अनाज की फसलों के लिए अच्छी है।"
    }
  },
  "uttar pradesh": {
    ghazipur: {
      state: "Uttar Pradesh",
      district: "Ghazipur",
      soilType: "Silt-Loam, Clay-Loam",
      recommendedCrops: ["गेहूं", "धान", "गन्ना", "दलहन", "तिलहन"],
      soilDescription: "गाजीपुर की मिट्टी Silt-Loam, Loam, Clay-Loam प्रकार की है जो माध्यम रूप से उपजाऊ है और विभिन्न फसलों के लिए उपयुक्त है।"
    },
    prayagraj: {
      state: "Uttar Pradesh", 
      district: "Prayagraj",
      soilType: "Mixed Alluvial",
      recommendedCrops: ["गेहूं", "धान", "अरहर", "चना", "सरसों"],
      soilDescription: "प्रयागराज (इलाहाबाद) की मिट्टी मिक्स है - जमुना खड्डर व alluvial, गंगा low land, कुछ क्षेत्रों में sodic मिट्टी भी है।"
    }
  },
  bihar: {
    patna: {
      state: "Bihar",
      district: "Patna", 
      soilType: "Karail-Kewal Soil",
      recommendedCrops: ["धान", "गेहूं", "मक्का", "दलहन"],
      soilDescription: "पटना की मिट्टी Karail-Kewal प्रकार की भारी क्ले मिट्टी है जो धान और अन्य अनाज की फसलों के लिए उपयुक्त है।"
    },
    gaya: {
      state: "Bihar",
      district: "Gaya",
      soilType: "Karail-Kewal Clay",
      recommendedCrops: ["धान", "गेहूं", "दलहन", "तिलहन"],
      soilDescription: "गया की मिट्टी भारी clay मिट्टी है जो जलभराव वाले क्षेत्रों में पाई जाती है।"
    }
  }
};

export const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("नमस्कार! 🌾 मैं आपका कृषि सलाहकार हूं। आप मुझसे मिट्टी, फसल, मौसम या खेती के बारे में कुछ भी पूछ सकते हैं। आप अपना स्थान भी बता सकते हैं ताकि मैं आपको स्थानीय मिट्टी की जानकारी दे सकूं।");
    }
  }, [isOpen]);

  const addBotMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user', 
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getLocationInfo = (userMessage: string): LocationInfo | null => {
    const message = userMessage.toLowerCase();
    
    for (const [state, districts] of Object.entries(locationData)) {
      if (message.includes(state)) {
        for (const [district, info] of Object.entries(districts)) {
          if (message.includes(district)) {
            return info;
          }
        }
        // Return first district info if only state mentioned
        return Object.values(districts)[0];
      }
    }
    
    // Check for district names without state
    for (const [state, districts] of Object.entries(locationData)) {
      for (const [district, info] of Object.entries(districts)) {
        if (message.includes(district)) {
          return info;
        }
      }
    }
    
    return null;
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Location-based soil information
    const locationInfo = getLocationInfo(message);
    if (locationInfo) {
      return `📍 **${locationInfo.district}, ${locationInfo.state} की मिट्टी की जानकारी:**

🌱 **मिट्टी का प्रकार:** ${locationInfo.soilType}

📝 **विवरण:** ${locationInfo.soilDescription}

🌾 **अनुशंसित फसलें:** ${locationInfo.recommendedCrops.join(', ')}

💡 **सुझाव:** इस मिट्टी में खेती के लिए उचित जल निकासी और संतुलित उर्वरक का उपयोग करें।`;
    }

    // Soil-related queries
    if (message.includes('मिट्टी') || message.includes('soil') || message.includes('मिट्टी की जांच')) {
      return `🌱 **मिट्टी की जानकारी:**

मिट्टी के मुख्य प्रकार:
• **दोमट मिट्टी (Loamy)** - सबसे अच्छी खेती के लिए
• **चिकनी मिट्टी (Clay)** - पानी रोकने में अच्छी
• **रेतीली मिट्टी (Sandy)** - जल निकासी अच्छी

कृपया अपना स्थान बताएं ताकि मैं आपको स्थानीय मिट्टी की विस्तृत जानकारी दे सकूं।`;
    }

    // Crop-related queries
    if (message.includes('फसल') || message.includes('crop') || message.includes('खेती')) {
      return `🌾 **फसल की सिफारिशें:**

**रबी फसलें (अक्टूबर-मार्च):**
• गेहूं, जौ, चना, मसूर, सरसों

**खरीफ फसलें (जून-सितम्बर):**  
• धान, मक्का, ज्वार, बाजरा, कपास

**जायद फसलें (मार्च-जून):**
• तरबूज, खरबूजा, खीरा, लौकी

आपकी मिट्टी और क्षेत्र के अनुसार सटीक सुझाव के लिए कृपया अपना स्थान बताएं।`;
    }

    // Weather-related queries
    if (message.includes('मौसम') || message.includes('weather') || message.includes('बारिश')) {
      return `🌤️ **मौसम और खेती:**

**मानसून से पहले:**
• बीज और उर्वरक की तैयारी करें
• खेत की जुताई और तैयारी करें

**मानसून के दौरान:**
• धान, मक्का, ज्वार की बुआई
• जल निकासी का प्रबंध करें

**सर्दी में:**
• गेहूं, चना, सरसों की फसल
• सिंचाई का उचित प्रबंध

वर्तमान मौसम की स्थिति के लिए मौसम विभाग की जांच करें।`;
    }

    // Fertilizer queries
    if (message.includes('खाद') || message.includes('उर्वरक') || message.includes('fertilizer')) {
      return `🧪 **उर्वरक की जानकारी:**

**मुख्य उर्वरक:**
• **यूरिया (N)** - पत्तियों की वृद्धि के लिए
• **DAP (P)** - जड़ों की मजबूती के लिए  
• **MOP (K)** - फल-फूल के लिए

**जैविक खाद:**
• गोबर की खाद, कम्पोस्ट
• हरी खाद, केंचुआ खाद

**उपयोग:** मिट्टी जांच के बाद ही उर्वरक का उपयोग करें।`;
    }

    // Pest/disease queries
    if (message.includes('कीट') || message.includes('रोग') || message.includes('pest') || message.includes('disease')) {
      return `🐛 **कीट और रोग प्रबंधन:**

**मुख्य कीट:**
• एफिड, माईट, कैटरपिलर
• सफेद मक्खी, थ्रिप्स

**रोग:**
• फंगल रोग, बैक्टीरियल रोग
• वायरल रोग

**प्राकृतिक नियंत्रण:**
• नीम का तेल, साबुन का छिड़काव
• जैविक कीटनाशक का उपयोग

📸 आप फसल की तस्वीर भी अपलोड कर सकते हैं पहचान के लिए।`;
    }

    // Market price queries  
    if (message.includes('भाव') || message.includes('कीमत') || message.includes('price') || message.includes('market')) {
      return `💰 **बाजार भाव की जानकारी:**

**वर्तमान दरें (अनुमानित):**
• गेहूं: ₹2000-2200/क्विंटल
• धान: ₹1800-2000/क्विंटल
• चना: ₹4500-5000/क्विंटल
• सरसों: ₹4000-4500/क्विंटल

**सुझाव:**
• स्थानीय मंडी की दरें जांचें
• न्यूनतम समर्थन मूल्य (MSP) देखें
• बिक्री का सही समय चुनें

📱 eNAM ऐप से नवीनतम भाव देखें।`;
    }

    // Default response
    return `🤖 मैं आपकी मदद करना चाहता हूं! आप मुझसे पूछ सकते हैं:

• 🌱 मिट्टी की जानकारी (अपना स्थान बताएं)
• 🌾 फसल की सिफारिशें
• 🌤️ मौसम और खेती
• 🧪 उर्वरक और खाद
• 🐛 कीट-रोग नियंत्रण
• 💰 बाजार की कीमतें

कुछ और जानना चाहते हैं?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addUserMessage(userMessage);
    setIsLoading(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      addBotMessage(botResponse);
      setIsLoading(false);
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("आपका ब्राउज़र वॉयस इनपुट सपोर्ट नहीं करता");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("सुन रहा हूं... बोलें");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("वॉयस इनपुट में त्रुटि हुई");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("कृपया एक वैध छवि फ़ाइल चुनें");
      return;
    }

    addUserMessage(`📸 छवि अपलोड की गई: ${file.name}`);
    
    // Simulate image analysis
    setTimeout(() => {
      addBotMessage(`📸 **छवि विश्लेषण परिणाम:**

मैंने आपकी छवि का विश्लेषण किया है। यह सुविधा अभी विकास के चरण में है।

**सामान्य सुझाव:**
• यदि यह कीट/रोग की छवि है, तो स्थानीय कृषि विशेषज्ञ से सलाह लें
• यदि यह फसल की छवि है, तो इसकी वर्तमान अवस्था बताएं
• अधिक सटीक सलाह के लिए कृपया छवि के बारे में और जानकारी दें

🔬 जल्द ही हम AI-powered छवि पहचान लेकर आएंगे!`);
    }, 2000);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-agricultural hover:shadow-lg transition-all duration-300 z-50 group"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground group-hover:scale-110 transition-transform" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-agricultural z-50 bg-card/95 backdrop-blur-md border-border/60">
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t.chatWithAI}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-primary-foreground hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                    message.sender === 'user'
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.typeMessage}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
              disabled={isLoading}
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              className={`transition-colors ${isListening ? 'bg-destructive text-destructive-foreground' : ''}`}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};