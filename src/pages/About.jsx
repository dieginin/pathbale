import { Link } from "../components/Link"

const i18n = {
  es: {
    about: "Sobre mí",
    button_text: "Ir a Inicio",
    description: "Hola! Me llamo Diego y estoy creando un clon de React Router",
    pic_alt: "Foto de Diego",
  },
  en: {
    about: "About",
    button_text: "Go to Home",
    home: "Home",
    description: "Hi! I'm Diego and I'm creating a clone of React Router",
    pic_alt: "Diego's photo",
  },
}

const useI18n = (lang) => i18n[lang] || i18n.es

export default function AboutPage({ params }) {
  const t = useI18n(params.lang)

  return (
    <>
      <h1>{t.about}</h1>
      <div>
        <img
          src='https://pbs.twimg.com/profile_images/1751378324616577024/XFAwktyX_400x400.jpg'
          alt={t.pic_alt}
        />

        <p>{t.description}</p>
      </div>
      <Link to='/'>{t.button_text}</Link>
    </>
  )
}
