import { Component } from '@angular/core';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css'],
})
export class GenerateComponent {
  name: string = '';
  components: any[] = [
    { title: 'SCRAPED CONTENT', tag: 'scraped-text' },
    { title: 'FACTOIDS', tag: 'factoids' },
    { title: 'SUMMARIZED CONTENT', tag: 'summarized-text' },
  ];
}
