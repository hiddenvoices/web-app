import { Component, Input } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-scraped-text',
  templateUrl: './scraped-text.component.html',
  styleUrls: ['./scraped-text.component.css'],
})
export class ScrapedTextComponent {
  items: any[] = [];
  @Input() name: string = '';

  constructor(private wikiService: WikipediaGenerationService) {}

  generateFactoids() {
    this.wikiService.extract(this.name, this.items);
  }
}
