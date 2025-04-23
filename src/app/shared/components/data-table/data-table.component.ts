import { CommonModule } from '@angular/common';
import {
  Component, EventEmitter, Input, Output,
  OnChanges, SimpleChanges, OnInit, HostListener, ElementRef
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule 
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() filter: string = '';
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  displayedColumns: string[] = [];
  filteredData: any[] = [];

  // Paginación
  currentPage = 0;
  pageSize = 5;
  pagedData: any[] = [];

  dropdownOpen: any = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.displayedColumns = [...this.columns, 'actions'];
    this.applyFilter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['filter']) {
      this.applyFilter();
    }
  }

  applyFilter(): void {
    const filterValue = this.filter.trim().toLowerCase();
    this.filteredData = this.data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(filterValue)
      )
    );
    this.currentPage = 0;
    this.paginate();
  }

  paginate(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.filteredData.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.paginate();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.paginate();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.paginate();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  isIsoDate(value: any): boolean {
    return typeof value === 'string' && /^\d{2}-\d{2}-\d{4}T/.test(value);
  }

  onEdit(item: any) {
    this.edit.emit(item);
    this.dropdownOpen = null;
  }

  onDelete(item: any) {
    this.delete.emit(item);
    this.dropdownOpen = null;
  }

  toggleDropdown(item: any): void {
    this.dropdownOpen = this.dropdownOpen === item ? null : item;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.dropdownOpen = null;
    }
  }
}
