import { test } from 'node:test'
import assert from 'node:assert/strict'
import { addMonths, fixture, issueDemoPolicy, readPolicy, savePolicy, resolveCredential, credentialUrl, validateProfile } from '../src/checkout/demo.js'
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}}
const payload={profile:fixture,planId:'basico',planName:'Básico',monthlyPrice:599,term:'monthly'}
test('vigencias de calendario y fin exclusivo',()=>{
  assert.equal(addMonths('2026-01-31',1),'2026-02-28')
  assert.equal(addMonths('2028-02-29',12),'2029-02-28')
  const p=issueDemoPolicy(payload,storage(),new Date('2026-02-01T02:00:00Z'))
  assert.equal(p.started,'2026-01-31')
  assert.equal(resolveCredential(p.credential,p,'2026-02-27').status,'active')
  assert.equal(resolveCredential(p.credential,p,'2026-02-28').status,'expired')
})
test('titular, póliza, carnet y precio anual se mantienen separados',()=>{
  const s=storage()
  const p=issueDemoPolicy(payload,s)
  savePolicy(p,s)
  assert.deepEqual(readPolicy(s),p)
  const year=issueDemoPolicy({...payload,term:'annual'},s)
  assert.equal(year.memberId,p.memberId)
  assert.notEqual(year.policyId,p.policyId)
  assert.notEqual(year.credential,p.credential)
  assert.equal(year.total,599*12)
  assert.equal(year.months,12)
  const url=credentialUrl(p,'https://petcare.example.test')
  assert.ok(url.endsWith(p.credential))
  assert.ok(!url.includes(p.memberId) && !url.includes(p.email) && !url.includes(p.dog))
  assert.equal(resolveCredential(year.credential,p).status,'unavailable')
})
test('rechaza datos que salen del contrato de la demo',()=>{
  assert.ok(validateProfile({...fixture,email:'persona@example.com'}))
  assert.ok(validateProfile({...fixture,breed:'Desconocida'}))
  assert.ok(validateProfile({...fixture,owner:' '}))
  assert.throws(()=>issueDemoPolicy({...payload,term:'weekly'},storage()))
  assert.throws(()=>issueDemoPolicy({...payload,monthlyPrice:0},storage()))
})
