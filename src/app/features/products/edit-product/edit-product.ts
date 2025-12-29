import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../services/product.service';
import { categoryList } from '../constants/products.constants';

@Component({
  selector: 'app-edit-product',
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
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  public isSubmitting = signal<boolean>(false);
  public isLoading = signal<boolean>(true);
  public categoryList = categoryList;
  public productForm!: FormGroup;
  private productId!: number;

  ngOnInit(): void {
    this.initializeForm();
    this.loadProduct();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });
  }

  private loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.snackBar.open('Invalid product ID', 'Close', {
        duration: 3000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/products']);
      return;
    }

    this.productId = Number(id);
    this.isLoading.set(true);

    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.populateForm(product);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading.set(false);
        const errorMessage = error?.message || 'Failed to load product. Please try again.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'start',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
        this.router.navigate(['/products']);
      },
    });
  }

  private populateForm(product: any): void {
    this.productForm.patchValue({
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price || 0,
      stock: product.stock || 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
    });
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      const formValue = this.productForm.value;

      this.productService.updateProduct(this.productId, formValue).subscribe({
        next: () => {
          this.snackBar.open('Product updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'start',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          const errorMessage = error?.message || 'Failed to update product. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'start',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `Min length is ${minLength} characters`;
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return `Max length is ${maxLength} characters`;
    }
    if (field?.hasError('min')) {
      return `Value must be greater than 0`;
    }
    return '';
  }
}
