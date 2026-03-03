export default function Hero({ t }) {
  return (
    <section
      className="paw-bg min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#f0f7f0 0%,#faf7ef 50%,#ddeedd 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">

          {/* Left */}
          <div className="space-y-6">
            <div className="fade-up inline-flex items-center gap-2 bg-sage-100 text-sage-700
                            rounded-full px-4 py-1.5 text-sm font-medium border border-sage-200">
              <span className="w-2 h-2 rounded-full bg-sage-500 pulse-dot" />
              {t.hero.badge}
            </div>

            <h1 className="fade-up-2 font-display text-4xl sm:text-5xl lg:text-6xl text-sage-900 leading-tight">
              {t.hero.title}<br />
              <em className="text-sage-500 not-italic">{t.hero.accent}</em>
            </h1>

            <p className="fade-up-3 text-sage-700 text-lg font-light leading-relaxed max-w-lg">
              {t.hero.subtitle}
            </p>

            <div className="fade-up-4 flex flex-col sm:flex-row gap-4">
              <a href="#quote" className="btn-primary">{t.hero.cta}</a>
              <a href="#plans" className="btn-outline">{t.hero.cta2}</a>
            </div>

            <div className="flex flex-wrap gap-5 fade-up-4">
              {t.hero.trusts.map((tr, i) => (
                <div key={i} className="flex items-center gap-2 text-sage-600 text-sm">
                  <svg className="w-4 h-4 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {tr}
                </div>
              ))}
            </div>
          </div>

          {/* Right — image collage */}
          <div className="relative h-[460px] hidden lg:block">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=640&q=80"
                alt="Happy dog"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1548366086-7f1b76106622?w=480&q=80"
                alt="Vet with cat"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-4 border border-sage-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center text-xl">🐾</div>
                <div>
                  <p className="text-sage-800 font-semibold text-sm">{t.hero.cardLabel}</p>
                  <p className="text-sage-500 font-display text-lg font-bold">$100,000 MXN</p>
                </div>
              </div>
            </div>
            <div className="absolute top-12 left-12 bg-amber-400 text-white text-xs font-bold rounded-full px-3 py-1 shadow-md">
              desde $700 MXN/mes
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
