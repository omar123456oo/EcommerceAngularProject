import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeSliderComponent } from './components/home-slider/home-slider.component';
import { HomeCategoryComponent } from './components/home-category/home-category.component';
import { HomeProductComponent } from './components/home-product/home-product.component';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  imports: [HomeSliderComponent, HomeCategoryComponent, HomeProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['paymentSuccess'] === 'true') {
      this.toastr.success('Your payment went through — track its progress in My Orders.', 'Order Confirmed');
      this.cartService.cartCount.set(0);
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
    }
  }
}
