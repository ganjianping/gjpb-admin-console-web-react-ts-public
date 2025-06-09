/**
 * Internationalization hook
 */
import { useState, useEffect, useCallback } from 'react';
import i18n from 'i18next';
import { APP_CONFIG } from '../utils/config';

type Language = 'en' | 'zh';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('gjpb_language');
    if (savedLang === 'en' || savedLang === 'zh') {
      return savedLang;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'zh') {
      return 'zh';
    }
    
    return APP_CONFIG.DEFAULT_LANGUAGE as Language;
  });

  // Update localStorage and i18n instance when language changes
  useEffect(() => {
    localStorage.setItem('gjpb_language', currentLanguage);
    i18n.changeLanguage(currentLanguage).then(() => {
      console.info(`Language changed to ${currentLanguage}`);
    }).catch(err => {
      console.error(`Failed to change language to ${currentLanguage}:`, err);
    });
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage]);

  // Debug function to check if translations are loaded
  const verifyTranslationsLoaded = useCallback(() => {
    const testKey = 'login.form.submit';
    const translation = i18n.t(testKey);
    console.info(`Translation test - Key: "${testKey}", Result: "${translation}"`);
    
    if (testKey === translation) {
      console.error('Translation key returned instead of translation value. i18n may not be properly initialized.');
      
      // Try reloading translations
      i18n.reloadResources().then(() => {
        console.info('Translations reloaded, testing again...');
        const newTranslation = i18n.t(testKey);
        console.info(`After reload - Key: "${testKey}", Result: "${newTranslation}"`);
      });
    }
    
    return translation !== testKey;
  }, []);

  const changeLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    // Verify translations after language change
    setTimeout(verifyTranslationsLoaded, 500);
  }, [verifyTranslationsLoaded]);

  return { 
    language: currentLanguage, 
    changeLanguage, 
    supportedLanguages: APP_CONFIG.AVAILABLE_LANGUAGES,
    isEnglish: currentLanguage === 'en',
    isChinese: currentLanguage === 'zh',
  };
};

export default useLanguage;
