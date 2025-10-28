# 🧭 PathBale

A lightweight, declarative router for React that keeps things simple while giving you full control. Built by NextBale.

Key ideas:

- Declare routes either as a prop or as children — or both at the same time.
- Sensible defaults for 404, 403, and loading; all are easily customizable.
- Guarded/protected routes with optional redirection.
- Dynamic paths with params for i18n, search, and any custom matching.
- Works great with React.lazy and Suspense.

---

## 🚀 Installation

```bash
npm install pathbale
# or
yarn add pathbale
```

Requires React 18+. Tested with React 19.

---

## ⚡️ Quick start

```jsx
import { lazy } from "react"
import { Router, Route, Link } from "pathbale"

const Home = lazy(() => import("./pages/Home"))
const About = lazy(() => import("./pages/About"))
const NotFound = () => <h1>404 - Not Found</h1>

export default function App() {
  return (
    <main>
      <Router notFoundPage={NotFound}>
        <Route path='/' component={Home} />
        <Route path='/about' component={About} />
      </Router>

      <nav>
        <Link to='/'>Home</Link>
        <Link to='/about'>About</Link>
      </nav>
    </main>
  )
}
```

---

## 🧩 Defining routes

PathBale lets you define routes in two ways — you can mix and match them.

### 1) As a `routes` prop (array)

```jsx
import { lazy } from "react"
import { Router } from "pathbale"

const SearchPage = lazy(() => import("./pages/Search"))

const appRoutes = [
  { path: "/search/:query", component: SearchPage },
  { path: "/:lang/about", component: lazy(() => import("./pages/About")) },
]

export default function App() {
  return <Router routes={appRoutes} />
}
```

### 2) As `Route` children

```jsx
import { Router, Route } from "pathbale"

export default function App() {
  return (
    <Router>
      <Route path='/' component={() => <h1>Home</h1>} />
      <Route path='/about' component={() => <h1>About</h1>} />
    </Router>
  )
}
```

You can use both at once. Internally, routes from the `routes` prop are combined with the `Route` children, and the first match wins (order matters).

---

## 🧭 Navigation with `Link`

Use the provided `Link` component to navigate without a full page reload:

```jsx
import { Link } from "pathbale"

;<Link to='/about'>Go to About</Link>
```

It intercepts normal left-clicks to push history and notify the router. Modified clicks (Cmd/Ctrl/Alt/Shift) or non-self targets behave like a normal anchor tag.

---

## 🧠 Dynamic paths and params

Routes support dynamic segments using `path-to-regexp` semantics. Any captured params are passed to your route component as `props.params`:

```jsx
// Define
;<Route path='/member/:id/tasks/:taskId' component={TaskDetails} />

// Consume
function TaskDetails({ params }) {
  return (
    <>
      <h1>Member {params.id}</h1>
      <h2>Task {params.taskId}</h2>
    </>
  )
}
```

This enables i18n-style routes too, e.g. `/:lang/about`, and you can localize content using `params.lang` inside your page.

---

## 🔐 Protected routes with `guard` and `redirectTo`

Any route can be protected by providing a `guard` function. If the guard returns `false`:

- If `redirectTo` is provided, PathBale navigates there and renders that route.
- If `redirectTo` is not provided, the 403 page is rendered.

```jsx
// Example auth flag. Replace with your own auth logic/context.
const isAuthenticated = false

// Provide a login route to redirect to when not authenticated
<Route path='/login' component={() => <h1>Login</h1>} />

// Protect a route using the flag
<Route
  path='/secret'
  component={() => <h1>Secret</h1>}
  guard={() => isAuthenticated}
  redirectTo='/login'
/>
```

You can also define guarded routes in the `routes` array:

```jsx
const routes = [
	{ path: "/private", component: PrivatePage, guard: () => true },
]

<Router routes={routes} />
```

---

## 🧰 Customizing 404, 403 and loading

The router ships with sensible defaults:

