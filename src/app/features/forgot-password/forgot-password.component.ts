import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  step = signal<'email' | 'code' | 'reset'>('email');
  isLoading = signal(false);
  userEmail = signal('');

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  codeForm = new FormGroup({
    resetCode: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  resetForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  sendEmail(): void {
    if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.authService.forgotPassword(this.emailForm.value.email!).subscribe({
      next: () => {
        this.userEmail.set(this.emailForm.value.email!);
        this.toastr.success('Reset code sent to your email', 'Check Email');
        this.step.set('code');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Email not found', 'Error');
        this.isLoading.set(false);
      },
    });
  }

  verifyCode(): void {
    if (this.codeForm.invalid) { this.codeForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.authService.verifyResetCode(this.codeForm.value.resetCode!).subscribe({
      next: () => {
        this.toastr.success('Code verified!', 'Success');
        this.step.set('reset');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Invalid code', 'Error');
        this.isLoading.set(false);
      },
    });
  }

  resetPassword(): void {
    if (this.resetForm.invalid) { this.resetForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.authService.resetPassword(this.userEmail(), this.resetForm.value.newPassword!).subscribe({
      next: () => {
        this.toastr.success('Password reset successfully! Please login.', 'Done');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Reset failed', 'Error');
        this.isLoading.set(false);
      },
    });
  }
}
