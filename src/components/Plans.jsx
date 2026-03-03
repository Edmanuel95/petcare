export default function Plans({ t }) {
  return (
    <section id="plans" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sage-500 text-sm font-medium tracking-widest uppercase mb-3">
            {t.plans.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-sage-800 leading-tight mb-4">
            {t.plans.title}
          </h2>
          <p className="text-sage-600 text-lg font-light leading-relaxed">{t.plans.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {t.plans.items.map((plan, i) => (
            <div key={i}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                plan.featured
                  ? 'plan-featured bg-sage-800 text-white'
                  : 'bg-white border-2 border-sage-100 shadow-sm hover:shadow-md hover:border-sage-200'
              }`}>

              {plan.featured && (
                <div className="bg-amber-400 text-white text-xs font-bold text-center py-1.5 tracking-wide">
                  ⭐ {t.plans.popular}
                </div>
              )}

              <div className="p-7">
                <h3 className={`font-display text-2xl mb-1 ${plan.featured ? 'text-white' : 'text-sage-800'}`}>
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-end gap-1 my-5">
                  <span className={`text-sm font-medium ${plan.featured ? 'text-sage-300' : 'text-sage-500'}`}>$</span>
                  <span className={`font-display text-5xl font-bold leading-none ${plan.featured ? 'text-amber-400' : 'text-sage-700'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1 ${plan.featured ? 'text-sage-300' : 'text-sage-500'}`}>
                    MXN{t.plans.perMonth}
                  </span>
                </div>

                {/* Actuarial key data */}
                <div className={`space-y-2 mb-6 p-4 rounded-xl text-sm ${plan.featured ? 'bg-sage-700' : 'bg-sage-50'}`}>
                  {[
                    [t.plans.labelSum, plan.sum],
                    [t.plans.labelDed, plan.ded],
                    [t.plans.labelCo,  plan.co],
                    ['Loss Ratio',     plan.lr],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className={plan.featured ? 'text-sage-300' : 'text-sage-500'}>{k}</span>
                      <span className={`font-semibold ${plan.featured ? 'text-white' : 'text-sage-800'}`}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${plan.featured ? 'text-sage-300' : 'text-sage-500'}`}>
                  {t.plans.includes}
                </p>
                <ul className="space-y-2 mb-7">
                  {plan.feats.map((f, j) => (
                    <li key={j} className={`flex items-start gap-2 text-sm ${plan.featured ? 'text-sage-200' : 'text-sage-600'}`}>
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.featured ? 'text-amber-400' : 'text-sage-400'}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href="#quote"
                  className={`block text-center py-3 rounded-full font-semibold transition-all duration-200 ${
                    plan.featured
                      ? 'bg-amber-400 hover:bg-amber-500 text-white shadow-lg hover:shadow-xl'
                      : 'border-2 border-sage-400 text-sage-600 hover:bg-sage-500 hover:text-white hover:border-sage-500'
                  }`}>
                  {t.plans.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sage-400 text-xs mt-6">{t.plans.note}</p>
      </div>
    </section>
  )
}
