# Striking Motion Lab — integración de pruebas

Esta rama conserva la base espacial inmersiva del nuevo esqueleto y monta el sitio funcional actual completo como submódulo fijado a un commit concreto. Así se preservan sus escenas 3D, rutas, contenidos, recursos multimedia, funciones Netlify y MI SML sin duplicar ni recortar los más de 50 MB de recursos.

- Fundación espacial: archivos de la raíz y `src/` de este repositorio.
- Sitio SML funcional: `current-site/sml-v31/sml-v31-academy`.
- Netlify: usa esa aplicación como directorio base para el Deploy Preview.
- No se copian secretos ni archivos `.env`; configura las variables de entorno de prueba en Netlify por separado.

La integración visual entre el corredor del esqueleto y las salas actuales sigue siendo una fase posterior: esta rama prioriza que el sitio completo y sus funciones existentes puedan compilarse y probarse sin perder datos ni sustituir producción.
