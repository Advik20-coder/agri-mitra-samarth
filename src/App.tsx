import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PestDetection } from "./components/PestDetection";
import { AIAdvisor } from "./components/AIAdvisor";
import { WeatherAlerts } from "./components/WeatherAlerts";
import { MarketPrices } from "./components/MarketPrices";
import { CropPlanning } from "./components/CropPlanning";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pest-detection" element={<PestDetection />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
            <Route path="/weather-alerts" element={<WeatherAlerts />} />
            <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/crop-planning" element={<CropPlanning />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
