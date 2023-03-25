import { Component, OnInit } from '@angular/core';
import { WikipediaGenerationService } from './core/services/wikipedia-generation.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'hidden_voices_frontend';
  items: MenuItem[] = [];
  name: string = '';

  ngOnInit() {
    this.items = [
      {
        label: 'Scrape',
        icon: 'pi pi-fw pi-search',
        routerLink: '/scrape',
      },
      {
        label: 'Generate',
        icon: 'pi pi-fw pi-pencil',
        routerLink: '/generate',
      },
    ];
  }
}
