import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductFilters } from '../product-filters/product-filters';
import { ProductsTable } from '../products-table/products-table';
import {
  Product,
  ProductActiveFilters,
  SortField,
  SortDirection,
  SortConfig,
} from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    ProductFilters,
    ProductsTable,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  public productService = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  products = signal<Product[]>([]);
  activeFilters = signal<ProductActiveFilters>({ categories: [], status: null });

  loading = signal<boolean>(false);
  totalProducts = signal<number>(0);
  term = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = computed(() => Math.ceil(this.totalProducts() / this.pageSize()));

  sortBy = signal<SortConfig>({
    field: null,
    direction: SortDirection.Asc,
  });

  filteredProducts = computed(() => {
    let products = this.products();

    const term = this.term().toLowerCase();
    if (term) {
      products = products.filter((product) => product.name.toLowerCase().includes(term));
    }

    const filters = this.activeFilters();
    if (filters.categories.length > 0) {
      products = products.filter((product) => filters.categories.includes(product.category));
    }

    if (filters.status !== null) {
      products = products.filter((product) => product.isActive === filters.status);
    }

    return products;
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    const sort = this.sortBy();
    this.productService
      .getProducts(this.currentPage(), this.pageSize(), sort.field, sort.direction)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ products, total }) => {
          this.products.set(products);
          this.totalProducts.set(total);
        },
        error: (error) => {
          console.error('Error loading products:', error);
          const errorMessage = error?.message || 'Failed to load products. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'start',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.term.set(value);
  }

  onFiltersChanged(filters: ProductActiveFilters): void {
    this.activeFilters.set(filters);
    this.currentPage.set(1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.loadProducts();
    }
  }

  getStartIndex(): number {
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalProducts());
  }

  onCreateProduct(): void {
    this.router.navigate(['/products/create']);
  }

  onSortChanged(sortValue: string): void {
    if (!sortValue || sortValue === 'none') {
      this.sortBy.set({ field: null, direction: SortDirection.Asc });
    } else {
      const [fieldStr, directionStr] = sortValue.split('-');
      const field = fieldStr as SortField;
      const direction = directionStr as SortDirection;

      if (
        Object.values(SortField).includes(field) &&
        Object.values(SortDirection).includes(direction)
      ) {
        this.sortBy.set({ field, direction });
      }
    }

    this.currentPage.set(1);
    this.loadProducts();
  }

  getCurrentSortValue(): string {
    const sort = this.sortBy();
    if (!sort.field) {
      return 'none';
    }
    return `${sort.field}-${sort.direction}`;
  }
}
