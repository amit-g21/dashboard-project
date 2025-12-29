import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { ProductActiveFilters } from '../../models/product.model';
import { categoryList, statusList } from '../../constants/products.constans';

@Component({
  selector: 'app-product-filters',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatButton,
  ],
  templateUrl: './product-filters.html',
  styleUrl: './product-filters.scss',
})
export class ProductFilters {
  filtersChanged = output<ProductActiveFilters>();

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  public filterForm!: FormGroup;
  public categoryList = categoryList;
  public statusList = statusList;

  ngOnInit() {
    this.filterForm = this.fb.group({
      categories: [[]],
      status: [null],
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.filtersChanged.emit({
          categories: value.categories || [],
          status: value.status,
        });
      });
  }

  clearFilters(): void {
    this.filterForm.reset({
      categories: [],
      status: null,
    });
  }
}
