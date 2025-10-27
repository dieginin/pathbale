import { useEffect } from "react"

export default function SearchPage({ params }) {
  useEffect(() => {
    document.title = `Buscando: ${params.query}`
  }, [params])

  return <h1>Has buscado: {params.query}</h1>
}
