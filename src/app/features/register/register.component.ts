import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const pass = control.get('password');
  const rePass = control.get('rePassword');
  if (pass && rePass && pass.value !== rePass.value) {
    rePass.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);

  isLoading = signal(false);
  showPassword = signal(false);
  showRePassword = signal(false);
  serverError = signal('');

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
    ]),
    rePassword: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
  }, { validators: passwordMatchValidator });

  get nameCtrl() { return this.registerForm.get('name')!; }
  get emailCtrl() { return this.registerForm.get('email')!; }
  get passwordCtrl() { return this.registerForm.get('password')!; }
  get rePasswordCtrl() { return this.registerForm.get('rePassword')!; }
  get phoneCtrl() { return this.registerForm.get('phone')!; }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.serverError.set('');
    this.spinner.show();

    this.authService.register(this.registerForm.value as any).subscribe({
      next: (res) => {
        this.toastr.success('Account created! Please login.', 'Success');
        this.router.navigate(['/login']);
        this.isLoading.set(false);
        this.spinner.hide();
      },
      error: (err) => {
        this.serverError.set(err.error?.message || 'Registration failed. Please try again.');
        this.isLoading.set(false);
        this.spinner.hide();
      },
    });
  }
}
