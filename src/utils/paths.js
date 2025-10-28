import { EVENTS } from "./consts"

export const getCurrentPath = () => window.location.pathname

export const navigateTo = (href) => {
  window.history.pushState({}, "", href)
  window.dispatchEvent(new Event(EVENTS.PUSHSTATE))
}

export const goBack = () => {
  window.history.back()
  window.dispatchEvent(new Event(EVENTS.POPSTATE))
}
