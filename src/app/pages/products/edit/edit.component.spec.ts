import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditComponent } from './edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '../../../model/product';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  const mockProduct = {
    id: 'PROD1',
    name: 'Test Product',
    description: 'Some description',
    logo: 'https://logo.png',
    date_release: new Date().toISOString().split('T')[0],
    date_revision: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  };

  const productServiceMock = {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    verifyId: jest.fn()
  };

  const routeMock = {
    snapshot: {
      paramMap: {
        get: jest.fn()
      }
    }
  };

  const routerMock = {
    navigate: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EditComponent, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        TranslateService,
        TranslateStore
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    routeMock.snapshot.paramMap.get.mockReturnValue(null); // isNew = true
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form as new', () => {
    expect(component.isNew).toBe(true);
    expect(component.form.get('id')?.disabled).toBe(false);
  });

  it('should patch product data when editing', () => {
    routeMock.snapshot.paramMap.get.mockReturnValue('PROD1');
    productServiceMock.getById.mockReturnValue(of(mockProduct));
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.form.value.name).toBe(mockProduct.name);
  });

  it('should update date_revision when date_release changes', () => {
    const releaseDate = new Date().toISOString().split('T')[0];
    component.form.get('date_release')?.setValue(releaseDate);
    const expected = new Date(releaseDate);
    expected.setFullYear(expected.getFullYear() + 1);
    expect(component.form.get('date_revision')?.value).toBe(expected.toISOString().split('T')[0]);
  });

  it('should show error if ID is taken', () => {
    component.form.get('id')?.setValue('DUPLICATED_ID');
    productServiceMock.verifyId.mockReturnValue(of(true));
    component.onIdBlur();
    expect(component.form.get('id')?.hasError('idTaken')).toBe(true);
  });

  it('should remove idTaken error if ID is available', () => {
    const idControl = component.form.get('id');
    idControl?.setValue('UNIQUE_ID');
    idControl?.setErrors({ idTaken: true });
    productServiceMock.verifyId.mockReturnValue(of(false));
    component.onIdBlur();
    expect(idControl?.hasError('idTaken')).toBe(false);
  });

  it('should mark form as touched when invalid on submit', () => {
    component.form.get('name')?.setValue('');
    component.onSubmit();
    expect(component.form.get('name')?.touched).toBe(true);
  });

  it('should reset form and disable revision date', () => {
    component.isNew = true;
    component.onReset();
    expect(component.form.get('date_release')?.enabled).toBe(true);
    expect(component.form.get('date_revision')?.disabled).toBe(true);
  });

  it('should navigate to /products on cancel', () => {
    component.onCancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should validate minDate', () => {
    const validator = component.minDateValidator();
    const past = new Date(Date.now() - 86400000); // ayer
    const future = new Date(Date.now() + 86400000);
    expect(validator({ value: formatDate(past) } as AbstractControl)).toEqual({ minDate: true });
    expect(validator({ value: formatDate(future) } as AbstractControl)).toBeNull();
  });

  it('should call create and navigate on successful new product submission', () => {
    component.isNew = true;
    component.form.setValue(mockProduct);
    productServiceMock.create.mockReturnValue(of({ message: 'Created!', data: { id: 'PROD1' } }));

    jest.useFakeTimers();
    component.onSubmit();
    jest.advanceTimersByTime(700);

    expect(productServiceMock.create).toHaveBeenCalledWith(mockProduct);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products', 'PROD1']);
    jest.useRealTimers();
  });

  it('should call update and show message on existing product submission', () => {
    routeMock.snapshot.paramMap.get.mockReturnValue('PROD1');
    component.isNew = false;
    component.productId = 'PROD1';
    component.form.setValue(mockProduct);
    productServiceMock.update.mockReturnValue(of({ message: 'Updated!' }));

    component.onSubmit();

    expect(productServiceMock.update).toHaveBeenCalledWith('PROD1', mockProduct);
    expect(component.message).toBe('Updated!');
    expect(component.messageType).toBe('success');
  });

  it('should show error message if create fails', () => {
    component.isNew = true;
    component.form.setValue(mockProduct);
    productServiceMock.create.mockReturnValue(throwError(() => ({ error: { message: 'Create failed' } })));

    component.onSubmit();

    expect(component.message).toBe('Create failed');
    expect(component.messageType).toBe('error');
  });

  it('should show error message if update fails', () => {
    component.isNew = false;
    component.productId = 'PROD1';
    component.form.setValue(mockProduct);
    productServiceMock.update.mockReturnValue(throwError(() => ({ error: { message: 'Update failed' } })));

    component.onSubmit();

    expect(component.message).toBe('Update failed');
    expect(component.messageType).toBe('error');
  });

  it('should clear message after 700ms in showMessage', () => {
    jest.useFakeTimers();
    component.showMessage('Test', 'success');
    expect(component.message).toBe('Test');
    jest.advanceTimersByTime(700);
    expect(component.message).toBe('');
    expect(component.messageType).toBe('');
    jest.useRealTimers();
  });
});
