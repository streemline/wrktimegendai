import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslations } from '@/hooks/use-translations';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/translations';

export default function LanguageSelector() {
  const { t, currentLanguage, changeLanguage, availableLanguages } = useTranslations();
  
  const handleLanguageChange = (value: string) => {
    changeLanguage(value as SupportedLanguage);
  };
  
  return (
    <Card className="bg-card rounded-lg shadow-lg p-4 mb-4">
      <CardContent className="p-0">
        <h3 className="text-lg font-medium mb-4">{t.profile.languageSettings}</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-sm mb-3 block">
              {t.profile.language}
            </Label>
            
            <RadioGroup 
              value={currentLanguage} 
              onValueChange={handleLanguageChange}
              className="flex flex-col space-y-2"
            >
              {availableLanguages.map((lang) => (
                <div 
                  key={lang.code}
                  className={`flex items-center space-x-2 p-2 rounded-md 
                    ${currentLanguage === lang.code ? 'bg-primary/10' : 'hover:bg-secondary/20'}`}
                >
                  <RadioGroupItem 
                    value={lang.code} 
                    id={`lang-${lang.code}`} 
                    className="text-primary"
                  />
                  <Label 
                    htmlFor={`lang-${lang.code}`}
                    className="cursor-pointer flex-1 flex items-center"
                  >
                    <span className="ml-2">{lang.name}</span>
                    {currentLanguage === lang.code && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-xs text-primary bg-primary/20 px-2 py-1 rounded"
                      >
                        ✓ {t.profile.language}
                      </motion.span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}