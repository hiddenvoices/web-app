import { Component } from '@angular/core';

@Component({
  selector: 'app-scraped-text',
  templateUrl: './scraped-text.component.html',
  styleUrls: ['./scraped-text.component.css'],
})
export class ScrapedTextComponent {
  items: any[] = [
    {
      text: 'ABCD',
      source: 'abcd.com',
    },
    {
      text: 'PQRS',
      source: 'pqrs.com',
    },
    {
      text: 'ABCD',
      source: 'abcd.com',
    },
    {
      text: 'PQRS',
      source: 'pqrs.com',
    },
    {
      text: 'ABCD',
      source: 'abcd.com',
    },
    {
      text: 'PQRS',
      source: 'pqrs.com',
    },
  ];
}
