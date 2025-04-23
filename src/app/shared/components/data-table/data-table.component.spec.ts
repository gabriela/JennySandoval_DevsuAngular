import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataTableComponent,
        TranslateModule.forRoot() // ✅ Necesario para proveer TranslateService y TranslateStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;

    // Datos de prueba mínimos
    component.columns = ['id', 'name'];
    component.data = [
      { id: 1, name: 'Producto 1' },
      { id: 2, name: 'Producto 2' },
      { id: 3, name: 'Producto 3' }
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter data correctly', () => {
    component.filter = 'producto 2';
    component.applyFilter();
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].name).toBe('Producto 2');
  });

  it('should paginate data correctly', () => {
    component.pageSize = 2;
    component.applyFilter();
    expect(component.pagedData.length).toBe(2);
    component.nextPage();
    expect(component.currentPage).toBe(1);
  });

  it('should emit edit event', () => {
    const item = component.data[0];
    const emitSpy = jest.spyOn(component.edit, 'emit');
    component.onEdit(item);
    expect(emitSpy).toHaveBeenCalledWith(item);
  });

  it('should emit delete event', () => {
    const item = component.data[1];
    const emitSpy = jest.spyOn(component.delete, 'emit');
    component.onDelete(item);
    expect(emitSpy).toHaveBeenCalledWith(item);
  });

  it('should toggle dropdown', () => {
    const item = component.data[0];
    component.toggleDropdown(item);
    expect(component.dropdownOpen).toBe(item);
    component.toggleDropdown(item);
    expect(component.dropdownOpen).toBeNull();
  });
});
