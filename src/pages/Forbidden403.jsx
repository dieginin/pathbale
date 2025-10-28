import { PopLink } from "../components/PopLink"

export default function Forbidden403() {
  return (
    <div className='container'>
      <h1 className='code'>403</h1>
      <p className='message'>Access denied</p>
      <PopLink>Go back</PopLink>
    </div>
  )
}
