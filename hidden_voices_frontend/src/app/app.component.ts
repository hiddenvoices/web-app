import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'hidden_voices_frontend';
  name: string = '';
  scrapedContent: string = '';
  triples: string = '';

  updateScrapedContent(event: any) {
    this.name = event['name'];
    this.scrapedContent = event['content'];
  }

  updateTriples(event: any) {
    this.triples = event;
  }
}
