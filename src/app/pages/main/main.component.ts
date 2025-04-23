import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule
  ]
})
export class MainComponent {
  logoUrl: string = './assets/images/brand.jpg';
  showSidenav: boolean = true;
  isHandset: boolean = false; // valor fijo por ahora

  constructor(private translate: TranslateService) {}

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  toggleSidenav() {
    this.showSidenav = !this.showSidenav;
    const sidenav = document.querySelector('.sidenav');
    sidenav?.classList.toggle('closed');
  }
}
