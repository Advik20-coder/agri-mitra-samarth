import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Sprout, TrendingUp } from "lucide-react";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
    },
    moga: {
      state: "Punjab",
      district: "Moga",
      soilType: "Loamy Alluvial Soil",
      recommendedCrops: ["गेहूं", "धान", "कपास", "गन्ना"],
      soilDescription: "मोगा की मिट्टी उपजाऊ दोमट मिट्टी है जो अधिकांश फसलों के लिए उपयुक्त है।"
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
    },
    varanasi: {
      state: "Uttar Pradesh",
      district: "Varanasi",
      soilType: "Alluvial Soil",
      recommendedCrops: ["गेहूं", "धान", "दलहन", "तिलहन", "सब्जी"],
      soilDescription: "वाराणसी की मिट्टी गंगा के मैदानी क्षेत्र की उपजाऊ जलोढ़ मिट्टी है।"
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
    },
    muzaffarpur: {
      state: "Bihar",
      district: "Muzaffarpur",
      soilType: "Gangetic Alluvium",
      recommendedCrops: ["धान", "गेहूं", "मक्का", "लीची", "आम"],
      soilDescription: "मुजफ्फरपुर की मिट्टी गंगा की उपजाऊ जलोढ़ मिट्टी है जो फलों और अनाज दोनों के लिए उपयुक्त है।"
    }
  }
};

const stateNames: Record<string, string> = {
  punjab: "पंजाब (Punjab)",
  "uttar pradesh": "उत्तर प्रदेश (Uttar Pradesh)", 
  bihar: "बिहार (Bihar)"
};

export const LocationDialog = ({ open, onOpenChange }: LocationDialogProps) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const { t } = useLanguage();

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setLocationInfo(null);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    if (selectedState && locationData[selectedState] && locationData[selectedState][district]) {
      setLocationInfo(locationData[selectedState][district]);
    }
  };

  const availableDistricts = selectedState ? Object.keys(locationData[selectedState] || {}) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <MapPin className="h-6 w-6 text-primary" />
            {t.soilInfo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.selectState}</label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="राज्य चुनें / Select State" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(locationData).map((state) => (
                    <SelectItem key={state} value={state}>
                      {stateNames[state]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.selectDistrict}</label>
              <Select 
                value={selectedDistrict} 
                onValueChange={handleDistrictChange}
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="जिला चुनें / Select District" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district.charAt(0).toUpperCase() + district.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Information Display */}
          {locationInfo && (
            <div className="space-y-6">
              <Card className="bg-gradient-card shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {locationInfo.district}, {locationInfo.state} की मिट्टी की जानकारी
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-primary rounded-full"></div>
                      मिट्टी का प्रकार (Soil Type)
                    </h4>
                    <p className="text-lg font-medium text-primary">{locationInfo.soilType}</p>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">विस्तृत विवरण:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {locationInfo.soilDescription}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                    अनुशंसित फसलें (Recommended Crops)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {locationInfo.recommendedCrops.map((crop, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
                      >
                        <div className="font-medium text-green-800">{crop}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    कृषि सुझाव (Agricultural Recommendations)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-muted-foreground">
                        <strong>जल प्रबंधन:</strong> उचित जल निकासी और सिंचाई व्यवस्था सुनिश्चित करें
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-muted-foreground">
                        <strong>उर्वरक:</strong> मिट्टी परीक्षण के आधार पर संतुलित उर्वरक का उपयोग करें
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-muted-foreground">
                        <strong>फसल चक्र:</strong> मिट्टी की उर्वरता बनाए रखने के लिए फसल चक्र अपनाएं
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-muted-foreground">
                        <strong>जैविक खाद:</strong> रासायनिक उर्वरकों के साथ जैविक खाद का संयोजन करें
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Call to Action */}
          <div className="flex justify-center">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gradient-primary"
            >
              समझ गया / Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};