import { Component } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-scrape',
  templateUrl: './scrape.component.html',
  styleUrls: ['./scrape.component.css'],
})
export class ScrapeComponent {
  name: string = '';
  institute: string = '';
  activeServices: number = 0;
  items: any[] = [];

  constructor(private wikiService: WikipediaGenerationService) {}

  ngOnInit() {
    this.wikiService.getScrapeCounter().subscribe((value) => {
      this.activeServices = value;
    });
    this.wikiService.scrapedArticles.subscribe((data) => (this.items = data));
    this.wikiService.name.subscribe((data) => (this.name = data));
  }

  scrapeContent() {
    if (this.name == '' || this.institute == '') {
      alert('All fields must be set for scraping.');
      return;
    }
    this.wikiService.scrape(this.name, this.institute);
  }

  updateName() {
    this.wikiService.name.next(this.name);
  }
}
