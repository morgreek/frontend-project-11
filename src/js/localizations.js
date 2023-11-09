import i18next from 'i18next';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: {
      translation: {
        validate: {
          reqiured: 'Не должно быть пустым',
          url: 'Ссылка должна быть валидным URL',
        },
        rssEvents: {
          success: 'RSS успешно загружен',
          existingUrl: 'RSS уже существует',
          notValidRSS: 'Ресурс не содержит валидный RSS',
        },
        form: {
          preview: 'Просмотр',
          read: 'Читать полностью',
          close: 'Закрыть',
        },
        networks: {
          error: 'Ошибка сети',
        },
      },
    },
  },
});

export default i18next;
