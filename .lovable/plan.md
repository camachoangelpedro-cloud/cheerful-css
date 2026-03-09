

# Plan: Configurador de Módulos 2.5D Isométrico

## Resumen

Crear una página `/configurador` estilo Sklum donde el cliente puede arrastrar módulos, apilarlos vertical y horizontalmente en una vista isométrica 2.5D, elegir colores, y añadir todo al carrito como productos individuales.

## Datos del Producto (del Excel)

```text
SKU         | W×H (cm)  | Tipo
------------|-----------|---------------------------
M1:05       | 36×18     | Módulo básico
M1:07       | 36×24     | Módulo básico
M1:1        | 36×36     | Módulo básico
M1:1F       | 36×36     | Con repisa
M1:1P       | 36×36     | Con puerta
M1:1FP      | 36×36     | Con puerta y repisa
M1:2        | 36×72     | Con puerta y repisa
M2:05       | 72×18     | Doble ancho
M2:07       | 72×24     | Doble ancho
M2:1P       | 72×36     | Doble ancho con puerta
M2:2P       | 72×72     | Doble ancho, 2 puertas
P1:1        | 36×36     | Placa base
P2:1        | 72×36     | Placa base doble
CLIP        | -         | Conector

5 colores: Adobe Clay, Oxide Red, Midnight Blue, Pine Green, Roman Ochre
```

## Arquitectura

```text
src/
├── data/
│   └── modulesCatalog.ts        # Catálogo de módulos con SKUs, dimensiones, precios
├── stores/
│   └── configuratorStore.ts     # Zustand: módulos colocados, color, undo/redo
├── pages/
│   └── ConfiguradorPage.tsx     # Página principal del configurador
├── components/configurator/
│   ├── IsometricCanvas.tsx      # Canvas 2.5D con CSS transforms
│   ├── ModuleCatalog.tsx        # Panel lateral con módulos arrastrables
│   ├── PlacedModule.tsx         # Módulo individual en el canvas
│   ├── ConfigToolbar.tsx        # Barra inferior (undo, reset, color, total)
│   └── ConfigSummary.tsx        # Resumen del bundle + "Añadir al carrito"
```

## Diseño Visual

**Layout**: Pantalla completa dividida en:
- ~75% izquierda: Canvas isométrico (fondo con grid sutil)
- ~25% derecha: Panel catálogo + resumen

**Vista isométrica**: CSS `transform: rotateX(30deg) rotateZ(-45deg)` aplicado al canvas. Los módulos son div con colores sólidos, bordes sutiles, y sombras para dar profundidad. Las proporciones reales del módulo se respetan (1 unidad grid = 36cm).

**Interacción**:
1. Click en un módulo del catálogo → se "selecciona"
2. Click en el canvas → se coloca en la posición del grid más cercana
3. Los módulos se apilan: detecta colisiones y se coloca encima o al lado
4. Click en módulo colocado → seleccionarlo (mover/eliminar/cambiar color)
5. Drag para reposicionar módulos ya colocados

**Snap-to-grid**: Grid de 36cm. Módulos M2 ocupan 2 celdas horizontales. Stacking vertical: detecta el módulo más alto en esa columna y coloca encima.

## Integración con Shopify

Los módulos aún no existen como productos en Shopify (0 productos). El configurador funcionará primero con datos locales (precios del Excel). Después crearemos los productos en Shopify y mapearemos SKU → variantId para el checkout real.

Por ahora, el botón "Añadir al carrito" mostrará el resumen con precios pero indicará que los productos se están preparando.

## Flujo de implementación

1. **Crear `modulesCatalog.ts`** con todos los SKUs, dimensiones, colores y precios del Excel
2. **Crear `configuratorStore.ts`** (Zustand) para estado del canvas: módulos colocados, posiciones, colores, undo/redo stack
3. **Crear componentes del configurador**: Canvas isométrico con CSS transforms, catálogo lateral, toolbar
4. **Implementar lógica de colocación**: snap-to-grid, stacking, detección de colisiones
5. **Crear `ConfiguradorPage.tsx`** y añadir ruta `/configurador` en App.tsx
6. **Conectar resumen con carrito** (preparado para cuando existan productos en Shopify)

## Detalles técnicos

- **Sin dependencias 3D**: Isometría lograda puramente con CSS transforms, sin three.js
- **Drag & Drop**: HTML5 drag API nativa o pointer events con estado manual
- **Rendimiento**: Cada módulo es un div posicionado absolutamente en el canvas. Max ~50 módulos = sin problemas
- **Responsive**: En móvil, catálogo se mueve abajo del canvas

