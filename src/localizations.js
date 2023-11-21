import i18next from 'i18next';
import resources from './locales/index.js';

i18next.init({
  lng: 'ru',
  debug: true,
  resources
});

export default i18next;
