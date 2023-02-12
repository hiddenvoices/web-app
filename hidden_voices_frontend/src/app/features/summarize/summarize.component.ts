import { Component, Input } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-summarize',
  templateUrl: './summarize.component.html',
  styleUrls: ['./summarize.component.css'],
})
export class SummarizeComponent {
  constructor(private wikipediaGenerationService: WikipediaGenerationService) {}

  @Input() name: string = '';
  @Input() triples: string = '';
  summarizedContent: string = '';

  summarizeTriples() {
    this.wikipediaGenerationService.incrementServiceCounter();
    this.wikipediaGenerationService
      .summarize(this.name, this.triples)
      .subscribe({
        next: (response: any) => (this.summarizedContent = response['content']),
        error: () => this.wikipediaGenerationService.decrementServiceCounter(),
        complete: () =>
          this.wikipediaGenerationService.decrementServiceCounter(),
      });
  }
}
