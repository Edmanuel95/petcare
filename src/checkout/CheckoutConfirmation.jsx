import { downloadPdf } from './documents'

export default function CheckoutConfirmation({ policy, documents }) {
  const period = policy.months === 12 ? 'Anual' : 'Mensual'

  return (
    <div className="overflow-hidden rounded-3xl border border-sage-200 bg-cream-50 shadow-sm">
      <div className="bg-gradient-to-br from-sage-900 via-sage-800 to-sage-700 px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-full border border-cream-300 bg-cream-100 text-2xl font-semibold text-sage-800" aria-hidden="true">✓</div>
        <p role="status" className="mb-2 text-sm font-medium text-cream-300">Pago de prueba aprobado</p>
        <h2 data-step-title tabIndex={-1} className="max-w-xl break-words font-display text-3xl leading-tight sm:text-4xl">
          {policy.dog} ya tiene su póliza de prueba
        </h2>
        <p className="mt-3 text-cream-100">Tu póliza y tu carnet con QR están listos.</p>
        <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-sage-400 pt-5">
          <div>
            <dt className="text-sm text-cream-200">Plan</dt>
            <dd className="mt-1 font-medium">{policy.planName} · {period}</dd>
          </div>
          <div>
            <dt className="text-sm text-cream-200">Vigencia de prueba</dt>
            <dd className="mt-1 font-medium">{policy.started} a {policy.expires}</dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-col items-start gap-4 px-6 py-6 sm:flex-row sm:items-center sm:px-9">
        <a href="#cliente" className="btn-primary !inline-flex w-full items-center justify-center gap-2 !px-4 sm:w-auto sm:!px-8">Inicia con tus beneficios <span aria-hidden="true">→</span></a>
        <button type="button" className="text-sm font-medium text-sage-700 underline underline-offset-4"
          onClick={() => downloadPdf(documents.policy, policy.policyId + '.pdf')}>
          Descargar póliza PDF
        </button>
      </div>
    </div>
  )
}
