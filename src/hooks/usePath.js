import { addListeners, removeListeners } from "../utils/listeners"
import { getCurrentPath, navigateTo } from "../utils/paths"
import { useEffect, useState } from "react"

import { match } from "path-to-regexp"

export default function usePath({ routes, NotFoundPage, ForbiddenPage }) {
  const [currentPath, setCurrentPath] = useState(getCurrentPath())

  useEffect(() => {
    const onLocationChange = () => setCurrentPath(getCurrentPath())

    addListeners(onLocationChange)
    return () => removeListeners(onLocationChange)
  }, [])

  let params = {}
  const matchedRoute = routes.find(({ path }) => {
    if (path === currentPath) return true

    const matchResult = match(path, { decode: decodeURIComponent })
    const matched = matchResult(currentPath)
    if (!matched) return false
    params = matched.params
    return true
  })

  let CurrentComponent = matchedRoute?.component || NotFoundPage
  const guard = matchedRoute?.guard
  const redirectTo = matchedRoute?.redirectTo

  if (guard && !guard()) {
    if (redirectTo) {
      navigateTo(redirectTo)
      const RedirectComponent =
        routes.find((r) => r.path === redirectTo)?.component || NotFoundPage
      CurrentComponent = RedirectComponent
    } else {
      CurrentComponent = ForbiddenPage
    }
  }
  return { CurrentComponent, params }
}
