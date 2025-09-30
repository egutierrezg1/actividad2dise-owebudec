# Sistema de Gestión de Contenido Dinámico - EcoAventura LATAM

## 📋 Descripción

Este sistema permite gestionar todo el contenido de la página web de manera dinámica a través de un archivo JSON, facilitando la actualización y mantenimiento del sitio sin necesidad de modificar código HTML.

## 📁 Estructura de Archivos

```
├── index.html          # Estructura HTML base (sin contenido estático)
├── styles.css          # Estilos CSS (sin cambios)
├── data.json           # Contenido dinámico en formato JSON
├── content-loader.js   # Script que carga y renderiza el contenido
└── script.js           # Script original (mantenido para compatibilidad)
```

## 🔧 Cómo Funciona

1. **Carga de datos**: El archivo `content-loader.js` carga automáticamente el contenido desde `data.json`
2. **Renderizado dinámico**: El contenido se inserta en el HTML usando JavaScript
3. **Fallback**: Si falla la carga del JSON, se mantiene el contenido estático del HTML

## 📝 Gestión de Contenido

### Tours
Para agregar un nuevo tour, edita la sección `tours.items` en `data.json`:

```json
{
  "id": "nuevo-tour",
  "name": "Nombre del Tour",
  "country": "País",
  "image": "URL_de_imagen",
  "alt": "Descripción de la imagen",
  "difficulty": "Baja|Media|Alta",
  "risk": "Bajo|Medio|Alto",
  "age": "8+",
  "price": 200,
  "rating": 5,
  "reviews": 150,
  "detailLink": "#detalle-nuevo-tour"
}
```

### Blog Posts
Para agregar un nuevo post de blog:

```json
{
  "title": "Título del Post",
  "excerpt": "Resumen del contenido...",
  "link": "#enlace-del-post"
}
```

### Testimonios
Para agregar un nuevo testimonio:

```json
{
  "text": "Texto del testimonio",
  "author": "Nombre del Autor",
  "location": "País"
}
```

### Multimedia
Para agregar nuevo contenido multimedia:

```json
{
  "type": "video|youtube|map",
  "src": "URL_del_contenido",
  "poster": "URL_del_poster (solo para video)",
  "caption": "Descripción del contenido",
  "aria-label": "Etiqueta de accesibilidad (opcional)"
}
```

## 🎨 Personalización

### Colores y Estilos
Los estilos se mantienen en `styles.css` usando variables CSS:

```css
:root {
  --verde: #2e7d32;
  --verde-claro: #a5d6a7;
  --verde-oscuro: #1b5e20;
  /* ... más variables */
}
```

### Información de Contacto
Edita la sección `contact.info` en `data.json`:

```json
{
  "whatsapp": {
    "number": "573001112233",
    "display": "+57 300 111 2233"
  },
  "email": "hola@ecoaventura.lat",
  "schedule": "Lun–Sáb, 9:00–18:00 (GMT-5)",
  "coverage": "Colombia, Brasil, Costa Rica, Argentina, Perú"
}
```

## 🚀 Ventajas del Sistema

### ✅ Para Desarrolladores
- **Separación de contenido y código**: El contenido está separado del HTML
- **Fácil mantenimiento**: Cambios de contenido sin tocar código
- **Escalabilidad**: Agregar nuevos tours/posts es muy simple
- **Versionado**: El contenido puede versionarse independientemente

### ✅ Para Contenidistas
- **Sin conocimientos técnicos**: Solo necesitan editar JSON
- **Formato estructurado**: Fácil de entender y modificar
- **Validación**: El JSON puede validarse antes de publicar
- **Backup**: Fácil hacer copias de seguridad del contenido

### ✅ Para el Negocio
- **Actualizaciones rápidas**: Cambiar precios, agregar tours, etc.
- **Consistencia**: Estructura uniforme para todo el contenido
- **Flexibilidad**: Fácil adaptar a diferentes idiomas o mercados
- **SEO**: Contenido estructurado facilita la optimización

## 🔄 Flujo de Trabajo Recomendado

1. **Desarrollo inicial**: Crear estructura HTML y CSS
2. **Contenido base**: Poblar `data.json` con contenido inicial
3. **Testing**: Verificar que todo se carga correctamente
4. **Mantenimiento**: Actualizar solo `data.json` para cambios de contenido
5. **Expansión**: Agregar nuevas secciones al JSON según necesidades

## 🛠️ Herramientas Recomendadas

- **Editor JSON**: VS Code con extensión JSON
- **Validación**: JSONLint para validar sintaxis
- **Testing**: Servidor local para probar cambios
- **Backup**: Control de versiones (Git) para el archivo JSON

## 📊 Ejemplo de Uso

```bash
# 1. Editar contenido
vim data.json

# 2. Validar JSON
jsonlint data.json

# 3. Probar cambios
python -m http.server 8000

# 4. Verificar en navegador
open http://localhost:8000
```

## 🎯 Próximos Pasos

- [ ] Agregar validación de esquema JSON
- [ ] Crear interfaz de administración web
- [ ] Implementar sistema de plantillas
- [ ] Agregar soporte multiidioma
- [ ] Integrar con CMS externo

---

**Nota**: Este sistema mantiene toda la funcionalidad original mientras proporciona flexibilidad para gestionar contenido de manera eficiente.
