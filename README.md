# NathuraVitae V2

**Aplicación PWA de medicina natural y bienestar integral con respaldo bibliográfico oficial.**

## Estructura del proyecto

```
NathuraVitae-V2/
├── index.html                  ← Home principal
├── manifest.json               ← Configuración PWA
├── sw.js                       ← Service Worker (offline)
├── pages/
│   ├── herbologia-indice.html  ← Índice A-Z + filtro por dolencia
│   ├── explorador-sintoma.html ← Motor síntoma → ruta natural
│   ├── ficha-planta.html       ← Ficha individual de planta
│   └── mindfulness-audio.html  ← Zona Mindfulness con audio
├── data/
│   ├── schema-v2.json          ← Schema JSON oficial v2
│   ├── digestivo/              ← Fichas grupo digestivo / EII
│   ├── nervioso/               ← Fichas grupo nervioso
│   ├── respiratorio/           ← Fichas grupo respiratorio
│   ├── inmunologico/           ← Fichas grupo inmunológico
│   └── flora-panama/           ← Flora medicinal panameña
├── audio/                      ← Ambientes sonoros (MP3 locales)
│   ├── olas-playa.mp3
│   ├── riachuelo.mp3
│   ├── pajaros-manana.mp3
│   └── lluvia-suave.mp3
└── icons/
    ├── icon-192.png            ← Icono app 192×192
    └── icon-512.png            ← Icono app 512×512
```

## Fuentes bibliográficas

| Nivel | Fuente | Descripción |
|---|---|---|
| A | OMS — Monografías | 92 plantas con monografía completa |
| A | EMA — Herbal Monographs | 200+ plantas, actualizadas anualmente |
| A | Kommission E (BfArM) | 380 plantas, estándar europeo |
| B | PubMed / Cochrane | Metaanálisis y ensayos clínicos |
| B | TRAMIL / OPS | Validación latinoamericana |
| C | INDICASAT / UP / UTP | Estudios panameños y flora local |

## Archivos de audio

Descargar y colocar en `/audio/`:
- `olas-playa.mp3` → Pixabay: "ocean waves beach relaxing"
- `riachuelo.mp3` → Freesound: "forest stream flowing water"
- `pajaros-manana.mp3` → Freesound: "morning birds dawn chorus"
- `lluvia-suave.mp3` → Pixabay: "gentle rain meditation"

Los ambientes de cuencos tibetanos y binaural 432 Hz se generan
sintéticamente con Web Audio API — no requieren archivos.

## Despliegue

1. Subir carpeta a GitHub
2. Conectar repo a Vercel
3. Configurar dominio personalizado (opcional)

## Versión

- App: V2.0
- Schema: v2.0
- Fecha: Abril 2026
