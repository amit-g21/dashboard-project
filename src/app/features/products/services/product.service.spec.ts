import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products list', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product',
        sku: 'SKU001',
        category: 'Electronics',
        description: 'Test',
        price: 99.99,
        stock: 10,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    service.getProducts(1, 10).subscribe((result) => {
      expect(result.products.length).toBe(1);
      expect(result.products[0].name).toBe('Test Product');
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('http://localhost:3000/products')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts, { headers: { 'X-Total-Count': '1' } });
  });

  it('should get product by id', () => {
    const mockProduct: Product = {
      id: 1,
      name: 'Test Product',
      sku: 'SKU001',
      category: 'Electronics',
      description: 'Test',
      price: 99.99,
      stock: 10,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    service.getProductById(1).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product.name).toBe('Test Product');
    });

    const req = httpMock.expectOne('http://localhost:3000/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create new product', () => {
    const newProduct = {
      name: 'New Product',
      sku: 'SKU002',
      category: 'Books',
      description: 'Test',
      price: 29.99,
      stock: 5,
      isActive: true,
    };

    service.createProduct(newProduct).subscribe((product) => {
      expect(product.name).toBe('New Product');
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('POST');
    req.flush({ ...newProduct, id: 2 });
  });

  it('should update product', () => {
    const updates = { name: 'Updated Name' };

    service.updateProduct(1, updates).subscribe((product) => {
      expect(product.name).toBe('Updated Name');
    });

    const req = httpMock.expectOne('http://localhost:3000/products/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 1, ...updates });
  });

  it('should delete product', () => {
    service.deleteProduct(1).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/products/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
