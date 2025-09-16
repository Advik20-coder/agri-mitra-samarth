import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Upload, Mic, MicOff, ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const crops = [
  { value: "wheat", label: "गेहूं / Wheat" },
  { value: "rice", label: "धान / Rice" },
  { value: "corn", label: "मक्का / Corn" },
  { value: "cotton", label: "कपास / Cotton" },
  { value: "sugarcane", label: "गन्ना / Sugarcane" },
  { value: "potato", label: "आलू / Potato" },
  { value: "tomato", label: "टमाटर / Tomato" },
  { value: "onion", label: "प्याज / Onion" }
];

export const PestDetection = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [acreage, setAcreage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
      toast.success("सुन रहा हूं... बोलें");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Try to match crop names from speech
      const matchedCrop = crops.find(crop => 
        transcript.toLowerCase().includes(crop.label.toLowerCase()) ||
        transcript.toLowerCase().includes(crop.value)
      );
      if (matchedCrop) {
        setSelectedCrop(matchedCrop.value);
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      toast.error("Camera access denied");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0);
      
      // Stop camera
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setShowCamera(false);
      
      // Simulate analysis
      analyzeImage("camera_capture.jpg");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      analyzeImage(file.name);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const analyzeImage = (filename: string) => {
    if (!selectedCrop || !acreage) {
      toast.error("कृपया पहले फसल और क्षेत्रफल चुनें");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const pestAnalysis = generatePestAnalysis(selectedCrop, filename);
      setAnalysisResult(pestAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const generatePestAnalysis = (crop: string, filename: string): string => {
    const pestData: Record<string, any> = {
      wheat: {
        pest: "Aphids (एफिड्स)",
        disease: "Yellow Rust (पीला रतुआ)",
        treatment: "Imidacloprid 17.8% SL @ 0.3ml/liter",
        googleLens: "wheat+aphids+yellow+rust"
      },
      rice: {
        pest: "Brown Plant Hopper (भूरा फुदका)", 
        disease: "Blast Disease (ब्लास्ट रोग)",
        treatment: "Thiamethoxam 25% WG @ 0.2g/liter",
        googleLens: "rice+brown+plant+hopper+blast"
      },
      cotton: {
        pest: "Bollworm (सुंडी)",
        disease: "Wilt Disease (मुरझाना रोग)", 
        treatment: "Cypermethrin 10% EC @ 1ml/liter",
        googleLens: "cotton+bollworm+wilt+disease"
      }
    };

    const data = pestData[crop] || pestData.wheat;
    
    return `📸 **छवि विश्लेषण रिपोर्ट** (${filename})

🌾 **फसल:** ${crops.find(c => c.value === crop)?.label}
📐 **क्षेत्रफल:** ${acreage} एकड़

🐛 **संभावित कीट:** ${data.pest}
🦠 **संभावित रोग:** ${data.disease}

💊 **उपचार सुझाव:**
• ${data.treatment}
• छिड़काव सुबह या शाम के समय करें
• 15 दिन बाद दोहराएं यदि आवश्यक हो

⚠️ **सावधानियां:**
• सुरक्षा उपकरण पहनें
• हवा की दिशा का ध्यान रखें
• बच्चों और पशुओं से दूर रखें

🔍 **अधिक जानकारी के लिए Google Lens से खोजें:**`;
  };

  const openGoogleLens = () => {
    if (selectedCrop) {
      const data = {
        wheat: "wheat+pest+disease+treatment", 
        rice: "rice+pest+disease+treatment",
        cotton: "cotton+pest+disease+treatment"
      };
      const query = data[selectedCrop as keyof typeof data] || "crop+pest+disease";
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
  };

  if (showCamera) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setShowCamera(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              वापस
            </Button>
            <h1 className="text-2xl font-bold">📸 फोटो खींचें</h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  onClick={capturePhoto}
                  className="bg-gradient-primary text-white px-8 py-3 rounded-full"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  फोटो खींचें
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            🐛 Pest & Disease Detection
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 फसल जानकारी
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
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">फसल चुनें:</label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="फसल चुनें..." />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map(crop => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">क्षेत्रफल (एकड़):</label>
                <Input
                  type="number"
                  value={acreage}
                  onChange={(e) => setAcreage(e.target.value)}
                  placeholder="जैसे: 2.5"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">फोटो अपलोड करें:</h3>
                
                <Button
                  onClick={startCamera}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!selectedCrop || !acreage}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  कैमरा से फोटो लें
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                  disabled={!selectedCrop || !acreage}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  गैलरी से अपलोड करें
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {selectedCrop && acreage && (
                <Button
                  onClick={openGoogleLens}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Google Lens में खोजें
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Analysis Result */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 विश्लेषण परिणाम</CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>AI द्वारा छवि का विश्लेषण हो रहा है...</p>
                </div>
              ) : analysisResult ? (
                <div className="whitespace-pre-line text-sm bg-muted p-4 rounded-lg">
                  {analysisResult}
                  <div className="mt-4">
                    <Button
                      onClick={openGoogleLens}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Google Lens में देखें
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>पहले फसल की जानकारी भरें और फोटो अपलोड करें</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};