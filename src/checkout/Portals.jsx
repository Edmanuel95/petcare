import { useEffect, useRef, useState } from 'react'
import { Documents, Shell } from './Checkout'
import { actionClass, fieldClass, money } from './ui'
import { credentialUrl, distanceMeters, resolveCredential } from './demo'

export function ClientPortal({ policy, issuedDocs, onClear }) {
  return <Shell title="Portal cliente de prueba">
    {policy ? <div className="space-y-5">
      <p><strong>{policy.dog}</strong> · {policy.breed} · {policy.color} · Póliza de prueba hasta {policy.expires}</p>
      {issuedDocs && (
        <div role="status" className="rounded-xl border border-sage-200 bg-sage-50 p-4">
          <p className="font-semibold"><span aria-hidden="true">✓ </span>Pago de prueba aprobado</p>
          <p className="mt-1 text-sm">{money(policy.total)} MXN · Folio {policy.policyId}</p>
          <p className="mt-2 text-sm">Puedes volver a descargar la póliza o guardar el carnet con QR desde aquí.</p>
        </div>
      )}
      <Documents key={policy.policyId} policy={policy} initial={issuedDocs} />
      <a className="underline block" href={credentialUrl(policy)}>Abrir el enlace de identificación del QR</a>
      <Adventures key={policy.policyId}/>
      <button className="underline text-sm" onClick={onClear}>Cerrar sesión de prueba y borrar los datos de esta pestaña</button>
    </div> : <p>Aún no hay una póliza en esta pestaña. <a className="underline" href="#plans">Elige un plan de prueba</a>.</p>}
  </Shell>
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

function Adventures() {
  const watch=useRef(null)
  const last=useRef(null)
  const start=useRef(0)
  const distance=useRef(0)
  const photoUrls=useRef(new Set())
  const [tracking,setTracking]=useState(false)
  const [meters,setMeters]=useState(0)
  const [fixes,setFixes]=useState(0)
  const [error,setError]=useState('')
  const [photo,setPhoto]=useState(null)
  const [walks,setWalks]=useState([])
  useEffect(()=>()=> {
    if(watch.current!==null) navigator.geolocation.clearWatch(watch.current)
    for(const url of photoUrls.current) URL.revokeObjectURL(url)
  },[])
  function begin() {
    if (!navigator.geolocation) {setError('Este navegador no ofrece GPS.');return}
    if(watch.current!==null) return
    setError('');setFixes(0);setMeters(0);distance.current=0;last.current=null;start.current=Date.now();setTracking(true)
    watch.current=navigator.geolocation.watchPosition(({coords})=>{
      if (coords.accuracy > 65) return
      const point={lat:coords.latitude,lng:coords.longitude}
      if(last.current) {
        const delta=distanceMeters(last.current,point)
        if(delta<8) return
        distance.current+=delta
        setMeters(Math.round(distance.current))
      }
      last.current=point
      setFixes(n=>n+1)
    },()=>setError('No se recibió ubicación. Revisa el permiso de GPS y la señal.'),{enableHighAccuracy:true,maximumAge:0,timeout:15000})
  }
  function stop() {
    if (watch.current===null) return
    navigator.geolocation.clearWatch(watch.current);watch.current=null;setTracking(false)
    const url=photo ? URL.createObjectURL(photo) : ''
    if(url) photoUrls.current.add(url)
    setWalks(current=>[{
      id:crypto.randomUUID(),minutes:Math.round((Date.now()-start.current)/60000),
      meters:fixes>=2?Math.round(distance.current):null,url
    },...current])
    last.current=null;setPhoto(null)
  }
  return <section className="border-t border-sage-100 pt-5 space-y-3">
    <h2 className="text-xl">Aventuras con GPS</h2>
    <p>La distancia es aproximada. La ubicación y las fotos se quedan en esta pantalla; puedes probar con una imagen de ejemplo.</p>
    <label className="block">Foto opcional<input type="file" accept="image/jpeg,image/png,image/webp" className={fieldClass} key={walks.length} onChange={e=>{
      const file=e.target.files?.[0]
      if(file && (!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5000000)) {
        setError('Elige JPG, PNG o WebP de hasta 5 MB.');e.target.value='';setPhoto(null);return
      }
      setError('');setPhoto(file||null)
    }}/></label>
    {tracking ? <button className={actionClass} onClick={stop}>Terminar aventura · {meters} m</button> : <button className={actionClass} onClick={begin}>Iniciar aventura con GPS</button>}
    {error && <p role="status" className="text-red-800">{error}</p>}
    {walks.length>0 && <ul className="space-y-2">{walks.map(w=><li key={w.id} className="rounded-lg bg-sage-50 p-3">
      {w.minutes} min · {w.meters===null?'distancia sin señal suficiente':w.meters+' m'}
      {w.url && <img src={w.url} className="mt-2 max-h-48 rounded-lg" alt="Foto de la aventura"/>}
    </li>)}</ul>}
  </section>
}
