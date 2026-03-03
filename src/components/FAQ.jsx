import { useState } from 'react'

export default function FAQ({ t }) {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = i => setOpenIdx(openIdx === i ? null : i)

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <p className="text-sage-500 text-sm font-medium tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="font-display text-3xl md:text-4xl text-sage-800 leading-tight mb-4">
            {t.faq.title}
          </h2>
          <p className="text-sage-600 text-lg font-light">{t.faq.sub}</p>
        </div>

        <div className="space-y-3">
          {t.faq.items.map((item, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i}
                className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen ? 'border-sage-400 shadow-sm' : 'border-sage-100 hover:border-sage-200'
                }`}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-5 text-left group">
                  <span className={`font-semibold text-base pr-4 transition-colors ${
                    isOpen ? 'text-sage-700' : 'text-sage-800 group-hover:text-sage-600'
                  }`}>
                    {item.q}
                  </span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? 'bg-sage-500 text-white rotate-45' : 'bg-sage-100 text-sage-500'
                  }`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className={`faq-body ${isOpen ? 'open' : ''}`}>
                  <p className="px-5 pb-5 text-sage-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
