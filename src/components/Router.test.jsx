import { beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { Link } from "./Link"
import { Route } from "./Route"
import { Router } from "./Router"
import { getCurrentPath } from "../utils/paths"

vi.mock("../utils/paths", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getCurrentPath: vi.fn(),
  }
})

describe("Router", () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it("should render", () => {
    render(<Router />)
    expect(true).toBeTruthy()
  })

  it("should render the component of the first route that matches", () => {
    getCurrentPath.mockReturnValue("/about")

    const routes = [
      { path: "/", component: () => <h1>Home</h1> },
      { path: "/about", component: () => <h1>About</h1> },
    ]
    render(<Router routes={routes} />)
    expect(screen.getByText("About")).toBeTruthy()
  })

  it("should navigate using Links", async () => {
    getCurrentPath.mockReturnValueOnce("/").mockReturnValue("/about")

    render(
      <Router>
        <Route
          path='/'
          component={() => {
            return (
              <>
                <h1>Home</h1>
                <Link to='/about'>Go to About</Link>
              </>
            )
          }}
        />
        <Route path='/about' component={() => <h1>About</h1>} />
      </Router>
    )

    screen.getByText("Go to About").click()

    expect(await screen.findByText("About")).toBeTruthy()
  })

  it("should render not found page", () => {
    getCurrentPath.mockReturnValue("/non-existent-route")

    render(
      <Router>
        <Route path='/' component={() => <h1>Home</h1>} />
      </Router>
    )

    expect(screen.getByText("404 - Not Found")).toBeTruthy()
  })

  it("should render not custom found page", () => {
    getCurrentPath.mockReturnValue("/non-existent-route")

    render(
      <Router notFoundPage={() => <h1>Custom 404 Page</h1>}>
        <Route path='/' component={() => <h1>Home</h1>} />
      </Router>
    )

    expect(screen.getByText("Custom 404 Page")).toBeTruthy()
  })

  it("should redirect from a protected route when guard denies", async () => {
    getCurrentPath.mockReturnValueOnce("/private").mockReturnValue("/login")

    render(
      <Router>
        <Route path='/login' component={() => <h1>Login</h1>} />
        <Route
          path='/private'
          component={() => <h1>Secret</h1>}
          guard={() => false}
          redirectTo='/login'
        />
      </Router>
    )

    expect(await screen.findByText("Login")).toBeTruthy()
  })

  it("should render a protected route when guard allows", async () => {
    getCurrentPath.mockReturnValue("/private")

    render(
      <Router>
        <Route
          path='/private'
          component={() => <h1>Secret</h1>}
          guard={() => true}
        />
      </Router>
    )

    expect(await screen.findByText("Secret")).toBeTruthy()
  })

  it("should render forbidden page when guard does not allow", () => {
    getCurrentPath.mockReturnValue("/private")

    render(
      <Router>
        <Route
          path='/private'
          component={() => <h1>Secret</h1>}
          guard={() => false}
        />
      </Router>
    )

    expect(screen.getByText("403 - Forbidden")).toBeTruthy()
  })

  it("should render custom forbidden page when guard does not allow", () => {
    getCurrentPath.mockReturnValue("/private")

    render(
      <Router forbiddenPage={() => <h1>Not Allowed</h1>}>
        <Route
          path='/private'
          component={() => <h1>Secret</h1>}
          guard={() => false}
        />
      </Router>
    )
    expect(screen.getByText("Not Allowed")).toBeTruthy()
  })
})
