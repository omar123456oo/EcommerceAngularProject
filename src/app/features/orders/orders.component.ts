import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../core/services/orders.service';
import { AuthService } from '../../core/services/auth.service';
import { IOrder } from '../../core/models/api.interface';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);

  orders = signal<IOrder[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.isLoading.set(false);
      return;
    }
    this.ordersService.getUserOrders(userId).subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res : (res as any)?.data || [];
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
