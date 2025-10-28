import { Children, Suspense, useEffect, useState } from "react"
import { addListeners, removeListeners } from "../utils/listeners"

import { getCurrentPath } from "../utils/paths"
import { match } from "path-to-regexp"

export function Router({
  children,
  routes = [],
  notFoundPage: NotFoundPage = () => <h1>404 - Not Found</h1>, // TODO Mejorar componente 404
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
  const CurrentComponent =
    routesToUse.find(({ path }) => {
      if (path === currentPath) return true

      const matchResult = match(path, { decode: decodeURIComponent })
      const matched = matchResult(currentPath)
      if (!matched) return false

      params = matched.params
      return true
    })?.component || NotFoundPage

  return (
    <Suspense fallback={LoadingComponent}>
      <CurrentComponent params={params} />
    </Suspense>
  )
}
