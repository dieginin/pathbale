import { Children, Suspense, useEffect, useState } from "react"
import { addListeners, removeListeners } from "../utils/listeners"
import { getCurrentPath, navigateTo } from "../utils/paths"

import Forbidden403 from "../pages/Forbidden403"
import Loading from "./Loading"
import NotFound404 from "../pages/NotFound404"
import { match } from "path-to-regexp"

export function Router({
  children,
  routes = [],
  notFoundPage: NotFoundPage = NotFound404,
  forbiddenPage: ForbiddenPage = Forbidden403,
  loadingComponent: LoadingComponent = <Loading />,
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
