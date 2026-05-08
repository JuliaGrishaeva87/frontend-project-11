import { snapshot, subscribe } from 'valtio/vanilla'

const renderErrorHandler = (errors, elements, i18n) => {
  const { input, errorContainer } = elements
  const errorKey = errors.rss
  if (errorKey) {
    input.classList.add('is-invalid')
    errorContainer.classList.remove('text-success')
    errorContainer.classList.add('text-danger')
    errorContainer.textContent = i18n.t(errorKey)
  }
  else {
    input.classList.remove('is-invalid')
  }
}

const handleProcessState = (elements, process, i18n) => {
  switch (process) {
    case null:
      break
    case 'filling':
      elements.input.disabled = false
      elements.submit.disabled = false
      elements.submit.classList.remove('btn-secondary')
      elements.submit.classList.add('btn-primary')
      elements.errorContainer.textContent = ''
      elements.errorContainer.classList.remove('text-success', 'text-danger')
      elements.input.classList.remove('is-invalid')
      break

    case 'submitting':
      elements.submit.disabled = true
      elements.input.disabled = true
      break

    case 'invalid':
      elements.input.disabled = false
      elements.submit.disabled = false
      break

    case 'validated':
      elements.form.reset()
      elements.input.focus()
      elements.input.disabled = false
      elements.submit.disabled = false
      elements.input.classList.remove('is-invalid')
      elements.errorContainer.classList.remove('text-danger')
      elements.errorContainer.classList.add('text-success')
      elements.errorContainer.textContent = i18n.t('validation.valid')
      break

    default:
      throw new Error(`Unknown process ${process}`)
  }
}

const watch = (elements, state, i18n) => {
  const render = (path, value) => {
    switch (path) {
      case 'form.status':
        handleProcessState(elements, value, i18n)
        break
      case 'form.errors':
        renderErrorHandler(value, elements, i18n)
        break
      default:
        break
    }
  }

  let prev = snapshot(state.form)

  subscribe(state.form, () => {
    const current = snapshot(state.form)

    Object.keys(current).forEach((key) => {
      if (current[key] !== prev[key]) {
        render(`form.${key}`, current[key])
      }
    })

    prev = current
  })
}

export default watch
