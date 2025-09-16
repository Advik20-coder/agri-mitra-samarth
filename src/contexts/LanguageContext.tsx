import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Translation } from '@/lib/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('preferred-language');
    return saved || 'hi'; // Default to Hindi
  });

  useEffect(() => {
    localStorage.setItem('preferred-language', language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language] || translations.hi;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};