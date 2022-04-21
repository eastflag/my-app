import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import commonEn from './en/common.json';
import sampleEn from './en/sample.json';
import memberEn from './en/member.json';
import creatorEn from './en/creator.json';
import launchpadEn from './en/launchpad.json';

import commonKo from './ko/common.json';
import sampleKo from './ko/sample.json';
import memberKo from './ko/member.json';
import creatorKo from './ko/creator.json';
import launchpadKo from './ko/launchpad.json';
import { common } from '@mui/material/colors';
// Add this line to your app entrypoint. Usually it is src/index.js
// import './i18n';

// https://react.i18next.com/latest/i18next-instance
// https://react.i18next.com/latest/using-with-hooks#using-the-withtranslation-hoc
i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  // .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    detection: {
      order: ['localStorage', 'querystring', 'cookie'],
      lookupLocalStorage: 'lang',
      lookupQuerystring: 'locale',
      lookupCookie: 'lang',
    },
    resources: {
      en: { common: commonEn, sample: sampleEn, member: memberEn, creator: creatorEn, launchpad: launchpadEn },
      ko: { common: commonKo, sample: sampleKo, member: memberKo, creator: creatorKo, launchpad: launchpadKo },
    },
    defaultNS: 'common',
    fallbackLng: 'en',
    debug: false, // process.env.REACT_APP_I18N_DEBUG === 'true',
    react: {
      useSuspense: false,
    },
  });

export default i18n;
