import { Component } from '@angular/core';

@Component({
  selector: 'app-factoids',
  templateUrl: './factoids.component.html',
  styleUrls: ['./factoids.component.css'],
})
export class FactoidsComponent {
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
