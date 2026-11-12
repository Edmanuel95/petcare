import { useEffect, useRef, useState } from 'react'
import { breeds, colors, fixture, issueDemoPolicy, planIds, savePolicy, validateProfile } from './demo'
import { downloadPdf, makeDocuments } from './documents'

export const money = amount => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(amount)
export const fieldClass = 'block w-full mt-1 rounded-xl border border-sage-300 bg-white p-3 focus:outline-sage-500'
export const actionClass = 'btn-primary disabled:opacity-50'
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
  const [accepted,setAccepted]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [result,setResult]=useState(null)
  const pending=useRef(false)
  const section=useRef(null)
  useEffect(()=>{ section.current?.querySelector('[data-step-title]')?.focus() },[step])
  const bind=name=>({name,value:profile[name],onChange:e=>setProfile(current=>({...current,[name]:e.target.value})),className:fieldClass,required:true})
  async function confirm(event) {
    event.preventDefault()
    if (!accepted || pending.current) return
    pending.current=true
    setBusy(true);setError('')
    try {
      const policy=issueDemoPolicy({profile,planId:planIds[planIndex],planName:plan.name,monthlyPrice,term})
      const docs=await makeDocuments(policy)
      savePolicy(policy)
      onIssue(policy)
      setResult({policy,docs})
      setStep('issued')
    } catch (e) {
      setError(e instanceof DOMException ? 'Habilita el almacenamiento de sesión para guardar la prueba.' : 'No pudimos completar la emisión. Revisa los datos y vuelve a intentar.')
    } finally {pending.current=false;setBusy(false)}
  }
  return <Shell title={'Contratar · '+plan.name}>
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
      {step==='payment' && <form className="space-y-4" onSubmit={confirm}>
        <h2 data-step-title tabIndex={-1} className="text-xl">2. Revisar y pagar en modo de prueba</h2>
        <p>{profile.owner} · {profile.dog} ({profile.breed}, {profile.color}) · {profile.email}</p>
        <fieldset className="space-y-2" disabled={busy}>
          <legend className="font-semibold mb-2">Vigencia del plan</legend>
          <label className="block"><input type="radio" name="term" value="monthly" checked={term==='monthly'} onChange={()=>setTerm('monthly')}/> Mensual · {money(monthlyPrice)} MXN</label>
          <label className="block"><input type="radio" name="term" value="annual" checked={term==='annual'} onChange={()=>setTerm('annual')}/> Anual · {money(monthlyPrice*12)} MXN</label>
        </fieldset>
        <p className="rounded-xl bg-sage-50 p-4 font-semibold">Total simulado: {money(monthlyPrice*(term==='annual'?12:1))} MXN</p>
        <label className="block"><input type="checkbox" required checked={accepted} disabled={busy} onChange={e=>setAccepted(e.target.checked)}/> Entiendo que el pago y la póliza son de prueba.</label>
        <div className="flex flex-wrap gap-3"><button type="button" className="btn-outline" disabled={busy} onClick={()=>{setError('');setAccepted(false);setStep('profile')}}>Editar datos</button>
          <button disabled={busy||!accepted} className={actionClass}>{busy?'Preparando póliza y carnet…':'Simular pago y emitir'}</button></div>
      </form>}
      {step==='issued' && <div className="space-y-4">
        <h2 data-step-title tabIndex={-1} className="text-xl">3. Póliza emitida para {result.policy.dog}</h2>
        <p role="status">Pago simulado aprobado. Tus dos PDF están listos.</p>
        <dl className="space-y-2 rounded-xl bg-sage-50 p-4 break-words">
          <div><dt className="font-semibold">Folio</dt><dd>{result.policy.policyId}</dd></div>
          <div><dt className="font-semibold">ID del titular</dt><dd>{result.policy.memberId}</dd></div>
          <div><dt className="font-semibold">Vigencia</dt><dd>{result.policy.started} a {result.policy.expires} (fin exclusivo)</dd></div>
        </dl>
        <Documents policy={result.policy} initial={result.docs}/>
        <a href="#cliente" className="inline-block underline">Continuar al portal cliente</a>
      </div>}
    </div>
  </Shell>
}
