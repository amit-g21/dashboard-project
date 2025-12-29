import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Product, SubmitMode } from '../../models/product.model';
import { categoryList } from '../../constants/products.constans';

@Component({
  selector: 'app-product-form',
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
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  private fb = inject(FormBuilder);

  mode = input.required<SubmitMode>();
  title = input<string>('Product Form');
  subTitle = input<string>('');
  initialData = input<Product | null>(null);
  isLoading = input<boolean>(false);
  isSubmitting = input<boolean>(false);

  formSubmit = output<Product>();
  formCancel = output<void>();

  public productForm!: FormGroup;
  public categoryList = categoryList;

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.populateForm(data);
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });
  }

  private populateForm(product: Product): void {
    this.productForm.patchValue(product);
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isSubmitting()) {
      this.formSubmit.emit(this.productForm.value);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
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
