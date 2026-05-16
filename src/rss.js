import _ from 'lodash'

const buildProxyUrl = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app/')
  proxyUrl.searchParams.set('disableCache', 'true')
  proxyUrl.searchParams.set('url', url)
  return proxyUrl.toString()
}

const parseRSS = (xmlUrl) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlUrl, 'text/xml')
  const errorNode = xmlDoc.querySelector('parsererror')
  if (errorNode) {
    const error = new Error('invalid_rss')
    error.name = 'ParsingError'
    throw error
  }
  const feed = {}
  feed.feedId = _.uniqueId()
  feed.feedTitle = xmlDoc.querySelector('title').textContent
  feed.feedDescription = xmlDoc.querySelector('description').textContent
  feed.posts = Array.from(xmlDoc.querySelectorAll('item'), item => ({
    id: _.uniqueId(),
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
  }))
  return feed
}

export { buildProxyUrl, parseRSS }
