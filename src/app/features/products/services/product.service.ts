import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product, SortField, SortDirection } from '../models/product.model';

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
    sortDirection?: SortDirection
  ): Observable<{
    products: Product[];
    total: number;
  }> {
    let params = new HttpParams().set('_page', page.toString()).set('_limit', limit.toString());

    if (sortField) {
      params = params.set('_sort', sortField).set('_order', sortDirection || SortDirection.Asc);
    }

    return this.http
      .get<Product[]>(this.apiUrl, {
        params,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          console.info('🚀 ~ ProductService ~ res:', res);
          return {
            products: res.body || [],
            total: Number(res.headers.get('X-Total-Count')) || 0,
          };
        })
      );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    const productPayload: Partial<Product> = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.http.post<Product>(this.apiUrl, productPayload);
  }
}
