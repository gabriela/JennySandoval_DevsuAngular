import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { formatDate, Product } from '../../../model/product';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  productId: string | null = null;
  isNew = true;
  today = formatDate(new Date());

  message = '';
  messageType: 'success' | 'error' | '' = '';

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.isNew = !this.productId;

    this.buildForm();

    if (!this.isNew && this.productId) {
      this.loadProduct();
    }

    this.form.get('date_release')?.valueChanges.subscribe(value => {
      if (value) this.updateRevisionDate(value);
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      id: [
        { value: '', disabled: !this.isNew },
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: [
        '',
        [Validators.required, Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i)]
      ],
      date_release: [
        { value: '', disabled: !this.isNew },
        [Validators.required, this.minDateValidator()]
      ],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    });
  }

  private loadProduct(): void {
    this.productService.getById(this.productId!).subscribe({
      next: (data) => this.form.patchValue(data),
      error: (err) => console.error('Error loading product:', err)
    });
  }

  showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 700);
  }

  onIdBlur(): void {
    const idControl = this.form.get('id');
    const idValue = idControl?.value?.trim();

    if (idControl && idValue) {
      this.productService.verifyId(idValue).subscribe({
        next: (exists) => {
          const currentErrors = idControl.errors || {};
          if (exists) {
            idControl.setErrors({ ...currentErrors, idTaken: true });
          } else {
            delete currentErrors['idTaken'];
            idControl.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
          }
        },
        error: (err) =>
          this.showMessage(
            err.error?.message || this.translate.instant('common.error'),
            'error'
          )
      });
    }
  }

  updateRevisionDate(releaseDate: string | Date): void {
    const d = new Date(releaseDate);
    d.setFullYear(d.getFullYear() + 1);
    const formatted = d.toISOString().split('T')[0];
    this.form.get('date_revision')?.setValue(formatted);
  }

  minDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value < this.today) {
        return { minDate: true };
      }
      return null;
    };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const product: Product = this.form.getRawValue();

    const request = this.isNew
      ? this.productService.create(product)
      : this.productService.update(this.productId!, product);

    request.subscribe({
      next: (res) => {
        const msgKey = this.isNew ? 'form.snackbar.createSuccess' : 'form.snackbar.updateSuccess';
        const message = res.message || this.translate.instant(msgKey);

        this.showMessage(message, 'success');

        if (this.isNew) {
          setTimeout(() => {
            this.router.navigate(['/products', res.data.id]);
          }, 700);
        }
      },
      error: (err) => {
        const errorKey = this.isNew ? 'form.snackbar.createError' : 'form.snackbar.updateError';
        this.showMessage(err.error?.message || this.translate.instant(errorKey), 'error');
      }
    });
  }

  onReset(): void {
    this.form.reset();
    if (this.isNew) {
      this.form.get('date_release')?.enable();
      this.form.get('date_revision')?.disable();
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
