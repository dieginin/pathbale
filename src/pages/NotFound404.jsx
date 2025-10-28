import { PopLink } from "../components/PopLink"

export default function NotFound404() {
  return (
    <div className='container'>
      <h1 className='code'>404</h1>
      <p className='message'>Page not found</p>
      <PopLink>Go back</PopLink>
    </div>
  )
}
