import { Route, Router } from "./index"

import { lazy } from "react"

const AboutPage = lazy(() => import("./pages/About"))
const HomePage = lazy(() => import("./pages/Home"))
const Page404 = lazy(() => import("./pages/404"))
const SearchPage = lazy(() => import("./pages/Search"))
const LoadingPage = lazy(() => import("./pages/Loading"))

const appRoutes = [
  { path: "/", component: HomePage },
  { path: "/:lang/about", component: AboutPage },
  {
    path: "/member/:id/brawlers/:brawlerId",
    component: ({ params }) => (
      <>
        <h1>Member {params.id}</h1>
        <h2>Brawler {params.brawlerId}</h2>
      </>
    ),
  },
]

function App() {
  return (
    <main>
      <Router
        routes={appRoutes}
        notFoundPage={Page404}
        loadingComponent={<LoadingPage />}
      >
        <Route path='/about' component={AboutPage} />
        <Route path='/search/:query' component={SearchPage} />
      </Router>
    </main>
  )
}

export default App
