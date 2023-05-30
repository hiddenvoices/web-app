import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WikipediaGenerationService {
  private scrapeCounter: BehaviorSubject<number>;
  private generateCounter: BehaviorSubject<number>;
  public scrapedArticles: BehaviorSubject<any>;
  public factoids: BehaviorSubject<any>;
  public article: BehaviorSubject<string>;

  constructor(private httpClient: HttpClient) {
    this.generateCounter = new BehaviorSubject<number>(0);
    this.scrapeCounter = new BehaviorSubject<number>(0);
    this.scrapedArticles = new BehaviorSubject<any>([]);
    this.factoids = new BehaviorSubject<any>([]);
    this.article = new BehaviorSubject<string>('');
  }

  BACKEND_URL = 'https://msc1-130-250-170-11.cloud.denvrdata.com/backend/wiki';

  public scrape(name: string) {
    const body = {
      name: name,
    };
    this.incrementScrapeCounter();
    this.httpClient.post(`${this.BACKEND_URL}/scrape/`, body).subscribe({
      next: (response) => this.scrapedArticles.next(response),
      error: (error) => this.decrementScrapeCounter(),
      complete: () => this.decrementScrapeCounter(),
    });
  }

  public extract(name: string, content: any) {
    const body = {
      name: name,
      content: content,
    };
    this.incrementGenerateCounter();
    this.httpClient.post(`${this.BACKEND_URL}/extract/`, body).subscribe({
      next: (response) => this.factoids.next(response),
      error: (error) => this.decrementGenerateCounter(),
      complete: () => this.decrementGenerateCounter(),
    });
  }

  public summarize(name: string, factoids: any) {
    const body = {
      name: name,
      content: factoids,
    };
    this.incrementGenerateCounter();
    this.httpClient.post(`${this.BACKEND_URL}/summarize/`, body).subscribe({
      next: (response: any) => this.article.next(response['content']),
      error: (error) => this.decrementGenerateCounter(),
      complete: () => this.decrementGenerateCounter(),
    });
  }

  public incrementGenerateCounter(): void {
    this.generateCounter.next(this.generateCounter.value + 1);
  }

  public decrementGenerateCounter(): void {
    this.generateCounter.next(this.generateCounter.value - 1);
  }

  public getGenerateCounter(): Observable<number> {
    return this.generateCounter.asObservable();
  }

  public incrementScrapeCounter(): void {
    this.scrapeCounter.next(this.scrapeCounter.value + 1);
  }

  public decrementScrapeCounter(): void {
    this.scrapeCounter.next(this.scrapeCounter.value - 1);
  }

  public getScrapeCounter(): Observable<number> {
    return this.scrapeCounter.asObservable();
  }
}
