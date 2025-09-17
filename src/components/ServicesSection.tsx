import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Bot, 
  Microscope, 
  CloudRain, 
  Bug, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  MapPin,
  MessageCircle
} from "lucide-react";
import { useState } from "react";
import { LocationDialog } from "@/components/LocationDialog";
import { useNavigate } from "react-router-dom";

export const ServicesSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  const services = [
    {
      icon: Bot,
      title: t.aiAdvisor,
      description: t.aiAdvisorDesc,
      gradient: "from-green-500 to-emerald-600",
      action: "chat"
    },
    {
      icon: Microscope,
      title: t.soilAnalysis,
      description: t.soilAnalysisDesc,
      gradient: "from-amber-500 to-orange-600",
      action: "location"
    },
    {
      icon: CloudRain,
      title: t.weatherAlerts,
      description: t.weatherAlertsDesc,
      gradient: "from-blue-500 to-cyan-600",
      action: "weather"
    },
    {
      icon: Bug,
      title: t.pestDetection,
      description: t.pestDetectionDesc,
      gradient: "from-red-500 to-pink-600",
      action: "upload"
    },
    {
      icon: TrendingUp,
      title: t.marketPrices,
      description: t.marketPricesDesc,
      gradient: "from-purple-500 to-violet-600",
      action: "market"
    },
    {
      icon: Calendar,
      title: t.cropPlanning,
      description: t.cropPlanningDesc,
      gradient: "from-teal-500 to-green-600",
      action: "planning"
    }
  ];

  const handleServiceClick = (action: string) => {
    switch (action) {
      case 'location':
        setShowLocationDialog(true);
        break;
      case 'chat':
        navigate('/ai-advisor');
        break;
      case 'weather':
        navigate('/weather-alerts');
        break;
      case 'upload':
        navigate('/pest-detection');
        break;
      case 'market':
        navigate('/market-prices');
        break;
      case 'planning':
        navigate('/crop-planning');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {t.services}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.servicesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index}
                  className="group hover:shadow-agricultural transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-border/60 cursor-pointer"
                  onClick={() => handleServiceClick(service.action)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-muted-foreground mb-6">
                      {service.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      {service.action === 'location' ? (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          {t.getLocationInfo}
                        </>
                      ) : service.action === 'chat' ? (
                        <>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {t.startChat}
                        </>
                      ) : (
                        <>
                          {t.learnMore}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features showcase */}
          <div className="mt-20 bg-gradient-card rounded-2xl p-8 md:p-12 shadow-soft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  {t.smartFeaturesTitle}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t.voiceEnabledAI}</h4>
                      <p className="text-muted-foreground text-sm">
                        {t.voiceEnabledAIDesc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t.imageRecognition}</h4>
                      <p className="text-muted-foreground text-sm">
                        {t.imageRecognitionDesc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t.locationBasedRec}</h4>
                      <p className="text-muted-foreground text-sm">
                        {t.locationBasedRecDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-64 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-24 w-24 text-white opacity-50" />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-harvest-yellow to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LocationDialog 
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
      />
    </>
  );
};