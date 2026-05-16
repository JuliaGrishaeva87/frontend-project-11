import { proxy } from 'valtio/vanilla'
import _ from 'lodash'
import watch from './view.js'
import { makeSchema } from './validation.js'
import { renderStaticTexts } from './initHtml.js'
import { buildProxyUrl, parseRSS } from './rss.js'
import i18next from 'i18next'
import resources from './locales/index'
import axios from 'axios'

const validate = (task, feeds) => {
  const addedUrls = feeds.map(feed => feed.url)
  const schema = makeSchema(addedUrls)
  return schema.validate(task, { abortEarly: false })
}

const parseValidationErrors = (err) => {
  if (err.inner) {
    const errorsByPath = _.keyBy(err.inner, 'path')
    return _.mapValues(errorsByPath, errorItem => errorItem.message.key)
  }
  return { rss: err.message.key }
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
          message: null,
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
        const formData = new FormData(e.target)
        const rssUrl = Object.fromEntries(formData)
        state.form.status = 'submitting'
        state.form.message = null

        validate(rssUrl, state.feeds)
          .then(validData => axios.get(buildProxyUrl(validData.rss)))
          .then((response) => {
            return parseRSS(response.data.contents)
          })
          .then((parsedData) => {
            state.form.errors = {}
            parsedData.url = rssUrl.rss
            state.feeds.push((parsedData))
            state.form.message = 'validation.valid'
            state.form.status = 'validated'
            elements.form.reset()
          })
          .catch((err) => {
            state.form.status = 'invalid'
            if (err.name === 'ValidationError') {
              state.form.errors = parseValidationErrors(err)
              state.form.message = Object.values(state.form.errors)[0]
            }
            else if (err.name === 'ParsingError') {
              state.form.errors = { rss: 'validation.errors.invalidRss' }
              state.form.message = 'validation.errors.invalidRss'
            }
            else {
              state.form.errors = { rss: 'validation.errors.network' }
              state.form.message = 'validation.errors.network'
            }
          })
      })

      elements.input.addEventListener('input', () => {
        state.form.status = 'filling'
      })
    })
}

export default app
