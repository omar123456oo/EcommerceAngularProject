import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ICategory } from '../../../../core/models/api.interface';

interface Slide {
  id: number;
  brand: string;
  brandLogo: string;
  title: string;
  image: string;
  bgColor: string;
}

@Component({
  selector: 'app-home-slider',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css',
})
export class HomeSliderComponent implements OnInit, OnDestroy {
  private categoriesService = inject(CategoriesService);

  currentSlide = signal(0);
  categories = signal<ICategory[]>([]);
  private intervalRef: any;

  slides: Slide[] = [
    {
      id: 1,
      brand: 'iPhone 14 Series',
      brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      title: 'Up to 10% off Voucher',
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
      bgColor: '#000',
    },
    {
      id: 2,
      brand: 'Samsung',
      brandLogo: '',
      title: 'Exclusive Deals on Galaxy S Series',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=280&fit=crop',
      bgColor: '#1a1a2e',
    },
    {
      id: 3,
      brand: 'Sony',
      brandLogo: '',
      title: 'Premium Audio Experience',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=280&fit=crop',
      bgColor: '#0f0f1a',
    },
  ];

  ngOnInit(): void {
    this.startAutoSlide();
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => this.categories.set(res.data),
      error: () => this.categories.set([]),
    });
  }

  ngOnDestroy(): void {
    if (this.intervalRef) clearInterval(this.intervalRef);
  }

  startAutoSlide(): void {
    this.intervalRef = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide.update((i) => (i + 1) % this.slides.length);
  }

  prevSlide(): void {
    this.currentSlide.update((i) => (i - 1 + this.slides.length) % this.slides.length);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    if (this.intervalRef) clearInterval(this.intervalRef);
    this.startAutoSlide();
  }
}
