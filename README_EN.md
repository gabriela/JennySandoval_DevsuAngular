
# Angular Interview App

This project is a frontend application developed with Angular. It simulates product management with forms, listings, validations, and unit tests configured using Jest.

## 🚀 Technologies Used

- Angular 14+
- Angular Material
- Jest (for unit testing)
- ngx-translate (for internationalization)
- SweetAlert2
- RxJS
- SCSS

## 📁 Project Structure

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

## 📦 Installation

```bash
npm install
```

## 🧪 Run Unit Tests

```bash
npm run test
```

### ✅ Run Tests for a Specific Component

```bash
npm run test:list
```

### 📈 View Coverage for a Specific Component

```bash
npm run test:list:coverage
```

### 🧪 View Global Test Coverage

```bash
npm run test:coverage
```

## 📊 View Coverage Report

After running the test:coverage command, a /coverage folder will be generated with the report.

### To View the Report:

1. Run the command:
   ```bash
   npm run test:coverage
   ```
2. Open the file:
   ```
   coverage/index.html
   ```
   You can open it in your preferred browser to see detailed file and line-by-line coverage.

## 🛠 Important Scripts

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

## 🌍 Internationalization

This project uses ngx-translate. Language files are located in /assets/i18n. The default language is Spanish.

---

💡 *Make sure the backend is running at http://localhost:3002 for HTTP requests to work properly.*
