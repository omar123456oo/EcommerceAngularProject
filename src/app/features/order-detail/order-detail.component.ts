import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../../core/services/orders.service';
import { OrderTrackingService } from '../../core/services/order-tracking.service';
import { IOrder } from '../../core/models/api.interface';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);
  private orderTrackingService = inject(OrderTrackingService);
  private toastr = inject(ToastrService);

  order = signal<IOrder | null>(null);
  isLoading = signal(true);
  loadError = signal(false);
  receivedLocally = signal(false);

  isDelivered = computed(() => !!this.order()?.isDelivered || this.receivedLocally());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      this.loadError.set(true);
      return;
    }
    this.receivedLocally.set(this.orderTrackingService.isReceived(id));
    this.ordersService.getOrderById(id).subscribe({
      next: (res) => {
        const data: IOrder = Array.isArray(res) ? res[0] : res?.data ?? res;
        this.order.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set(true);
      },
    });
  }

  markAsReceived(): void {
    const order = this.order();
    if (!order || this.isDelivered()) return;
    this.orderTrackingService.markReceived(order._id);
    this.receivedLocally.set(true);
    this.toastr.success("Thanks! We've marked your order as delivered.", 'Order Completed');
  }
}
