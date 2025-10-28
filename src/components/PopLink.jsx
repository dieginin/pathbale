import { goBack } from "../utils/paths"

export function PopLink({ ...props }) {
  return <a href='#' onClick={goBack} {...props} />
}
