import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
<div class="container py-10">
  <!-- Breadcrumb -->
  <div class="breadcrumb mb-12">
    <a routerLink="/">Home</a>
    <span>/</span>
    <span class="active">About</span>
  </div>

  <div class="flex flex-col lg:flex-row gap-16 items-center mb-20">
    <!-- Left: Story -->
    <div class="flex-1">
      <h1 class="text-4xl font-bold text-black mb-8">Our Story</h1>
      <p class="text-gray-600 text-base leading-relaxed mb-6">
        Launched in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presence in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 million customers across the region.
      </p>
      <p class="text-gray-600 text-base leading-relaxed">
        Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assortment in categories ranging from consumer electronics to fashion and lifestyle.
      </p>
    </div>

    <!-- Right: Image -->
    <div class="lg:w-1/2">
      <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&h=500&fit=crop"
        alt="About Us" class="rounded w-full object-cover max-h-96"/>
    </div>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
    <div class="border border-gray-200 rounded text-center py-8 px-4 hover:bg-exclusive hover:text-white hover:border-exclusive transition-all group cursor-default">
      <div class="w-14 h-14 border-2 border-gray-800 group-hover:border-white rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9"/>
        </svg>
      </div>
      <p class="text-3xl font-bold">10.5k</p>
      <p class="text-sm mt-1">Sellers active on our site</p>
    </div>
    <div class="border border-gray-200 rounded text-center py-8 px-4 bg-exclusive text-white border-exclusive group cursor-default">
      <div class="w-14 h-14 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-3xl font-bold">33k</p>
      <p class="text-sm mt-1">Monthly product sale</p>
    </div>
    <div class="border border-gray-200 rounded text-center py-8 px-4 hover:bg-exclusive hover:text-white hover:border-exclusive transition-all group cursor-default">
      <div class="w-14 h-14 border-2 border-gray-800 group-hover:border-white rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
      <p class="text-3xl font-bold">45.5k</p>
      <p class="text-sm mt-1">Customer active in our site</p>
    </div>
    <div class="border border-gray-200 rounded text-center py-8 px-4 hover:bg-exclusive hover:text-white hover:border-exclusive transition-all group cursor-default">
      <div class="w-14 h-14 border-2 border-gray-800 group-hover:border-white rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
        </svg>
      </div>
      <p class="text-3xl font-bold">25k</p>
      <p class="text-sm mt-1">Annum gross sale in our site</p>
    </div>
  </div>

  <!-- Team Section -->
  <div class="mb-20">
    <h2 class="text-3xl font-semibold text-center text-black mb-10">Our Team</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      @for (member of team; track member.name) {
        <div class="text-center group">
          <div class="relative overflow-hidden rounded mb-5">
            <img [src]="member.image" [alt]="member.name"
              class="w-full h-72 object-cover object-top transition-transform duration-500 group-hover:scale-105"/>
            <!-- Social -->
            <div class="absolute bottom-0 left-0 right-0 bg-black/80 flex items-center justify-center gap-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <a href="#" class="text-white hover:text-exclusive transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-black">{{ member.name }}</h3>
          <p class="text-gray-500 text-sm">{{ member.role }}</p>
        </div>
      }
    </div>
  </div>

  <!-- Services -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="text-center">
      <div class="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
        </svg>
      </div>
      <h4 class="font-bold text-sm tracking-wider mb-2">FREE AND FAST DELIVERY</h4>
      <p class="text-gray-500 text-sm">Free delivery for all orders over $140</p>
    </div>
    <div class="text-center">
      <div class="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      </div>
      <h4 class="font-bold text-sm tracking-wider mb-2">24/7 CUSTOMER SERVICE</h4>
      <p class="text-gray-500 text-sm">Friendly 24/7 customer support</p>
    </div>
    <div class="text-center">
      <div class="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      </div>
      <h4 class="font-bold text-sm tracking-wider mb-2">MONEY BACK GUARANTEE</h4>
      <p class="text-gray-500 text-sm">We return money within 30 days</p>
    </div>
  </div>
</div>
  `,
})
export class AboutComponent {
  team = [
    {
      name: 'Tom Cruise',
      role: 'Founder & Chairman',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    },
    {
      name: 'Emma Watson',
      role: 'Managing Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80',
    },
    {
      name: 'Will Smith',
      role: 'Product Designer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
    },
  ];
}
