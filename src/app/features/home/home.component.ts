import { Component } from '@angular/core';
import { HomeSliderComponent } from './components/home-slider/home-slider.component';
import { HomeCategoryComponent } from './components/home-category/home-category.component';
import { HomeProductComponent } from './components/home-product/home-product.component';

@Component({
  selector: 'app-home',
  imports: [HomeSliderComponent, HomeCategoryComponent, HomeProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
