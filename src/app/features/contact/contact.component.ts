import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [RouterLink, FormsModule],
  template: `
<div class="container py-10">

  <!-- Breadcrumb -->
  <div class="breadcrumb mb-12">
    <a routerLink="/">Home</a>
    <span>/</span>
    <span class="active">Contact</span>
  </div>

  <div class="flex flex-col lg:flex-row gap-8">

    <!-- Left: Contact Info -->
    <div class="lg:w-80 shrink-0">
      <!-- Call Us -->
      <div class="border-b border-gray-200 pb-8 mb-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-10 h-10 bg-exclusive text-white rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-black text-base">Call To Us</h3>
        </div>
        <p class="text-sm text-gray-600 mb-2">We are available 24/7, 7 days a week.</p>
        <p class="text-sm text-gray-800 font-medium">Phone: +8801611112222</p>
      </div>

      <!-- Write To Us -->
      <div>
        <div class="flex items-center gap-4 mb-6">
          <div class="w-10 h-10 bg-exclusive text-white rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-black text-base">Write To Us</h3>
        </div>
        <p class="text-sm text-gray-600 mb-3">Fill out our form and we will contact you within 24 hours.</p>
        <p class="text-sm text-gray-800 mb-2">Emails: customer&#64;exclusive.com</p>
        <p class="text-sm text-gray-800">Emails: support&#64;exclusive.com</p>
      </div>
    </div>

    <!-- Right: Contact Form -->
    <div class="flex-1 bg-white shadow-sm rounded p-8">
      @if (sent()) {
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-black mb-2">Message Sent!</h3>
          <p class="text-gray-500">We'll get back to you within 24 hours.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input type="text" [(ngModel)]="form.name" placeholder="Your Name *"
            class="bg-[#f5f5f5] rounded px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-exclusive/20"/>
          <input type="email" [(ngModel)]="form.email" placeholder="Your Email *"
            class="bg-[#f5f5f5] rounded px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-exclusive/20"/>
          <input type="tel" [(ngModel)]="form.phone" placeholder="Your Phone *"
            class="bg-[#f5f5f5] rounded px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-exclusive/20"/>
        </div>
        <textarea [(ngModel)]="form.message" rows="8" placeholder="Your Message"
          class="w-full bg-[#f5f5f5] rounded px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-exclusive/20 resize-none mb-4"></textarea>
        <div class="flex justify-end">
          <button (click)="onSend()"
            class="btn-exclusive px-8 py-3">
            Send Message
          </button>
        </div>
      }
    </div>

  </div>
</div>
  `,
})
export class ContactComponent {
  sent = signal(false);
  form = { name: '', email: '', phone: '', message: '' };

  onSend(): void {
    if (this.form.name && this.form.email && this.form.message) {
      this.sent.set(true);
    }
  }
}
