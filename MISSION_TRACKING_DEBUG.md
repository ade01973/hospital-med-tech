# 🔧 GUÍA DE VERIFICACIÓN: TRACKING DE MISIONES

## ¿CÓMO VERIFICAR QUE FUNCIONA?

### Paso 1: Abre DevTools (F12)
En el navegador, presiona **F12** o **Ctrl+Shift+I** para abrir la consola de desarrollador.

### Paso 2: Ve a la pestaña "Console" (Consola)
Aquí verás todos los logs en tiempo real.

### Paso 3: Juega una pregunta y observa los logs

Cuando respondas una pregunta **CORRECTAMENTE**, deberías ver en la consola:

```
📍 Respuesta en pregunta 1: opción 0
🎯 Mission tracking: question answered
🎯 Contador actualizado: verificar localStorage['dailyMissions']
🔥 Racha tracking llamado con valor: 1
✅ CORRECTO! Tiempo: 5s, Velocidad: ¡RÁPIDO! +150 PTS, Racha: 1, Puntos: 150
⚡ Respuesta rápida tracking llamado
```

### Paso 4: Verifica localStorage directamente

En la consola, ejecuta estos comandos:

```javascript
// Ver todas las misiones diarias
JSON.parse(localStorage.getItem('dailyMissions'))

// Ver misión semanal
JSON.parse(localStorage.getItem('weeklyMission'))
```

Deberías ver el progreso actualizado:

```json
{
  "questions_answered": { "progress": 1, "target": 10, ... },
  "streak_active": { "progress": 1, "target": 1, ... },
  "fast_answers": { "progress": 1, "target": 5, ... }
}
```

### Paso 5: Abre el modal de Misiones

1. Vuelve a Dashboard (click en "Volver")
2. Busca el botón 🎯 (Misiones) en la esquina superior derecha
3. Haz click en él
4. Deberías ver los contadores ACTUALIZADOS en tiempo real

---

## LOGS DE DEBUG QUE VERÁS

| Evento | Log |
|--------|-----|
| Respuesta respondida | `🎯 Mission tracking: question answered` |
| Racha actualizada | `🔥 Mission tracking: streak active - X` |
| Respuesta rápida | `⚡ Mission tracking: fast response detected` |
| Nivel perfecto | `🏆 Mission tracking: perfect level completed` |

---

## SI FUNCIONAN LOS LOGS PERO NO SE VEN EN MISIONES

Si ves los logs de debug en la consola pero el modal de misiones no se actualiza:

1. **Cierra y abre el modal** - Debería sincronizar después de 1 segundo
2. **Recarga la página** - Los cambios deberían persistir en localStorage
3. **Verifica localStorage directamente** - Los datos deben estar ahí

---

## DETALLES TÉCNICOS

### Cómo funciona el tracking:

1. **GameLevel.jsx** llama a `trackQuestionAnswered()`, etc.
2. El hook **useMissions.js** LEE del localStorage
3. ACTUALIZA el objeto en memoria
4. ESCRIBE el resultado de vuelta en localStorage
5. Dashboard polling cada 1 segundo sincroniza desde localStorage
6. El modal se re-renderiza con datos nuevos

### Storage Keys:
- `dailyMissions` - Objeto JSON con todas las misiones diarias
- `weeklyMission` - Objeto JSON con misiones semanales
- `lastMissionReset` - Fecha de último reset diario
- `lastWeeklyReset` - Fecha de último reset semanal

---

## TESTING MANUAL

### Test 1: 10 Preguntas
```
Responde 10 preguntas CORRECTAMENTE
✓ Deberías ver: "Responde 10 preguntas" → 10/10 (COMPLETADA)
```

### Test 2: Racha Activa
```
Responde 1 pregunta CORRECTA
✓ Deberías ver: "Mantén tu racha activa" → 1/1 (COMPLETADA)
```

### Test 3: 5 Respuestas Rápidas
```
Responde 5 preguntas CORRECTAMENTE en < 10 segundos cada una
✓ Deberías ver: "Consigue 5 respuestas rápidas" → 5/5 (COMPLETADA)
```

### Test 4: 3 Niveles Perfectos
```
Completa 3 niveles CON 100% DE RESPUESTAS CORRECTAS
✓ Deberías ver: "Completa 3 niveles con 3 estrellas" → 3/3 (COMPLETADA)
```

---

## ¿AÚN NO FUNCIONA?

Si después de seguir estos pasos el tracking sigue sin funcionar:

1. **Abre DevTools (F12)**
2. **Copia TODO en la consola**
3. **Dí qué logs ves exactamente**

Esto ayudará a diagnosticar si:
- Las funciones se están llamando ✓
- localStorage se actualiza ✓
- El modal sincroniza ✓
