import { useEffect, useRef } from 'react'

export default function Benefits({ t }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.13 }
    )
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [t])

  return (
    <section id="benefits" className="py-20 bg-cream-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-14 reveal">
          <p className="text-sage-500 text-sm font-medium tracking-widest uppercase mb-3">
            {t.benefits.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-sage-800 leading-tight mb-4">
            {t.benefits.title}
          </h2>
          <p className="text-sage-600 text-lg font-light leading-relaxed">{t.benefits.sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.benefits.items.map((item, i) => (
            <div key={i}
              className={`card border border-sage-100 hover:border-sage-300 group reveal delay-${(i % 4) + 1}`}>
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">
                {item.icon}
              </div>
              <h3 className="font-display text-lg text-sage-800 mb-2">{item.title}</h3>
              <p className="text-sage-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Banner image */}
        <div className="mt-16 rounded-3xl overflow-hidden h-56 relative">
          <img
            src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1200&q=80"
            alt="Veterinarian with pet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-sage-900/40 flex items-center justify-center">
            <p className="font-display text-white text-2xl md:text-3xl text-center px-4">
              {t.benefits.banner}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
