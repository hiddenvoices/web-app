import { Component, EventEmitter, Output } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-scrape',
  templateUrl: './scrape.component.html',
  styleUrls: ['./scrape.component.css'],
})
export class ScrapeComponent {
  constructor(private wikipediaGenerationService: WikipediaGenerationService) {}

  @Output() scrapedContentEvent = new EventEmitter<any>();
  name: string = '';
  content: string = '';
  scrapeData() {
    this.wikipediaGenerationService.incrementServiceCounter();
    this.wikipediaGenerationService.scrape(this.name).subscribe({
      next: (response: any) => {
        this.content = response['content'];
        this.scrapedContentEvent.emit({
          name: this.name,
          content: this.content,
        });
      },
      error: () => this.wikipediaGenerationService.decrementServiceCounter(),
      complete: () => this.wikipediaGenerationService.decrementServiceCounter(),
    });
  }

  nameChange() {
    this.scrapedContentEvent.emit({
      name: this.name,
    });
  }
}
