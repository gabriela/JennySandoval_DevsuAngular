import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product/product.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  message: string = ''; // para mostrar mensajes simples en UI
  columns: string[] = ['logo', 'name', 'description', 'date_release', 'date_revision'];

  private productService = inject(ProductService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.message = '';
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

    const confirmMsg = this.translate.instant('list.deleteConfirmTitle', { name: product.name });
    if (window.confirm(confirmMsg)) {
      this.productService.delete(product.id).subscribe({
        next: (res) => {
          this.message = res.message;
          this.loadProducts();
        },
        error: (err) => {
          this.message = this.translate.instant('form.snackbar.deleteError');
          console.error(err);
        }
      });
    }
  }
}
