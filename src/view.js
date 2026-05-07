import { snapshot, subscribe } from 'valtio/vanilla'

const renderErrorHandler = (errors, elements) => {
  const { input, errorContainer } = elements
  const errorMessage = errors.rss
  if (errorMessage) {
    input.classList.add('is-invalid')
    errorContainer.classList.remove('text-success')
    errorContainer.classList.add('text-danger')
    errorContainer.textContent = errorMessage
  }
  else {
    input.classList.remove('is-invalid')
  }
}

const handleProcessState = (elements, process) => {
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
      elements.errorContainer.textContent = 'RSS успешно добавлен'
      break

    default:
      throw new Error(`Unknown process ${process}`)
  }
}

const watch = (elements, state) => {
  const render = (path, value) => {
    switch (path) {
      case 'form.status':
        handleProcessState(elements, value)
        break
      case 'form.errors':
        renderErrorHandler(value, elements)
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
