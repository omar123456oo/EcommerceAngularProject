import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../core/services/categories.service';
import { IBrand } from '../../core/models/api.interface';

@Component({
  selector: 'app-brands',
  imports: [CommonModule, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private categoriesService = inject(CategoriesService);

  brands = signal<IBrand[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.categoriesService.getAllBrands().subscribe({
      next: (res) => { this.brands.set(res.data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}
