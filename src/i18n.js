import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
import translationEN from './locales/en.json';
import translationHI from './locales/hi.json';

// Language resources
const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en', // If translation is missing, use English
  interpolation: { escapeValue: false },
});

export default i18n;
