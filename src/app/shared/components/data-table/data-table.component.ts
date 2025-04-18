import { CommonModule } from '@angular/common';
import {
  Component, EventEmitter, Input, Output, ViewChild,
  AfterViewInit, OnChanges, SimpleChanges,
  OnInit
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() set filter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return Object.values(data).some(val =>
        String(val).toLowerCase().includes(filter)
      );
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }

    if (changes['columns']) {
      this.displayedColumns = [...this.columns, 'actions'];
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  isIsoDate(value: any): boolean {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value);
  }

  onEdit(id: any) {
    this.edit.emit(id);
  }

  onDelete(id: any) {
    this.delete.emit(id);
  }
}