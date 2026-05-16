export default {
  translation: {
    languages: {
      ru: 'Русский',
    },
    interface: {
      title: 'RSS агрегатор',
      subtitle: 'Начните читать RSS сегодня! Это легко, это красиво.',
      inputPlaceholderText: 'Ссылка RSS',
      addBtn: 'Добавить',
      example: 'Пример: https://lorem-rss.hexlet.app/feed',
    },
    validation: {
      errors: {
        required: 'Не должно быть пустым',
        notOneOf: 'Этот RSS-канал уже добавлен',
        validURL: 'Ссылка должна быть валидным URL',
        invalidRss: 'Не содержит RSS',
        network: 'Ошибка сети',
      },
      valid: 'RSS успешно добавлен',
    },
    postsList: 'Посты',
    feedsList: 'Фиды',
    previewButton: 'Просмотр',
  },
}
