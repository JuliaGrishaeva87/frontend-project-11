import { proxy } from 'valtio/vanilla'
import _ from 'lodash'
import watch from './view.js'
import { makeSchema } from './validation.js'
import { renderStaticTexts } from './initHtml.js'
import i18next from 'i18next'
import resources from './locales/index'

const validate = (task, feeds) => {
  const schema = makeSchema(feeds)
  return schema.validate(task, { abortEarly: false })
}

const app = () => {
  const defaultLang = 'ru'
  const i18n = i18next.createInstance()
  i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  })
    .then(() => {
      renderStaticTexts(i18n)
      const state = proxy({
        feeds: [],
        form: {
          status: null, // filling, submitting, validated, invalid
          errors: {},
        },
      })

      const elements = {
        form: document.getElementById('rss-form'),
        input: document.getElementById('rss-input'),
        errorContainer: document.getElementById('error-msg'),
        submit: document.getElementById('rss-submit'),
        list: document.getElementById('rss-list'),
      }

      watch(elements, state, i18n)

      elements.input.addEventListener('focus', () => {
        state.form.status = 'filling'
      })

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault()
        state.form.status = 'submitting'
        const formData = new FormData(e.target)
        const rssUrl = Object.fromEntries(formData)
        validate(rssUrl, state.feeds)
          .then((validData) => {
            state.form.errors = {}
            state.form.status = 'validated'
            state.feeds.push((validData.rss))
          })
          .catch((err) => {
            state.form.status = 'invalid'
            if (err.inner) {
              const errorsByPath = _.keyBy(err.inner, 'path')
              state.form.errors = _.mapValues(errorsByPath, (errorItem) => {
                return errorItem.message.key
              })
            }
            else {
              state.form.errors = { rss: err.message.key }
            }
          })
      })

      elements.input.addEventListener('input', () => {
        state.form.status = 'filling'
      })
    })
}

export default app
