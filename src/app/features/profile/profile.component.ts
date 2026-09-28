import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AddressesService } from '../../core/services/addresses.service';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

  activeTab = signal<'info' | 'password' | 'addresses'>('info');
  
  // User Info
  userData = { name: '', email: '', phone: '' };
  isUpdatingInfo = signal(false);

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

  setTab(tab: 'info' | 'password' | 'addresses') {
    this.activeTab.set(tab);
    if (tab === 'addresses') {
      this.loadAddresses();
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
}
