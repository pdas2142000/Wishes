import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/da';
import 'intl-pluralrules';
import "intl-messageformat"

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ICU from 'i18next-icu';
import da from './da.json'
import en from './en.json'
import * as RNLocalize from 'react-native-localize'

const resources = {
  en: { translation: en },
  da: { translation: da },
}
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    const locales = RNLocalize.getLocales()
    const bestLanguage = locales[0]?.languageTag || 'en'
    callback(bestLanguage)
  },
  init: () => { },
  cacheUserLanguage: () => { }
}
i18n
  .use(ICU)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n


