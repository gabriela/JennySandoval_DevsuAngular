import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ListComponent } from './list.component';
import { ProductService } from '../../../services/product/product.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ListComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
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

  it('should delete product when confirmed', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const product = {
      id: '123',
      name: 'Mock Product',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    };

    component.onDelete(product);
    expect(confirmSpy).toHaveBeenCalled();
    expect(productServiceMock.delete).toHaveBeenCalledWith('123');
  });

  it('should NOT delete product when cancelled', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
    const product = {
      id: '123',
      name: 'Mock Product',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    };

    component.onDelete(product);
    expect(confirmSpy).toHaveBeenCalled();
    expect(productServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should not call delete when product is null', () => {
    component.onDelete(null);
    expect(productServiceMock.delete).not.toHaveBeenCalled();
  });
});
