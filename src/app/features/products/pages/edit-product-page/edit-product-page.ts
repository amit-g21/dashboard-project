import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product, SubmitMode } from '../../models/product.model';
import { ProductForm } from '../../components/product-form/product-form';

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
    ProductForm,
  ],
  templateUrl: './edit-product-page.html',
  styleUrl: './edit-product-page.scss',
})
export class EditProduct implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  public product = signal<Product | null>(null);
  public isLoading = signal(true);
  public isSubmitting = signal(false);

  public mode = SubmitMode.Edit;
  public title = 'Edit Product';
  public subTitle = 'Update the product information';

  private productId!: number;

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.snackBar.open('Invalid product ID', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/products']);
      return;
    }

    this.productId = Number(id);
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        const message = error?.message || 'Failed to load product';
        this.snackBar.open(message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.router.navigate(['/products']);
      },
    });
  }

  onSubmit(product: Product): void {
    this.isSubmitting.set(true);

    this.productService
      .updateProduct(this.productId, product)
      .pipe(tap(() => this.productService.clearCache()))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.snackBar.open('Product updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          const message = error?.message || 'Failed to update product';
          this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
