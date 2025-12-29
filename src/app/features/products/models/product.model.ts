export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductActiveFilters {
  categories: string[];
  status: boolean | null;
}

export enum SortField {
  Name = 'name',
  Price = 'price',
  CreatedAt = 'createdAt',
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}
