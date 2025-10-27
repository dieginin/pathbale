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

  it("should render 404 if no route match", () => {
    render(<Router notFoundPage={() => <h1>404</h1>} />)
    expect(screen.getByText("404")).toBeTruthy()
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
    getCurrentPath.mockReturnValueOnce("/")

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
})
