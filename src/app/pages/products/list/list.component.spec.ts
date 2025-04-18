import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ListComponent } from './list.component';
import { ProductService } from '../../../services/product/product.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// 🧪 Mock global de SweetAlert
import Swal from 'sweetalert2';

jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true })
}));

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const productServiceMock = {
    getAll: jest.fn().mockReturnValue(of([])),
    delete: jest.fn().mockReturnValue(of({ message: 'Deleted' }))
  };

  const routerMock = {
    navigate: jest.fn()
  };

  const snackBarMock = {
    open: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ListComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        TranslateService,
        TranslateStore
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceMock.getAll).toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should navigate to edit with product', () => {
    const product = { id: '123', name: '', description: '', logo: '', date_release: '', date_revision: '' };
    component.goToEdit(product);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products', '123'], { state: { product } });
  });

  it('should navigate to new product when null passed', () => {
    component.goToEdit(null);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products/new'], { state: { product: null } });
  });

  it('should filter products by search value', () => {
    component.products = [
      { id: '1', name: 'Test', description: 'Desc', logo: '', date_release: '', date_revision: '' }
    ];
    component.filterValue = 'test';
    component.onSearchChange();
    expect(component.filteredProducts.length).toBe(1);
  });

  it('should handle error on loadProducts', () => {
    productServiceMock.getAll.mockReturnValueOnce(throwError(() => 'Error'));
    component.loadProducts();
    expect(component.error).toContain('common.error');
    expect(component.loading).toBe(false);
  });

  it('should call delete when confirmed', async () => {
    const product = {
      id: '123',
      name: 'Mock Product',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    };

    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });
    productServiceMock.delete.mockReturnValueOnce(of({ message: 'Deleted!' }));

    await component.onDelete(product);
    fixture.detectChanges();

    expect(productServiceMock.delete).toHaveBeenCalledWith('123');
    expect(snackBarMock.open).not.toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        duration: 5000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
    );
  });

  it('should NOT call delete when cancelled', fakeAsync(() => {
    const product = {
      id: '123',
      name: 'Mock Product',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    };

    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: false }); // usuario cancela

    component.onDelete(product);
    tick();

    expect(productServiceMock.delete).not.toHaveBeenCalled();
    expect(snackBarMock.open).not.toHaveBeenCalled();
  }));

  it('should not call delete when product is null', () => {
    component.onDelete(null);
    expect(productServiceMock.delete).not.toHaveBeenCalled();
  });
});
