import { Component, OnInit } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-summarized-text',
  templateUrl: './summarized-text.component.html',
  styleUrls: ['./summarized-text.component.css'],
})
export class SummarizedTextComponent implements OnInit {
  article: string = '';
  constructor(private wikiService: WikipediaGenerationService) {}

  ngOnInit(): void {
    this.wikiService.article.subscribe((data) => (this.article = data));
  }
}
