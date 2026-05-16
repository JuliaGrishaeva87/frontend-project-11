import { snapshot, subscribe } from 'valtio/vanilla'

const renderMessage = (messageKey, snapshotState, elements, i18n) => {
  const { input, errorContainer } = elements
  if (!messageKey) {
    errorContainer.textContent = ''
    return
  }

  if (snapshotState.form.status === 'invalid') {
    input.classList.add('is-invalid')
    errorContainer.classList.remove('text-success')
    errorContainer.classList.add('text-danger')
  }
  else {
    input.classList.remove('is-invalid')
    errorContainer.classList.add('text-success')
    errorContainer.classList.remove('text-danger')
  }
  errorContainer.textContent = i18n.t(messageKey)
}

const renderLists = (snapshotState, i18n) => {
  const outputSection = document.querySelector('#outputField')
  outputSection.innerHTML = ''
  const postsListTitle = i18n.t('postsList')
  const feedsListTitle = i18n.t('feedsList')
  const postsListBody = snapshotState.feeds
    .flatMap(feed => feed.posts
      .map(post => `<li class="list-group-item d-flex flex-row justify-content-between align-items-center border-0">
      <a href='${post.link}'>${post.title}</a>
      <a class="btn btn-outline-primary btn-sm flex-shrink-0 ms-auto" data-id="${post.id}" href="${post.link}">${i18n.t('previewButton')}</a>
      </li>`)).join('')
  const feedsListBody = snapshotState.feeds.map(feed => `<li class="list-group-item border-0">
      <p class="h6 m-0">${feed.feedTitle}</p>
      <p class="text-secondary mt-2 mb-0 small">${feed.feedDescription}</p></li>`).join('')
  const div = document.createElement('div')
  div.classList.add('row')
  const divPosts = document.createElement('div')
  divPosts.classList.add('col-md-8')
  const divFeeds = document.createElement('div')
  divFeeds.classList.add('col-md-4')
  const ulPosts = document.createElement('ul')
  ulPosts.classList.add('list-group', 'list-group-flush')
  const ulFeeds = document.createElement('ul')
  ulFeeds.classList.add('list-group', 'list-group-flush')
  ulPosts.innerHTML = postsListBody
  ulFeeds.innerHTML = feedsListBody
  const h4posts = document.createElement('h4')
  const h4feeds = document.createElement('h4')
  h4posts.classList.add('m-3')
  h4feeds.classList.add('m-3')
  h4posts.textContent = postsListTitle
  h4feeds.textContent = feedsListTitle
  divPosts.append(h4posts, ulPosts)
  divFeeds.append(h4feeds, ulFeeds)
  div.append(divPosts, divFeeds)
  outputSection.append(div)
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
      break

    default:
      throw new Error(`Unknown process ${process}`)
  }
}

const watch = (elements, state, i18n) => {
  const render = (path, value, currentSnapshot) => {
    switch (path) {
      case 'form.status':
        handleProcessState(elements, value)
        break
      case 'form.message':
        renderMessage(value, currentSnapshot, elements, i18n)
        break
      case 'feeds':
        renderLists(currentSnapshot, i18n)
        break
      default:
        break
    }
  }

  let prevForm = snapshot(state.form)

  subscribe(state.form, () => {
    const current = snapshot(state.form)
    const currentFullState = snapshot(state)
    Object.keys(current).forEach((key) => {
      if (current[key] !== prevForm[key]) {
        render(`form.${key}`, current[key], currentFullState)
      }
    })
    prevForm = current
  })

  subscribe(state.feeds, () => {
    render('feeds', null, snapshot(state))
  })
}

export default watch
