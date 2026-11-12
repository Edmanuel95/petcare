import { useState } from 'react'
import { Documents, Shell } from './Checkout'
import { actionClass, fieldClass } from './ui'
import { credentialUrl, resolveCredential } from './demo'

export function ClientPortal({ policy, issuedDocs, onClear }) {
  return (
    <Shell title="Portal del cliente">
      {policy ? (
        <div className="space-y-5">
          <div className="rounded-2xl bg-sage-900 p-5 text-white sm:p-6">
            <p className="text-sm text-cream-200">Plan {policy.planName} · Póliza de prueba</p>
            <h2 className="mt-1 break-words font-display text-3xl">{policy.dog}</h2>
            <p className="mt-2 text-sm text-cream-100">{policy.breed} · {policy.color} · Vigencia hasta {policy.expires}</p>
          </div>
          <section aria-labelledby="client-documents">
            <h2 id="client-documents" className="mb-3 text-xl">Mi póliza y carnet</h2>
            <Documents key={policy.policyId} policy={policy} initial={issuedDocs} />
            <a className="mt-3 inline-block underline" href={credentialUrl(policy)}>Abrir el enlace de identificación del QR</a>
          </section>
          <button className="underline text-sm" onClick={onClear}>Cerrar sesión de prueba y borrar los datos de esta pestaña</button>
        </div>
      ) : (
        <div className="space-y-4">
          <p>Emite una póliza de prueba en esta pestaña para descargar tus documentos.</p>
          <a className="btn-primary" href="#plans">Elegir un plan de prueba</a>
        </div>
      )}
    </Shell>
  )
}

export function VetPortal({policy,initialToken=''}) {
  const [input,setInput]=useState(initialToken)
  const [token,setToken]=useState(initialToken)
  const [network,setNetwork]=useState('')
  const [decision,setDecision]=useState('')
  const info=token ? resolveCredential(token,policy) : null
  return <Shell title="Consulta veterinaria de prueba">
    <p className="mb-4">Abre el enlace del QR o pega la referencia. La demo consulta el carnet emitido en esta pestaña.</p>
    <form className="space-y-3" onSubmit={e=>{
      e.preventDefault()
      const value=input.trim()
      let parsed=value
      try {parsed=new URLSearchParams(new URL(value).hash.slice(1)).get('credencial')||''} catch {}
      setToken(parsed || 'invalid')
      setNetwork('');setDecision('')
    }}>
      <label className="block">Enlace del carnet o referencia<input className={fieldClass} value={input} onChange={e=>setInput(e.target.value)} maxLength={300} required/></label>
      <button className={actionClass}>Consultar carnet</button>
    </form>
    {info && <div className="mt-5 rounded-xl bg-sage-50 p-4 space-y-3" role="region" aria-label="Resultado del carnet">
      {info.status==='unavailable' ? <p role="status">No encontramos el carnet en esta pestaña.</p> : <>
        <p><strong>{info.dog}</strong> · {info.breed} · {info.color}</p>
        <p role="status">Vigencia de prueba: {info.status==='active'?'vigente':'vencida'} · hasta {info.expires}.</p>
        {info.status==='active' && <>
          <label className="block">Convenio veterinario de prueba<select className={fieldClass} value={network} onChange={e=>{setNetwork(e.target.value);setDecision('')}}>
            <option value="">Selecciona el caso</option><option value="in">Clínica en red</option><option value="out">Clínica fuera de red</option>
          </select></label>
          <div className="flex flex-wrap gap-3">
            <button className={actionClass} disabled={network!=='in'} onClick={()=>setDecision('Atención aceptada en esta demostración.')}>Aceptar en red</button>
            <button className="btn-outline" disabled={!network} onClick={()=>setDecision(network==='out'?'Atención no aceptada por red: clínica fuera de convenio.':'Atención declinada por la clínica.')}>Declinar</button>
          </div>
          {decision && <p role="status">{decision}</p>}
        </>}
      </>}
    </div>}
  </Shell>
}
