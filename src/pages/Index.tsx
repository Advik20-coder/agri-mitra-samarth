import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { FeedbackPopup } from "@/components/FeedbackPopup";

const Index = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedback(true);
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
      </main>
      <FloatingChatbot />
      <FeedbackPopup 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
      />
    </div>
  );
};

export default Index;
