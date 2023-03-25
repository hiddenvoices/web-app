import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WikipediaGenerationService {
  private serviceCounter: BehaviorSubject<number>;
  public factoids: BehaviorSubject<any>;
  public article: BehaviorSubject<string>;

  constructor(private httpClient: HttpClient) {
    this.serviceCounter = new BehaviorSubject<number>(0);
    this.factoids = new BehaviorSubject<any>([]);
    this.article = new BehaviorSubject<string>('');
  }

  BACKEND_URL = 'http://localhost:8000/backend/wiki';

  public scrape(name: string) {
    const body = {
      name: name,
    };
    return this.httpClient.post(`${this.BACKEND_URL}/scrape/`, body);
  }

  public extract(name: string, content: any) {
    const body = {
      name: name,
      content: content,
    };
    this.httpClient.post(`${this.BACKEND_URL}/extract/`, body).subscribe({
      next: (response) => this.factoids.next(response),
      error: (error) => console.log(error),
    });
  }

  public summarize(name: string, factoids: any) {
    const body = {
      name: name,
      content: factoids,
    };
    this.httpClient.post(`${this.BACKEND_URL}/summarize/`, body).subscribe({
      next: (response: any) => {
        this.article.next(response['content']);
      },
      error: (error) => console.log(error),
    });
  }

  public incrementServiceCounter(): void {
    this.serviceCounter.next(this.serviceCounter.value + 1);
  }

  public decrementServiceCounter(): void {
    this.serviceCounter.next(this.serviceCounter.value - 1);
  }

  public getServiceCounter(): Observable<number> {
    return this.serviceCounter.asObservable();
  }
}
