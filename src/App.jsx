import { useEffect, useState } from 'react'
import { translations } from './i18n'
import Navbar    from './components/Navbar'
import Hero      from './components/Hero'
import Stats     from './components/Stats'
import Benefits  from './components/Benefits'
import Plans     from './components/Plans'
import Quoter    from './components/Quoter'
import FAQ       from './components/FAQ'
import Footer    from './components/Footer'
import Checkout from './checkout/Checkout'
import { ClientPortal, VetPortal } from './checkout/Portals'
import { clearPolicy, planIds, readPolicy } from './checkout/demo'

export default function App() {
  const [lang, setLang] = useState('es')
  const t = translations[lang]
  const [hash, setHash] = useState(location.hash)
  const [policy, setPolicy] = useState(() => readPolicy())
  const [issuedDocs, setIssuedDocs] = useState(null)
  useEffect(() => {
    const update = () => setHash(location.hash)
    addEventListener('hashchange', update)
    return () => removeEventListener('hashchange', update)
  }, [])
  const params = new URLSearchParams(hash.slice(1))
  const planIndex = planIds.indexOf(params.get('contratar'))
  const isClientRoute = hash === '#cliente' || hash === '#cliente/aventuras'
  const isDemoRoute = planIndex >= 0 || isClientRoute || hash === '#veterinaria' || params.has('credencial')
  useEffect(() => {
    if (isDemoRoute) {
      window.scrollTo({top:0,behavior:'instant'})
      document.querySelector('main h1')?.focus({preventScroll:true})
    } else if (hash === '#plans') {
      document.getElementById('plans')?.scrollIntoView()
    }
  }, [hash,isDemoRoute])
  if (planIndex >= 0) return <Checkout key={hash} planIndex={planIndex} plans={translations.es.plans.items} onIssue={(issuedPolicy, docs) => { setPolicy(issuedPolicy); setIssuedDocs(docs) }}/>
  if (isClientRoute) return <ClientPortal section={hash === '#cliente/aventuras' ? 'adventures' : 'documents'} policy={policy} issuedDocs={issuedDocs} onClear={() => { clearPolicy(); setPolicy(null); setIssuedDocs(null) }}/>
  if (hash === '#veterinaria' || params.has('credencial')) return <VetPortal key={hash} policy={policy} initialToken={params.get('credencial')||''}/>

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
