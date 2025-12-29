import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Product, SubmitMode } from '../models/product.model';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-create-product',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ProductForm,
  ],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
})
export class CreateProduct {
  private router = inject(Router);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  mode = SubmitMode.Create;
  title = 'Create New Product';
  subTitle = 'Fill in the details to add a new product to your inventory';
  isSubmitting = signal(false);

  onSubmit(product: Product): void {
    this.isSubmitting.set(true);

    this.productService.createProduct(product).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.snackBar.open('Product created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'start',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        const message = error?.message || 'Failed to create product. Please try again.';
        this.snackBar.open(message, 'Close', {
          duration: 5000,
          horizontalPosition: 'start',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
