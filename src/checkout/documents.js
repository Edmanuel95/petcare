import { credentialUrl } from './demo'

export async function makeDocuments(policy) {
  const [pdfLib, {default: QRCode}] = await Promise.all([import('pdf-lib'), import('qrcode')])
  const qr = await QRCode.toDataURL(credentialUrl(policy), {width: 384, margin: 2, errorCorrectionLevel:'M'})
  return {
    policy: await render(policy, null, pdfLib),
    card: await render(policy, qr, pdfLib),
  }
}

async function render(p, qr, {PDFDocument, StandardFonts, rgb}) {
  const card = Boolean(qr)
  const pdf = await PDFDocument.create()
  pdf.setTitle(card ? 'Carnet PetCare de prueba' : 'Póliza PetCare de prueba')
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const page = pdf.addPage(card ? [550,335] : [595,842])
  const {width,height}=page.getSize()
  const green=rgb(.13,.28,.19)
  const ink=rgb(.18,.22,.2)
  const accent=rgb(.9,.95,.9)
  const put=(s,x,y,size=11,weight=font,color=ink)=>page.drawText(String(s).replaceAll('’',"'"),{x,y,size,font:weight,color})
  page.drawRectangle({x:0,y:height-109,width,height:109,color:green})
  put('PETCARE  /  DEMOSTRACIÓN',30,height-36,13,bold,accent)
  put(card?'Carnet de identificación':'Póliza de prueba',30,height-75,29,bold,rgb(1,1,1))
  if (card) {
    put(p.dog,30,height-141,15,bold)
    put(p.breed+' / '+p.color,30,height-164)
    put('Vigencia hasta '+p.expires+' (no inclusive)',30,height-186)
    put('Escanea para abrir la consulta de prueba.',30,height-210,10)
    put('La consulta requiere la misma sesión web.',30,height-226,10)
    const image=await pdf.embedPng(qr)
    page.drawImage(image,{x:width-171,y:55,width:140,height:140})
  } else {
    const fields=[['Folio',p.policyId],['ID del titular',p.memberId],['Titular',p.owner],['Correo de prueba',p.email],
      ['Perro',p.dog],['Raza',p.breed],['Color',p.color],['Plan de prueba',p.planName],
      ['Vigencia',p.months+' mes(es): '+p.started+' a '+p.expires+' (fin exclusivo)'],
      ['Importe simulado',p.total.toLocaleString('es-MX')+' MXN']]
    fields.forEach(([label,value],i)=>{
      const y=height-148-i*43
      put(label.toUpperCase(),30,y,9,bold,green)
      put(value,30,y-17,11)
    })
    put('Confirmación de pago simulado. No se efectuó ningún cargo.',30,200,11)
  }
  put('SIMULACIÓN - SIN VALIDEZ COMO PÓLIZA NI COBERTURA REAL',30,24,10,bold,green)
  return pdf.save()
}

export function downloadPdf(bytes, name) {
  const url=URL.createObjectURL(new Blob([bytes], {type:'application/pdf'}))
  const link=document.createElement('a')
  link.href=url
  link.download=name
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(()=>URL.revokeObjectURL(url),30000)
}
