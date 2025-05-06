import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from '@/locales/en.json';
import swTranslation from '@/locales/sw.json';
import frTranslation from '@/locales/fr.json';
import luTranslation from '@/locales/lu.json';

// Set up i18next with all plugins
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',
    // Default language
    fallbackLng: 'en',
    // Supported languages
    supportedLngs: ['en', 'sw', 'fr', 'lu'],
    // Detect from navigator, localStorage, etc.
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      // React already protects from XSS
      escapeValue: false, 
    },
    // Resources containing translations for each language
    resources: {
      en: {
        translation: enTranslation
      },
      sw: {
        translation: swTranslation
      },
      fr: {
        translation: frTranslation
      },
      lu: {
        translation: luTranslation
      }
    }
  });

export default i18n;