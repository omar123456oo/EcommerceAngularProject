import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AddressesService } from '../../core/services/addresses.service';
import { AuthService } from '../../core/services/auth.service';
import { ProfilePhotoService } from '../../core/services/profile-photo.service';
import { ToastrService } from 'ngx-toastr';
import QRCode from 'qrcode';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private addressesService = inject(AddressesService);
  private authService = inject(AuthService);
  profilePhotoService = inject(ProfilePhotoService);
  private toastr = inject(ToastrService);

  activeTab = signal<'info' | 'password' | 'addresses' | 'qrcode'>('info');

  // User Info
  userData = { name: '', email: '', phone: '' };
  isUpdatingInfo = signal(false);

  // QR Code
  qrDataUrl = signal<string | null>(null);
  isGeneratingQr = signal(false);

  // Password
  passwordData = { currentPassword: '', password: '', rePassword: '' };
  isUpdatingPassword = signal(false);

  // Addresses
  addresses = signal<any[]>([]);
  isAddressesLoading = signal(false);
  newAddress = { name: '', details: '', phone: '', city: '' };
  showAddAddress = signal(false);
  isAddingAddress = signal(false);

  ngOnInit(): void {
    this.loadUserData();
    this.loadAddresses();
  }

  loadUserData(): void {
    this.userService.getLoggedInUser().subscribe({
      next: (res) => {
        const user = res.data || res;
        this.userData = {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        };
      },
    });
  }

  setTab(tab: 'info' | 'password' | 'addresses' | 'qrcode') {
    this.activeTab.set(tab);
    if (tab === 'addresses') {
      this.loadAddresses();
    }
    if (tab === 'qrcode') {
      this.generateQrCode();
    }
  }

  updateInfo() {
    this.isUpdatingInfo.set(true);
    this.userService.updateUserData(this.userData).subscribe({
      next: (res) => {
        this.toastr.success('Profile updated successfully');
        this.isUpdatingInfo.set(false);
      },
      error: () => this.isUpdatingInfo.set(false)
    });
  }

  updatePassword() {
    if (this.passwordData.password !== this.passwordData.rePassword) {
      this.toastr.error('Passwords do not match');
      return;
    }
    this.isUpdatingPassword.set(true);
    this.userService.changePassword(this.passwordData).subscribe({
      next: (res) => {
        this.toastr.success('Password updated successfully');
        this.isUpdatingPassword.set(false);
        this.passwordData = { currentPassword: '', password: '', rePassword: '' };
      },
      error: () => this.isUpdatingPassword.set(false)
    });
  }

  loadAddresses() {
    this.isAddressesLoading.set(true);
    this.addressesService.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res.data);
        this.isAddressesLoading.set(false);
      },
      error: () => this.isAddressesLoading.set(false)
    });
  }

  addAddress() {
    this.isAddingAddress.set(true);
    this.addressesService.addAddress(this.newAddress).subscribe({
      next: (res) => {
        this.toastr.success('Address added successfully');
        this.addresses.update(addrs => [...addrs, res.data]);
        this.showAddAddress.set(false);
        this.isAddingAddress.set(false);
        this.newAddress = { name: '', details: '', phone: '', city: '' };
        this.loadAddresses();
      },
      error: () => this.isAddingAddress.set(false)
    });
  }

  removeAddress(id: string) {
    this.addressesService.removeAddress(id).subscribe({
      next: () => {
        this.toastr.success('Address removed');
        this.addresses.update(addrs => addrs.filter(a => a._id !== id));
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastr.error('Please choose an image file', 'Invalid File');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toastr.error('Image must be smaller than 5MB', 'File Too Large');
      return;
    }
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.resizeImage(file, 300)
      .then((dataUrl) => {
        this.profilePhotoService.setPhoto(userId, dataUrl);
        this.toastr.success('Profile photo updated!', 'Photo');
      })
      .catch(() => this.toastr.error('Could not read that image', 'Error'));
  }

  removePhoto(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.profilePhotoService.removePhoto(userId);
    this.toastr.info('Profile photo removed', 'Photo');
  }

  private buildProfileVCard(): string {
    const { name, email, phone } = this.userData;
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${name || 'User'}`,
      email ? `EMAIL:${email}` : '',
      phone ? `TEL:${phone}` : '',
      'END:VCARD',
    ].filter(Boolean).join('\n');
  }

  generateQrCode(): void {
    this.isGeneratingQr.set(true);
    QRCode.toDataURL(this.buildProfileVCard(), {
      width: 260,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then((url) => {
        this.qrDataUrl.set(url);
        this.isGeneratingQr.set(false);
      })
      .catch(() => {
        this.toastr.error('Could not generate QR code', 'Error');
        this.isGeneratingQr.set(false);
      });
  }

  downloadQrCode(): void {
    const url = this.qrDataUrl();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-profile-qr.png';
    a.click();
  }

  async shareQrCode(): Promise<void> {
    const url = this.qrDataUrl();
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], 'my-profile-qr.png', { type: 'image/png' });

      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({
          title: 'My Profile QR Code',
          text: `Scan to get ${this.userData.name || 'my'} contact details`,
          files: [file],
        });
      } else {
        this.downloadQrCode();
        this.toastr.info('Sharing not supported here — downloaded the QR code instead', 'QR Code');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        this.toastr.error('Could not share QR code', 'Error');
      }
    }
  }

  private resizeImage(file: File, maxSize: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height >= width && height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }
}
