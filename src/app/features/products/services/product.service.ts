import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product, SortField, SortDirection, ProductActiveFilters } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  private http = inject(HttpClient);

  getProducts(
    page: number,
    limit: number,
    sortField?: SortField | null,
    sortDirection?: SortDirection,
    filters?: ProductActiveFilters,
    searchTerm?: string
  ): Observable<{
    products: Product[];
    total: number;
  }> {
    let params = new HttpParams().set('_page', page.toString()).set('_limit', limit.toString());

    if (sortField) {
      params = params.set('_sort', sortField).set('_order', sortDirection || SortDirection.Asc);
    }

    if (searchTerm && searchTerm.trim()) {
      params = params.set('name_like', searchTerm.trim());
    }

    if (filters?.categories && filters.categories.length > 0) {
      filters.categories.forEach((category) => {
        params = params.append('category', category);
      });
    }

    if (filters?.status !== null && filters?.status !== undefined) {
      params = params.set('isActive', filters.status.toString());
    }

    return this.http
      .get<Product[]>(this.apiUrl, {
        params,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return {
            products: res.body || [],
            total: Number(res.headers.get('X-Total-Count')) || 0,
          };
        })
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    const productPayload: Partial<Product> = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.http.post<Product>(this.apiUrl, productPayload);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const productPayload: Partial<Product> = {
      ...product,
      updatedAt: new Date(),
    };
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productPayload);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
