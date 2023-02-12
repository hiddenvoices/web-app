import { Component, OnInit } from '@angular/core';
import { WikipediaGenerationService } from './core/services/wikipedia-generation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'hidden_voices_frontend';
  name: string = '';
  scrapedContent: string = '';
  triples: string = '';
  activeServices: number = 0;

  constructor(private wikipediaGenerationService: WikipediaGenerationService) {}

  ngOnInit() {
    this.wikipediaGenerationService.getServiceCounter().subscribe((value) => {
      this.activeServices = value;
    });
  }

  updateScrapedContent(event: any) {
    this.name = event['name'];
    this.scrapedContent = event['content'];
  }

  updateTriples(event: any) {
    this.triples = event;
  }
}
