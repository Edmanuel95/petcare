import { useState } from 'react'
import { translations } from './i18n'
import Navbar    from './components/Navbar'
import Hero      from './components/Hero'
import Stats     from './components/Stats'
import Benefits  from './components/Benefits'
import Plans     from './components/Plans'
import Quoter    from './components/Quoter'
import FAQ       from './components/FAQ'
import Footer    from './components/Footer'

export default function App() {
  const [lang, setLang] = useState('es')
  const t = translations[lang]

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar t={t} lang={lang} setLang={setLang} />
      <Hero     t={t} />
      <Stats    t={t} />
      <Benefits t={t} />
      <Plans    t={t} />
      <Quoter   t={t} />
      <FAQ      t={t} />
      <Footer   t={t} />
    </div>
  )
}
