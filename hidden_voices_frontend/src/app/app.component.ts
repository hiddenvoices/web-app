import { Component, OnInit } from '@angular/core';
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
        tooltipOptions: {
          tooltipLabel:
            'This section is to scrape information on the person of interest. All you need is their name and institute they are associated with!',
          tooltipPosition: 'right',
        },
        style: { marginLeft: '30px' },
      },
      {
        label: 'Generate',
        icon: 'pi pi-fw pi-pencil',
        routerLink: '/generate',
        tooltipOptions: {
          tooltipLabel:
            'This section generates a Wikipedia article from the scraped information. If you already have scraped information, you can come to this page directly.',
          tooltipPosition: 'right',
        },
        style: { marginLeft: '15px' },
      },
    ];
  }
}
