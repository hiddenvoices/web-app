import { Component, Input, OnInit } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-scraped-text',
  templateUrl: './scraped-text.component.html',
  styleUrls: ['./scraped-text.component.css'],
})
export class ScrapedTextComponent implements OnInit {
  items: any[] = [];
  @Input() name: string = '';

  constructor(private wikiService: WikipediaGenerationService) {}

  ngOnInit() {
    this.wikiService.scrapedArticles.subscribe((data) => (this.items = data));
  }

  generateFactoids() {
    if (this.name == '') {
      alert('Name must be set before generating factoids.');
      return;
    }
    this.wikiService.extract(this.name, this.items);
  }
}