- 404: `() => <h1>404 - Not Found</h1>`
- 403: `() => <h1>403 - Forbidden</h1>`
- Loading: `<h1>Loading...</h1>` used as the Suspense fallback

You can override any of them:

```jsx
import { lazy } from "react"
import { Router } from "pathbale"

const Page404 = lazy(() => import("./pages/404"))
const Page403 = () => <h1>Not allowed</h1>
const Loading = () => <div>Loading…</div>

<Router
	notFoundPage={Page404}
	forbiddenPage={Page403}
	loadingComponent={<Loading />}
>
	{/* routes here */}
</Router>
```

Note: `notFoundPage` and `forbiddenPage` expect React components (not elements). `loadingComponent` expects a React node (e.g., `<Loading />`).

---

## 🧪 Full example (combined styles)

```jsx
import { lazy } from "react"
import { Router, Route } from "pathbale"

const AboutPage = lazy(() => import("./pages/About"))
const HomePage = lazy(() => import("./pages/Home"))
const LoadingPage = lazy(() => import("./pages/Loading"))
const Page403 = () => <h1>403 - Forbidden</h1>
const Page404 = () => <h1>404 - Not Found</h1>
const isAuthenticated = false // replace with your auth logic

const appRoutes = [
  { path: "/search/:query", component: lazy(() => import("./pages/Search")) },
  { path: "/:lang/about", component: AboutPage },
  {
    path: "/member/:id/tasks/:taskId",
    component: ({ params }) => (
      <>
        <h1>Member {params.id}</h1>
        <h2>Task {params.taskId}</h2>
      </>
    ),
  },
]

export default function App() {
  return (
    <main>
      <Router
        routes={appRoutes}
        notFoundPage={Page404}
        forbiddenPage={Page403}
        loadingComponent={<LoadingPage />}
      >
        <Route path='/' component={HomePage} />
        <Route path='/login' component={() => <h1>Login</h1>} />
        <Route
          path='/secret'
          component={() => <h1>Secret</h1>}
          guard={() => isAuthenticated}
          redirectTo='/login'
        />
      </Router>
    </main>
  )
}
```

---

## 📚 API Reference

### `<Router />`

Props:

- `routes?: Array<{ path: string; component: React.ComponentType | ((props: { params: Record<string, string> }) => JSX.Element); guard?: () => boolean; redirectTo?: string }>`
- `notFoundPage?: React.ComponentType` – Custom 404 page component.
- `forbiddenPage?: React.ComponentType` – Custom 403 page component.
- `loadingComponent?: React.ReactNode` – Suspense fallback while lazy components load.

Notes:

- Matching is by `window.location.pathname` (no query string or hash).
- The first route that matches wins; order your routes accordingly.
- Route params are passed as `props.params` to the matched component.

### `<Route />`

Props:

- `path: string` — Path pattern to match; supports dynamic segments (e.g., `/:lang/about`, `/search/:query`).
- `component: React.ComponentType | ((props: { params: Record<string, string> }) => JSX.Element)` — Component to render when the route matches.
- `guard?: () => boolean`— Guard function on a route; return `true` to allow access, `false` to deny (403 or redirect if `redirectTo` is set).
- `redirectTo?: string` — Path to navigate to when `guard()` returns `false`. If omitted, the 403 page is rendered.

Used only as a child of `<Router />`. It contributes a plain route object.

### `<Link />`

Props:

- `to: string` – Target pathname.
- `target?: string` – Optional; behaves like an `<a>` attribute. Non-self targets don’t intercept navigation.
- Additional props are forwarded to `<a>` (e.g., `className`).

Behavior:

- Intercepts left-clicks without modifiers and calls the router’s navigation under the hood.

---

## ⚠️ Notes & limitations

- Routes are matched against `pathname` only; if you need query string or hash handling, parse them inside components.
- There’s no concept of nested layouts or outlet regions — keep components in control of rendering.
- Programmatic navigation is provided via the `Link` component; use it for in-app navigation.

---

## 📝 License

MIT © NextBale
