export const money = amount => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(amount)
export const fieldClass = 'block w-full mt-1 rounded-xl border border-sage-300 bg-white p-3 focus:outline-sage-500'
export const actionClass = 'btn-primary disabled:opacity-50'
