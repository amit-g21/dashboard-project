import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/pages/product-list-page/product-list-page').then(
        (m) => m.ProductList
      ),
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import('./features/products/pages/create-product-page/create-product-page').then(
        (m) => m.CreateProduct
      ),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./features/products/pages/edit-product-page/edit-product-page').then(
        (m) => m.EditProduct
      ),
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];
