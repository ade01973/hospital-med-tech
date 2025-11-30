# Infografías Temáticas

## Cómo Agregar Nuevas Infografías

### Paso 1: Guardar la Imagen
Guarda la infografía en esta carpeta con el siguiente nombre:
```
modulo-{id}-{nombre-corto}.png
```

**Ejemplo:**
- Módulo 2 (Liderazgo) → `modulo-2-liderazgo.png`
- Módulo 3 (Competencias Digitales) → `modulo-3-competencias-digitales.png`

### Paso 2: Actualizar InfographiesGallery.jsx

Abre `src/components/InfographiesGallery.jsx` y encuentra esta sección:

```javascript
// Mapeo de infografías por módulo
const infographicsMap = {
  1: moduloGestoraImg, // La Gestora Enfermera
  // Agregar más módulos aquí...
};
```

Agrega un import al principio del archivo:
```javascript
import modulo2Img from '../assets/infographics/modulo-2-liderazgo.png';
import modulo3Img from '../assets/infographics/modulo-3-competencias-digitales.png';
// etc...
```

Luego completa el mapeo:
```javascript
const infographicsMap = {
  1: moduloGestoraImg,
  2: modulo2Img,
  3: modulo3Img,
  // ... continúa para los módulos 4-21
};
```

### Módulos Disponibles (1-21)

1. ✅ La Gestora Enfermera
2. ⏳ Liderazgo
3. ⏳ Competencias Digitales
4. ⏳ Gestión de la Comunicación
5. ⏳ Clima Laboral
6. ⏳ Gestión del Conflicto
7. ⏳ Motivación en Enfermería
8. ⏳ Trabajo en Equipo
9. ⏳ Imagen Digital de la Enfermera
10. ⏳ Toma de Decisiones
11. ⏳ Planificación y Gestión del Tiempo
12. ⏳ Gestión por Procesos
13. ⏳ Marketing Sanitario
14. ⏳ Gestión del Cambio
15. ⏳ Gestión de la Innovación
16. ⏳ La Carga de Cuidados
17. ⏳ Los Sistemas de Salud
18. ⏳ La Administración como Ciencia
19. ⏳ La Calidad
20. ⏳ Dirección Estratégica
21. ⏳ Seguridad del Paciente

## Características Actuales

✅ Gallery modal con vista de grid (3 columnas)
✅ Tarjetas interactivas con información del módulo
✅ Badges de estado (Disponible / Próximamente)
✅ Modal a pantalla completa al hacer clic
✅ Scroll en contenedor de imagen grande
✅ Cierre con botón X o clic fuera
✅ Diseño responsive (móvil, tablet, desktop)
✅ Estética cyan-blue consistente con dashboard

## Tamaño Recomendado de Imágenes

- **Ancho mínimo:** 1200px
- **Proporción:** 9:16 o similar (vertical/portrait)
- **Formato:** PNG (transparencia soportada)
- **Tamaño máximo:** 10MB (optimizar si es posible)

## Notas

- El componente automáticamente detecta qué infografías están disponibles
- Las que falten aparecen como "Próximamente" (deshabilitadas)
- El botón de descarga fue removido (ahora solo pantalla completa)
