import { proxy } from 'valtio/vanilla'
import _ from 'lodash'
import watch from './view.js'
import { makeSchema } from './validation.js'

const validate = (task, feeds) => {
  const schema = makeSchema(feeds)
  return schema.validate(task, { abortEarly: false })
}

const app = () => {
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

  watch(elements, state)

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
          state.form.errors = _.mapValues(errorsByPath, 'message')
        }
        else {
          state.form.errors = { rss: err.message }
        }
      })
  })

  elements.input.addEventListener('input', () => {
    state.form.status = 'filling'
  })
}

export default app
