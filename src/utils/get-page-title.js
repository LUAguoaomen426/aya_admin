import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Hospital backstage'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
