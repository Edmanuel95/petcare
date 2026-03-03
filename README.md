# 🐾 PetCare Seguro — Landing Page

Seguro de Gastos Médicos Mayores para Mascotas (SGMM) · México  
Proyecto **Vite + React + Tailwind CSS** — bilingüe ES / EN

---

## 🚀 Arrancar en local

```bash
# 1. Instala dependencias
npm install

# 2. Servidor de desarrollo (http://localhost:5173)
npm run dev

# 3. Build para producción
npm run build

# 4. Preview del build
npm run preview
```

> Requiere **Node.js ≥ 16**

---

## 📁 Estructura del proyecto

```
petcare-seguro/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          ← entrada de React
    ├── App.jsx           ← root, maneja estado de idioma
    ├── index.css         ← Tailwind + estilos custom
    ├── i18n.js           ← TODO el contenido ES/EN (textos, precios, FAQ)
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── Stats.jsx
        ├── Benefits.jsx
        ├── Plans.jsx
        ├── Quoter.jsx
        ├── FAQ.jsx
        └── Footer.jsx
```

---

## ✏️ Cómo modificar contenido

Todo el texto, precios y datos están en **`src/i18n.js`**.  
Busca la clave que quieras cambiar:

```js
// Cambiar precios
plans: {
  items: [
    { name:'Básico',   price:'599', sum:'$30,000 MXN', ded:'$2,000 MXN', co:'20%' },
    { name:'Estándar', price:'700', sum:'$60,000 MXN', ded:'$1,500 MXN', co:'15%' },
    { name:'Premium',  price:'950', sum:'$100,000 MXN',ded:'$1,000 MXN', co:'10%' },
  ]
}

// Cambiar contacto
footer: {
  email: 'tu@email.com',
  phone: '+52 55 XXXX XXXX',
  addr:  'Tu ciudad, México',
}
```

---

## 🌐 Deploy gratuito y permanente

### Netlify (más fácil — 0 configuración)
```bash
npm run build
# Arrastra la carpeta dist/ a https://app.netlify.com/drop
```

### Vercel
```bash
npm install -g vercel
vercel          # sigue las instrucciones, detecta Vite automáticamente
```

### GitHub Pages
```bash
# Agrega a vite.config.js: base: '/nombre-repo/'
npm run build
# Sube dist/ a la rama gh-pages
```

---

## 📊 Datos actuariales (fuente: Plan Técnico SGMM)

| Parámetro | Valor |
|---|---|
| Prima promedio | $700 MXN/mes |
| Frecuencia base | 22% |
| Severidad media | $9,500 MXN |
| Inflación veterinaria | 8% anual |
| WACC | 18% |
| Cartera inicial | 2,000 pólizas |
| CAGR (3 años) | 85% |
