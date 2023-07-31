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
  responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(private wikipediaGenerationService: WikipediaGenerationService) {}

  ngOnInit() {
    this.wikipediaGenerationService.getGenerateCounter().subscribe((value) => {
      this.activeServices = value;
    });
    this.wikipediaGenerationService.name.subscribe(
      (data) => (this.name = data)
    );
  }

  updateName() {
    this.wikipediaGenerationService.name.next(this.name);
  }
}
