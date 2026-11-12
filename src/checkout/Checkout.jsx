import { useEffect, useRef, useState } from 'react'
import { breeds, colors, fixture, issueDemoPolicy, planIds, savePolicy, validateProfile } from './demo'
import { downloadPdf, makeDocuments } from './documents'

import { actionClass, fieldClass } from './ui'
import PaymentForm from './PaymentForm'
import CheckoutConfirmation from './CheckoutConfirmation'

export function Shell({title,children}) {
  return <main className="min-h-screen bg-cream-100 px-4 py-8 sm:py-12 text-sage-900">
    <div className="max-w-3xl mx-auto">
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-6" aria-label="Demo PetCare">
        <a className="font-semibold" href="#plans">🐾 PetCare · Planes</a><a className="underline" href="#cliente">Portal cliente</a><a className="underline" href="#veterinaria">Vista veterinaria de prueba</a>
      </nav>
      <section className="bg-white rounded-3xl border border-sage-100 p-5 sm:p-9 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-sage-600 mb-2">Demostración · sin cobro real</p>
        <h1 tabIndex={-1} className="text-3xl sm:text-4xl mb-5">{title}</h1>
        {children}
      </section>
    </div>
  </main>
}
function Field({label,children}) { return <label className="block font-medium">{label}{children}</label> }
export function Documents({policy,initial}) {
  const [docs,setDocs]=useState(initial || null)
  const [error,setError]=useState('')
  useEffect(()=>{
    if (initial) return
    let live=true
    makeDocuments(policy).then(result=>{if(live)setDocs(result)}).catch(()=>{if(live)setError('No se pudieron preparar los PDF. Recarga para reintentar.')})
    return ()=>{live=false}
  },[policy,initial])
  return <div className="space-y-3">
    {error && <p role="alert" className="text-red-800">{error}</p>}
    {!docs && !error && <p role="status">Preparando los documentos…</p>}
    <div className="flex flex-wrap gap-3">
      <button disabled={!docs} className={actionClass} onClick={()=>downloadPdf(docs.policy,policy.policyId+'.pdf')}>Descargar póliza PDF</button>
      <button disabled={!docs} className="btn-outline disabled:opacity-50" onClick={()=>downloadPdf(docs.card,'carnet-'+policy.policyId+'.pdf')}>Descargar carnet con QR</button>
    </div>
  </div>
}

export default function Checkout({planIndex, plans, onIssue}) {
  const plan=plans[planIndex]
  const monthlyPrice=Number(plan.price)
  const [profile,setProfile]=useState({owner:'',email:'',dog:'',breed:'',color:''})
  const [step,setStep]=useState('profile')
  const [term,setTerm]=useState('monthly')
  const [scenario, setScenario] = useState('approved')
  const [confirmation, setConfirmation] = useState(null)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const pending=useRef(false)
  const section=useRef(null)
  useEffect(()=>{ section.current?.querySelector('[data-step-title]')?.focus() },[step])
  const bind=name=>({name,value:profile[name],onChange:e=>setProfile(current=>({...current,[name]:e.target.value})),className:fieldClass,required:true})
  async function confirm(event) {
    event.preventDefault()
    if (pending.current) return
    if (scenario === 'declined') {
      setError('Pago de prueba rechazado. Selecciona la tarjeta de aprobación para reintentar.')
      return
    }

    const checkoutRoute = location.hash
    pending.current = true
    setBusy(true)
    setError('')
    try {
      const policy = issueDemoPolicy({ profile, planId: planIds[planIndex], planName: plan.name, monthlyPrice, term })
      const docs = await makeDocuments(policy)
      if (location.hash !== checkoutRoute) return

      savePolicy(policy)
      onIssue(policy, docs)
      setConfirmation({ policy, documents: docs })
      setStep('confirmed')
      try {
        downloadPdf(docs.policy, policy.policyId + '.pdf')
      } catch {
        // The confirmation keeps a download button if the browser blocks the automatic download.
      }
    } catch {
      setError('No pudimos completar la emisión. Revisa los datos y vuelve a intentar.')
    } finally {
      pending.current = false
      setBusy(false)
    }
  }
  return <Shell title={step === 'confirmed' ? 'Bienvenido a PetCare' : 'Contratar · ' + plan.name}>
    <div ref={section} className="space-y-4">
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
      {step==='profile' && <>
        <h2 data-step-title tabIndex={-1} className="text-xl">1. Datos del titular y del perro</h2>
        <p>Usa datos ficticios. Este registro de prueba queda en esta pestaña.</p>
        <button type="button" className="underline text-sage-700" onClick={()=>{setProfile({...fixture});setError('')}}>Usar datos de ejemplo</button>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={e=>{e.preventDefault();const problem=validateProfile(profile);setError(problem);if(!problem)setStep('payment')}}>
          <Field label="Nombre del titular"><input {...bind('owner')} maxLength={64} autoComplete="off"/></Field>
          <Field label="Correo ficticio"><input {...bind('email')} type="email" maxLength={80} placeholder="elena@petcare.test" autoComplete="off"/></Field>
          <Field label="Nombre del perro"><input {...bind('dog')} maxLength={64}/></Field>
          <Field label="Raza"><select {...bind('breed')}><option value="">Selecciona una raza</option>{breeds.map(b=><option key={b}>{b}</option>)}</select></Field>
          <Field label="Color"><select {...bind('color')}><option value="">Selecciona un color</option>{colors.map(c=><option key={c}>{c}</option>)}</select></Field>
          <div className="sm:col-span-2"><button className={actionClass}>Continuar al checkout</button></div>
        </form>
      </>}
      {confirmation && <CheckoutConfirmation {...confirmation} />}
      {step === 'payment' && (
        <PaymentForm
          profile={profile}
          monthlyPrice={monthlyPrice}
          term={term}
          setTerm={setTerm}
          scenario={scenario}
          setScenario={value => { setScenario(value); setError('') }}
          busy={busy}
          onBack={() => { setError(''); setStep('profile') }}
          onSubmit={confirm}
        />
      )}
    </div>
  </Shell>
}
