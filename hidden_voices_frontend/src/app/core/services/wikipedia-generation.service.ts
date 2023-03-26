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
    this.incrementServiceCounter();
    this.httpClient.post(`${this.BACKEND_URL}/extract/`, body).subscribe({
      next: (response) => this.factoids.next(response),
      error: (error) => this.decrementServiceCounter(),
      complete: () => this.decrementServiceCounter(),
    });
  }

  public summarize(name: string, factoids: any) {
    const body = {
      name: name,
      content: factoids,
    };
    this.incrementServiceCounter();
    this.httpClient.post(`${this.BACKEND_URL}/summarize/`, body).subscribe({
      next: (response: any) => this.article.next(response['content']),
      error: (error) => this.decrementServiceCounter(),
      complete: () => this.decrementServiceCounter(),
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
