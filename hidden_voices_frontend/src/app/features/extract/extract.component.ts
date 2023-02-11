import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.css'],
})
export class ExtractComponent {
  constructor(private wikipediaGenerationService: WikipediaGenerationService) {}

  @Input() name: string = '';
  @Input() scrapedContent: string = '';
  @Output() extractedTripletsEvent = new EventEmitter<string>();

  extractTriplets() {
    this.wikipediaGenerationService
      .extract(this.name, this.scrapedContent)
      .subscribe({
        next: (response: any) =>
          this.extractedTripletsEvent.emit(response['triples']),
      });
  }
}
