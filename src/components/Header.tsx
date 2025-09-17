import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sprout, Menu, X } from "lucide-react";
import farmersImage from "@/assets/farmers-working.jpg";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navigationItems = [
    { label: t.home, href: "#home" },
    { label: t.services, href: "#services" },
    { label: t.about, href: "#about" },
    { label: t.contact, href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/60 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src={farmersImage} 
          alt="Farmers working in fields" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CropAdvisor
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
              {t.getStarted}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/60">
            <nav className="flex flex-col gap-4 mt-4">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity mt-2">
                {t.getStarted}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};