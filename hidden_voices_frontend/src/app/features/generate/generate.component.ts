import { Component } from '@angular/core';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css'],
})
export class GenerateComponent {
  /*
    TODO:
      - Have input for POI name, set button
      - Have upload CSV button, populate the table with CSV contents
      - Have button for factoid generation
        - These should be generated for each link separately
        - Should be visible in a table
      - Have button to summarize
  */
  components: any[] = [
    { title: 'Scraped Content', tag: 'scraped-text' },
    { title: 'Factoids', tag: 'factoids' },
    { title: 'Summarized Text', tag: 'summarized-text' },
  ];
}
