import { Component } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css'],
})
export class GenerateComponent {
  name: string = '';
  components: any[] = [
    { title: 'SCRAPED CONTENT', tag: 'scraped-text' },
    { title: 'FACTOIDS', tag: 'factoids' },
    { title: 'SUMMARIZED CONTENT', tag: 'summarized-text' },
  ];
  activeServices: number = 0;

  constructor(private wikipediaGenerationService: WikipediaGenerationService) {}

  ngOnInit() {
    this.wikipediaGenerationService.getServiceCounter().subscribe((value) => {
      this.activeServices = value;
    });
  }
}
