> 🇬🇧 Looking for the English version? Check out the [English README](./README_EN.md).

# Angular Interview App

Este proyecto es una aplicación frontend desarrollada con Angular. Simula la gestión de productos con formularios, listados, validaciones, y pruebas unitarias configuradas con Jest.

## 🚀 Tecnologías usadas

- Angular 14+
- Angular Material
- Jest (para pruebas unitarias)
- ngx-translate (para internacionalización)
- SweetAlert2
- RxJS
- SCSS

## 📁 Estructura principal

```
repo/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── products/
│   │   │   │   ├── list/
│   │   │   │   └── edit/
│   │   │   └── main/
│   │   ├── shared/
│   │   │   └── components/data-table/
│   │   └── app.component.*
│   ├── assets/
├── angular.json
├── jest.config.ts
├── tsconfig.json
├── package.json
├── setup-jest.ts
```

## 📦 Instalación

```bash
npm install
```

## 🧪 Ejecutar pruebas unitarias

```bash
npm run test
```

### ✅ Ejecutar pruebas de un componente específico

```bash
npm run test:list
```

### 📈 Ver cobertura de un componente específico

```bash
npm run test:list:coverage
```

### 🧪 Ver cobertura global

```bash
npm run test:coverage
```

## 📊 Ver reporte de cobertura

Después de ejecutar el comando `test:coverage`, se generará una carpeta `/coverage` con el reporte.

### Para ver el reporte:

1. Ejecuta el comando:
   ```bash
   npm run test:coverage
   ```
2. Abre el archivo:
   ```
   coverage/index.html
   ```
   Puedes abrirlo con tu navegador preferido para ver el detalle de la cobertura por archivo y línea.

## 🛠 Scripts importantes

```json
"scripts": {
  "start": "ng serve",
  "build": "ng build",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:list": "jest src/app/pages/products/list/list.component.spec.ts",
  "test:list:coverage": "jest src/app/pages/products/list/list.component.spec.ts --coverage"
}
```

## 🌍 Internacionalización

Este proyecto usa `ngx-translate`. Los archivos de idioma están en `/assets/i18n`. El idioma predeterminado es español.

---

💡 *Recuerda tener el backend corriendo en `http://localhost:3002` si quieres que las llamadas HTTP funcionen correctamente.*
