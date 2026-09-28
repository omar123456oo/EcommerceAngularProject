import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/models/api.interface';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private categoriesService = inject(CategoriesService);

  categories = signal<ICategory[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => { this.categories.set(res.data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}
