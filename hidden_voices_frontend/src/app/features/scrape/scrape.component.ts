import { Component } from '@angular/core';
import { WikipediaGenerationService } from 'src/app/core/services/wikipedia-generation.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-scrape',
  templateUrl: './scrape.component.html',
  styleUrls: ['./scrape.component.css'],
  providers: [MessageService],
})
export class ScrapeComponent {
  name: string = '';
  institute: string = '';
  email: string = '';
  validationMessage: string = '';
  activeServices: number = 0;
  items: any[] = [];

  constructor(
    private wikiService: WikipediaGenerationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.wikiService.getScrapeCounter().subscribe((value) => {
      this.activeServices = value;
    });
    this.wikiService.scrapedArticles.subscribe((data) => (this.items = data));
    this.wikiService.name.subscribe((data) => (this.name = data));
  }

  scrapeContent() {
    if (!this.fieldsValid()) {
      alert(this.validationMessage);
      return;
    }
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: `An email will be sent to ${this.email} once the dataset is generated.`,
    });
    this.wikiService.scrape(this.name, this.institute, this.email);
  }

  fieldsValid() {
    if (this.name == '' || this.institute == '' || this.email == '') {
      this.validationMessage = 'All fields must be set for scraping.';
      return false;
    }
    const regex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    if (!this.email.match(regex)) {
      this.validationMessage = 'Provide a valid email.';
      return false;
    }
    return true;
  }

  updateName() {
    this.wikiService.name.next(this.name);
  }
}
