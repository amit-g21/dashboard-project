# Product Management Dashboard

Angular application for managing products in an e-commerce catalog. The project demonstrates clean architecture, RxJS usage, reactive forms, caching, and basic product CRUD flows.

## 📌 Features

- **Product list with:**
  - Search functionality
  - Filters (category, status)
  - Sorting options
  - Pagination
- **Create new product**
- **Edit existing product**
- **Delete existing product**
- Reactive Forms with validation
- Clear UI states: loading, empty state, error handling
- Client-side caching using RxJS
- Strong typing with TypeScript
- Feature-based folder structure

## 🧱 Tech Stack

- Angular
- Angular Material
- RxJS
- json-server (mock backend)
- TypeScript

## 📁 Project Structure

```
src/app/
├── features/products/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Routed pages (list, create, edit)
│   ├── services/       # API and data access
│   ├── models/         # Strongly typed interfaces and enums
│   └── constants/      # Constants and configuration
└── shared/             # Shared components across features
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dashboard-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the mock backend (json-server)**

   The project uses `json-server` as a fake REST API.

   ```bash
   npm run server
   ```

   The server will run on `http://localhost:3000`

4. **Run the Angular application**

   In a new terminal:

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:4200`

## 🧪 Running Tests

```bash
# Run service test
ng test --include='**/product.service.spec.ts'

```

## 📝 Available Scripts

- `npm start` - Start the development server
- `npm run server` - Start json-server (mock API)
- `npm test` - Run unit tests
- `npm run build` - Build the project for production

## 🌐 API Endpoints

The mock API provides the following endpoints:

- `GET /products` - Get all products (supports pagination, sorting, filtering)
- `GET /products/:id` - Get a single product
- `POST /products` - Create a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

## 📚 Additional Information

- For form validation rules, see the ProductForm component
- For API caching implementation, see the ProductService
- The project uses Angular's standalone components (no NgModules)
