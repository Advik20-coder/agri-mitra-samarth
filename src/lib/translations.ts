export interface Translation {
  // Navigation
  home: string;
  services: string;
  about: string;
  contact: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  getStarted: string;
  learnMore: string;

  // Services
  aiAdvisor: string;
  aiAdvisorDesc: string;
  soilAnalysis: string;
  soilAnalysisDesc: string;
  weatherAlerts: string;
  weatherAlertsDesc: string;
  pestDetection: string;
  pestDetectionDesc: string;
  marketPrices: string;
  marketPricesDesc: string;
  cropPlanning: string;
  cropPlanningDesc: string;

  // Chatbot
  chatWithAI: string;
  typeMessage: string;
  voiceInput: string;
  uploadImage: string;
  askAnything: string;
  soilInfo: string;
  cropRecommendations: string;
  weatherInfo: string;

  // Common
  language: string;
  submit: string;
  close: string;
  loading: string;
  error: string;
  success: string;
  getLocationInfo: string;
  startChat: string;
  
  // Location
  enterLocation: string;
  selectState: string;
  selectDistrict: string;
  
  // Services Section
  servicesDescription: string;
  smartFeaturesTitle: string;
  voiceEnabledAI: string;
  voiceEnabledAIDesc: string;
  imageRecognition: string;
  imageRecognitionDesc: string;
  locationBasedRec: string;
  locationBasedRecDesc: string;
  
  // Guidance Popup
  guidanceVideoTitle: string;
}

