import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, X, Send, Mic, MicOff, Upload, MapPin, Languages } from "lucide-react";
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
  const [chatLanguage, setChatLanguage] = useState('hi');
  const { t } = useLanguage();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessages = {
        hi: "नमस्कार! 🌾 मैं आपका कृषि सलाहकार हूं। आप मुझसे मिट्टी, फसल, मौसम या खेती के बारे में कुछ भी पूछ सकते हैं। आप अपना स्थान भी बता सकते हैं ताकि मैं आपको स्थानीय मिट्टी की जानकारी दे सकूं।",
        en: "Hello! 🌾 I'm your agriculture advisor. You can ask me anything about soil, crops, weather, or farming. You can also tell me your location so I can provide local soil information.",
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 🌾 ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ਹਾਂ। ਤੁਸੀਂ ਮਿੱਟੀ, ਫਸਲਾਂ, ਮੌਸਮ ਜਾਂ ਖੇਤੀਬਾੜੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਤੁਸੀਂ ਆਪਣਾ ਸਥਾਨ ਵੀ ਦੱਸ ਸਕਦੇ ਹੋ ਤਾਂ ਜੋ ਮੈਂ ਤੁਹਾਨੂੰ ਸਥਾਨਕ ਮਿੱਟੀ ਦੀ ਜਾਣਕਾਰੀ ਦੇ ਸਕਾਂ।"
      };
      addBotMessage(welcomeMessages[chatLanguage as keyof typeof welcomeMessages]);
    }
  }, [isOpen, chatLanguage]);

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
    
    const responses = {
      hi: {
        schemes: {
          punjab: "पंजाब सरकारी योजनाएं:\n• कृषि अवसंरचना फंड (AIF)\n• पंजाब ई-मंडी/ई-NAM\n• मिट्टी स्वास्थ्य कार्ड योजना\n• कृषि गृह सहायता योजना",
          bihar: "बिहार सरकारी योजनाएं:\n• सिंचाई सब्सिडी (₹140 करोड़)\n• मुफ्त सोयाबीन बीज (₹4,000/एकड़)\n• सब्जी विकास (75% सब्सिडी)\n• पॉली हाउस सब्सिडी (50%)",
          general: "पंजाब, यूपी, बिहार और एमपी के लिए सरकारी योजनाएं उपलब्ध हैं। कृपया अपना राज्य बताएं।"
        },
        subsidy: "🏛️ **सरकारी सब्सिडी योजनाएं (2025 अपडेट):**\n\n**केंद्र सरकार की मुख्य योजनाएं:**\n• PM-KISAN: ₹6,000/वर्ष (तीन किस्तों में)\n• मिट्टी स्वास्थ्य कार्ड: मुफ्त मिट्टी जांच\n• प्रधानमंत्री फसल बीमा योजना: कम प्रीमियम पर फसल बीमा\n• कृषि यंत्रीकरण: 50-80% सब्सिडी कृषि यंत्रों पर\n• किसान क्रेडिट कार्ड: 4% ब्याज दर पर लोन\n\n**राज्य विशिष्ट योजनाएं:**\n• पंजाब: कृषि अवसंरचना फंड (3% ब्याज)\n• यूपी: मुफ्त बीज वितरण (₹4,000/एकड़)\n• बिहार: सिंचाई सब्सिडी (75% तक)\n• MP: भावांतर भुगतान योजना\n\n📋 **आवेदन प्रक्रिया:** PM-KISAN पोर्टल या नजदीकी CSC केंद्र पर जाएं।",
        insurance: "🛡️ **फसल बीमा योजना (2025):**\n\n**प्रधानमंत्री फसल बीमा योजना (PMFBY):**\n• खरीफ: केवल 2% प्रीमियम\n• रबी: केवल 1.5% प्रीमियम\n• वार्षिक/बागवानी: केवल 5% प्रीमियम\n\n**कवरेज:**\n• प्राकृतिक आपदा से नुकसान\n• कीट-रोग से हानि\n• मौसम की मार\n• फसल कटाई के बाद नुकसान (14 दिनों तक)\n\n**क्लेम प्रक्रिया:**\n• 72 घंटे में सूचना दें (टोल फ्री: 14447)\n• मोबाइल ऐप 'Crop Insurance' से रिपोर्ट करें\n• नुकसान का सर्वे होगा\n• 60 दिनों में भुगतान\n\n📱 **त्वरित आवेदन:** pmfby.gov.in पर ऑनलाइन करें।",
        soil: "🌱 **मिट्टी की जानकारी:**\n\nमिट्टी के मुख्य प्रकार:\n• **दोमट मिट्टी (Loamy)** - सबसे अच्छी खेती के लिए\n• **चिकनी मिट्टी (Clay)** - पानी रोकने में अच्छी\n• **रेतीली मिट्टी (Sandy)** - जल निकासी अच्छी\n\nकृपया अपना स्थान बताएं ताकि मैं आपको स्थानीय मिट्टी की विस्तृत जानकारी दे सकूं।",
        crops: "🌾 **फसल की सिफारिशें:**\n\n**रबी फसलें (अक्टूबर-मार्च):**\n• गेहूं, जौ, चना, मसूर, सरसों\n\n**खरीफ फसलें (जून-सितम्बर):**\n• धान, मक्का, ज्वार, बाजरा, कपास\n\n**जायद फसलें (मार्च-जून):**\n• तरबूज, खरबूजा, खीरा, लौकी\n\nआपकी मिट्टी और क्षेत्र के अनुसार सटीक सुझाव के लिए कृपया अपना स्थान बताएं।",
        default: "🤖 मैं आपकी मदद करना चाहता हूं! आप मुझसे पूछ सकते हैं:\n\n• 🌱 मिट्टी की जानकारी\n• 🌾 फसल की सिफारिशें\n• 🌤️ मौसम और खेती\n• 🧪 उर्वरक और खाद\n• 🐛 कीट-रोग नियंत्रण\n• 💰 बाजार की कीमतें\n• 🏛️ सरकारी योजनाएं\n• 🛡️ फसल बीमा\n\nकुछ और जानना चाहते हैं?"
      },
      en: {
        schemes: {
          punjab: "Punjab Government Schemes:\n• Agriculture Infrastructure Fund (AIF)\n• Punjab e-Mandi/e-NAM\n• Soil Health Card Scheme\n• Agriculture House Assistance Scheme",
          bihar: "Bihar Government Schemes:\n• Irrigation Subsidy (₹140 crore)\n• Free Soybean Seeds (₹4,000/acre)\n• Vegetable Development (75% subsidy)\n• Polyhouse Subsidy (50%)",
          general: "Government schemes available for Punjab, UP, Bihar, and MP. Please specify your state."
        },
        subsidy: "🏛️ **Government Subsidy Schemes (2025 Update):**\n\n**Central Government Key Schemes:**\n• PM-KISAN: ₹6,000/year (in three installments)\n• Soil Health Card: Free soil testing\n• PM Crop Insurance: Low premium crop insurance\n• Agricultural Mechanization: 50-80% subsidy on farm equipment\n• Kisan Credit Card: 4% interest rate loans\n\n**State Specific Schemes:**\n• Punjab: Agriculture Infrastructure Fund (3% interest)\n• UP: Free seed distribution (₹4,000/acre)\n• Bihar: Irrigation subsidy (up to 75%)\n• MP: Price difference payment scheme\n\n📋 **Application Process:** Visit PM-KISAN portal or nearest CSC center.",
        insurance: "🛡️ **Crop Insurance Scheme (2025):**\n\n**Pradhan Mantri Fasal Bima Yojana (PMFBY):**\n• Kharif: Only 2% premium\n• Rabi: Only 1.5% premium\n• Annual/Horticulture: Only 5% premium\n\n**Coverage:**\n• Natural disaster damage\n• Pest and disease losses\n• Weather damage\n• Post-harvest losses (up to 14 days)\n\n**Claim Process:**\n• Report within 72 hours (Toll Free: 14447)\n• Report via 'Crop Insurance' mobile app\n• Survey will be conducted\n• Payment within 60 days\n\n📱 **Quick Application:** Apply online at pmfby.gov.in",
        soil: "🌱 **Soil Information:**\n\nMain Soil Types:\n• **Loamy Soil** - Best for farming\n• **Clay Soil** - Good water retention\n• **Sandy Soil** - Good drainage\n\nPlease tell me your location so I can provide detailed local soil information.",
        crops: "🌾 **Crop Recommendations:**\n\n**Rabi Crops (Oct-Mar):**\n• Wheat, Barley, Gram, Lentil, Mustard\n\n**Kharif Crops (Jun-Sep):**\n• Rice, Maize, Jowar, Bajra, Cotton\n\n**Zaid Crops (Mar-Jun):**\n• Watermelon, Muskmelon, Cucumber, Bottle gourd\n\nFor precise suggestions based on your soil and region, please tell me your location.",
        default: "🤖 I'm here to help you! You can ask me about:\n\n• 🌱 Soil information\n• 🌾 Crop recommendations\n• 🌤️ Weather and farming\n• 🧪 Fertilizers and manure\n• 🐛 Pest and disease control\n• 💰 Market prices\n• 🏛️ Government schemes\n• 🛡️ Crop insurance\n\nWhat would you like to know?"
      },
      pa: {
        schemes: {
          punjab: "ਪੰਜਾਬ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ:\n• ਖੇਤੀਬਾੜੀ ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਫੰਡ (AIF)\n• ਪੰਜਾਬ ਈ-ਮੰਡੀ/ਈ-NAM\n• ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਯੋਜਨਾ\n• ਖੇਤੀਬਾੜੀ ਘਰ ਸਹਾਇਤਾ ਯੋਜਨਾ",
          bihar: "ਬਿਹਾਰ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ:\n• ਸਿੰਚਾਈ ਸਬਸਿਡੀ (₹140 ਕਰੋੜ)\n• ਮੁਫਤ ਸੋਇਆਬੀਨ ਬੀਜ (₹4,000/ਏਕੜ)\n• ਸਬਜ਼ੀ ਵਿਕਾਸ (75% ਸਬਸਿਡੀ)\n• ਪੌਲੀਹਾਊਸ ਸਬਸਿਡੀ (50%)",
          general: "ਪੰਜਾਬ, ਯੂਪੀ, ਬਿਹਾਰ ਅਤੇ ਐਮਪੀ ਲਈ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਉਪਲਬਧ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਰਾਜ ਦੱਸੋ।"
        },
        subsidy: "🏛️ **ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਯੋਜਨਾਵਾਂ (2025 ਅਪਡੇਟ):**\n\n**ਕੇਂਦਰ ਸਰਕਾਰ ਦੀਆਂ ਮੁੱਖ ਯੋਜਨਾਵਾਂ:**\n• PM-KISAN: ਸਾਲ ਵਿੱਚ ₹6,000 (ਤਿੰਨ ਕਿਸ਼ਤਾਂ ਵਿੱਚ)\n• ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ: ਮੁਫਤ ਮਿੱਟੀ ਜਾਂਚ\n• PM ਫਸਲ ਬੀਮਾ: ਘੱਟ ਪ੍ਰੀਮੀਅਮ ਤੇ ਫਸਲ ਬੀਮਾ\n• ਖੇਤੀਬਾੜੀ ਮਸ਼ੀਨਰੀ: 50-80% ਸਬਸਿਡੀ\n• ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ: 4% ਬਿਆਜ ਦਰ\n\n**ਰਾਜ ਵਿਸ਼ੇਸ਼ ਯੋਜਨਾਵਾਂ:**\n• ਪੰਜਾਬ: ਖੇਤੀਬਾੜੀ ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਫੰਡ (3% ਬਿਆਜ)\n• UP: ਮੁਫਤ ਬੀਜ ਵੰਡ (₹4,000/ਏਕੜ)\n• ਬਿਹਾਰ: ਸਿੰਚਾਈ ਸਬਸਿਡੀ (75% ਤੱਕ)\n• MP: ਕੀਮਤ ਅੰਤਰ ਭੁਗਤਾਨ\n\n📋 **ਅਰਜੀ ਪ੍ਰਕਿਰਿਆ:** PM-KISAN ਪੋਰਟਲ ਜਾਂ ਨਜ਼ਦੀਕੀ CSC ਕੇਂਦਰ ਤੇ ਜਾਓ।",
        insurance: "🛡️ **ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ (2025):**\n\n**ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ (PMFBY):**\n• ਖਰੀਫ: ਸਿਰਫ 2% ਪ੍ਰੀਮੀਅਮ\n• ਰਬੀ: ਸਿਰਫ 1.5% ਪ੍ਰੀਮੀਅਮ\n• ਸਾਲਾਨਾ/ਬਾਗਬਾਨੀ: ਸਿਰਫ 5% ਪ੍ਰੀਮੀਅਮ\n\n**ਕਵਰੇਜ:**\n• ਕੁਦਰਤੀ ਆਪਦਾ ਨਾਲ ਨੁਕਸਾਨ\n• ਕੀੜੇ-ਰੋਗ ਨਾਲ ਨੁਕਸਾਨ\n• ਮੌਸਮ ਦਾ ਮਾਰ\n• ਫਸਲ ਵੱਢਣ ਤੋਂ ਬਾਅਦ ਨੁਕਸਾਨ (14 ਦਿਨ ਤੱਕ)\n\n**ਦਾਅਵਾ ਪ੍ਰਕਿਰਿਆ:**\n• 72 ਘੰਟਿਆਂ ਵਿੱਚ ਸੂਚਨਾ ਦਿਓ (ਟੋਲ ਫ੍ਰੀ: 14447)\n• 'Crop Insurance' ਮੋਬਾਈਲ ਐਪ ਰਾਹੀਂ ਰਿਪੋਰਟ ਕਰੋ\n• ਨੁਕਸਾਨ ਦਾ ਸਰਵੇ ਹੋਵੇਗਾ\n• 60 ਦਿਨਾਂ ਵਿੱਚ ਭੁਗਤਾਨ\n\n📱 **ਤੇਜ਼ ਅਰਜੀ:** pmfby.gov.in ਤੇ ਔਨਲਾਈਨ ਕਰੋ।",
        soil: "🌱 **ਮਿੱਟੀ ਦੀ ਜਾਣਕਾਰੀ:**\n\nਮਿੱਟੀ ਦੇ ਮੁੱਖ ਕਿਸਮ:\n• **ਦੋਮਟ ਮਿੱਟੀ** - ਖੇਤੀਬਾੜੀ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ\n• **ਮਿੱਟੀ ਮਿੱਟੀ** - ਪਾਣੀ ਰੱਖਣ ਵਿੱਚ ਚੰਗੀ\n• **ਰੇਤਲੀ ਮਿੱਟੀ** - ਪਾਣੀ ਨਿਕਾਸ ਚੰਗੀ\n\nਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਥਾਨ ਦੱਸੋ ਤਾਂ ਜੋ ਮੈਂ ਤੁਹਾਨੂੰ ਸਥਾਨਕ ਮਿੱਟੀ ਦੀ ਵਿਸਥਾਰ ਜਾਣਕਾਰੀ ਦੇ ਸਕਾਂ।",
        crops: "🌾 **ਫਸਲਾਂ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ:**\n\n**ਰਬੀ ਫਸਲਾਂ (ਅਕਤੂਬਰ-ਮਾਰਚ):**\n• ਕਣਕ, ਜੌਂ, ਚਨਾ, ਮਸੂਰ, ਸਰ੍ਹੋਂ\n\n**ਖਰੀਫ ਫਸਲਾਂ (ਜੂਨ-ਸਤੰਬਰ):**\n• ਝੋਨਾ, ਮੱਕੀ, ਜੁਆਰ, ਬਜਰਾ, ਕਪਾਹ\n\n**ਜਾਇਦ ਫਸਲਾਂ (ਮਾਰਚ-ਜੂਨ):**\n• ਤਰਬੂਜ਼, ਖਰਬੂਜ਼ਾ, ਖੀਰਾ, ਲੌਕੀ\n\nਤੁਹਾਡੀ ਮਿੱਟੀ ਅਤੇ ਖੇਤਰ ਅਨੁਸਾਰ ਸਹੀ ਸੁਝਾਵਾਂ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਥਾਨ ਦੱਸੋ।",
        default: "🤖 ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ! ਤੁਸੀਂ ਮੈਨੂੰ ਪੁੱਛ ਸਕਦੇ ਹੋ:\n\n• 🌱 ਮਿੱਟੀ ਦੀ ਜਾਣਕਾਰੀ\n• 🌾 ਫਸਲਾਂ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ\n• 🌤️ ਮੌਸਮ ਅਤੇ ਖੇਤੀਬਾੜੀ\n• 🧪 ਖਾਦ ਅਤੇ ਉਰਵਰਕ\n• 🐛 ਕੀੜੇ ਅਤੇ ਰੋਗ ਨਿਯੰਤਰਣ\n• 💰 ਮੰਡੀ ਦੇ ਭਾਵ\n• 🏛️ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ\n• 🛡️ ਫਸਲ ਬੀਮਾ\n\nਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?"
      }
    };

    // Government schemes and subsidy queries
    if (message.includes('yojna') || message.includes('scheme') || message.includes('सरकारी') || message.includes('govt') || message.includes('ਯੋਜਨਾ') || message.includes('ਸਰਕਾਰੀ') || message.includes('subsidy') || message.includes('सब्सिडी')) {
      const langResponses = responses[chatLanguage as keyof typeof responses];
      if (message.includes('punjab') || message.includes('पंजाब') || message.includes('ਪੰਜਾਬ')) {
        return langResponses.schemes.punjab;
      }
      if (message.includes('bihar') || message.includes('बिहार') || message.includes('ਬਿਹਾਰ')) {
        return langResponses.schemes.bihar;
      }
      return langResponses.subsidy;
    }

    // Crop insurance queries
    if (message.includes('insurance') || message.includes('बीमा') || message.includes('ਬੀਮਾ') || message.includes('pmfby') || message.includes('crop insurance')) {
      return responses[chatLanguage as keyof typeof responses].insurance;
    }

    // Handle Hinglish queries
    const hinglishMessage = message.replace(/kya/g, 'क्या').replace(/hai/g, 'है').replace(/kaise/g, 'कैसे').replace(/farming/g, 'खेती').replace(/crop/g, 'फसल');
    
    // Location-based soil information
    const locationInfo = getLocationInfo(message) || getLocationInfo(hinglishMessage);
    if (locationInfo) {
      const locationResponses = {
        hi: `📍 **${locationInfo.district}, ${locationInfo.state} की मिट्टी की जानकारी:**\n\n🌱 **मिट्टी का प्रकार:** ${locationInfo.soilType}\n\n📝 **विवरण:** ${locationInfo.soilDescription}\n\n🌾 **अनुशंसित फसलें:** ${locationInfo.recommendedCrops.join(', ')}\n\n💡 **सुझाव:** इस मिट्टी में खेती के लिए उचित जल निकासी और संतुलित उर्वरक का उपयोग करें।`,
        en: `📍 **Soil Information for ${locationInfo.district}, ${locationInfo.state}:**\n\n🌱 **Soil Type:** ${locationInfo.soilType}\n\n📝 **Description:** This soil type is suitable for various crops and has good fertility.\n\n🌾 **Recommended Crops:** ${locationInfo.recommendedCrops.join(', ')}\n\n💡 **Suggestion:** Use proper drainage and balanced fertilizers for farming in this soil.`,
        pa: `📍 **${locationInfo.district}, ${locationInfo.state} ਦੀ ਮਿੱਟੀ ਦੀ ਜਾਣਕਾਰੀ:**\n\n🌱 **ਮਿੱਟੀ ਦਾ ਕਿਸਮ:** ${locationInfo.soilType}\n\n📝 **ਵੇਰਵਾ:** ਇਹ ਮਿੱਟੀ ਖੇਤੀਬਾੜੀ ਲਈ ਚੰਗੀ ਅਤੇ ਉਪਜਾਊ ਹੈ।\n\n🌾 **ਸਿਫਾਰਸ਼ੀ ਫਸਲਾਂ:** ${locationInfo.recommendedCrops.join(', ')}\n\n💡 **ਸੁਝਾਵ:** ਇਸ ਮਿੱਟੀ ਵਿੱਚ ਖੇਤੀਬਾੜੀ ਲਈ ਸਹੀ ਪਾਣੀ ਨਿਕਾਸ ਅਤੇ ਸੰਤੁਲਿਤ ਖਾਦ ਦਾ ਵਰਤੋਂ ਕਰੋ।`
      };
      return locationResponses[chatLanguage as keyof typeof locationResponses];
    }

    // Soil-related queries
    if (message.includes('मिट्टी') || message.includes('soil') || message.includes('mitti') || message.includes('ਮਿੱਟੀ')) {
      return responses[chatLanguage as keyof typeof responses].soil;
    }

    // Crop-related queries
    if (message.includes('फसल') || message.includes('crop') || message.includes('खेती') || message.includes('ਫਸਲ') || message.includes('ਖੇਤੀ')) {
      return responses[chatLanguage as keyof typeof responses].crops;
    }

    // Default response
    return responses[chatLanguage as keyof typeof responses].default;
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

  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("आपका ब्राउज़र वॉयस इनपुट सपोर्ट नहीं करता। कृपया Chrome या Edge का उपयोग करें।");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      // Request microphone permission explicitly
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      toast.error("माइक्रोफोन की अनुमति आवश्यक है। कृपया माइक्रोफोन की अनुमति दें और फिर से कोशिश करें।");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Add timeout for voice listening (3 seconds)
    const timeoutId = setTimeout(() => {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
        toast.error("Voice listening timed out. Please try again.");
      }
    }, 3000);
    const languageMap = {
      'hi': 'hi-IN',
      'en': 'en-US', 
      'pa': 'pa-IN'
    };
    recognition.lang = languageMap[chatLanguage as keyof typeof languageMap] || 'hi-IN';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("सुन रहा हूं... बोलें");
    };

    recognition.onresult = (event) => {
      if (event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        // Auto-send the message after voice input
        setTimeout(() => {
          if (transcript.trim()) {
            const userMessage = transcript.trim();
            addUserMessage(userMessage);
            setIsLoading(true);
            setTimeout(() => {
              const botResponse = generateBotResponse(userMessage);
              addBotMessage(botResponse);
              setIsLoading(false);
            }, 1000);
          }
        }, 100);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      
      let errorMessage = "वॉयस इनपुट में त्रुटि हुई। कृपया फिर से कोशिश करें।";
      if (event.error === 'not-allowed') {
        errorMessage = "माइक्रोफोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक्रोफोन की अनुमति दें।";
      } else if (event.error === 'no-speech') {
        errorMessage = "कोई आवाज़ नहीं सुनी गई। कृपया दोबारा बोलने की कोशिश करें।";
      } else if (event.error === 'network') {
        errorMessage = "नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।";
      }
      
      toast.error(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setIsListening(false);
      toast.error("वॉयस इनपुट शुरू नहीं हो सका। कृपया फिर से कोशिश करें।");
    }
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
      
      {/* Language Selector */}
      <div className="px-4 py-2 bg-card border-b border-border/20">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <Select value={chatLanguage} onValueChange={setChatLanguage}>
            <SelectTrigger className="w-full bg-background border border-input shadow-sm z-50">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-input shadow-lg z-[60]">
              <SelectItem value="hi" className="cursor-pointer hover:bg-accent">
                हिंदी (Hindi)
              </SelectItem>
              <SelectItem value="en" className="cursor-pointer hover:bg-accent">
                English
              </SelectItem>
              <SelectItem value="pa" className="cursor-pointer hover:bg-accent">
                ਪੰਜਾਬੀ (Punjabi)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <CardContent className="p-0 flex flex-col h-[calc(100%-120px)]">
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