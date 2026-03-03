import { useState } from 'react'

// ── Actuarial recommendation engine ──────────────────────────
// Based on PDF: freq 22%, severity $9,500 MXN, age risk factors
function recommend(ageKey, budgetKey) {
  const ageRisk = { a0: 0.7, a1: 1.0, a2: 1.4, a3: 1.8 }
  const risk = ageRisk[ageKey] ?? 1.0
  if (ageKey === 'a3') return { planIdx: null, price: null, risk }
  if (budgetKey === 'b1') return { planIdx: 0, price: '599', risk }
  if (budgetKey === 'b3') return { planIdx: 2, price: '950', risk }
  return risk <= 1.0
    ? { planIdx: 1, price: '700', risk }
    : { planIdx: 2, price: '950', risk }
}

function riskLabel(risk, q) {
  if (risk <= 0.7) return q.riskLow
  if (risk <= 1.0) return q.riskMod
  if (risk <= 1.4) return q.riskHigh
  return q.riskVH
}

function SelectBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
        active ? 'border-sage-500 bg-sage-50 text-sage-800' : 'border-sage-100 text-sage-600 hover:border-sage-300'
      }`}>
      {children}
    </button>
  )
}

export default function Quoter({ t }) {
  const [petType, setPetType]   = useState('')
  const [ageKey,  setAgeKey]    = useState('')
  const [budget,  setBudget]    = useState('')
  const [result,  setResult]    = useState(null)

  const q = t.quote
  const ready = petType && ageKey && budget

  const calc = () => {
    if (!ready) return
    setResult(recommend(ageKey, budget))
    setTimeout(() => document.getElementById('quote-result')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120)
  }

  const reset = () => { setPetType(''); setAgeKey(''); setBudget(''); setResult(null) }

  const planName = result?.planIdx != null ? t.plans.items[result.planIdx]?.name : null

  return (
    <section id="quote" className="py-20 bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <p className="text-sage-500 text-sm font-medium tracking-widest uppercase mb-3">{q.eyebrow}</p>
          <h2 className="font-display text-3xl md:text-4xl text-sage-800 leading-tight mb-4">{q.title}</h2>
          <p className="text-sage-600 text-lg font-light">{q.sub}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-sage-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Q1 Pet type */}
            <div>
              <label className="block text-sage-700 font-semibold text-sm mb-4">{q.pLabel}</label>
              <div className="flex flex-col gap-3">
                {q.pets.map(o => (
                  <SelectBtn key={o.k} active={petType === o.k} onClick={() => setPetType(o.k)}>
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{o.l.split(' ')[0]}</span>
                      <span>{o.l.split(' ').slice(1).join(' ')}</span>
                    </span>
                  </SelectBtn>
                ))}
              </div>
            </div>

            {/* Q2 Age */}
            <div>
              <label className="block text-sage-700 font-semibold text-sm mb-4">{q.aLabel}</label>
              <div className="flex flex-col gap-2">
                {q.ages.map(o => (
                  <SelectBtn key={o.k} active={ageKey === o.k} onClick={() => setAgeKey(o.k)}>
                    {o.l}
                  </SelectBtn>
                ))}
              </div>
            </div>

            {/* Q3 Budget */}
            <div>
              <label className="block text-sage-700 font-semibold text-sm mb-4">{q.bLabel}</label>
              <div className="flex flex-col gap-3">
                {q.budgets.map(o => (
                  <SelectBtn key={o.k} active={budget === o.k} onClick={() => setBudget(o.k)}>
                    {o.l}
                  </SelectBtn>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={calc}
              disabled={!ready}
              className={`btn-primary transition-opacity ${!ready ? 'opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-lg' : ''}`}>
              {q.calcBtn}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div id="quote-result" className="mt-8">
            {!planName ? (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-8 text-center space-y-3">
                <p className="text-5xl">💬</p>
                <p className="font-display text-2xl text-sage-800">{q.warningAge}</p>
                <a href="#footer" className="btn-primary mt-3">{q.contactAdvisor}</a>
              </div>
            ) : (
              <div className="bg-sage-800 text-white rounded-3xl p-8 text-center space-y-4 quote-pulse">
                <p className="text-sage-300 text-sm uppercase tracking-widest">{q.resultLabel}</p>
                <p className="font-display text-5xl font-bold text-amber-400">{planName}</p>
                <p className="text-sage-200">
                  <span className="text-3xl font-bold text-white">${result.price}</span>
                  <span className="text-sage-300"> MXN/{t.lang === 'es' ? 'mes' : 'month'}</span>
                </p>
                <div className="inline-flex items-center gap-2 bg-sage-700 rounded-full px-4 py-1.5 text-sm text-sage-200">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  {q.riskLabel} <strong className="text-white ml-1">{riskLabel(result.risk, q)}</strong>
                </div>
                <p className="text-sage-400 text-xs">{q.resultSub}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                  <a href="#plans"
                    className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-8 py-3 rounded-full transition-colors">
                    {q.contractBtn}
                  </a>
                  <button onClick={reset}
                    className="border-2 border-sage-500 text-sage-300 hover:bg-sage-700 font-medium px-8 py-3 rounded-full transition-colors">
                    {q.resetBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-sage-400 text-xs mt-4">{q.note}</p>
      </div>
    </section>
  )
}
