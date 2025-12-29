import { Component, computed, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, debounceTime, Subject, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductFilters } from '../product-filters/product-filters';
import { DeleteDialog, DeleteDialogData } from '../../../shared/delete-dialog/delete-dialog';
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
    MatDialogModule,
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
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();

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
    return this.products();
  });

  ngOnInit() {
    this.loadProducts();

    this.searchSubject
      .pipe(debounceTime(700), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchTerm: string) => {
        this.term.set(searchTerm);
        this.currentPage.set(1);
        this.loadProducts();
      });
  }

  loadProducts(): void {
    this.loading.set(true);
    const sort = this.sortBy();
    const filters = this.activeFilters();
    const searchTerm = this.term();
    this.productService
      .getProducts(
        this.currentPage(),
        this.pageSize(),
        sort.field,
        sort.direction,
        filters,
        searchTerm
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ products, total }) => {
          this.products.set(products);
          this.totalProducts.set(total);
        },
        error: (error) => {
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
    this.searchSubject.next(value);
  }

  onFiltersChanged(filters: ProductActiveFilters): void {
    this.activeFilters.set(filters);
    this.currentPage.set(1);
    this.loadProducts();
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

  onEditProduct(productId: number): void {
    this.router.navigate(['/products/edit', productId]);
  }

  onDeleteProduct(productId: number): void {
    const product = this.products().find((p) => p.id === productId);
    const productName = product?.name || 'this product';

    const dialogData: DeleteDialogData = {
      productName: productName,
    };

    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.productService
          .deleteProduct(productId)
          .pipe(tap(() => this.productService.clearCache()))
          .subscribe({
            next: () => {
              this.snackBar.open('Product deleted successfully!', 'Close', {
                duration: 3000,
                horizontalPosition: 'start',
                verticalPosition: 'bottom',
                panelClass: ['success-snackbar'],
              });
              this.loadProducts();
            },
            error: (error) => {
              const errorMessage = error?.message || 'Failed to delete product. Please try again.';
              this.snackBar.open(errorMessage, 'Close', {
                duration: 5000,
                horizontalPosition: 'start',
                verticalPosition: 'bottom',
                panelClass: ['error-snackbar'],
              });
            },
          });
      }
    });
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
