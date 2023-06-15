import { Component, Input, OnInit } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-factoids',
  templateUrl: './factoids.component.html',
  styleUrls: ['./factoids.component.css'],
})
export class FactoidsComponent implements OnInit {
  items: any[] = [];
  @Input() name: string = '';

  constructor(private wikiService: WikipediaGenerationService) {}

  ngOnInit(): void {
    this.wikiService.factoids.subscribe((data) => (this.items = data));
  }

  summarizeContent() {
    if (this.name == '') {
      alert('Name must be set before summarizing the article.');
      return;
    }
    this.wikiService.summarize(this.name, this.items);
  }
}
