import { Link } from "../components/Link"

export default function Page404() {
  return (
    <>
      <div>
        <h1>404 - Not Found</h1>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <img
          src='https://midu.dev/images/this-is-fine-404.gif'
          alt='GIF del perro de This is Fine quemándose vivo'
        />
      </div>
      <Link to='/'>Volver a Home</Link>
    </>
  )
}
