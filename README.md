Product Management Dashboard

Angular application for managing products in an e-commerce catalog.
The project demonstrates clean architecture, RxJS usage, reactive forms, caching, and basic product CRUD flows.

---

📌 Features

Product list with:

Search

Filters (category, status)

Sorting

Pagination

Create new product

Edit existing product

Reactive Forms with validation

Clear UI states: loading, empty state, error handling

Client-side caching using RxJS

Strong typing with TypeScript

Feature-based folder structure

---

🧱 Tech Stack

Angular

Angular Material

RxJS

json-server (mock backend)

TypeScript

---

📁 Project Structure

src/
├── app/
│ ├── features/
│ │ └── products/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── models/
│ │
│ ├── shared/

pages – routed pages (list, create, edit)

components – reusable UI components

services – API and data access

models – strongly typed interfaces and enums

---

🚀 Getting Started

1. Clone the repository

git clone
cd dashboard-project.

2. Install dependencies
   npm install

3. Run mock backend (json-server)

The project uses json-server as a fake REST API.

npm run server

4. Run the Angular application

npm start
