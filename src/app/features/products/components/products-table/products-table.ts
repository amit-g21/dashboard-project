import { Component, computed, input, output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Product, SortDirection, SortField } from '../../models/product.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-products-table',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatIcon,
    MatIconButton,
    MatFormFieldModule,
  ],
  templateUrl: './products-table.html',
  styleUrl: './products-table.scss',
})
export class ProductsTable {
  public productsList = input<Product[]>();
  public currentSort = input<string>('none');
  public sortChanged = output<string>();
  public editProduct = output<number>();
  public deleteProduct = output<number>();

  public productsCount = computed(() => {
    return this.productsList()?.length;
  });

  sortOptions: SortOption[] = [
    { value: 'none', label: 'None' },
    { value: `${SortField.Name}-${SortDirection.Asc}`, label: 'Name (A-Z)' },
    { value: `${SortField.Name}-${SortDirection.Desc}`, label: 'Name (Z-A)' },
    { value: `${SortField.Price}-${SortDirection.Asc}`, label: 'Price (Low to High)' },
    { value: `${SortField.Price}-${SortDirection.Desc}`, label: 'Price (High to Low)' },
    { value: `${SortField.CreatedAt}-${SortDirection.Desc}`, label: 'Newest First' },
    { value: `${SortField.CreatedAt}-${SortDirection.Asc}`, label: 'Oldest First' },
  ];

  displayedColumns: string[] = ['name', 'sku', 'category', 'price', 'stock', 'status', 'actions'];

  get dataSource() {
    return this.productsList();
  }

  onSortChange(value: string): void {
    this.sortChanged.emit(value);
  }

  onEdit(productId: number): void {
    this.editProduct.emit(productId);
  }

  onDelete(productId: number): void {
    this.deleteProduct.emit(productId);
  }
}
