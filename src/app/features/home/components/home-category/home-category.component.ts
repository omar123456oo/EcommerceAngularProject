import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ICategory } from '../../../../core/models/api.interface';

@Component({
  selector: 'app-home-category',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-category.component.html',
  styleUrl: './home-category.component.css',
})
export class HomeCategoryComponent implements OnInit {
  private categoriesService = inject(CategoriesService);

  categories = signal<ICategory[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data.slice(0, 8));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
