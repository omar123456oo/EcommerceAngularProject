import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { NavbarComponent } from "./core/layout/components/navbar/navbar.component";
import { FooterComponent } from "./core/layout/components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('e-commerce');
}
