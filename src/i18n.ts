
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';

export const languageResources = {
  en: {translation: en},
  ko: {translation: ko},
  ja: {translation: ja},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: languageResources,
  lng: 'ko',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
