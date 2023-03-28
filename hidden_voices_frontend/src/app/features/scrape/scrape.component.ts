import { Component } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-scrape',
  templateUrl: './scrape.component.html',
  styleUrls: ['./scrape.component.css'],
})
export class ScrapeComponent {
  name: string = '';
  activeServices: number = 0;
  items: any[] = [];

  constructor(private wikiService: WikipediaGenerationService) {}

  ngOnInit() {
    this.wikiService.getScrapeCounter().subscribe((value) => {
      this.activeServices = value;
    });
    this.wikiService.scrapedArticles.subscribe((data) => (this.items = data));
  }

  scrapeContent() {
    this.wikiService.scrape(this.name);
  }
}
