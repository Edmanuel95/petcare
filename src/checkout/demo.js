export const planIds = ['basico', 'estandar', 'premium']
export const breeds = ['Mestizo', 'Beagle', 'Border Collie', 'Boxer', 'Bulldog francés', 'Chihuahua', 'Cocker Spaniel', 'Dachshund', 'Dálmata', 'Golden Retriever', 'Husky siberiano', 'Labrador Retriever', 'Pastor alemán', 'Pomerania', 'Poodle', 'Pug', 'Schnauzer', 'Shih Tzu', 'Xoloitzcuintle', 'Yorkshire Terrier', 'Otra']
export const colors = ['Negro', 'Blanco', 'Café', 'Dorado', 'Gris', 'Crema', 'Atigrado', 'Bicolor', 'Tricolor', 'Otro']
export const fixture = { owner: 'Elena Demo', email: 'elena@petcare.test', dog: 'Luna', breed: 'Mestizo', color: 'Dorado' }
const key = 'petcare.checkout.demo.v1'
export function readPolicy(storage = sessionStorage) {
  try {
    const value = JSON.parse(storage.getItem(key))
    return value?.schema === 1 && /^PCD-[\da-f-]{36}$/i.test(value.policyId) ? value : null
  } catch { return null }
}
export function clearPolicy(storage = sessionStorage) { storage.removeItem(key) }
export function addMonths(iso, months) {
  const [y,m,d] = iso.split('-').map(Number)
  const target = new Date(Date.UTC(y,m-1+months,1))
  const last = new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate()
  target.setUTCDate(Math.min(d,last))
  return target.toISOString().slice(0,10)
}
export function dateInMexico(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(p=>[p.type,p.value]))
  return [parts.year,parts.month,parts.day].join('-')
}
export function validateProfile(profile) {
  for (const field of ['owner','dog']) {
    const v=profile[field]?.trim()
    if (!v || v.length > 64 || !/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 .,'’\-]+$/.test(v)) return 'Revisa el nombre del titular y del perro.'
  }
  if (!/^[a-z0-9][a-z0-9._+\-]{0,63}@(petcare|example)\.test$/i.test(profile.email?.trim() || '')) return 'Usa un correo ficticio @petcare.test o @example.test.'
  if (!breeds.includes(profile.breed) || !colors.includes(profile.color)) return 'Selecciona una raza y un color.'
  return ''
}
export function issueDemoPolicy({profile, planId, planName, monthlyPrice, term}, storage = sessionStorage, now = new Date()) {
  const invalid = validateProfile(profile)
  if (invalid) throw new Error(invalid)
  if (!planIds.includes(planId) || !['monthly','annual'].includes(term) || !Number.isSafeInteger(monthlyPrice) || monthlyPrice <= 0) throw new Error('Selecciona un plan y una vigencia válidos.')
  const months = term === 'annual' ? 12 : 1
  const started = dateInMexico(now)
  const previous = readPolicy(storage)
  const email = profile.email.trim().toLowerCase()
  const policy = {
    schema:1, simulation:true, policyId:'PCD-'+crypto.randomUUID(),
    memberId:previous?.email === email ? previous.memberId : 'PCU-'+crypto.randomUUID(),
    credential:crypto.randomUUID(), owner:profile.owner.trim(), email,
    dog:profile.dog.trim(), breed:profile.breed, color:profile.color, planId, planName, months,
    started, expires:addMonths(started,months), total:monthlyPrice*months
  }
  return policy
}
export function savePolicy(policy, storage = sessionStorage) { storage.setItem(key,JSON.stringify(policy)) }
export function credentialUrl(policy, origin = location.origin) {
  return new URL('/#credencial='+encodeURIComponent(policy.credential),origin).href
}
export function resolveCredential(token, policy, today = dateInMexico()) {
  if (!policy || policy.credential !== token) return {status:'unavailable'}
  return {status:today >= policy.expires ? 'expired' : 'active',dog:policy.dog,breed:policy.breed,color:policy.color,expires:policy.expires}
}
export function distanceMeters(a,b) {
  const rad = Math.PI/180
  const lat = (b.lat-a.lat)*rad, lng = (b.lng-a.lng)*rad
  const h = Math.sin(lat/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(lng/2)**2
  return 6371000*2*Math.asin(Math.sqrt(Math.min(1,h)))
}
