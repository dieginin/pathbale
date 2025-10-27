import { navigateTo } from "../utils/paths"

export function Link({ target, to, ...props }) {
  const handleClick = (event) => {
    const isMainEvent = event.button === 0
    const isModifiedEvent =
      event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
    const isTargetSelf = !target || target === "_self"

    if (isMainEvent && isTargetSelf && !isModifiedEvent) {
      event.preventDefault()
      navigateTo(to)
    }
  }

  return <a href={to} onClick={handleClick} target={target} {...props} />
}
