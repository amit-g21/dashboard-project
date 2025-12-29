import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import('./features/products/create-product/create-product').then((m) => m.CreateProduct),
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];
