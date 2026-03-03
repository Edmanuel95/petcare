export default function Stats({ t }) {
  return (
    <section className="bg-sage-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {t.stats.map((s, i) => (
            <div key={i} className="space-y-1">
              <p className="font-display text-3xl md:text-4xl text-amber-400 font-bold">{s.val}</p>
              <p className="text-sage-200 font-medium text-sm">{s.label}</p>
              <p className="text-sage-400 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
