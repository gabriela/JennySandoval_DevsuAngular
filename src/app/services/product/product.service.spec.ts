import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService, Response } from './product.service';
import { Product } from '../../model/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: '123',
    name: 'Product',
    description: 'Description',
    logo: 'http://logo.com/image.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    service.getAll().subscribe((products) => {
      expect(products).toEqual([mockProduct]);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');

    req.flush({ data: [mockProduct] });
  });

  it('should get product by id', () => {
    service.getById('123').subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/123');
    expect(req.request.method).toBe('GET');

    req.flush(mockProduct);
  });

  it('should verify if id exists', () => {
    service.verifyId('123').subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/verification/123');
    expect(req.request.method).toBe('GET');

    req.flush(true);
  });

  it('should create a product', () => {
    const mockResponse: Response = {
      data: mockProduct,
      message: 'Created'
    };

    service.create(mockProduct).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);

    req.flush(mockResponse);
  });

  it('should update a product', () => {
    const mockResponse: Response = {
      data: mockProduct,
      message: 'Updated'
    };

    service.update('123', mockProduct).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/123');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);

    req.flush(mockResponse);
  });

  it('should delete a product', () => {
    const mockResponse = { message: 'Deleted' };

    service.delete('123').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/123');
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });
});
