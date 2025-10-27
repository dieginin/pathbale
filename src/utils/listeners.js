import { EVENTS } from "./consts"

export const addListeners = (callback) => {
  window.addEventListener(EVENTS.PUSHSTATE, callback)
  window.addEventListener(EVENTS.POPSTATE, callback)
}

export const removeListeners = (callback) => {
  window.removeEventListener(EVENTS.PUSHSTATE, callback)
  window.removeEventListener(EVENTS.POPSTATE, callback)
}
