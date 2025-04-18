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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ProductService } from '../../../services/product/product.service';
import { Product } from '../../../model/product';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  productId: string | null = null;
  isNew: boolean = true;
  today: Date = new Date(new Date().setHours(0, 0, 0, 0));

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.isNew = !this.productId;

    this.form = this.fb.group({
      id: [{ value: '', disabled: !this.isNew }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i)]],
      date_release: [
        { value: '', disabled: !this.isNew },
        [Validators.required, this.minDateValidator()]
      ],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    });

    if (!this.isNew && this.productId) {
      this.productService.getById(this.productId).subscribe({
        next: (data) => {
          this.form.patchValue(data);
          this.updateRevisionDate(data.date_release);
        },
        error: (err) => console.error('Error trying to ger product: ', err)
      });
    }

    this.form.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        this.updateRevisionDate(value);
      }
    });
  }

  onIdBlur(): void {
    const idControl = this.form.get('id');
    const idValue = idControl?.value?.trim();

    if (idControl && idValue) {
      this.productService.verifyId(idValue).subscribe({
        next: (exists) => {
          if (exists) {
            idControl.setErrors({ idTaken: true });
          } else {
            const currentErrors = idControl.errors;
            if (currentErrors) {
              delete currentErrors['idTaken'];
              if (Object.keys(currentErrors).length === 0) {
                idControl.setErrors(null);
              } else {
                idControl.setErrors(currentErrors);
              }
            }
          }
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || this.translate.instant('common.error'), this.translate.instant('buttons.close'), {
            duration: 5000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  updateRevisionDate(releaseDate: string | Date) {
    const d = new Date(releaseDate);
    d.setFullYear(d.getFullYear() + 1);
    const formatted = d.toISOString().split('T')[0];
    this.form.get('date_revision')?.setValue(formatted);
  }

  minDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = new Date(control.value).setHours(0, 0, 0, 0);
      if (value < this.today.getTime()) {
        return { minDate: true };
      }
      return null;
    };
  }

  onSubmit() {
    if (this.form.valid) {
      const product: Product = this.form.getRawValue();

      if (this.isNew) {
        this.productService.create(product).subscribe({
          next: (res) => {
            const message = res.message || this.translate.instant('form.snackbar.createSuccess');
            this.snackBar.open(message, this.translate.instant('buttons.accept'), {
              duration: 5000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }).afterDismissed().subscribe(() => {
              this.router.navigate(['/products', res.data.id]);
            });
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || this.translate.instant('form.snackbar.createError'), this.translate.instant('buttons.close'), {
              duration: 5000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
      } else {
        this.productService.update(this.productId!, product).subscribe({
          next: (res) => {
            const message = res.message || this.translate.instant('form.snackbar.updateSuccess');
            this.snackBar.open(message, this.translate.instant('buttons.close'), {
              duration: 4000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || this.translate.instant('form.snackbar.updateError'), this.translate.instant('buttons.close'), {
              duration: 5000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
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