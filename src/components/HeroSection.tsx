import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Play, Zap, Shield, Globe } from "lucide-react";
import { useState } from "react";
import { GuidancePopup } from "@/components/GuidancePopup";

export const HeroSection = () => {
  const { t } = useLanguage();
  const [showGuidancePopup, setShowGuidancePopup] = useState(false);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-white/20"></div>
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-white/10"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-white/15"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Agricultural Solutions</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white/90">
            {t.heroSubtitle}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t.heroDescription}
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">Multilingual Support</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Voice Enabled</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-lg text-lg px-8 py-6 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
              onClick={() => setShowGuidancePopup(true)}
            >
              {t.getStarted}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">86%</div>
              <div className="text-sm text-white/70">Small Farmers in India</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">30%</div>
              <div className="text-sm text-white/70">Yield Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">3+</div>
              <div className="text-sm text-white/70">Languages Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm text-white/70">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <GuidancePopup 
        open={showGuidancePopup}
        onOpenChange={setShowGuidancePopup}
      />
    </section>
  );
};