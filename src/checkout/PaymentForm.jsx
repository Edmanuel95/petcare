import { actionClass, fieldClass, money } from './ui'

const testCards = {
  approved: { number: '4242 4242 4242 4242', expiry: '12/39', cvc: '123' },
  declined: { number: '4000 0000 0000 0002', expiry: '12/39', cvc: '123' },
}

export default function PaymentForm({ profile, monthlyPrice, term, setTerm, scenario, setScenario, busy, onBack, onSubmit }) {
  const card = testCards[scenario]
  const total = monthlyPrice * (term === 'annual' ? 12 : 1)

  return (
    <form className="space-y-5" onSubmit={onSubmit} autoComplete="off">
      <div>
        <h2 data-step-title tabIndex={-1} className="text-2xl">Pago con tarjeta de prueba</h2>
        <p className="mt-1 text-sm">{profile.owner} · {profile.dog} ({profile.breed}, {profile.color})</p>
      </div>
      <fieldset className="space-y-2" disabled={busy}>
        <legend className="font-semibold mb-2">Vigencia del plan</legend>
        <label className="block"><input type="radio" name="term" value="monthly" checked={term === 'monthly'} onChange={() => setTerm('monthly')} /> Mensual · {money(monthlyPrice)} MXN</label>
        <label className="block"><input type="radio" name="term" value="annual" checked={term === 'annual'} onChange={() => setTerm('annual')} /> Anual · {money(monthlyPrice * 12)} MXN</label>
      </fieldset>
      <fieldset className="rounded-2xl border border-sage-200 p-4 space-y-3" disabled={busy}>
        <legend className="px-2 font-semibold">Datos de la tarjeta</legend>
        <label className="block">
          Tarjeta de prueba
          <select className={fieldClass} value={scenario} onChange={event => setScenario(event.target.value)}>
            <option value="approved">Visa de prueba · pago aprobado</option>
            <option value="declined">Visa de prueba · pago rechazado</option>
          </select>
        </label>
        <label className="block">Titular de la tarjeta<input className={fieldClass} value={profile.owner} readOnly /></label>
        <label className="block">Número de tarjeta<input className={fieldClass} value={card.number} readOnly /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">Vencimiento<input className={fieldClass} value={card.expiry} readOnly /></label>
          <label className="block">CVC<input className={fieldClass} value={card.cvc} readOnly /></label>
        </div>
      </fieldset>
      <p className="rounded-xl bg-sage-50 p-4 font-semibold">Total simulado: {money(total)} MXN</p>
      <label className="block">
        <input type="checkbox" required disabled={busy} /> Acepto emitir una póliza de prueba con un pago simulado.
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-outline" disabled={busy} onClick={onBack}>Editar datos</button>
        <button type="submit" className={actionClass} disabled={busy}>
          {busy ? 'Preparando póliza y carnet…' : 'Pagar ' + money(total) + ' MXN · prueba'}
        </button>
      </div>
    </form>
  )
}
