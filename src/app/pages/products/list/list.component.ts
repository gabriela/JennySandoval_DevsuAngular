import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import Swal from 'sweetalert2';

import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product/product.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslateModule,
    DataTableComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  error: string = '';
  filterValue: string = '';
  loading: boolean = true;
  columns: string[] = ['logo', 'name', 'description', 'date_release', 'date_revision'];

  private productService = inject(ProductService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => {
        this.error = this.translate.instant('common.error') + ': ' + err;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    const filter = this.filterValue.trim().toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      Object.values(product).some(val =>
        String(val).toLowerCase().includes(filter)
      )
    );
  }

  goToEdit(product: Product | null = null): void {
    const route = product ? ['/products', product.id] : ['/products/new'];
    this.router.navigate(route, { state: { product } });
  }

  onDelete(product: Product | null = null): void {
    if (!product) return;

    Swal.fire({
      title: this.translate.instant('list.deleteConfirmTitle', { name: product.name }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('buttons.confirm'),
      cancelButtonText: this.translate.instant('buttons.cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(product.id).subscribe({
          next: (res) => {
            this.snackBar.open(res.message, this.translate.instant('buttons.accept'), {
              duration: 5000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.loadProducts();
          },
          error: (err) => {
            this.snackBar.open(
              this.translate.instant('form.snackbar.deleteError'),
              this.translate.instant('buttons.close'),
              {
                duration: 5000,
                panelClass: ['snackbar-error'],
                horizontalPosition: 'right',
                verticalPosition: 'top'
              }
            );
            console.error(err);
          }
        });
      }
    });
  }
}