export const translations: Record<string, Translation> = {
  en: {
    // Navigation
    home: "Home",
    services: "Services", 
    about: "About",
    contact: "Contact",

    // Hero Section
    heroTitle: "Smart Agriculture Advisory System",
    heroSubtitle: "Empowering Farmers with AI Technology",
    heroDescription: "Get personalized crop recommendations, soil analysis, weather alerts, and expert advice in your native language. Boost your productivity and reduce costs with scientific farming guidance.",
    getStarted: "Get Started",
    learnMore: "Learn More",

    // Services
    aiAdvisor: "AI Agriculture Advisor",
    aiAdvisorDesc: "Get instant answers to your farming questions with our AI-powered chatbot",
    soilAnalysis: "Soil Health Analysis",
    soilAnalysisDesc: "Understand your soil composition and get fertilizer recommendations",
    weatherAlerts: "Weather Alerts",
    weatherAlertsDesc: "Receive timely weather updates and farming alerts",
    pestDetection: "Pest & Disease Detection",
    pestDetectionDesc: "Upload crop images to identify pests and diseases instantly",
    marketPrices: "Market Price Tracking",
    marketPricesDesc: "Stay updated with latest crop prices in your region",
    cropPlanning: "Crop Planning",
    cropPlanningDesc: "Plan your crops based on soil, weather, and market conditions",

    // Chatbot
    chatWithAI: "Chat with AI Assistant",
    typeMessage: "Type your message...",
    voiceInput: "Voice Input",
    uploadImage: "Upload Image",
    askAnything: "Ask anything about farming, crops, or soil",
    soilInfo: "Soil Information",
    cropRecommendations: "Crop Recommendations",
    weatherInfo: "Weather Information",

    // Common
    language: "Language",
    submit: "Submit",
    close: "Close",
    loading: "Loading...",
    error: "Error occurred",
    success: "Success",
    getLocationInfo: "Get Location Info",
    startChat: "Start Chat",
    
    // Location
    enterLocation: "Enter Your Location",
    selectState: "Select State",
    selectDistrict: "Select District",
    
    // Services Section
    servicesDescription: "Comprehensive agricultural solutions powered by AI to help farmers make informed decisions",
    smartFeaturesTitle: "Smart Features for Modern Farming",
    voiceEnabledAI: "Voice-Enabled AI Assistant",
    voiceEnabledAIDesc: "Interact naturally with our AI in your preferred language using voice commands",
    imageRecognition: "Image Recognition",
    imageRecognitionDesc: "Upload photos of crops to instantly identify pests, diseases, and nutrients",
    locationBasedRec: "Location-Based Recommendations",
    locationBasedRecDesc: "Get personalized advice based on your local soil type and climate conditions",
    
    // Guidance Popup
    guidanceVideoTitle: "There will be a guidance video of website",
  },

  hi: {
    // Navigation
    home: "होम",
    services: "सेवाएं",
    about: "हमारे बारे में",
    contact: "संपर्क",

    // Hero Section
    heroTitle: "स्मार्ट कृषि सलाहकार प्रणाली",
    heroSubtitle: "एआई तकनीक से किसानों को सशक्त बनाना",
    heroDescription: "अपनी मातृभाषा में व्यक्तिगत फसल सिफारिशें, मिट्टी विश्लेषण, मौसम अलर्ट और विशेषज्ञ सलाह प्राप्त करें। वैज्ञानिक खेती मार्गदर्शन के साथ अपनी उत्पादकता बढ़ाएं और लागत कम करें।",
    getStarted: "शुरू करें",
    learnMore: "और जानें",

    // Services
    aiAdvisor: "एआई कृषि सलाहकार",
    aiAdvisorDesc: "हमारे एआई-संचालित चैटबॉट के साथ अपने खेती के सवालों के तुरंत जवाब पाएं",
    soilAnalysis: "मिट्टी स्वास्थ्य विश्लेषण",
    soilAnalysisDesc: "अपनी मिट्टी की संरचना समझें और उर्वरक सिफारिशें पाएं",
    weatherAlerts: "मौसम अलर्ट",
    weatherAlertsDesc: "समय पर मौसम अपडेट और खेती अलर्ट प्राप्त करें",
    pestDetection: "कीट और रोग पहचान",
    pestDetectionDesc: "कीटों और बीमारियों की तुरंत पहचान के लिए फसल की तस्वीरें अपलोड करें",
    marketPrices: "बाजार मूल्य ट्रैकिंग",
    marketPricesDesc: "अपने क्षेत्र में नवीनतम फसल की कीमतों से अपडेट रहें",
    cropPlanning: "फसल योजना",
    cropPlanningDesc: "मिट्टी, मौसम और बाजार की स्थितियों के आधार पर अपनी फसलों की योजना बनाएं",

    // Chatbot
    chatWithAI: "एआई असिस्टेंट से चैट करें",
    typeMessage: "अपना संदेश टाइप करें...",
    voiceInput: "वॉयस इनपुट",
    uploadImage: "छवि अपलोड करें",
    askAnything: "खेती, फसल या मिट्टी के बारे में कुछ भी पूछें",
    soilInfo: "मिट्टी की जानकारी",
    cropRecommendations: "फसल सिफारिशें",
    weatherInfo: "मौसम की जानकारी",

    // Common
    language: "भाषा",
    submit: "सबमिट करें",
    close: "बंद करें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि हुई",
    success: "सफलता",
    getLocationInfo: "स्थान की जानकारी प्राप्त करें",
    startChat: "चैट शुरू करें",
    
    // Location
    enterLocation: "अपना स्थान दर्ज करें",
    selectState: "राज्य चुनें",
    selectDistrict: "जिला चुनें",
    
    // Services Section
    servicesDescription: "एआई द्वारा संचालित व्यापक कृषि समाधान जो किसानों को सूचित निर्णय लेने में मदद करते हैं",
    smartFeaturesTitle: "आधुनिक खेती के लिए स्मार्ट सुविधाएं",
    voiceEnabledAI: "वॉयस-सक्षम एआई सहायक",
    voiceEnabledAIDesc: "वॉयस कमांड का उपयोग करके अपनी पसंदीदा भाषा में हमारे एआई के साथ प्राकृतिक रूप से बातचीत करें",
    imageRecognition: "छवि पहचान",
    imageRecognitionDesc: "कीटों, बीमारियों और पोषक तत्वों की तुरंत पहचान के लिए फसलों की तस्वीरें अपलोड करें",
    locationBasedRec: "स्थान-आधारित सिफारिशें",
    locationBasedRecDesc: "अपनी स्थानीय मिट्टी के प्रकार और जलवायु की स्थिति के आधार पर व्यक्तिगत सलाह प्राप्त करें",
    
    // Guidance Popup
    guidanceVideoTitle: "वेबसाइट का मार्गदर्शन वीडियो होगा",
  },

  pa: {
    // Navigation
    home: "ਘਰ",
    services: "ਸੇਵਾਵਾਂ",
    about: "ਸਾਡੇ ਬਾਰੇ",
    contact: "ਸੰਪਰਕ",

    // Hero Section
    heroTitle: "ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ਸਿਸਟਮ",
    heroSubtitle: "ਏਆਈ ਤਕਨਾਲੋਜੀ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ",
    heroDescription: "ਆਪਣੀ ਮਾਤ੍ਰਿਭਾਸ਼ਾ ਵਿੱਚ ਵਿਅਕਤੀਗਤ ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ, ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ, ਮੌਸਮ ਅਲਰਟ ਅਤੇ ਮਾਹਰ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰੋ। ਵਿਗਿਆਨਕ ਖੇਤੀ ਮਾਰਗਦਰਸ਼ਨ ਨਾਲ ਆਪਣੀ ਉਤਪਾਦਕਤਾ ਵਧਾਓ ਅਤੇ ਲਾਗਤ ਘਟਾਓ।",
    getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
    learnMore: "ਹੋਰ ਜਾਣੋ",

    // Services
    aiAdvisor: "ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ",
    aiAdvisorDesc: "ਸਾਡੇ ਏਆਈ-ਸੰਚਾਲਿਤ ਚੈਟਬੋਟ ਨਾਲ ਆਪਣੇ ਖੇਤੀ ਦੇ ਸਵਾਲਾਂ ਦੇ ਤੁਰੰਤ ਜਵਾਬ ਪਾਓ",
    soilAnalysis: "ਮਿੱਟੀ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ",
    soilAnalysisDesc: "ਆਪਣੀ ਮਿੱਟੀ ਦੀ ਬਣਤਰ ਸਮਝੋ ਅਤੇ ਖਾਦ ਸਿਫਾਰਸ਼ਾਂ ਪਾਓ",
    weatherAlerts: "ਮੌਸਮ ਅਲਰਟ",
    weatherAlertsDesc: "ਸਮੇਂ ਸਿਰ ਮੌਸਮ ਅਪਡੇਟ ਅਤੇ ਖੇਤੀ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ",
    pestDetection: "ਕੀੜੇ ਅਤੇ ਰੋਗ ਪਛਾਣ",
    pestDetectionDesc: "ਕੀੜਿਆਂ ਅਤੇ ਬਿਮਾਰੀਆਂ ਦੀ ਤੁਰੰਤ ਪਛਾਣ ਲਈ ਫਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਕਰੋ",
    marketPrices: "ਮਾਰਕੀਟ ਕੀਮਤ ਟਰੈਕਿੰਗ",
    marketPricesDesc: "ਆਪਣੇ ਖੇਤਰ ਵਿੱਚ ਨਵੀਨਤਮ ਫਸਲ ਦੀਆਂ ਕੀਮਤਾਂ ਨਾਲ ਅਪਡੇਟ ਰਹੋ",
    cropPlanning: "ਫਸਲ ਯੋਜਨਾ",
    cropPlanningDesc: "ਮਿੱਟੀ, ਮੌਸਮ ਅਤੇ ਮਾਰਕੀਟ ਦੀਆਂ ਸਥਿਤੀਆਂ ਦੇ ਆਧਾਰ ਤੇ ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਯੋਜਨਾ ਬਣਾਓ",

    // Chatbot
    chatWithAI: "ਏਆਈ ਅਸਿਸਟੈਂਟ ਨਾਲ ਚੈਟ ਕਰੋ",
    typeMessage: "ਆਪਣਾ ਸੰਦੇਸ਼ ਟਾਈਪ ਕਰੋ...",
    voiceInput: "ਵੌਇਸ ਇਨਪੁਟ",
    uploadImage: "ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ",
    askAnything: "ਖੇਤੀ, ਫਸਲ ਜਾਂ ਮਿੱਟੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ",
    soilInfo: "ਮਿੱਟੀ ਦੀ ਜਾਣਕਾਰੀ",
    cropRecommendations: "ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ",
    weatherInfo: "ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ",

    // Common
    language: "ਭਾਸ਼ਾ",
    submit: "ਸਬਮਿਟ ਕਰੋ",
    close: "ਬੰਦ ਕਰੋ",
    loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    error: "ਗਲਤੀ ਹੋਈ",
    success: "ਸਫਲਤਾ",
    getLocationInfo: "ਟਿਕਾਣੇ ਦੀ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ",
    startChat: "ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ",
    
    // Location
    enterLocation: "ਆਪਣਾ ਟਿਕਾਣਾ ਦਰਜ ਕਰੋ",
    selectState: "ਰਾਜ ਚੁਣੋ",
    selectDistrict: "ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ",
    
    // Services Section
    servicesDescription: "ਏਆਈ ਦੁਆਰਾ ਸੰਚਾਲਿਤ ਵਿਆਪਕ ਖੇਤੀਬਾੜੀ ਹੱਲ ਜੋ ਕਿਸਾਨਾਂ ਨੂੰ ਸੂਚਿਤ ਫੈਸਲੇ ਲੈਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ",
    smartFeaturesTitle: "ਆਧੁਨਿਕ ਖੇਤੀ ਲਈ ਸਮਾਰਟ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
    voiceEnabledAI: "ਆਵਾਜ਼-ਸਮਰੱਥ ਏਆਈ ਸਹਾਇਕ",
    voiceEnabledAIDesc: "ਆਵਾਜ਼ ਕਮਾਂਡਾਂ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹੋਏ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਵਿੱਚ ਸਾਡੇ ਏਆਈ ਨਾਲ ਕੁਦਰਤੀ ਰੂਪ ਵਿੱਚ ਗੱਲਬਾਤ ਕਰੋ",
    imageRecognition: "ਚਿੱਤਰ ਪਛਾਣ",
    imageRecognitionDesc: "ਕੀੜਿਆਂ, ਬਿਮਾਰੀਆਂ ਅਤੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੀ ਤੁਰੰਤ ਪਛਾਣ ਲਈ ਫਸਲਾਂ ਦੀਆਂ ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਕਰੋ",
    locationBasedRec: "ਸਥਾਨ-ਅਧਾਰਿਤ ਸਿਫਾਰਸ਼ਾਂ",
    locationBasedRecDesc: "ਆਪਣੀ ਸਥਾਨਕ ਮਿੱਟੀ ਦੇ ਪ੍ਰਕਾਰ ਅਤੇ ਜਲਵਾਯੂ ਦੀਆਂ ਸਥਿਤੀਆਂ ਦੇ ਆਧਾਰ ਤੇ ਵਿਅਕਤਿਗਤ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰੋ",
    
    // Guidance Popup
    guidanceVideoTitle: "ਵੈਬਸਾਈਟ ਦਾ ਮਾਰਗਦਰਸ਼ਨ ਵੀਡੀਓ ਹੋਵੇਗਾ",
  },
};