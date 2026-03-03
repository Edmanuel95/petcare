import { useState, useEffect } from 'react'

export default function Navbar({ t, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: t.nav.benefits, href: '#benefits' },
    { label: t.nav.plans,    href: '#plans'    },
    { label: t.nav.quote,    href: '#quote'    },
    { label: t.nav.faq,      href: '#faq'      },
    { label: t.nav.contact,  href: '#footer'   },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🐾</span>
            <div className="leading-none">
              <span className="font-display text-sage-800 font-bold text-lg">Mari Diana Edwin Confidential</span>
              <span className="text-sage-500 text-xs block tracking-widest uppercase">Seguro</span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="text-sage-700 hover:text-sage-500 font-medium transition-colors text-sm tracking-wide">
                {l.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Lang toggle */}
            <div className="flex rounded-full border border-sage-200 overflow-hidden text-xs font-medium">
              {['es','en'].map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1.5 transition-colors uppercase ${
                    lang === l ? 'bg-sage-500 text-white' : 'text-sage-600 hover:text-sage-800'
                  }`}>
                  {l}
                </button>
              ))}
            </div>

            <a href="#quote"
              className="hidden md:inline-flex btn-primary text-sm !py-2 !px-5">
              {t.nav.cta}
            </a>

            {/* Hamburger */}
            <button className="md:hidden p-2 text-sage-700" onClick={() => setOpen(!open)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-sage-100 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="text-sage-700 hover:text-sage-500 font-medium py-1 text-sm">
                {l.label}
              </a>
            ))}
            <a href="#quote" onClick={() => setOpen(false)}
              className="btn-primary text-sm !py-2 mt-1 text-center">
              {t.nav.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
