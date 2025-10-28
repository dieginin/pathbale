import { Children, Suspense, useEffect, useState } from "react"
import { addListeners, removeListeners } from "../utils/listeners"
import { getCurrentPath, navigateTo } from "../utils/paths"

import { match } from "path-to-regexp"

export function Router({
  children,
  routes = [],
  notFoundPage: NotFoundPage = () => <h1>404 - Not Found</h1>, // TODO Mejorar componente 404
  forbiddenPage: ForbiddenPage = () => <h1>403 - Forbidden</h1>, // TODO Mejorar componente 403
  loadingComponent: LoadingComponent = <h1>Loading...</h1>, // TODO Mejorar componente de carga
}) {
  const [currentPath, setCurrentPath] = useState(getCurrentPath())

  useEffect(() => {
    const onLocationChange = () => setCurrentPath(getCurrentPath())

    addListeners(onLocationChange)
    return () => removeListeners(onLocationChange)
  }, [])

  const routesFromChildren = Children.map(children, ({ props, type }) => {
    const isRoute = type.name === "Route"
    return isRoute ? props : null
  })
  const routesToUse = routes.concat(routesFromChildren || []).filter(Boolean)

  let params = {}
  const matchedRoute = routesToUse.find(({ path }) => {
    if (path === currentPath) return true

    const matchResult = match(path, { decode: decodeURIComponent })
    const matched = matchResult(currentPath)
    if (!matched) return false
    params = matched.params
    return true
  })

  const CurrentComponent = matchedRoute?.component || NotFoundPage
  const guard = matchedRoute?.guard
  const redirectTo = matchedRoute?.redirectTo

  if (guard && !guard()) {
    if (redirectTo) {
      navigateTo(redirectTo)
      const RedirectComponent =
        routesToUse.find((r) => r.path === redirectTo)?.component ||
        NotFoundPage
      return <RedirectComponent />
    }
    const ForbiddenComponent = ForbiddenPage
    return <ForbiddenComponent />
  }

  return (
    <Suspense fallback={LoadingComponent}>
      <CurrentComponent params={params} />
    </Suspense>
  )
}
