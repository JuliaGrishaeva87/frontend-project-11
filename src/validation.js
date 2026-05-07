import * as yup from 'yup'

yup.setLocale({
  string: {
    url: 'Ссылка должна быть валидным URL',
  },
  mixed: {
    notOneOf: 'Этот RSS-канал уже добавлен',
    required: 'Не должно быть пустым',
  },
})

export const makeSchema = (urls) => {
  return yup.object().shape({
    rss: yup.string().trim().required().url().notOneOf(urls),
  })
}
