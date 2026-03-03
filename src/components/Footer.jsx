export default function Footer({ t }) {
  const f = t.footer
  return (
    <footer id="footer" className="bg-sage-900 text-sage-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🐾</span>
              <div>
                <span className="font-display text-white text-xl font-bold">Mari Diana Edwin Confidential</span>
                <span className="text-sage-400 text-xs block tracking-widest uppercase">Seguro</span>
              </div>
            </div>
            <p className="text-sage-400 text-sm leading-relaxed mb-5">{f.tagline}</p>
            <div className="flex gap-3">
              {[['F','Facebook'],['In','Instagram'],['X','X / Twitter'],['Li','LinkedIn']].map(([icon, label]) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 bg-sage-800 hover:bg-sage-600 rounded-full flex items-center justify-center text-sage-300 text-xs font-bold transition-colors">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 font-display">{f.contactTitle}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-sage-500 mt-0.5">📍</span>
                <span>{f.addr}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sage-500">✉️</span>
                <a href={`mailto:${f.email}`} className="hover:text-white transition-colors">{f.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sage-500">📞</span>
                <a href={`tel:${f.phone}`} className="hover:text-white transition-colors">{f.phone}</a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-5 font-display">
              {t.lang === 'es' ? 'Planes' : 'Plans'}
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Básico',    '599'],
                ['Estándar',  '700'],
                ['Premium',   '950'],
              ].map(([name, price]) => (
                <li key={name}>
                  <a href="#plans" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-sage-500 text-xs">→</span>
                    {name} — ${price} MXN/{t.lang === 'es' ? 'mes' : 'month'}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a href="#quote"
                  className="bg-amber-400 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-amber-500 transition-colors inline-block mt-1">
                  {f.quoteBtn}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-sage-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sage-500 text-xs">{f.legal}</p>
          <div className="flex gap-5">
            {f.links.map(l => (
              <a key={l} href="#" className="text-sage-500 hover:text-sage-300 text-xs transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
